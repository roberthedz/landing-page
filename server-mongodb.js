const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const nodemailer = require('nodemailer');
const { connectDB, disconnectDB } = require('./src/config/database');
const Booking = require('./src/models/Booking');
const BookedSlot = require('./src/models/BookedSlot');
const ContactMessage = require('./src/models/ContactMessage');

const app = express();
const PORT = 3000;

// Función para obtener la URL base del request
const getBaseUrl = (req) => {
  const protocol = req.get('x-forwarded-proto') || req.protocol;
  const host = req.get('host');
  return `${protocol}://${host}`;
};

// Configurar el transportador de email
const emailTransporter = nodemailer.createTransporter({
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

// Conectar a MongoDB Atlas al iniciar el servidor
connectDB();

// API para obtener horarios ocupados
app.get('/api/booked-slots', async (req, res) => {
  try {
    const bookedSlots = await BookedSlot.find({});
    
    console.log(`Enviando ${bookedSlots.length} horarios ocupados`);
    
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

// API para enviar email de contacto
app.post('/api/send-contact-email', async (req, res) => {
  const { clientEmail, clientName, contactDetails } = req.body;
  
  try {
    // Guardar el mensaje en MongoDB
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
    console.log('✅ Mensaje de contacto guardado en MongoDB');
    
    // Email a la empresa con los detalles del mensaje
    await emailTransporter.sendMail({
      from: '"Formulario de Contacto DeDecor" <dedecorinfo@gmail.com>',
      to: 'dedecorinfo@gmail.com',
      subject: `Nuevo mensaje de contacto - ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6163;">Nuevo Mensaje de Contacto</h2>
          <p>Has recibido un nuevo mensaje de contacto con los siguientes detalles:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${clientName}</p>
            <p><strong>Email:</strong> ${clientEmail}</p>
            <p><strong>Teléfono:</strong> ${contactDetails.phone || 'No proporcionado'}</p>
            <p><strong>Fecha:</strong> ${contactDetails.date}</p>
            <p><strong>Mensaje:</strong></p>
            <p style="background-color: #ffffff; padding: 10px; border-radius: 5px;">${contactDetails.message}</p>
          </div>
          
          <p>Para responder, simplemente contesta a este correo.</p>
          
          <p style="font-size: 0.9em; color: #6c757d;">Este es un email automático generado por el formulario de contacto de tu sitio web.</p>
        </div>
      `
    });
    
    console.log('✅ Email enviado a la empresa');
    
    // Email de confirmación al cliente
    await emailTransporter.sendMail({
      from: '"DeDecor" <dedecorinfo@gmail.com>',
      to: clientEmail,
      subject: 'Hemos recibido tu mensaje',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6163;">Mensaje Recibido</h2>
          <p>Hola ${clientName},</p>
          <p>Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos lo antes posible.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Tu mensaje:</strong></p>
            <p style="background-color: #ffffff; padding: 10px; border-radius: 5px;">${contactDetails.message}</p>
          </div>
          
          <p>Si tienes alguna consulta urgente, no dudes en llamarnos directamente.</p>
          
          <p style="margin-top: 30px;">Saludos,<br>El equipo de DeDecor</p>
        </div>
      `
    });
    
    console.log('✅ Email de confirmación enviado al cliente');
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error al enviar emails de contacto:', error);
    res.status(500).json({ error: 'Error al enviar emails de contacto' });
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
    // Email a la empresa con opciones para confirmar/rechazar
    await emailTransporter.sendMail({
      from: '"Sistema de Reservas DeDecor" <dedecorinfo@gmail.com>',
      to: 'dedecorinfo@gmail.com',
      subject: `Nueva solicitud de reserva - ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6163;">Nueva Solicitud de Reserva</h2>
          <p>Has recibido una nueva solicitud de reserva con los siguientes detalles:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Cliente:</strong> ${clientName}</p>
            <p><strong>Email:</strong> ${clientEmail}</p>
            <p><strong>Teléfono:</strong> ${bookingDetails.phone}</p>
            <p><strong>Servicio:</strong> ${bookingDetails.service}${bookingDetails.duration ? ` (${bookingDetails.duration})` : ''}</p>
            <p><strong>Fecha:</strong> ${bookingDetails.date}</p>
            <p><strong>Hora:</strong> ${bookingDetails.time}</p>
            <p><strong>Tipo de cita:</strong> ${bookingDetails.type}</p>
            <p><strong>Notas:</strong> ${bookingDetails.notes || 'Sin notas adicionales'}</p>
          </div>
          
          <p>Por favor, confirma o rechaza esta solicitud:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-right: 15px;">
              Confirmar Reserva
            </a>
            <a href="${rejectUrl}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              Rechazar Reserva
            </a>
          </div>
          
          <p style="font-size: 0.9em; color: #6c757d;">Este es un email automático, por favor no responder directamente.</p>
        </div>
      `
    });
    
    console.log('✅ Email enviado a la empresa');
    
    // Email de recepción al cliente
    await emailTransporter.sendMail({
      from: '"DeDecor" <dedecorinfo@gmail.com>',
      to: clientEmail,
      subject: 'Hemos recibido tu solicitud de reserva',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6163;">Solicitud de Reserva Recibida</h2>
          <p>Hola ${clientName},</p>
          <p>Hemos recibido tu solicitud de reserva. Un miembro de nuestro equipo la revisará y te confirmará en breve.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Servicio:</strong> ${bookingDetails.service}${bookingDetails.duration ? ` (${bookingDetails.duration})` : ''}</p>
            <p><strong>Fecha:</strong> ${bookingDetails.date}</p>
            <p><strong>Hora:</strong> ${bookingDetails.time}</p>
            <p><strong>Tipo de cita:</strong> ${bookingDetails.type}</p>
          </div>
          
          <p>Tu reserva está <strong>pendiente de confirmación</strong>. Recibirás un email cuando sea aprobada.</p>
          <p>Si tienes alguna pregunta, no dudes en contactarnos respondiendo a este correo.</p>
          
          <p style="margin-top: 30px;">Saludos,<br>El equipo de DeDecor</p>
        </div>
      `
    });
    
    console.log('✅ Email enviado al cliente');
    
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
      // Actualizar estado de la reserva
      booking.status = 'confirmed';
      await booking.save();
      
      // Función para generar slots ocupados según el tipo de servicio
      const generateBookedSlots = (booking) => {
        const slots = [];
        const morningTimes = ['9:00 AM', '10:00 AM', '11:00 AM'];
        const afternoonTimes = ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        
        // Si es asesoría completa, bloquear todo el turno
        if (booking.type === 'asesoria-completa') {
          const isMorning = morningTimes.includes(booking.time);
          const timesToBlock = isMorning ? morningTimes : afternoonTimes;
          
          timesToBlock.forEach(time => {
            slots.push({
              date: booking.date,
              time: time,
              bookingId: booking.id,
              reason: `Asesoría completa - turno ${isMorning ? 'mañana' : 'tarde'}`
            });
          });
        }
        // Si es consulta de 120 min, bloquear 2 slots consecutivos
        else if (booking.serviceDuration === '120 min') {
          const allTimes = [...morningTimes, ...afternoonTimes];
          const currentIndex = allTimes.indexOf(booking.time);
          
          // Bloquear el horario actual
          slots.push({
            date: booking.date,
            time: booking.time,
            bookingId: booking.id,
            reason: 'Consulta 120 min - hora 1'
          });
          
          // Bloquear el siguiente horario si existe y está en el mismo turno
          if (currentIndex !== -1 && currentIndex < allTimes.length - 1) {
            const nextTime = allTimes[currentIndex + 1];
            const isMorningTime = morningTimes.includes(booking.time);
            const isNextMorningTime = morningTimes.includes(nextTime);
            
            if (isMorningTime === isNextMorningTime) {
              slots.push({
                date: booking.date,
                time: nextTime,
                bookingId: booking.id,
                reason: 'Consulta 120 min - hora 2'
              });
            }
          }
        }
        // Para consulta de 60 min, solo bloquear el horario seleccionado
        else {
          slots.push({
            date: booking.date,
            time: booking.time,
            bookingId: booking.id,
            reason: 'Consulta 60 min'
          });
        }
        
        return slots;
      };
      
      // Generar y guardar los slots ocupados
      const newSlots = generateBookedSlots(booking);
      await BookedSlot.insertMany(newSlots);
      
      console.log('✅ Slots ocupados generados y guardados:', newSlots.length);
      
      // Enviar email de confirmación al cliente
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: booking.clientEmail,
        subject: 'Tu reserva ha sido confirmada',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">¡Reserva Confirmada!</h2>
            <p>Hola ${booking.clientName},</p>
            <p>Nos complace confirmar tu reserva para el servicio de ${booking.service}.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Fecha:</strong> ${booking.date}</p>
              <p><strong>Hora:</strong> ${booking.time}</p>
              <p><strong>Tipo de cita:</strong> ${booking.type}</p>
            </div>
            
            <p>¡Esperamos verte pronto!</p>
            <p>Si necesitas hacer algún cambio, por favor contáctanos lo antes posible.</p>
            
            <p style="margin-top: 30px;">Saludos,<br>El equipo de DeDecor</p>
          </div>
        `
      });
      
      console.log('✅ Email de confirmación enviado al cliente');
      
      return res.json({ success: true, message: 'Reserva confirmada exitosamente' });
    } else if (action === 'reject') {
      // Actualizar estado de la reserva
      booking.status = 'rejected';
      await booking.save();
      
      // Enviar email de rechazo al cliente
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: booking.clientEmail,
        subject: 'Información sobre tu solicitud de reserva',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">Actualización de tu Reserva</h2>
            <p>Hola ${booking.clientName},</p>
            <p>Lamentamos informarte que no podemos confirmar tu reserva para el servicio de ${booking.service} en el horario solicitado.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Fecha:</strong> ${booking.date}</p>
              <p><strong>Hora:</strong> ${booking.time}</p>
            </div>
            
            <p>Te invitamos a intentar con otro horario o fecha que se ajuste mejor a tu agenda.</p>
            <p>Si prefieres, puedes contactarnos directamente para ayudarte a encontrar un horario disponible.</p>
            
            <p style="margin-top: 30px;">Gracias por tu comprensión,<br>El equipo de DeDecor</p>
          </div>
        `
      });
      
      console.log('✅ Email de rechazo enviado al cliente');
      
      return res.json({ success: true, message: 'Reserva rechazada exitosamente' });
    }
    
    return res.status(400).json({ error: 'Acción desconocida' });
  } catch (error) {
    console.error('❌ Error al procesar la reserva:', error);
    return res.status(500).json({ error: 'Error al procesar la reserva' });
  }
});

// API para cancelar una reserva confirmada
app.post('/api/bookings/:id/cancel', async (req, res) => {
  const { id } = req.params;
  
  try {
    const booking = await Booking.findOne({ id });
    
    if (!booking) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
    }
    
    // Verificar que la reserva esté confirmada
    if (booking.status !== 'confirmed') {
      return res.status(400).json({ error: 'Solo se pueden cancelar reservas confirmadas' });
    }
    
    // Actualizar estado de la reserva
    booking.status = 'cancelled';
    await booking.save();
    
    // Eliminar todos los horarios ocupados relacionados con esta reserva
    const deletedSlots = await BookedSlot.deleteMany({ bookingId: id });
    
    console.log('✅ Slots eliminados:', deletedSlots.deletedCount);
    
    // Enviar email de cancelación al cliente
    await emailTransporter.sendMail({
      from: '"DeDecor" <dedecorinfo@gmail.com>',
      to: booking.clientEmail,
      subject: 'Tu reserva ha sido cancelada',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6163;">Reserva Cancelada</h2>
          <p>Hola ${booking.clientName},</p>
          <p>Te informamos que tu reserva para el servicio de ${booking.service} ha sido cancelada.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Fecha:</strong> ${booking.date}</p>
            <p><strong>Hora:</strong> ${booking.time}</p>
          </div>
          
          <p>Si deseas reprogramar tu cita, puedes hacerlo a través de nuestra página web o contactándonos directamente.</p>
          
          <p style="margin-top: 30px;">Saludos,<br>El equipo de DeDecor</p>
        </div>
      `
    });
    
    console.log('✅ Email de cancelación enviado al cliente');
    
    return res.json({ success: true, message: 'Reserva cancelada exitosamente' });
  } catch (error) {
    console.error('❌ Error al cancelar la reserva:', error);
    return res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
});

// API para listar todas las reservas
app.get('/api/bookings', async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const bookings = await Booking.find(query);
    
    // Devolver información básica de las reservas
    const bookingsInfo = bookings.map(booking => ({
      id: booking.id,
      clientName: booking.clientName,
      service: booking.service,
      date: booking.date,
      time: booking.time,
      status: booking.status
    }));
    
    res.json(bookingsInfo);
  } catch (error) {
    console.error('❌ Error al obtener reservas:', error);
    res.status(500).json({ error: 'Error al obtener reservas' });
  }
});

// API para crear una nueva reserva
app.post('/api/bookings', async (req, res) => {
  try {
    // Validar datos requeridos
    const { clientName, clientEmail, clientPhone, service, date, time, type } = req.body;
    
    if (!clientName || !clientEmail || !clientPhone || !service || !date || !time || !type) {
      return res.status(400).json({ 
        error: 'Faltan campos requeridos',
        success: false
      });
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      return res.status(400).json({ 
        error: 'Formato de email inválido',
        success: false
      });
    }
    
    // Generar ID único para la reserva
    const bookingId = req.body.id || `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Verificar que no existe una reserva con el mismo ID
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

// Manejar confirmaciones desde el email
app.get('/confirm-booking', async (req, res) => {
  const { id, action } = req.query;
  
  if (!id || !action) {
    return res.status(400).send(`
      <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <h1 class="error">Error</h1>
          <p>Faltan parámetros requeridos.</p>
        </body>
      </html>
    `);
  }
  
  try {
    const booking = await Booking.findOne({ id });
    
    if (!booking) {
      return res.status(404).send(`
        <html>
          <head>
            <title>Error</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
              .error { color: red; }
            </style>
          </head>
          <body>
            <h1 class="error">Error</h1>
            <p>Reserva no encontrada.</p>
          </body>
        </html>
      `);
    }
    
    if (action === 'confirm') {
      // Lógica igual que en el endpoint POST
      booking.status = 'confirmed';
      await booking.save();
      
      // Generar slots ocupados (código similar al anterior)
      const generateBookedSlots = (booking) => {
        const slots = [];
        const morningTimes = ['9:00 AM', '10:00 AM', '11:00 AM'];
        const afternoonTimes = ['2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
        
        if (booking.type === 'asesoria-completa') {
          const isMorning = morningTimes.includes(booking.time);
          const timesToBlock = isMorning ? morningTimes : afternoonTimes;
          
          timesToBlock.forEach(time => {
            slots.push({
              date: booking.date,
              time: time,
              bookingId: booking.id,
              reason: `Asesoría completa - turno ${isMorning ? 'mañana' : 'tarde'}`
            });
          });
        } else if (booking.serviceDuration === '120 min') {
          const allTimes = [...morningTimes, ...afternoonTimes];
          const currentIndex = allTimes.indexOf(booking.time);
          
          slots.push({
            date: booking.date,
            time: booking.time,
            bookingId: booking.id,
            reason: 'Consulta 120 min - hora 1'
          });
          
          if (currentIndex !== -1 && currentIndex < allTimes.length - 1) {
            const nextTime = allTimes[currentIndex + 1];
            const isMorningTime = morningTimes.includes(booking.time);
            const isNextMorningTime = morningTimes.includes(nextTime);
            
            if (isMorningTime === isNextMorningTime) {
              slots.push({
                date: booking.date,
                time: nextTime,
                bookingId: booking.id,
                reason: 'Consulta 120 min - hora 2'
              });
            }
          }
        } else {
          slots.push({
            date: booking.date,
            time: booking.time,
            bookingId: booking.id,
            reason: 'Consulta 60 min'
          });
        }
        
        return slots;
      };
      
      const newSlots = generateBookedSlots(booking);
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
            <p>Tu reserva para el servicio de ${booking.service} ha sido confirmada.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Fecha:</strong> ${booking.date}</p>
              <p><strong>Hora:</strong> ${booking.time}</p>
              <p><strong>Tipo de cita:</strong> ${booking.type}</p>
            </div>
            
            <p>¡Esperamos verte pronto!</p>
            
            <p style="margin-top: 30px;">Saludos,<br>El equipo de DeDecor</p>
          </div>
        `
      });
      
      return res.send(`
        <html>
          <head>
            <title>Reserva Confirmada</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
              .success { color: green; }
              .details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 500px; text-align: left; }
            </style>
          </head>
          <body>
            <h1 class="success">¡Reserva Confirmada!</h1>
            <p>Has confirmado exitosamente esta reserva.</p>
            
            <div class="details">
              <h3>Detalles de la reserva:</h3>
              <p><strong>Cliente:</strong> ${booking.clientName}</p>
              <p><strong>Email:</strong> ${booking.clientEmail}</p>
              <p><strong>Servicio:</strong> ${booking.service}</p>
              <p><strong>Fecha:</strong> ${booking.date}</p>
              <p><strong>Hora:</strong> ${booking.time}</p>
            </div>
            
            <p>Se ha enviado un correo electrónico de confirmación al cliente.</p>
          </body>
        </html>
      `);
    } else if (action === 'reject') {
      booking.status = 'rejected';
      await booking.save();
      
      // Enviar email de rechazo
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: booking.clientEmail,
        subject: 'Información sobre tu solicitud de reserva',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">Actualización de tu Reserva</h2>
            <p>Hola ${booking.clientName},</p>
            <p>Lamentamos informarte que no podemos confirmar tu reserva para el servicio de ${booking.service} en el horario solicitado.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Fecha:</strong> ${booking.date}</p>
              <p><strong>Hora:</strong> ${booking.time}</p>
            </div>
            
            <p>Te invitamos a intentar con otro horario o fecha que se ajuste mejor a tu agenda.</p>
            
            <p style="margin-top: 30px;">Gracias por tu comprensión,<br>El equipo de DeDecor</p>
          </div>
        `
      });
      
      return res.send(`
        <html>
          <head>
            <title>Reserva Rechazada</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
              .rejected { color: #dc3545; }
              .details { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px auto; max-width: 500px; text-align: left; }
            </style>
          </head>
          <body>
            <h1 class="rejected">Reserva Rechazada</h1>
            <p>Has rechazado esta reserva.</p>
            
            <div class="details">
              <h3>Detalles de la reserva:</h3>
              <p><strong>Cliente:</strong> ${booking.clientName}</p>
              <p><strong>Email:</strong> ${booking.clientEmail}</p>
              <p><strong>Servicio:</strong> ${booking.service}</p>
              <p><strong>Fecha:</strong> ${booking.date}</p>
              <p><strong>Hora:</strong> ${booking.time}</p>
            </div>
            
            <p>Se ha enviado un correo electrónico al cliente informando que su reserva ha sido rechazada.</p>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('❌ Error al procesar la reserva:', error);
    return res.status(500).send(`
      <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .error { color: red; }
          </style>
        </head>
        <body>
          <h1 class="error">Error</h1>
          <p>Hubo un problema al procesar la reserva.</p>
        </body>
      </html>
    `);
  }
});

// Manejar todas las demás rutas para servir la aplicación React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Manejar cierre graceful
process.on('SIGINT', async () => {
  console.log('🔄 Cerrando servidor...');
  await disconnectDB();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🔄 Cerrando servidor...');
  await disconnectDB();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  console.log(`📊 Modo: ${process.env.NODE_ENV || 'desarrollo'}`);
  console.log('🔗 MongoDB Atlas: Conectado');
  console.log('📧 Emails configurados correctamente');
}); 