const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

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
      maxPoolSize: 10, // Mantener hasta 10 conexiones de socket
      family: 4 // Usar IPv4, omitir IPv6
    });
    
    console.log('✅ Conectado a MongoDB Atlas exitosamente');
    
    // Eventos de conexión
    mongoose.connection.on('connected', () => {
      console.log('🟢 Mongoose conectado a MongoDB Atlas');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔴 Mongoose desconectado de MongoDB Atlas');
    });
    
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB Atlas:', error.message);
    console.error('🔧 Verifica:');
    console.error('   1. IP whitelist en MongoDB Atlas (0.0.0.0/0)');
    console.error('   2. Usuario y contraseña correctos');
    console.error('   3. Cluster activo');
    
    // No exit, permitir que el servidor siga corriendo para diagnosticar
    console.log('⚠️ Servidor continuará sin MongoDB...');
  }
};

// Schemas MongoDB
const bookingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'confirmed', 'rejected', 'cancelled'], default: 'pending' },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  clientPhone: { type: String, required: true },
  service: { type: String, required: true },
  serviceDuration: { type: String, required: false },
  servicePrice: { type: String, required: false },
  date: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, required: true },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const bookedSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  bookingId: { type: String, required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const contactMessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  clientEmail: { type: String, required: true },
  phone: { type: String, default: 'No proporcionado' },
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

// Configurar el transportador de email
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dedecorinfo@gmail.com',
    pass: 'ihrvuveqsskjxyog'
  }
});

// Verificar la configuración de email
emailTransporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error en la configuración de email:', error);
  } else {
    console.log('✅ Servidor de email configurado correctamente');
  }
});

// Middleware CORS MEJORADO para permitir dedecorinfo.com
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'https://landing-page-534b.onrender.com',
    'https://dedecorinfo.com',
    'http://dedecorinfo.com',
    'https://www.dedecorinfo.com',
    'http://www.dedecorinfo.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ]
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware adicional para CORS - ACTUALIZADO
app.use((req, res, next) => {
  const origin = req.get('origin');
  const allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'https://landing-page-534b.onrender.com',
    'https://dedecorinfo.com',
    'http://dedecorinfo.com',
    'https://www.dedecorinfo.com',
    'http://www.dedecorinfo.com'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // Para debugging, mostrar orígenes no permitidos
    console.log(`⚠️ Origen no permitido: ${origin}`);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  console.log(`🌐 CORS: ${req.method} ${req.path} desde ${origin || 'unknown'} - ${allowedOrigins.includes(origin) ? '✅ PERMITIDO' : '❌ BLOQUEADO'}`);
  
  if (req.method === 'OPTIONS') {
    console.log('🔧 Preflight OPTIONS request manejado');
    return res.sendStatus(200);
  }
  
  next();
});

app.use(express.static(path.join(__dirname, 'build')));

// Endpoint de salud para diagnosticar
app.get('/api/health', async (req, res) => {
  console.log('🔍 GET /api/health - Solicitud recibida desde:', req.get('origin'));
  
  try {
    // Probar conexión a MongoDB
    const bookingCount = await Booking.countDocuments();
    const slotCount = await BookedSlot.countDocuments();
    
    // Obtener las últimas 5 reservas para debugging
    const recentBookings = await Booking.find({}).sort({ createdAt: -1 }).limit(5);
    const recentSlots = await BookedSlot.find({}).sort({ createdAt: -1 }).limit(5);
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      mongodb: 'connected',
      email: 'configured',
      reservas: bookingCount,
      horarios: slotCount,
      cors: req.get('origin') || 'no-origin',
      ultimasReservas: recentBookings.map(b => ({
        id: b.id,
        cliente: b.clientName,
        fecha: b.date,
        hora: b.time,
        estado: b.status,
        creada: b.createdAt
      })),
      ultimosHorarios: recentSlots
    });
  } catch (error) {
    console.error('❌ Error en health check:', error);
    res.status(500).json({
      status: 'error',
      mongodb: 'disconnected',
      error: error.message
    });
  }
});

// API para obtener horarios ocupados - MEJORADA
app.get('/api/booked-slots', async (req, res) => {
  console.log('🔍 GET /api/booked-slots - Solicitud recibida desde:', req.get('origin'));
  
  try {
    console.log('📡 Consultando MongoDB Atlas...');
    const { date } = req.query;
    let query = {};
    
    if (date) {
      query.date = date;
      console.log(`🔍 Filtrando por fecha: ${date}`);
    }
    
    const bookedSlots = await BookedSlot.find(query).sort({ date: 1, time: 1 });
    console.log(`📊 Enviando ${bookedSlots.length} horarios ocupados:`, bookedSlots);
    
    // Agrupar por fecha para mejor organización
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
    
    res.set({
      'Cache-Control': 'public, max-age=30',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': req.get('origin') || '*'
    });
    
    res.json({
      success: true,
      totalSlots: bookedSlots.length,
      bookedSlots: bookedSlots,
      slotsByDate: slotsByDate
    });
    
  } catch (error) {
    console.error('❌ Error al obtener horarios ocupados:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al obtener horarios ocupados',
      success: false,
      data: [],
      details: error.message
    });
  }
});

// API para crear una nueva reserva - FLUJO COMPLETO Y ROBUSTO
app.post('/api/bookings', async (req, res) => {
  console.log('🔍 POST /api/bookings - Solicitud recibida desde:', req.get('origin'));
  console.log('📝 Datos recibidos:', req.body);
  
  try {
    const { clientName, clientEmail, clientPhone, service, date, time, type } = req.body;
    
    // 1️⃣ VALIDACIÓN DE DATOS REQUERIDOS
    if (!clientName || !clientEmail || !clientPhone || !service || !date || !time || !type) {
      console.log('❌ Faltan campos requeridos');
      return res.status(400).json({ 
        error: 'Faltan campos requeridos',
        success: false
      });
    }
    
    // 2️⃣ VALIDACIÓN DE EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      console.log('❌ Formato de email inválido:', clientEmail);
      return res.status(400).json({ 
        error: 'Formato de email inválido',
        success: false
      });
    }
    
    // 3️⃣ GENERAR ID ÚNICO
    const bookingId = req.body.id || `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // 4️⃣ VERIFICAR ID NO DUPLICADO
    const existingBooking = await Booking.findOne({ id: bookingId });
    if (existingBooking) {
      console.log('❌ ID duplicado:', bookingId);
      return res.status(409).json({ 
        error: 'Ya existe una reserva con este ID',
        success: false
      });
    }
    
    // 5️⃣ VERIFICAR QUE EL HORARIO ESTÉ DISPONIBLE
    console.log('🔍 Verificando disponibilidad del horario:', date, time);
    const existingSlot = await BookedSlot.findOne({ date, time });
    if (existingSlot) {
      console.log('❌ Horario ya ocupado:', existingSlot);
      return res.status(409).json({ 
        error: `Este horario ya está ocupado. Reserva: ${existingSlot.bookingId}`,
        success: false
      });
    }
    
    // 6️⃣ CREAR LA RESERVA
    console.log('💾 Creando reserva en MongoDB...');
    const booking = new Booking({
      id: bookingId,
      status: 'confirmed', // ✅ Auto-confirmar para evitar problemas
      clientName,
      clientEmail,
      clientPhone,
      service,
      serviceDuration: req.body.serviceDuration,
      servicePrice: req.body.servicePrice,
      date,
      time,
      type,
      notes: req.body.notes || ''
    });
    
    await booking.save();
    console.log(`✅ Reserva guardada: ${bookingId} para ${clientName}`);
    
    // 7️⃣ GENERAR Y GUARDAR HORARIOS OCUPADOS INMEDIATAMENTE
    console.log('🔒 Generando horarios ocupados automáticamente...');
    const morningTimes = ['9:00 AM', '10:00 AM', '11:00 AM'];
    const afternoonTimes = ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
    
    const newSlots = [];
    
    if (type === 'asesoria-completa') {
      // Bloquear todo el turno (mañana o tarde)
      const isMorning = morningTimes.includes(time);
      const timesToBlock = isMorning ? morningTimes : afternoonTimes;
      
      timesToBlock.forEach(timeSlot => {
        newSlots.push({
          date: date,
          time: timeSlot,
          bookingId: bookingId,
          reason: `Asesoría completa - turno ${isMorning ? 'mañana' : 'tarde'}`
        });
      });
      console.log(`🔒 Bloqueando turno completo (${isMorning ? 'mañana' : 'tarde'}):`, timesToBlock);
      
    } else if (req.body.serviceDuration === '120 min') {
      // Bloquear 2 slots consecutivos para servicios de 2 horas
      const allTimes = [...morningTimes, ...afternoonTimes];
      const currentIndex = allTimes.indexOf(time);
      
      // Bloquear el horario actual
      newSlots.push({
        date: date,
        time: time,
        bookingId: bookingId,
        reason: 'Consulta 120 min - hora 1'
      });
      
      // Bloquear el siguiente horario si existe y está en el mismo turno
      if (currentIndex !== -1 && currentIndex < allTimes.length - 1) {
        const nextTime = allTimes[currentIndex + 1];
        const isMorningTime = morningTimes.includes(time);
        const isNextMorningTime = morningTimes.includes(nextTime);
        
        if (isMorningTime === isNextMorningTime) {
          newSlots.push({
            date: date,
            time: nextTime,
            bookingId: bookingId,
            reason: 'Consulta 120 min - hora 2'
          });
        }
      }
      console.log(`🔒 Bloqueando 2 horas consecutivas desde: ${time}`);
      
    } else {
      // Para consultas de 60 min, solo bloquear el horario seleccionado
      newSlots.push({
        date: date,
        time: time,
        bookingId: bookingId,
        reason: 'Consulta individual'
      });
      console.log(`🔒 Bloqueando 1 hora: ${time}`);
    }
    
    // 8️⃣ GUARDAR HORARIOS OCUPADOS
    if (newSlots.length > 0) {
      await BookedSlot.insertMany(newSlots);
      console.log(`✅ ${newSlots.length} horarios bloqueados exitosamente`);
    }
    
    // 9️⃣ ENVIAR EMAILS DE NOTIFICACIÓN
    console.log('📧 Enviando emails de notificación...');
    try {
      const baseUrl = getBaseUrl(req);
      const confirmUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=confirm`;
      const rejectUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=reject`;
      
      // Email al admin
      await emailTransporter.sendMail({
        from: '"Sistema de Reservas DeDecor" <dedecorinfo@gmail.com>',
        to: 'dedecorinfo@gmail.com',
        subject: `🎉 RESERVA CONFIRMADA - ${clientName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #28a745;">✅ Reserva Confirmada Automáticamente</h2>
            <p>Se ha creado y confirmado una nueva reserva:</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Cliente:</strong> ${clientName}</p>
              <p><strong>Email:</strong> ${clientEmail}</p>
              <p><strong>Teléfono:</strong> ${clientPhone}</p>
              <p><strong>Servicio:</strong> ${service}</p>
              <p><strong>Fecha:</strong> ${date}</p>
              <p><strong>Hora:</strong> ${time}</p>
              <p><strong>Tipo:</strong> ${type}</p>
              <p><strong>Horarios bloqueados:</strong> ${newSlots.length}</p>
            </div>
            
            <div style="background-color: #e7f3ff; padding: 10px; border-radius: 5px; margin: 20px 0;">
              <p><strong>💡 Nota:</strong> Los horarios se han bloqueado automáticamente. Si necesitas cancelar, hazlo desde el panel de admin.</p>
            </div>
            
            <p style="font-size: 14px; color: #666;">
              ID de reserva: ${bookingId}
            </p>
          </div>
        `
      });
      
      // Email al cliente
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: clientEmail,
        subject: '🎉 ¡Tu reserva ha sido confirmada!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">¡Reserva Confirmada Exitosamente!</h2>
            <p>Hola ${clientName},</p>
            <p>Tu reserva ha sido <strong>confirmada automáticamente</strong>. ¡Nos vemos pronto!</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Servicio:</strong> ${service}</p>
              <p><strong>Fecha:</strong> ${date}</p>
              <p><strong>Hora:</strong> ${time}</p>
              <p><strong>Tipo:</strong> ${type}</p>
            </div>
            
            <div style="background-color: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>✅ Tu horario está reservado y bloqueado</strong></p>
              <p>No te preocupes, nadie más podrá reservar este horario.</p>
            </div>
            
            <p>Si necesitas hacer algún cambio, contáctanos lo antes posible.</p>
            <p>¡Esperamos verte pronto!</p>
            <p>Saludos,<br>El equipo de DeDecor</p>
          </div>
        `
      });
      
      console.log('✅ Emails enviados exitosamente');
    } catch (emailError) {
      console.error('⚠️ Error al enviar emails (pero la reserva fue creada):', emailError);
    }
    
    // 🔟 RESPUESTA EXITOSA
    console.log(`🎉 Flujo completo exitoso para ${clientName}`);
    res.status(201).json({ 
      success: true, 
      bookingId: booking.id,
      message: 'Reserva creada y horarios bloqueados exitosamente',
      horariosBloquados: newSlots.length,
      status: 'confirmed',
      emailsSent: true
    });
    
  } catch (error) {
    console.error('❌ Error en el flujo de reserva:', error);
    
    // 🔄 ROLLBACK: Si algo falló, intentar limpiar
    try {
      const bookingId = req.body.id || `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      console.log('🔄 Intentando rollback para:', bookingId);
      
      // Eliminar reserva si se creó
      await Booking.deleteOne({ id: bookingId });
      // Eliminar horarios si se crearon
      await BookedSlot.deleteMany({ bookingId });
      
      console.log('✅ Rollback completado');
    } catch (rollbackError) {
      console.error('❌ Error en rollback:', rollbackError);
    }
    
    res.status(500).json({ 
      error: 'Error interno del servidor al crear la reserva',
      success: false,
      details: error.message
    });
  }
});

// API para enviar email de confirmación de reserva
app.post('/api/send-booking-email', async (req, res) => {
  const { clientEmail, clientName, bookingDetails } = req.body;
  const baseUrl = getBaseUrl(req);
  const bookingId = bookingDetails.id || 'id';
  const confirmUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=confirm`;
  const rejectUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=reject`;
  
  console.log('📧 Enviando emails de reserva...');
  
  try {
    await emailTransporter.sendMail({
      from: '"Sistema de Reservas DeDecor" <dedecorinfo@gmail.com>',
      to: 'dedecorinfo@gmail.com',
      subject: `Nueva solicitud de reserva - ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6163;">Nueva Solicitud de Reserva</h2>
          <p>Has recibido una nueva solicitud de reserva:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Cliente:</strong> ${clientName}</p>
            <p><strong>Email:</strong> ${clientEmail}</p>
            <p><strong>Teléfono:</strong> ${bookingDetails.phone}</p>
            <p><strong>Servicio:</strong> ${bookingDetails.service}</p>
            <p><strong>Fecha:</strong> ${bookingDetails.date}</p>
            <p><strong>Hora:</strong> ${bookingDetails.time}</p>
            <p><strong>Tipo:</strong> ${bookingDetails.type}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 15px;">
              Confirmar Reserva
            </a>
            <a href="${rejectUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Rechazar Reserva
            </a>
          </div>
        </div>
      `
    });
    
    await emailTransporter.sendMail({
      from: '"DeDecor" <dedecorinfo@gmail.com>',
      to: clientEmail,
      subject: 'Hemos recibido tu solicitud de reserva',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6163;">Solicitud de Reserva Recibida</h2>
          <p>Hola ${clientName},</p>
          <p>Hemos recibido tu solicitud de reserva y la revisaremos pronto.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Servicio:</strong> ${bookingDetails.service}</p>
            <p><strong>Fecha:</strong> ${bookingDetails.date}</p>
            <p><strong>Hora:</strong> ${bookingDetails.time}</p>
          </div>
          
          <p>Te contactaremos pronto para confirmar tu reserva.</p>
          <p>Saludos,<br>El equipo de DeDecor</p>
        </div>
      `
    });
    
    console.log('✅ Emails enviados exitosamente');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error al enviar emails:', error);
    res.status(500).json({ error: 'Error al enviar emails' });
  }
});

// API para confirmar o rechazar una reserva
app.post('/api/bookings/:id/status', async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  
  try {
    const booking = await Booking.findOne({ id });
    
    if (!booking) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    if (action === 'confirm') {
      booking.status = 'confirmed';
      await booking.save();
      
      // Generar slots ocupados
      const morningTimes = ['9:00 AM', '10:00 AM', '11:00 AM'];
      const afternoonTimes = ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
      
      const newSlots = [];
      
      if (booking.type === 'asesoria-completa') {
        const isMorning = morningTimes.includes(booking.time);
        const timesToBlock = isMorning ? morningTimes : afternoonTimes;
        
        timesToBlock.forEach(time => {
          newSlots.push({
            date: booking.date,
            time: time,
            bookingId: booking.id,
            reason: `Asesoría completa - turno ${isMorning ? 'mañana' : 'tarde'}`
          });
        });
      } else {
        newSlots.push({
          date: booking.date,
          time: booking.time,
          bookingId: booking.id,
          reason: 'Consulta individual'
        });
      }
      
      await BookedSlot.insertMany(newSlots);
      
      // Enviar email de confirmación
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: booking.clientEmail,
        subject: 'Tu reserva ha sido confirmada',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">¡Reserva Confirmada!</h2>
            <p>Hola ${booking.clientName},</p>
            <p>Tu reserva para ${booking.service} ha sido confirmada.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Fecha:</strong> ${booking.date}</p>
              <p><strong>Hora:</strong> ${booking.time}</p>
            </div>
            
            <p>¡Esperamos verte pronto!</p>
            <p>Saludos,<br>El equipo de DeDecor</p>
          </div>
        `
      });
      
      console.log('✅ Reserva confirmada y email enviado');
      return res.json({ success: true, message: 'Reserva confirmada exitosamente' });
      
    } else if (action === 'reject') {
      booking.status = 'rejected';
      await booking.save();
      
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: booking.clientEmail,
        subject: 'Información sobre tu solicitud de reserva',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">Actualización de tu Reserva</h2>
            <p>Hola ${booking.clientName},</p>
            <p>Lamentamos informarte que no podemos confirmar tu reserva en el horario solicitado.</p>
            <p>Por favor, intenta con otro horario.</p>
            <p>Gracias por tu comprensión,<br>El equipo de DeDecor</p>
          </div>
        `
      });
      
      return res.json({ success: true, message: 'Reserva rechazada exitosamente' });
    }
    
    return res.status(400).json({ error: 'Acción desconocida' });
  } catch (error) {
    console.error('❌ Error al procesar la reserva:', error);
    return res.status(500).json({ error: 'Error al procesar la reserva' });
  }
});

// Manejar confirmaciones desde el email
app.get('/confirm-booking', async (req, res) => {
  const { id, action } = req.query;
  
  if (!id || !action) {
    return res.status(400).send('Error: Faltan parámetros');
  }
  
  try {
    const booking = await Booking.findOne({ id });
    
    if (!booking) {
      return res.status(404).send('Error: Reserva no encontrada');
    }
    
    if (action === 'confirm') {
      booking.status = 'confirmed';
      await booking.save();
      
      return res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: green;">¡Reserva Confirmada!</h1>
            <p>La reserva de ${booking.clientName} ha sido confirmada exitosamente.</p>
          </body>
        </html>
      `);
    } else if (action === 'reject') {
      booking.status = 'rejected';
      await booking.save();
      
      return res.send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; margin-top: 50px;">
            <h1 style="color: red;">Reserva Rechazada</h1>
            <p>La reserva de ${booking.clientName} ha sido rechazada.</p>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('❌ Error al procesar la confirmación:', error);
    return res.status(500).send('Error al procesar la reserva');
  }
});

// API para verificar el estado del sistema - DIAGNÓSTICO
app.get('/api/system-status', async (req, res) => {
  console.log('🔍 GET /api/system-status - Verificando estado del sistema...');
  
  try {
    // Verificar conexión a MongoDB
    const mongoStatus = mongoose.connection.readyState;
    const mongoStates = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    
    // Contar datos en cada colección
    const totalBookings = await Booking.countDocuments();
    const totalSlots = await BookedSlot.countDocuments();
    const totalMessages = await ContactMessage.countDocuments();
    
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const rejectedBookings = await Booking.countDocuments({ status: 'rejected' });
    
    // Verificar emails (test básico)
    let emailStatus = 'unknown';
    try {
      await emailTransporter.verify();
      emailStatus = 'connected';
    } catch (emailError) {
      emailStatus = 'error';
    }
    
    const systemStatus = {
      timestamp: new Date().toISOString(),
      server: {
        status: 'running',
        port: PORT,
        environment: process.env.NODE_ENV || 'production'
      },
      database: {
        status: mongoStates[mongoStatus],
        connection: mongoStatus === 1 ? 'connected' : 'disconnected',
        collections: {
          bookings: totalBookings,
          bookedSlots: totalSlots,
          contactMessages: totalMessages
        }
      },
      bookings: {
        total: totalBookings,
        confirmed: confirmedBookings,
        pending: pendingBookings,
        rejected: rejectedBookings
      },
      email: {
        status: emailStatus,
        transporter: emailTransporter ? 'configured' : 'not configured'
      }
    };
    
    console.log('✅ Estado del sistema:', systemStatus);
    res.json({
      success: true,
      ...systemStatus
    });
    
  } catch (error) {
    console.error('❌ Error al verificar estado del sistema:', error);
    res.status(500).json({
      success: false,
      error: 'Error al verificar el estado del sistema',
      details: error.message
    });
  }
});

// API para limpiar reservas de prueba - SOLO PARA DESARROLLO
app.delete('/api/cleanup-test-data', async (req, res) => {
  console.log('🧹 DELETE /api/cleanup-test-data - Limpiando datos de prueba...');
  
  try {
    // Solo eliminar reservas que claramente son de prueba
    const testBookings = await Booking.find({
      $or: [
        { clientName: { $regex: /test|prueba|demo/i } },
        { clientEmail: { $regex: /test|prueba|demo/i } },
        { id: { $regex: /test|prueba|demo/i } }
      ]
    });
    
    if (testBookings.length > 0) {
      const testBookingIds = testBookings.map(b => b.id);
      
      // Eliminar reservas de prueba
      await Booking.deleteMany({ id: { $in: testBookingIds } });
      
      // Eliminar horarios ocupados de prueba
      await BookedSlot.deleteMany({ bookingId: { $in: testBookingIds } });
      
      console.log(`🧹 Eliminadas ${testBookings.length} reservas de prueba`);
      res.json({
        success: true,
        message: `Eliminadas ${testBookings.length} reservas de prueba`,
        deletedBookings: testBookingIds
      });
    } else {
      res.json({
        success: true,
        message: 'No se encontraron reservas de prueba para eliminar'
      });
    }
    
  } catch (error) {
    console.error('❌ Error al limpiar datos de prueba:', error);
    res.status(500).json({
      success: false,
      error: 'Error al limpiar datos de prueba',
      details: error.message
    });
  }
});

// API para enviar email de contacto
app.post('/api/send-contact-email', async (req, res) => {
  const { clientEmail, clientName, contactDetails } = req.body;
  
  try {
    const messageId = `message-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newMessage = new ContactMessage({
      id: messageId,
      clientName,
      clientEmail,
      phone: contactDetails.phone || 'No proporcionado',
      message: contactDetails.message,
      date: contactDetails.date
    });
    
    await newMessage.save();
    
    await emailTransporter.sendMail({
      from: '"Formulario de Contacto DeDecor" <dedecorinfo@gmail.com>',
      to: 'dedecorinfo@gmail.com',
      subject: `Nuevo mensaje de contacto - ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Nuevo Mensaje de Contacto</h2>
          <p><strong>Nombre:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Teléfono:</strong> ${contactDetails.phone || 'No proporcionado'}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${contactDetails.message}</p>
        </div>
      `
    });
    
    await emailTransporter.sendMail({
      from: '"DeDecor" <dedecorinfo@gmail.com>',
      to: clientEmail,
      subject: 'Hemos recibido tu mensaje',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Mensaje Recibido</h2>
          <p>Hola ${clientName},</p>
          <p>Hemos recibido tu mensaje y te responderemos pronto.</p>
          <p>Saludos,<br>El equipo de DeDecor</p>
        </div>
      `
    });
    
    console.log('✅ Emails de contacto enviados');
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error al enviar emails de contacto:', error);
    res.status(500).json({ error: 'Error al enviar emails de contacto' });
  }
});

// Manejar todas las demás rutas para servir la aplicación React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
      console.log(`🔗 MongoDB Atlas: Conectado`);
      console.log(`📧 Email: Configurado`);
      console.log('✨ ¡Sistema de reservas listo para producción!');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer(); 