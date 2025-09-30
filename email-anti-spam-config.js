/**
 * Configuración mejorada de email con SendGrid para evitar spam
 * Incluye mejores prácticas para deliverabilidad
 */

const sgMail = require('@sendgrid/mail');

// Configurar SendGrid con API Key desde variables de entorno
const configureSendGrid = () => {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ SENDGRID_API_KEY no configurada - emails deshabilitados');
    return false;
  }
  
  sgMail.setApiKey(apiKey);
  console.log('✅ SendGrid configurado correctamente');
  return true;
};

// Función mejorada para enviar email de nueva reserva al admin
const sendAdminNotification = async (bookingData) => {
  try {
    const { bookingId, clientName, clientEmail, clientPhone, service, date, time, notes } = bookingData;
    
    const baseUrl = process.env.BASE_URL || 'https://dedecorinfo.com';
    const confirmUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=confirm`;
    const rejectUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=reject`;
    
    const msg = {
      to: 'dedecorinfo@gmail.com',
      from: {
        email: 'dedecorinfo@gmail.com',
        name: 'DEdecor'
      },
      replyTo: 'dedecorinfo@gmail.com',
      subject: `Nueva Solicitud de Reserva - ${clientName}`,
      // Headers para mejorar deliverabilidad
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      },
      // Configuración para evitar spam
      categories: ['booking-notification'],
      customArgs: {
        bookingId: bookingId,
        type: 'admin-notification'
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nueva Solicitud de Reserva</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8f9fa;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin: 0;">Nueva Solicitud de Reserva</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0;">Sistema de Reservas DEdecor</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="color: #495057; margin-top: 0;">Detalles de la Reserva</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; width: 120px;">ID:</td><td style="padding: 8px 0;">${bookingId}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Cliente:</td><td style="padding: 8px 0;">${clientName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td style="padding: 8px 0;">${clientEmail}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Teléfono:</td><td style="padding: 8px 0;">${clientPhone}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Servicio:</td><td style="padding: 8px 0;">${service}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Fecha:</td><td style="padding: 8px 0;">${date}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Hora:</td><td style="padding: 8px 0;">${time}</td></tr>
                ${notes ? `<tr><td style="padding: 8px 0; font-weight: bold;">Notas:</td><td style="padding: 8px 0;">${notes}</td></tr>` : ''}
              </table>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <p style="margin: 0; color: #856404;">
                <strong>IMPORTANTE:</strong> Los horarios NO están bloqueados hasta que confirmes esta reserva.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmUrl}" style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-right: 15px; font-weight: bold; display: inline-block;">
                CONFIRMAR RESERVA
              </a>
              <a href="${rejectUrl}" style="background-color: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                RECHAZAR RESERVA
              </a>
            </div>
            
            <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
              <p style="margin: 0;">ID de reserva: ${bookingId}</p>
              <p style="margin: 5px 0 0 0;">Estado: PENDIENTE</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Versión de texto plano para evitar spam
      text: `
Nueva Solicitud de Reserva - DEdecor

Detalles de la Reserva:
- ID: ${bookingId}
- Cliente: ${clientName}
- Email: ${clientEmail}
- Teléfono: ${clientPhone}
- Servicio: ${service}
- Fecha: ${date}
- Hora: ${time}
${notes ? `- Notas: ${notes}` : ''}

IMPORTANTE: Los horarios NO están bloqueados hasta que confirmes esta reserva.

Acciones disponibles:
- Confirmar: ${confirmUrl}
- Rechazar: ${rejectUrl}

Estado: PENDIENTE
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Email de notificación enviado al ADMIN');
    return true;
  } catch (error) {
    console.error('❌ Error enviando email al admin:', error);
    throw error;
  }
};

// Función mejorada para enviar email de confirmación al cliente
const sendClientConfirmation = async (bookingData) => {
  try {
    const { bookingId, clientName, clientEmail, service, date, time } = bookingData;
    
    const msg = {
      to: clientEmail,
      from: {
        email: 'dedecorinfo@gmail.com',
        name: 'DEdecor'
      },
      replyTo: 'dedecorinfo@gmail.com',
      subject: `Solicitud de Reserva Recibida - DEdecor`,
      // Headers para mejorar deliverabilidad
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      },
      // Configuración para evitar spam
      categories: ['booking-confirmation'],
      customArgs: {
        bookingId: bookingId,
        type: 'client-confirmation'
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Solicitud de Reserva Recibida</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8f9fa;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin: 0;">Solicitud de Reserva Recibida</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0;">DEdecor - Decoración de Interiores</p>
            </div>
            
            <p>Hola <strong>${clientName}</strong>,</p>
            <p>Hemos recibido tu solicitud de reserva y <strong>la revisaremos pronto</strong>.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
              <h3 style="color: #495057; margin-top: 0;">Detalles de tu Reserva</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: bold; width: 120px;">Servicio:</td><td style="padding: 8px 0;">${service}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Fecha:</td><td style="padding: 8px 0;">${date}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: bold;">Hora:</td><td style="padding: 8px 0;">${time}</td></tr>
              </table>
            </div>
            
            <p>Te enviaremos un email de confirmación una vez que tu reserva sea aprobada por nuestro equipo.</p>
            <p>¡Gracias por elegirnos!</p>
            
            <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
              <p style="margin: 0;">ID de reserva: ${bookingId}</p>
              <p style="margin: 5px 0 0 0;">Estado: PENDIENTE</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Versión de texto plano para evitar spam
      text: `
Solicitud de Reserva Recibida - DEdecor

Hola ${clientName},

Hemos recibido tu solicitud de reserva y la revisaremos pronto.

Detalles de tu Reserva:
- Servicio: ${service}
- Fecha: ${date}
- Hora: ${time}

Te enviaremos un email de confirmación una vez que tu reserva sea aprobada por nuestro equipo.

¡Gracias por elegirnos!

ID de reserva: ${bookingId}
Estado: PENDIENTE
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Email de confirmación enviado al CLIENTE');
    return true;
  } catch (error) {
    console.error('❌ Error enviando email al cliente:', error);
    throw error;
  }
};

module.exports = {
  configureSendGrid,
  sendAdminNotification,
  sendClientConfirmation
};
