require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const dns = require('dns');

// Importar configuración de email con Resend
const { 
  configureEmail, 
  sendAdminNotification, 
  sendClientConfirmation, 
  sendFinalConfirmation,
  sendPlantQuoteEmail
} = require('./src/config/emailConfig');

// Importar sender Gmail nativo (fallback sin Resend)
const { sendGmail } = require('./src/config/gmailSender');

// 🔧 FIX: Forzar uso de DNS de Google para resolver MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('🔧 DNS configurado:', dns.getServers());

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🌐 Environment:', process.env.NODE_ENV || 'development');

// Configuración MongoDB Atlas directa
const mongoUri = 'mongodb+srv://rhzamora144:86e6FbGM00uV78RP@cluster0.4vwcokw.mongodb.net/reservas?retryWrites=true&w=majority&appName=Cluster0';

// Conectar a MongoDB Atlas
const connectDB = async () => {
  try {
    console.log('🔗 Conectando a MongoDB Atlas...');
    console.log('🔗 URI:', mongoUri.replace(/:[^:@]*@/, ':***@')); // Ocultar password en logs
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000, // Timeout después de 10s
      socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
      bufferCommands: false // Deshabilitar buffering de Mongoose
    });
    
    console.log('✅ Conectado a MongoDB Atlas exitosamente');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB Atlas:', error);
    console.log('⚠️ El servidor continuará sin base de datos');
  }
};

// Conectar a la base de datos
connectDB();

// Esquemas de MongoDB
const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  service: { type: String, required: true },
  serviceDuration: { type: String, required: true },
  servicePrice: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  confirmedAt: { type: Date, default: null }
});

const bookedSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  bookingId: { type: String, required: false },
  isBlocked: { type: Boolean, default: false },
  reason: { type: String, required: false },
  blockedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const contactMessageSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Modelos
const Booking = mongoose.model('Booking', bookingSchema);
const BookedSlot = mongoose.model('BookedSlot', bookedSlotSchema);
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// Función para obtener la URL base del request
const getBaseUrl = (req) => {
  const protocol = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

// Configurar Resend para emails
const emailConfigured = configureEmail();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'https://landing-page-1-77xa.onrender.com',
    'https://dedecorinfo.com',
    'https://www.dedecorinfo.com'
  ],
  credentials: true
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'build')));

// Endpoint de health check
app.get('/api/health', async (req, res) => {
  try {
    const bookingsCount = await Booking.countDocuments();
    const slotsCount = await BookedSlot.countDocuments();
    const lastBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('id clientName date time status createdAt');
    
    const lastSlots = await BookedSlot.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('date time bookingId reason createdAt');
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      email: emailConfigured ? 'configured' : 'not-configured',
      reservas: bookingsCount,
      horarios: slotsCount,
      cors: req.get('origin') || 'no-origin',
      ultimasReservas: lastBookings,
      ultimosHorarios: lastSlots
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
      email: emailConfigured ? 'configured' : 'not-configured'
    });
  }
});

// Endpoint para obtener horarios ocupados
app.get('/api/booked-slots', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro date es requerido' 
      });
    }

    
    // Obtener slots ocupados (reservas confirmadas) Y slots bloqueados administrativamente
    const bookedSlots = await BookedSlot.find({ 
      date,
      $or: [
        { bookingId: { $ne: null } }, // Reservas confirmadas
        { isBlocked: true } // Slots bloqueados administrativamente
      ]
    });
    
    // Agrupar por fecha
    const slotsByDate = {};
    bookedSlots.forEach(slot => {
      if (!slotsByDate[slot.date]) {
        slotsByDate[slot.date] = [];
      }
      slotsByDate[slot.date].push({
        time: slot.time,
        bookingId: slot.bookingId,
        reason: slot.reason
      });
    });
    
    res.json({
      success: true,
      totalSlots: bookedSlots.length,
      date: date,
      bookedSlots: bookedSlots,
      slotsByDate: slotsByDate,
      cached: false,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error consultando horarios ocupados:', error);
    res.status(500).json({
      success: false,
      error: 'Error consultando horarios ocupados' 
    });
  }
});

// Endpoint principal para crear reservas
app.post('/api/bookings', async (req, res) => {
  console.log('📝 Datos recibidos:', req.body);
  
  try {
    const {
      id: bookingId,
      clientName,
      clientEmail,
      clientPhone,
      service,
      serviceDuration,
      servicePrice,
      date,
      time,
      type,
      notes = ''
    } = req.body;

    // Validaciones básicas
    if (!bookingId || !clientName || !clientEmail || !date || !time) {
      return res.status(400).json({ 
        success: false,
        error: 'Faltan campos requeridos'
      });
    }

    // 1️⃣ VERIFICAR ID NO DUPLICADO (si MongoDB está disponible)
    try {
    const existingBooking = await Booking.findOne({ id: bookingId });
    if (existingBooking) {
        console.log('⚠️ ID de reserva duplicado:', bookingId);
      return res.status(409).json({ 
          success: false,
          error: 'ID de reserva duplicado',
          bookingId: bookingId
      });
      }
    } catch (dbError) {
      console.warn('⚠️ No se pudo verificar ID duplicado (MongoDB no disponible)');
      // Continuar - el ID es único por timestamp
    }
    
    // 2️⃣ VERIFICAR QUE EL HORARIO ESTÉ DISPONIBLE (si MongoDB está disponible)
    try {
    const existingSlot = await BookedSlot.findOne({ date, time });
    if (existingSlot) {
        console.log('⚠️ Horario ya ocupado:', date, time);
      return res.status(409).json({ 
          success: false,
          error: 'Horario no disponible',
          date: date,
          time: time
        });
      }
    } catch (dbError) {
      console.warn('⚠️ No se pudo verificar disponibilidad de horario (MongoDB no disponible)');
      // Continuar - el cliente verá los horarios actualizados en el frontend
    }

    // 3️⃣ ENVIAR EMAILS PRIMERO (ANTES DE MongoDB para asegurar que se envíen)
    let emailsSent = false;
    
    if (emailConfigured) {
      try {
        // 🔥 IMPORTANTE: Enviar ambos emails EN PARALELO con timeout máximo de 20 segundos
        const emailPromise = Promise.all([
          // Email al ADMIN - Nueva solicitud que requiere confirmación
          sendAdminNotification({
            bookingId,
            clientName,
            clientEmail,
            clientPhone,
            service,
            date,
            time,
            notes
          }).catch(err => {
            console.error('⚠️ Error enviando email al admin:', err.message || err);
            return false;
          }),
          
          // Email al CLIENTE - Solicitud recibida (no confirmada)
          sendClientConfirmation({
            bookingId,
            clientName,
            clientEmail,
            service,
            date,
            time
          }).catch(err => {
            console.error('⚠️ Error enviando email al cliente:', err.message || err);
            return false;
          })
        ]);
        
        // Timeout de 35 segundos para el envío de emails (aumentado para Gmail)
        const timeoutPromise = new Promise((resolve) => 
          setTimeout(() => resolve([false, false]), 35000)
        );
        
        const results = await Promise.race([emailPromise, timeoutPromise]);
        
        // Verificar si al menos uno se envió correctamente
        if (Array.isArray(results) && results.some(r => r === true)) {
          console.log('✅ Al menos un email enviado exitosamente');
          emailsSent = true;
        } else {
          console.warn('⚠️ Los emails no se pudieron enviar o excedieron el timeout');
        }
      } catch (emailError) {
        console.error('⚠️ Error al enviar emails:', emailError.message || emailError);
        // Continuar aunque falle el email - no bloquear la reserva
      }
    } else {
      console.warn('⚠️ Resend no configurado - emails no enviados');
    }

    // 4️⃣ INTENTAR CREAR LA RESERVA EN MongoDB (si falla, no importa, los emails ya se enviaron)
    let bookingSaved = false;
    try {
      console.log('💾 Intentando guardar reserva en MongoDB como PENDING...');
    const booking = new Booking({
      id: bookingId,
      clientName,
      clientEmail,
      clientPhone,
      service,
        serviceDuration,
        servicePrice,
      date,
      time,
      type,
        notes,
        status: 'pending'
    });
    
    await booking.save();
    console.log(`✅ Reserva guardada como PENDING: ${bookingId} para ${clientName}`);
      bookingSaved = true;
    
      // 5️⃣ NO BLOQUEAR HORARIOS TODAVÍA
    // Los horarios se bloquearán solo cuando el admin confirme manualmente
    console.log('⏸️ Horarios NO bloqueados - esperando confirmación manual del admin');
    } catch (dbError) {
      console.error('⚠️ Error al guardar en MongoDB (pero los emails ya se enviaron):', dbError);
      // No hacer throw - los emails ya se enviaron, que es lo más importante
    }

    // 6️⃣ RESPUESTA EXITOSA (siempre responder, incluso si los emails fallan)
    // La reserva se crea siempre que sea posible, los emails son secundarios
    console.log(`🎉 Reserva procesada para ${clientName} - Emails: ${emailsSent ? 'enviados' : 'pendientes'}, BD: ${bookingSaved ? 'guardada' : 'pendiente'}`);
    res.status(201).json({ 
      success: true, 
      bookingId: bookingId,
      message: emailsSent 
        ? 'Solicitud de reserva enviada - Emails notificados' 
        : 'Solicitud de reserva creada - Los emails se enviarán próximamente',
      status: 'pending',
      emailsSent: emailsSent,
      bookingSaved: bookingSaved,
      note: bookingSaved 
        ? (emailsSent 
          ? 'Los horarios se bloquearán cuando el admin confirme la reserva' 
          : 'Reserva guardada. Los emails se enviarán en segundo plano.')
        : 'Emails enviados correctamente. MongoDB no disponible temporalmente.'
    });
    
  } catch (error) {
    console.error('❌ Error en endpoint /api/bookings:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

// Endpoint para confirmar reservas (admin)
app.get('/confirm-booking', async (req, res) => {
  const { id, action } = req.query;
  
  if (!id || !action) {
    return res.status(400).send('Parámetros requeridos: id y action');
  }
  
  try {
    const booking = await Booking.findOne({ id });
    
    if (!booking) {
      return res.status(404).send('Reserva no encontrada');
    }
    
    if (action === 'confirm') {
      // Confirmar la reserva
      booking.status = 'confirmed';
      booking.confirmedAt = new Date();
      await booking.save();
      
      // Bloquear los horarios
      const newSlot = new BookedSlot({
            date: booking.date,
          time: booking.time,
            bookingId: booking.id,
        reason: booking.service
      });
      await newSlot.save();
      
      // Enviar email de confirmación final
      if (emailConfigured) {
        try {
          await sendFinalConfirmation({
            clientName: booking.clientName,
            clientEmail: booking.clientEmail,
            service: booking.service,
          date: booking.date,
            time: booking.time
          });
        } catch (emailError) {
          console.error('Error enviando confirmación final:', emailError);
        }
      }
      
      res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #28a745;">✅ Reserva Confirmada</h2>
            <p>La reserva de <strong>${booking.clientName}</strong> ha sido confirmada.</p>
            <p>Los horarios han sido bloqueados automáticamente.</p>
            <p>El cliente ha recibido un email de confirmación.</p>
          </body>
        </html>
      `);
    } else if (action === 'reject') {
      // Rechazar la reserva
      booking.status = 'rejected';
      await booking.save();
      
      res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #dc3545;">❌ Reserva Rechazada</h2>
            <p>La reserva de <strong>${booking.clientName}</strong> ha sido rechazada.</p>
            <p>Los horarios permanecen disponibles.</p>
          </body>
        </html>
      `);
    } else {
      res.status(400).send('Acción inválida. Use "confirm" o "reject"');
    }
  } catch (error) {
    console.error('Error procesando confirmación:', error);
    res.status(500).send('Error interno del servidor');
  }
});

// Endpoint para obtener datos de una reserva específica
app.get('/api/bookings/:id', async (req, res) => {
  const { id } = req.params;
  
  console.log(`📋 GET /api/bookings/${id} - Obteniendo datos de reserva`);
  
  try {
    const booking = await Booking.findOne({ id });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Reserva no encontrada'
      });
    }
    
    res.json({
      success: true,
      booking: {
        id: booking.id,
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        clientPhone: booking.clientPhone,
        service: booking.service,
        serviceDuration: booking.serviceDuration,
        servicePrice: booking.servicePrice,
        date: booking.date,
        time: booking.time,
        type: booking.type,
        notes: booking.notes,
        status: booking.status,
        createdAt: booking.createdAt,
        confirmedAt: booking.confirmedAt
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo reserva:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo reserva'
    });
  }
});

// Endpoint para actualizar estado de reserva
app.post('/api/bookings/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  console.log(`🔄 POST /api/bookings/${id}/status - Cambiando estado a: ${status}`);
  
  try {
    const booking = await Booking.findOne({ id });
    
    if (!booking) {
      return res.status(404).json({
      success: false,
        error: 'Reserva no encontrada'
      });
    }
    
    // Actualizar estado
    booking.status = status;
    if (status === 'confirmed') {
      booking.confirmedAt = new Date();
      
      // Bloquear horarios cuando se confirma
      const newSlot = new BookedSlot({
          date: booking.date,
          time: booking.time,
          bookingId: booking.id,
        reason: booking.service
      });
      await newSlot.save();
      console.log('✅ Horarios bloqueados para reserva confirmada');
    }
    
    await booking.save();
    
    // Enviar email de confirmación si se confirma
    if (status === 'confirmed' && emailConfigured) {
      try {
        await sendFinalConfirmation({
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          service: booking.service,
              date: booking.date,
          time: booking.time
        });
        console.log('✅ Email de confirmación enviado');
      } catch (emailError) {
        console.error('⚠️ Error enviando confirmación:', emailError);
      }
    }
    
    res.json({
      success: true,
      message: `Reserva ${status === 'confirmed' ? 'confirmada' : 'actualizada'}`,
      booking: {
        id: booking.id,
        status: booking.status,
        confirmedAt: booking.confirmedAt
      }
    });
    
  } catch (error) {
    console.error('Error actualizando reserva:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando reserva'
    });
  }
});

// Endpoint para obtener horarios ocupados en lote
app.get('/api/booked-slots-batch', async (req, res) => {
  const { dates } = req.query;
  
  console.log('📅 GET /api/booked-slots-batch - Fechas:', dates);
  
  try {
    if (!dates) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro dates es requerido'
      });
    }
    
    const dateArray = dates.split(',');
    // Obtener slots ocupados (reservas confirmadas) Y slots bloqueados administrativamente
    const bookedSlots = await BookedSlot.find({ 
      date: { $in: dateArray },
      $or: [
        { bookingId: { $ne: null } }, // Reservas confirmadas
        { isBlocked: true } // Slots bloqueados administrativamente
      ]
    });
    
    
    // Agrupar por fecha
    const slotsByDate = {};
    bookedSlots.forEach(slot => {
      if (!slotsByDate[slot.date]) {
        slotsByDate[slot.date] = [];
      }
      slotsByDate[slot.date].push({
        time: slot.time,
        bookingId: slot.bookingId,
        reason: slot.reason
      });
    });
    
    res.json({
      success: true,
      totalSlots: bookedSlots.length,
      dates: dateArray,
      slotsByDate: slotsByDate,
      cached: false,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error consultando horarios en lote:', error);
    res.status(500).json({
      success: false,
      error: 'Error consultando horarios'
    });
  }
});

// Endpoint para contacto
app.post('/api/contact', async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, message, date } = req.body;
    
    const newMessage = new ContactMessage({
      clientName,
      clientEmail,
      clientPhone,
      message,
      date
    });
    
    await newMessage.save();
    
    res.json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Error en contacto:', error);
    res.status(500).json({ success: false, error: 'Error enviando mensaje' });
  }
});

// ==================== ENDPOINTS DE ADMINISTRACIÓN ====================

// Endpoint para obtener todas las reservas (admin)
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      bookings: bookings
    });
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo reservas'
    });
  }
});

// Endpoint para bloquear un horario específico
app.post('/api/admin/block-slot', async (req, res) => {
  try {
    const { date, time } = req.body;
    
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Fecha y hora requeridas'
      });
    }

    // Verificar si ya existe y está bloqueado
    const existingSlot = await BookedSlot.findOne({ date, time });
    
    if (existingSlot) {
      // Verificar si está ocupado por una reserva confirmada
      if (existingSlot.bookingId && existingSlot.bookingId !== null) {
        return res.status(400).json({
          success: false,
          error: `El horario ${time} del ${date} está ocupado por una reserva confirmada`
        });
      }
      
      // Si ya está bloqueado administrativamente, actualizar la fecha de bloqueo
      if (existingSlot.isBlocked && existingSlot.reason === 'admin-blocked') {
        console.log(`🔄 Re-bloqueando horario ${date} ${time}`);
        existingSlot.blockedAt = new Date();
        await existingSlot.save();
      } else {
        // Actualizar slot existente como bloqueado
        existingSlot.isBlocked = true;
        existingSlot.reason = 'admin-blocked';
        existingSlot.blockedAt = new Date();
        existingSlot.bookingId = null;
        await existingSlot.save();
      }
    } else {
      // Crear nuevo slot bloqueado
      const blockedSlot = new BookedSlot({
        date: date,
        time: time,
        isBlocked: true,
        reason: 'admin-blocked',
        blockedAt: new Date(),
        bookingId: null // Explícitamente null para bloqueos administrativos
      });
      await blockedSlot.save();
    }

    console.log(`✅ Horario ${date} ${time} bloqueado por admin`);
    
    res.json({
      success: true,
      message: `Horario ${time} del ${date} bloqueado`
    });
    
  } catch (error) {
    console.error('Error bloqueando horario:', error);
    res.status(500).json({
      success: false,
      error: 'Error bloqueando horario'
    });
  }
});

// Endpoint para desbloquear un horario específico
app.post('/api/admin/unblock-slot', async (req, res) => {
  try {
    const { date, time } = req.body;
    
    if (!date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Fecha y hora requeridas'
      });
    }

    // Eliminar slot bloqueado
    const result = await BookedSlot.deleteOne({ 
      date, 
      time, 
      isBlocked: true 
    });

    if (result.deletedCount === 0) {
      return res.status(400).json({
        success: false,
        error: `El horario ${time} del ${date} no está bloqueado administrativamente`
      });
    }

    console.log(`✅ Horario ${date} ${time} desbloqueado por admin`);
    
    res.json({
      success: true,
      message: `Horario ${time} del ${date} desbloqueado`
    });
    
  } catch (error) {
    console.error('Error desbloqueando horario:', error);
    res.status(500).json({
      success: false,
      error: 'Error desbloqueando horario'
    });
  }
});

// Endpoint para consultar el estado de una fecha específica
app.get('/api/admin/date-status', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({
        success: false,
        error: 'Parámetro date es requerido'
      });
    }

    // Consultar slots bloqueados administrativamente
    const blockedSlots = await BookedSlot.find({ 
      date: date, 
      isBlocked: true, 
      reason: 'admin-blocked' 
    });

    // Consultar slots con reservas confirmadas
    const bookedSlots = await BookedSlot.find({ 
        date: date,
      bookingId: { $ne: null } 
    });

    const isFullyBlocked = blockedSlots.length === 6; // 6 horarios disponibles
    const hasBookings = bookedSlots.length > 0;
    const blockedTimes = blockedSlots.map(slot => slot.time);
    const bookedTimes = bookedSlots.map(slot => slot.time);
    
      res.json({
        success: true,
      date: date,
      isFullyBlocked: isFullyBlocked,
      hasBookings: hasBookings,
      blockedSlots: blockedSlots.length,
      bookedSlots: bookedSlots.length,
      blockedTimes: blockedTimes,
      bookedTimes: bookedTimes,
      canBlock: !isFullyBlocked && !hasBookings,
      canUnblock: isFullyBlocked
    });
    
  } catch (error) {
    console.error('Error consultando estado de fecha:', error);
    res.status(500).json({
      success: false,
      error: 'Error consultando estado de fecha'
    });
  }
});

// Endpoint para obtener estadísticas de admin
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const rejectedBookings = await Booking.countDocuments({ status: 'rejected' });
    
    const today = new Date().toLocaleDateString('en-US');
    const todayBookings = await Booking.countDocuments({ date: today });
    
    res.json({
      success: true,
      stats: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        rejected: rejectedBookings,
        today: todayBookings
      }
    });
    
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estadísticas'
    });
  }
});

// Endpoint para eliminar una reserva
app.delete('/api/admin/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findByIdAndDelete(id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Reserva no encontrada'
      });
    }

    console.log(`✅ Reserva ${id} eliminada por admin`);
    
    res.json({
      success: true,
      message: 'Reserva eliminada exitosamente'
    });
    
  } catch (error) {
    console.error('Error eliminando reserva:', error);
    res.status(500).json({
      success: false,
      error: 'Error eliminando reserva'
    });
  }
});

// Endpoint para cambiar el estado de una reserva
app.put('/api/admin/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Estado inválido. Debe ser: pending, confirmed, o rejected'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id, 
      { status: status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Reserva no encontrada'
      });
    }

    // Si se confirma la reserva, bloquear el horario
    if (status === 'confirmed') {
      // Actualizar confirmedAt si no existe
      if (!booking.confirmedAt) {
        booking.confirmedAt = new Date();
        await booking.save();
      }
      
      const blockedSlot = new BookedSlot({
        date: booking.date,
        time: booking.time,
        isBlocked: false, // No es bloqueo administrativo, es reserva confirmada
        reason: 'confirmed-booking',
        bookingId: booking._id,
        blockedAt: new Date()
      });
      await blockedSlot.save();
      
      console.log(`✅ Horario ${booking.date} ${booking.time} bloqueado por reserva confirmada`);
      
      // Enviar email de confirmación al cliente (ASÍNCRONO - no bloquea la respuesta)
      if (emailConfigured) {
        // Enviar email en background sin esperar
        sendFinalConfirmation({
          clientName: booking.clientName,
          clientEmail: booking.clientEmail,
          service: booking.service,
          date: booking.date,
          time: booking.time
        }).then(() => {
          console.log(`✅ Email de confirmación enviado a ${booking.clientEmail}`);
        }).catch((emailError) => {
          console.error('❌ Error enviando email de confirmación final:', emailError.message || emailError);
          console.error('❌ Detalles del error:', emailError);
        });
        } else {
        console.warn('⚠️ Email no configurado - No se envió confirmación');
      }
    }

    console.log(`✅ Reserva ${id} actualizada a estado: ${status}`);
    
    // Responder inmediatamente sin esperar el email
    res.json({
      success: true,
      message: `Reserva actualizada a ${status}`,
      booking: booking
    });
    
  } catch (error) {
    console.error('Error actualizando estado de reserva:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando estado de reserva'
    });
  }
});

// Endpoint para cotización de plantas faux
app.post('/api/plant-quote', async (req, res) => {
  try {
    const { contact, contactType, zip, plants, photo } = req.body;

    if (!contact || !plants || plants.length === 0) {
      return res.status(400).json({ success: false, error: 'Faltan datos requeridos' });
    }

    console.log('🌿 Nueva solicitud de cotización de plantas:', { contact, contactType, zip, plants: plants.length, hasPhoto: !!photo });

    const plantRows = plants.map((p, i) => `
      <tr style="border-bottom:1px solid #eee">
        <td style="padding:10px 8px;color:#333">${i + 1}</td>
        <td style="padding:10px 8px;color:#333"><strong>${p.tipo}</strong></td>
        <td style="padding:10px 8px;color:#333">${p.maceta}</td>
        <td style="padding:10px 8px;color:#333">${p.tamano} pies</td>
      </tr>`).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="es">
      <head><meta charset="utf-8"></head>
      <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,sans-serif;color:#333">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr><td align="center" style="padding:30px 20px">
            <table width="580" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:10px;overflow:hidden">
              <tr>
                <td style="background:linear-gradient(135deg,#4a6163,#5d7a7c);padding:24px 30px">
                  <h1 style="margin:0;color:#fff;font-size:20px">🌿 Solicitud de cotización – Plantas Faux</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:24px 30px">
                  <h3 style="color:#4a6163;margin:0 0 10px;font-size:14px;text-transform:uppercase;letter-spacing:0.05em">Contacto del cliente</h3>
                  <table style="background:#f8f9fa;border-radius:8px;border-left:4px solid #4a6163;width:100%;margin-bottom:20px">
                    <tr><td style="padding:12px 16px;font-size:14px">
                      <strong>${contactType === 'email' ? 'Email' : 'Teléfono'}:</strong> ${contact}
                    </td></tr>
                  </table>
                  <h3 style="color:#4a6163;margin:0 0 10px;font-size:14px;text-transform:uppercase;letter-spacing:0.05em">Plantas solicitadas</h3>
                  <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #eee;border-radius:8px;overflow:hidden">
                    <thead>
                      <tr style="background:#4a6163">
                        <th style="padding:10px 8px;text-align:left;color:#fff;font-size:12px">#</th>
                        <th style="padding:10px 8px;text-align:left;color:#fff;font-size:12px">Tipo</th>
                        <th style="padding:10px 8px;text-align:left;color:#fff;font-size:12px">Maceta</th>
                        <th style="padding:10px 8px;text-align:left;color:#fff;font-size:12px">Tamaño</th>
                      </tr>
                    </thead>
                    <tbody>${plantRows}</tbody>
                  </table>
                  <p style="margin:20px 0 0;font-size:11px;color:#aaa;text-align:center">dedecorinfo.com</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>`;

    const adminEmail = process.env.ADMIN_EMAIL || 'dedecorinfo@gmail.com';

    if (emailConfigured) {
      // Usar Resend (producción)
      try {
        await sendPlantQuoteEmail({ contact, contactType, zip, plants, photo });
        console.log('✅ Email enviado via Resend');
      } catch (emailErr) {
        console.error('⚠️ Error Resend:', emailErr.message);
      }
    } else {
      // Fallback: Gmail SMTP nativo
      const gmailUser = process.env.EMAIL_USER;
      const gmailPass = process.env.GMAIL_APP_PASSWORD;
      if (gmailUser && gmailPass) {
        try {
          await sendGmail({
            from: `DEdecor <${gmailUser}>`,
            to: adminEmail,
            subject: '🌿 Nueva solicitud de cotización – Plantas Faux',
            html: emailHtml,
            user: gmailUser,
            pass: gmailPass
          });
          console.log('✅ Email enviado via Gmail SMTP a', adminEmail);
        } catch (gmailErr) {
          console.error('❌ Error Gmail SMTP:', gmailErr.message);
        }
      } else {
        console.log('⚠️ Sin credenciales de email – cotización no enviada');
      }
    }

    res.json({ success: true, message: 'Solicitud recibida correctamente' });
  } catch (error) {
    console.error('❌ Error en plant-quote:', error);
    res.status(500).json({ success: false, error: 'Error procesando la solicitud' });
  }
});

// Servir React app para todas las rutas no-API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  console.log(`🔗 MongoDB Atlas: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
      console.log('✨ ¡Sistema de reservas listo para producción!');
    });

module.exports = app;
