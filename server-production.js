const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración MongoDB Atlas directa
const mongoUri = 'mongodb+srv://rhzamora144:86e6FbGM00uV78RP@cluster0.4vwcokw.mongodb.net/reservas?retryWrites=true&w=majority&appName=Cluster0';

// Conectar a MongoDB Atlas
const connectDB = async () => {
  try {
    console.log('🔗 Conectando a MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado a MongoDB Atlas exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB Atlas:', error.message);
    process.exit(1);
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

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'https://landing-page-534b.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

// API para obtener horarios ocupados
app.get('/api/booked-slots', async (req, res) => {
  try {
    const bookedSlots = await BookedSlot.find({});
    console.log(`📊 Enviando ${bookedSlots.length} horarios ocupados`);
    
    res.set({
      'Cache-Control': 'public, max-age=30',
      'Content-Type': 'application/json'
    });
    
    res.json(bookedSlots);
  } catch (error) {
    console.error('❌ Error al obtener horarios ocupados:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al obtener horarios ocupados',
      data: []
    });
  }
});

// API para crear una nueva reserva
app.post('/api/bookings', async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, service, date, time, type } = req.body;
    
    if (!clientName || !clientEmail || !clientPhone || !service || !date || !time || !type) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos',
        success: false
      });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return res.status(400).json({ 
        error: 'Formato de email inválido',
        success: false
      });
    }
    
    const bookingId = req.body.id || `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const existingBooking = await Booking.findOne({ id: bookingId });
    if (existingBooking) {
      return res.status(409).json({ 
        error: 'Ya existe una reserva con este ID',
        success: false
      });
    }
    
    const booking = new Booking({
      id: bookingId,
      status: 'pending',
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
    
    console.log(`✅ Nueva reserva creada: ${bookingId} para ${clientName}`);
    res.status(201).json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error('❌ Error al crear reserva:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al crear la reserva',
      success: false
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
    
    app.listen(PORT, () => {
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