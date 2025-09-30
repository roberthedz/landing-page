const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const dns = require('dns');

// Importar configuración de email con SendGrid
const { 
  configureSendGrid, 
  sendAdminNotification, 
  sendClientConfirmation, 
  sendFinalConfirmation 
} = require('./src/config/emailConfig');

// 🔧 FIX: Forzar uso de DNS de Google para resolver MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);
console.log('🔧 DNS configurado:', dns.getServers());

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🔍 Puerto configurado:', PORT);
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
  bookingId: { type: String, required: true },
  reason: { type: String, required: true },
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

// Configurar SendGrid para emails seguros
const emailConfigured = configureSendGrid();

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

    console.log('🔍 Consultando horarios ocupados para:', date);
    
    const bookedSlots = await BookedSlot.find({ date });
    
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
  console.log('🔍 POST /api/bookings - Solicitud recibida desde:', req.get('origin'));
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
      console.log('🔍 Verificando disponibilidad del horario:', date, time);
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
    console.log('📧 Enviando emails de nueva solicitud...');
    let emailsSent = false;
    
    if (emailConfigured) {
      try {
        // 🔥 IMPORTANTE: Enviar ambos emails EN PARALELO para máxima velocidad
        await Promise.all([
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
          }),
          
          // Email al CLIENTE - Solicitud recibida (no confirmada)
          sendClientConfirmation({
            bookingId,
            clientName,
            clientEmail,
            service,
            date,
            time
          })
        ]);
        
        console.log('✅ Emails enviados exitosamente a ADMIN y CLIENTE simultáneamente');
        emailsSent = true;
      } catch (emailError) {
        console.error('⚠️ Error al enviar emails:', emailError);
        // Continuar aunque falle el email
      }
    } else {
      console.warn('⚠️ SendGrid no configurado - emails no enviados');
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

    // 6️⃣ RESPUESTA EXITOSA (siempre que los emails se hayan enviado)
    if (emailsSent) {
      console.log(`🎉 Flujo completo exitoso para ${clientName} - Emails enviados`);
      res.status(201).json({ 
        success: true, 
        bookingId: bookingId,
        message: 'Solicitud de reserva enviada - Emails notificados',
        status: 'pending',
        emailsSent: true,
        bookingSaved: bookingSaved,
        note: bookingSaved 
          ? 'Los horarios se bloquearán cuando el admin confirme la reserva' 
          : 'Emails enviados correctamente. MongoDB no disponible temporalmente.'
      });
    } else {
      // Si los emails no se enviaron, es un error crítico
      console.error('❌ Error crítico: No se pudieron enviar los emails');
      res.status(500).json({ 
        success: false, 
        error: 'No se pudieron enviar las notificaciones por email',
        bookingId: bookingId
      });
    }

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

// Servir React app para todas las rutas no-API
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  console.log(`🔗 MongoDB Atlas: ${mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
  console.log(`📧 Email: ${emailConfigured ? 'Configurado' : 'No configurado'}`);
  console.log('✨ ¡Sistema de reservas listo para producción!');
});

module.exports = app;
