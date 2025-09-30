/**
 * Configuración avanzada anti-spam para SendGrid
 * Implementa mejores prácticas para maximizar deliverabilidad
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
        name: 'DEdecor Reservas'
      },
      replyTo: 'dedecorinfo@gmail.com',
      subject: `Nueva Reserva - ${clientName} - ${date}`,
      // Configuración avanzada anti-spam
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'DEdecor-System',
        'X-Entity-Ref-ID': bookingId
      },
      // Configuración para evitar spam
      categories: ['booking-notification'],
      customArgs: {
        bookingId: bookingId,
        type: 'admin-notification',
        source: 'booking-system'
      },
      // Configuración de tracking
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: false
        },
        openTracking: {
          enable: true
        }
      },
      // Configuración de sandbox para testing
      mailSettings: {
        sandboxMode: {
          enable: false
        }
      },
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Nueva Solicitud de Reserva</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #2c3e50; margin: 0; }
            .header p { color: #6c757d; margin: 10px 0 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff; }
            .content h3 { color: #495057; margin-top: 0; }
            .data-table { width: 100%; border-collapse: collapse; }
            .data-table td { padding: 8px 0; }
            .data-table .label { font-weight: bold; width: 120px; }
            .warning { background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107; }
            .warning p { margin: 0; color: #856404; }
            .actions { text-align: center; margin: 30px 0; }
            .btn { background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 0 10px; display: inline-block; font-weight: bold; }
            .btn-danger { background-color: #dc3545; }
            .footer { border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nueva Solicitud de Reserva</h1>
              <p>Sistema de Reservas DEdecor</p>
            </div>
            
            <div class="content">
              <h3>Detalles de la Reserva</h3>
              <table class="data-table">
                <tr><td class="label">ID:</td><td>${bookingId}</td></tr>
                <tr><td class="label">Cliente:</td><td>${clientName}</td></tr>
                <tr><td class="label">Email:</td><td>${clientEmail}</td></tr>
                <tr><td class="label">Teléfono:</td><td>${clientPhone}</td></tr>
                <tr><td class="label">Servicio:</td><td>${service}</td></tr>
                <tr><td class="label">Fecha:</td><td>${date}</td></tr>
                <tr><td class="label">Hora:</td><td>${time}</td></tr>
                ${notes ? `<tr><td class="label">Notas:</td><td>${notes}</td></tr>` : ''}
              </table>
            </div>
            
            <div class="warning">
              <p><strong>IMPORTANTE:</strong> Los horarios NO están bloqueados hasta que confirmes esta reserva.</p>
            </div>
            
            <div class="actions">
              <a href="${confirmUrl}" class="btn">CONFIRMAR RESERVA</a>
              <a href="${rejectUrl}" class="btn btn-danger">RECHAZAR RESERVA</a>
            </div>
            
            <div class="footer">
              <p>ID de reserva: ${bookingId}</p>
              <p>Estado: PENDIENTE</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Versión de texto plano optimizada
      text: `
Nueva Solicitud de Reserva - DEdecor

Detalles de la Reserva:
ID: ${bookingId}
Cliente: ${clientName}
Email: ${clientEmail}
Teléfono: ${clientPhone}
Servicio: ${service}
Fecha: ${date}
Hora: ${time}
${notes ? `Notas: ${notes}` : ''}

IMPORTANTE: Los horarios NO están bloqueados hasta que confirmes esta reserva.

Acciones disponibles:
- Confirmar: ${confirmUrl}
- Rechazar: ${rejectUrl}

Estado: PENDIENTE

---
DEdecor - Sistema de Reservas
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
      subject: `Confirmación de Reserva - ${service} - ${date}`,
      // Configuración avanzada anti-spam
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'DEdecor-System',
        'X-Entity-Ref-ID': bookingId
      },
      // Configuración para evitar spam
      categories: ['booking-confirmation'],
      customArgs: {
        bookingId: bookingId,
        type: 'client-confirmation',
        source: 'booking-system'
      },
      // Configuración de tracking
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: false
        },
        openTracking: {
          enable: true
        }
      },
      // Configuración de sandbox para testing
      mailSettings: {
        sandboxMode: {
          enable: false
        }
      },
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Reserva</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #2c3e50; margin: 0; }
            .header p { color: #6c757d; margin: 10px 0 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff; }
            .content h3 { color: #495057; margin-top: 0; }
            .data-table { width: 100%; border-collapse: collapse; }
            .data-table td { padding: 8px 0; }
            .data-table .label { font-weight: bold; width: 120px; }
            .footer { border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Confirmación de Reserva</h1>
              <p>DEdecor - Decoración de Interiores</p>
            </div>
            
            <p>Hola <strong>${clientName}</strong>,</p>
            <p>Hemos recibido tu solicitud de reserva y la revisaremos pronto.</p>
            
            <div class="content">
              <h3>Detalles de tu Reserva</h3>
              <table class="data-table">
                <tr><td class="label">Servicio:</td><td>${service}</td></tr>
                <tr><td class="label">Fecha:</td><td>${date}</td></tr>
                <tr><td class="label">Hora:</td><td>${time}</td></tr>
              </table>
            </div>
            
            <p>Te enviaremos un email de confirmación una vez que tu reserva sea aprobada por nuestro equipo.</p>
            <p>¡Gracias por elegirnos!</p>
            
            <div class="footer">
              <p>ID de reserva: ${bookingId}</p>
              <p>Estado: PENDIENTE</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Versión de texto plano optimizada
      text: `
Confirmación de Reserva - DEdecor

Hola ${clientName},

Hemos recibido tu solicitud de reserva y la revisaremos pronto.

Detalles de tu Reserva:
Servicio: ${service}
Fecha: ${date}
Hora: ${time}

Te enviaremos un email de confirmación una vez que tu reserva sea aprobada por nuestro equipo.

¡Gracias por elegirnos!

ID de reserva: ${bookingId}
Estado: PENDIENTE

---
DEdecor - Decoración de Interiores
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
