const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar timeout para todas las rutas
app.use((req, res, next) => {
  // Timeout de 30 segundos para todas las peticiones
  req.setTimeout(30000, () => {
    res.status(408).json({ error: 'Request timeout' });
  });
  next();
});

// Función para obtener la URL base - siempre usar Render para las confirmaciones
const getBaseUrl = (req) => {
  // Siempre usar el servidor de Render para los enlaces de confirmación
  // porque es el único que tiene el servidor Node.js funcionando
  return 'https://landing-page-534b.onrender.com';
};

// Configuración del transportador de email - Usar siempre credenciales reales
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dedecorinfo@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'ihrvuveqsskjxyog' // Contraseña de aplicación
  },
  secure: true
});

// Middleware
app.use(cors({
  origin: '*', // Permitir cualquier origen en desarrollo
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'build')));

// Simular una base de datos simple (en producción se usaría una base de datos real)
let bookings = [];
let bookedSlots = [];
let contactMessages = [];

// API para obtener horarios ocupados (optimizada)
app.get('/api/booked-slots', (req, res) => {
  try {
    // Validar que bookedSlots sea un array válido
    if (!Array.isArray(bookedSlots)) {
      console.warn('bookedSlots no es un array válido, inicializando como array vacío');
      bookedSlots = [];
    }
    
    // Filtrar slots que no hayan expirado (opcional: remover slots muy antiguos)
    const validSlots = bookedSlots.filter(slot => {
      // Mantener todos los slots por ahora, pero esto se puede optimizar
      return slot && slot.date && slot.time;
    });
    
    // Agregar headers para cache y optimización
    res.set({
      'Cache-Control': 'public, max-age=30', // Cache por 30 segundos
      'Content-Type': 'application/json'
    });
    
    console.log(`Enviando ${validSlots.length} horarios ocupados`);
    res.json(validSlots);
  } catch (error) {
    console.error('Error al obtener horarios ocupados:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al obtener horarios ocupados',
      data: [] // Devolver array vacío como fallback
    });
  }
});

// API para enviar email de contacto
app.post('/api/send-contact-email', async (req, res) => {
  const { clientEmail, clientName, contactDetails } = req.body;
  
  try {
    // Guardar el mensaje en la "base de datos"
    const messageId = `message-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newMessage = {
      id: messageId,
      clientName,
      clientEmail,
      phone: contactDetails.phone || 'No proporcionado',
      message: contactDetails.message,
      date: contactDetails.date,
      createdAt: new Date().toISOString()
    };
    
    contactMessages.push(newMessage);
    
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
    
    console.log('Email enviado a la empresa:', 'dedecorinfo@gmail.com');
    
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
    
    console.log('Email de confirmación enviado al cliente:', clientEmail);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error al enviar emails de contacto:', error);
    res.status(500).json({ error: 'Error al enviar emails de contacto' });
  }
});

// API para enviar email de confirmación de reserva
app.post('/api/send-booking-email', async (req, res) => {
  const { clientEmail, clientName, bookingDetails } = req.body;
  // Detectar automáticamente la URL base desde el request
  const baseUrl = getBaseUrl(req);
  const bookingId = bookingDetails.id || 'id';
  const confirmUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=confirm`;
  const rejectUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=reject`;
  
  console.log('Base URL detectada automáticamente:', baseUrl);
  console.log('URL de confirmación:', confirmUrl);
  console.log('URL de rechazo:', rejectUrl);
  
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
    
    console.log('Email enviado a la empresa:', 'dedecorinfo@gmail.com');
    
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
    
    console.log('Email enviado al cliente:', clientEmail);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error al enviar emails:', error);
    res.status(500).json({ error: 'Error al enviar emails' });
  }
});

// API para confirmar o rechazar una reserva
app.post('/api/bookings/:id/status', async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;
  
  const bookingIndex = bookings.findIndex(booking => booking.id === id);
  
  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }
  
  try {
    if (action === 'confirm') {
      // Actualizar estado de la reserva
      bookings[bookingIndex].status = 'confirmed';
      
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
      
      // Generar y añadir los slots ocupados
      const newSlots = generateBookedSlots(bookings[bookingIndex]);
      bookedSlots.push(...newSlots);
      
      console.log('Slots ocupados generados:', newSlots);
      
      // Enviar email de confirmación al cliente
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: bookings[bookingIndex].clientEmail,
        subject: 'Tu reserva ha sido confirmada',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">¡Reserva Confirmada!</h2>
            <p>Hola ${bookings[bookingIndex].clientName},</p>
            <p>Nos complace confirmar tu reserva para el servicio de ${bookings[bookingIndex].service}.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Fecha:</strong> ${bookings[bookingIndex].date}</p>
              <p><strong>Hora:</strong> ${bookings[bookingIndex].time}</p>
              <p><strong>Tipo de cita:</strong> ${bookings[bookingIndex].type}</p>
            </div>
            
            <p>¡Esperamos verte pronto!</p>
            <p>Si necesitas hacer algún cambio, por favor contáctanos lo antes posible.</p>
            
            <p style="margin-top: 30px;">Saludos,<br>El equipo de DeDecor</p>
          </div>
        `
      });
      
      console.log('Email de confirmación enviado al cliente:', bookings[bookingIndex].clientEmail);
      
      return res.json({ success: true, message: 'Reserva confirmada exitosamente' });
    } else if (action === 'reject') {
      // Actualizar estado de la reserva
      bookings[bookingIndex].status = 'rejected';
      
      // Enviar email de rechazo al cliente
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: bookings[bookingIndex].clientEmail,
        subject: 'Información sobre tu solicitud de reserva',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">Actualización de tu Reserva</h2>
            <p>Hola ${bookings[bookingIndex].clientName},</p>
            <p>Lamentamos informarte que no podemos confirmar tu reserva para el servicio de ${bookings[bookingIndex].service} en el horario solicitado.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Fecha:</strong> ${bookings[bookingIndex].date}</p>
              <p><strong>Hora:</strong> ${bookings[bookingIndex].time}</p>
            </div>
            
            <p>Te invitamos a intentar con otro horario o fecha que se ajuste mejor a tu agenda.</p>
            <p>Si prefieres, puedes contactarnos directamente para ayudarte a encontrar un horario disponible.</p>
            
            <p style="margin-top: 30px;">Gracias por tu comprensión,<br>El equipo de DeDecor</p>
          </div>
        `
      });
      
      console.log('Email de rechazo enviado al cliente:', bookings[bookingIndex].clientEmail);
      
      return res.json({ success: true, message: 'Reserva rechazada exitosamente' });
    }
    
    return res.status(400).json({ error: 'Acción desconocida' });
  } catch (error) {
    console.error('Error al procesar la reserva:', error);
    return res.status(500).json({ error: 'Error al procesar la reserva' });
  }
});

// API para cancelar una reserva confirmada
app.post('/api/bookings/:id/cancel', async (req, res) => {
  const { id } = req.params;
  
  const bookingIndex = bookings.findIndex(booking => booking.id === id);
  
  if (bookingIndex === -1) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }
  
  try {
    // Verificar que la reserva esté confirmada
    if (bookings[bookingIndex].status !== 'confirmed') {
      return res.status(400).json({ error: 'Solo se pueden cancelar reservas confirmadas' });
    }
    
    // Actualizar estado de la reserva
    bookings[bookingIndex].status = 'cancelled';
    
    // Eliminar todos los horarios ocupados relacionados con esta reserva
    const slotsToRemove = bookedSlots.filter(slot => slot.bookingId === id);
    
    // Eliminar cada slot relacionado
    slotsToRemove.forEach(slotToRemove => {
      const slotIndex = bookedSlots.findIndex(slot => 
        slot.bookingId === slotToRemove.bookingId && 
        slot.date === slotToRemove.date && 
        slot.time === slotToRemove.time
      );
      
      if (slotIndex !== -1) {
        bookedSlots.splice(slotIndex, 1);
      }
    });
    
    console.log('Slots eliminados:', slotsToRemove.length);
    
    // Enviar email de cancelación al cliente
    await emailTransporter.sendMail({
      from: '"DeDecor" <dedecorinfo@gmail.com>',
      to: bookings[bookingIndex].clientEmail,
      subject: 'Tu reserva ha sido cancelada',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6163;">Reserva Cancelada</h2>
          <p>Hola ${bookings[bookingIndex].clientName},</p>
          <p>Te informamos que tu reserva para el servicio de ${bookings[bookingIndex].service} ha sido cancelada.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Fecha:</strong> ${bookings[bookingIndex].date}</p>
            <p><strong>Hora:</strong> ${bookings[bookingIndex].time}</p>
          </div>
          
          <p>Si deseas reprogramar tu cita, puedes hacerlo a través de nuestra página web o contactándonos directamente.</p>
          
          <p style="margin-top: 30px;">Saludos,<br>El equipo de DeDecor</p>
        </div>
      `
    });
    
    console.log('Email de cancelación enviado al cliente:', bookings[bookingIndex].clientEmail);
    
    return res.json({ success: true, message: 'Reserva cancelada exitosamente' });
  } catch (error) {
    console.error('Error al cancelar la reserva:', error);
    return res.status(500).json({ error: 'Error al cancelar la reserva' });
  }
});

// API para listar todas las reservas (con filtro opcional por estado)
app.get('/api/bookings', (req, res) => {
  const { status } = req.query;
  
  let filteredBookings = [...bookings];
  
  // Filtrar por estado si se proporciona
  if (status) {
    filteredBookings = filteredBookings.filter(booking => booking.status === status);
  }
  
  // Devolver información básica de las reservas (sin datos sensibles)
  const bookingsInfo = filteredBookings.map(booking => ({
    id: booking.id,
    clientName: booking.clientName,
    service: booking.service,
    date: booking.date,
    time: booking.time,
    status: booking.status
  }));
  
  res.json(bookingsInfo);
});

// API para crear una nueva reserva (mejorada)
app.post('/api/bookings', (req, res) => {
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
    const existingBooking = bookings.find(b => b.id === bookingId);
    if (existingBooking) {
      return res.status(409).json({ 
        error: 'Ya existe una reserva con este ID',
        success: false
      });
    }
    
    const booking = {
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
      notes: req.body.notes || '',
      createdAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    
    console.log(`Nueva reserva creada: ${bookingId} para ${clientName}`);
    res.status(201).json({ success: true, bookingId: booking.id });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al crear la reserva',
      success: false
    });
  }
});

// Manejar confirmaciones desde el email (cuando se hace clic en el enlace)
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
  
  const bookingIndex = bookings.findIndex(booking => booking.id === id);
  
  if (bookingIndex === -1) {
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
          <p>Reserva no encontrada. Es posible que ya haya sido procesada o que el ID sea incorrecto.</p>
        </body>
      </html>
    `);
  }
  
  try {
    if (action === 'confirm') {
      // Actualizar estado de la reserva
      bookings[bookingIndex].status = 'confirmed';
      
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
      
      // Generar y añadir los slots ocupados
      const newSlots = generateBookedSlots(bookings[bookingIndex]);
      bookedSlots.push(...newSlots);
      
      console.log('Slots ocupados generados:', newSlots);
      
      // Enviar email de confirmación al cliente
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: bookings[bookingIndex].clientEmail,
        subject: 'Tu reserva ha sido confirmada',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">¡Reserva Confirmada!</h2>
            <p>Hola ${bookings[bookingIndex].clientName},</p>
            <p>Nos complace confirmar tu reserva para el servicio de ${bookings[bookingIndex].service}.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Fecha:</strong> ${bookings[bookingIndex].date}</p>
              <p><strong>Hora:</strong> ${bookings[bookingIndex].time}</p>
              <p><strong>Tipo de cita:</strong> ${bookings[bookingIndex].type}</p>
            </div>
            
            <p>¡Esperamos verte pronto!</p>
            <p>Si necesitas hacer algún cambio, por favor contáctanos lo antes posible.</p>
            
            <p style="margin-top: 30px;">Saludos,<br>El equipo de DeDecor</p>
          </div>
        `
      });
      
      console.log('Email de confirmación enviado al cliente:', bookings[bookingIndex].clientEmail);
      
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
              <p><strong>Cliente:</strong> ${bookings[bookingIndex].clientName}</p>
              <p><strong>Email:</strong> ${bookings[bookingIndex].clientEmail}</p>
              <p><strong>Servicio:</strong> ${bookings[bookingIndex].service}</p>
              <p><strong>Fecha:</strong> ${bookings[bookingIndex].date}</p>
              <p><strong>Hora:</strong> ${bookings[bookingIndex].time}</p>
            </div>
            
            <p>Se ha enviado un correo electrónico de confirmación al cliente.</p>
          </body>
        </html>
      `);
    } else if (action === 'reject') {
      // Actualizar estado de la reserva
      bookings[bookingIndex].status = 'rejected';
      
      // Enviar email de rechazo al cliente
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: bookings[bookingIndex].clientEmail,
        subject: 'Información sobre tu solicitud de reserva',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">Actualización de tu Reserva</h2>
            <p>Hola ${bookings[bookingIndex].clientName},</p>
            <p>Lamentamos informarte que no podemos confirmar tu reserva para el servicio de ${bookings[bookingIndex].service} en el horario solicitado.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Fecha:</strong> ${bookings[bookingIndex].date}</p>
              <p><strong>Hora:</strong> ${bookings[bookingIndex].time}</p>
            </div>
            
            <p>Te invitamos a intentar con otro horario o fecha que se ajuste mejor a tu agenda.</p>
            <p>Si prefieres, puedes contactarnos directamente para ayudarte a encontrar un horario disponible.</p>
            
            <p style="margin-top: 30px;">Gracias por tu comprensión,<br>El equipo de DeDecor</p>
          </div>
        `
      });
      
      console.log('Email de rechazo enviado al cliente:', bookings[bookingIndex].clientEmail);
      
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
              <p><strong>Cliente:</strong> ${bookings[bookingIndex].clientName}</p>
              <p><strong>Email:</strong> ${bookings[bookingIndex].clientEmail}</p>
              <p><strong>Servicio:</strong> ${bookings[bookingIndex].service}</p>
              <p><strong>Fecha:</strong> ${bookings[bookingIndex].date}</p>
              <p><strong>Hora:</strong> ${bookings[bookingIndex].time}</p>
            </div>
            
            <p>Se ha enviado un correo electrónico al cliente informando que su reserva ha sido rechazada.</p>
          </body>
        </html>
      `);
    } else {
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
            <p>Acción desconocida: ${action}</p>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Error al procesar la reserva:', error);
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
          <p>Error: ${error.message}</p>
        </body>
      </html>
    `);
  }
});

// Añadir esta ruta al final del archivo para manejar todas las demás rutas y servir la aplicación React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  console.log(`Modo: ${process.env.NODE_ENV || 'desarrollo'}`);
  console.log('Los emails se enviarán realmente usando las credenciales proporcionadas.');
}); 