const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

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

const fs = require('fs');
const path = require('path');

// Archivo para persistir datos
const DATA_FILE = path.join(__dirname, 'data.json');

// Función para cargar datos desde archivo
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return {
        bookings: data.bookings || [],
        bookedSlots: data.bookedSlots || [],
        contactMessages: data.contactMessages || []
      };
    }
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
  return {
    bookings: [],
    bookedSlots: [],
    contactMessages: []
  };
}

// Función para guardar datos en archivo
function saveData() {
  try {
    const data = {
      bookings,
      bookedSlots,
      contactMessages
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    console.log('Datos guardados exitosamente');
  } catch (error) {
    console.error('Error guardando datos:', error);
  }
}

// Cargar datos al iniciar el servidor
const initialData = loadData();
let bookings = initialData.bookings;
let bookedSlots = initialData.bookedSlots;
let contactMessages = initialData.contactMessages;

console.log(`Servidor iniciado con ${bookings.length} reservas, ${bookedSlots.length} slots ocupados`);

// API para obtener horarios ocupados
app.get('/api/booked-slots', (req, res) => {
  res.json(bookedSlots);
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
    saveData();
    
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
  
  // Detectar automáticamente el dominio desde el cual se hace la petición
  const baseUrl = `${req.protocol}://${req.get('host')}`;
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
      
      // Añadir el horario a los ocupados
      bookedSlots.push({
        date: bookings[bookingIndex].date,
        time: bookings[bookingIndex].time,
        bookingId: id
      });
      
      // Guardar cambios
      saveData();
      
      // Enviar email de confirmación al cliente
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: bookings[bookingIndex].clientEmail,
        subject: 'Tu reserva ha sido confirmada',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">¡Reserva Confirmada!</h2>
            <p>Hola ${bookings[bookingIndex].clientName},</p>
            <p>Nos complace confirmar tu reserva para el servicio de ${bookings[bookingIndex].service}${bookings[bookingIndex].serviceDuration ? ` (${bookings[bookingIndex].serviceDuration})` : ''}.</p>
            
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
      
      // Guardar cambios
      saveData();
      
      // Enviar email de rechazo al cliente
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: bookings[bookingIndex].clientEmail,
        subject: 'Información sobre tu solicitud de reserva',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">Actualización de tu Reserva</h2>
            <p>Hola ${bookings[bookingIndex].clientName},</p>
            <p>Lamentamos informarte que no podemos confirmar tu reserva para el servicio de ${bookings[bookingIndex].service}${bookings[bookingIndex].serviceDuration ? ` (${bookings[bookingIndex].serviceDuration})` : ''} en el horario solicitado.</p>
            
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
    
    // Eliminar el horario de los ocupados
    const slotIndex = bookedSlots.findIndex(slot => 
      slot.bookingId === id && 
      slot.date === bookings[bookingIndex].date && 
      slot.time === bookings[bookingIndex].time
    );
    
    if (slotIndex !== -1) {
      bookedSlots.splice(slotIndex, 1);
    }
    
    // Guardar cambios
    saveData();
    
    // Enviar email de cancelación al cliente
    await emailTransporter.sendMail({
      from: '"DeDecor" <dedecorinfo@gmail.com>',
      to: bookings[bookingIndex].clientEmail,
      subject: 'Tu reserva ha sido cancelada',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6163;">Reserva Cancelada</h2>
          <p>Hola ${bookings[bookingIndex].clientName},</p>
          <p>Te informamos que tu reserva para el servicio de ${bookings[bookingIndex].service}${bookings[bookingIndex].serviceDuration ? ` (${bookings[bookingIndex].serviceDuration})` : ''} ha sido cancelada.</p>
          
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

// API para crear una nueva reserva
app.post('/api/bookings', (req, res) => {
  const booking = {
    id: req.body.id || `booking-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: 'pending',
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  bookings.push(booking);
  saveData();
  
  console.log('Nueva reserva creada:', {
    id: booking.id,
    clientName: booking.clientName,
    service: booking.service,
    date: booking.date,
    time: booking.time
  });
  console.log('Total de reservas en memoria:', bookings.length);
  
  res.status(201).json({ success: true, bookingId: booking.id });
});

// Manejar confirmaciones desde el email (cuando se hace clic en el enlace)
app.get('/confirm-booking', async (req, res) => {
  const { id, action } = req.query;
  
  console.log('=== CONFIRMACIÓN DE RESERVA ===');
  console.log('ID recibido:', id);
  console.log('Acción recibida:', action);
  console.log('URL completa:', req.url);
  console.log('Query params:', req.query);
  console.log('Total de reservas en memoria:', bookings.length);
  console.log('Reservas disponibles:', bookings.map(b => ({ 
    id: b.id, 
    status: b.status, 
    clientName: b.clientName,
    createdAt: b.createdAt 
  })));
  
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
      
      // Añadir el horario a los ocupados
      bookedSlots.push({
        date: bookings[bookingIndex].date,
        time: bookings[bookingIndex].time,
        bookingId: id
      });
      
      // Guardar cambios
      saveData();
      
      // Enviar email de confirmación al cliente
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: bookings[bookingIndex].clientEmail,
        subject: 'Tu reserva ha sido confirmada',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">¡Reserva Confirmada!</h2>
            <p>Hola ${bookings[bookingIndex].clientName},</p>
            <p>Nos complace confirmar tu reserva para el servicio de ${bookings[bookingIndex].service}${bookings[bookingIndex].serviceDuration ? ` (${bookings[bookingIndex].serviceDuration})` : ''}.</p>
            
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
              <p><strong>Servicio:</strong> ${bookings[bookingIndex].service}${bookings[bookingIndex].serviceDuration ? ` (${bookings[bookingIndex].serviceDuration})` : ''}</p>
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
      
      // Guardar cambios
      saveData();
      
      // Enviar email de rechazo al cliente
      await emailTransporter.sendMail({
        from: '"DeDecor" <dedecorinfo@gmail.com>',
        to: bookings[bookingIndex].clientEmail,
        subject: 'Información sobre tu solicitud de reserva',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4a6163;">Actualización de tu Reserva</h2>
            <p>Hola ${bookings[bookingIndex].clientName},</p>
            <p>Lamentamos informarte que no podemos confirmar tu reserva para el servicio de ${bookings[bookingIndex].service}${bookings[bookingIndex].serviceDuration ? ` (${bookings[bookingIndex].serviceDuration})` : ''} en el horario solicitado.</p>
            
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
              <p><strong>Servicio:</strong> ${bookings[bookingIndex].service}${bookings[bookingIndex].serviceDuration ? ` (${bookings[bookingIndex].serviceDuration})` : ''}</p>
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