/**
 * Configuración de email con SendGrid
 * Más seguro y confiable que SMTP directo
 */

// Importar SendGrid
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

// Función para enviar email de nueva reserva al admin
const sendAdminNotification = async (bookingData) => {
  try {
    const { bookingId, clientName, clientEmail, clientPhone, service, date, time, notes } = bookingData;
    
    const baseUrl = process.env.BASE_URL || 'https://dedecorinfo.com';
    const confirmUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=confirm`;
    const rejectUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=reject`;
    
    const msg = {
      to: 'dedecorinfo@gmail.com', // Email del admin
      from: {
        email: 'dedecorinfo@gmail.com',
        name: 'DEdecor'
      }, // Email verificado en SendGrid
      subject: `🎯 Nueva Solicitud de Reserva - ${clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">🎯 Nueva Solicitud de Reserva</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">📋 Detalles de la Reserva</h3>
            <p><strong>ID:</strong> ${bookingId}</p>
            <p><strong>Cliente:</strong> ${clientName}</p>
            <p><strong>Email:</strong> ${clientEmail}</p>
            <p><strong>Teléfono:</strong> ${clientPhone}</p>
            <p><strong>Servicio:</strong> ${service}</p>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Hora:</strong> ${time}</p>
            ${notes ? `<p><strong>Notas:</strong> ${notes}</p>` : ''}
          </div>
          
          <div style="margin: 30px 0;">
            <h3 style="color: #495057;">⚡ Acciones Requeridas</h3>
            <p>Esta reserva está <strong>PENDIENTE</strong> de confirmación. Debes:</p>
            <ul>
              <li>Revisar la disponibilidad</li>
              <li>Confirmar o rechazar la reserva</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" 
               style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px; display: inline-block;">
              ✅ CONFIRMAR RESERVA
            </a>
            <a href="${rejectUrl}" 
               style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 0 10px; display: inline-block;">
              ❌ RECHAZAR RESERVA
            </a>
          </div>
          
          <div style="background: #e9ecef; padding: 15px; border-radius: 6px; margin-top: 20px;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              <strong>Nota:</strong> Los horarios se bloquearán automáticamente cuando confirmes la reserva.
            </p>
          </div>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Email de notificación enviado al ADMIN');
    return true;
  } catch (error) {
    console.error('❌ Error enviando email al admin:', error);
    return false;
  }
};

// Función para enviar email de confirmación al cliente
const sendClientConfirmation = async (bookingData) => {
  try {
    const { bookingId, clientName, clientEmail, service, date, time } = bookingData;
    
    const msg = {
      to: clientEmail,
      from: {
        email: 'dedecorinfo@gmail.com',
        name: 'DEdecor'
      }, // Email verificado en SendGrid
      subject: `📧 Solicitud de Reserva Recibida - DeDecor`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">📧 Solicitud de Reserva Recibida</h2>
          
          <p>Hola <strong>${clientName}</strong>,</p>
          
          <p>Hemos recibido tu solicitud de reserva. Te contactaremos pronto para confirmar los detalles.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">📋 Resumen de tu Solicitud</h3>
            <p><strong>ID:</strong> ${bookingId}</p>
            <p><strong>Servicio:</strong> ${service}</p>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Hora:</strong> ${time}</p>
            <p><strong>Estado:</strong> <span style="color: #ffc107; font-weight: bold;">PENDIENTE DE CONFIRMACIÓN</span></p>
          </div>
          
          <div style="background: #d1ecf1; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #0c5460;">
              <strong>⏳ Próximos pasos:</strong><br>
              • Revisaremos tu solicitud<br>
              • Te contactaremos para confirmar<br>
              • Recibirás una confirmación final por email
            </p>
          </div>
          
          <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              <strong>DeDecor</strong><br>
              Consultoría de Decoración<br>
              Email: dedecorinfo@gmail.com
            </p>
          </div>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Email de confirmación enviado al CLIENTE');
    return true;
  } catch (error) {
    console.error('❌ Error enviando email al cliente:', error);
    return false;
  }
};

// Función para enviar email de confirmación final al cliente
const sendFinalConfirmation = async (bookingData) => {
  try {
    const { clientName, clientEmail, service, date, time } = bookingData;
    
    const msg = {
      to: clientEmail,
      from: {
        email: 'dedecorinfo@gmail.com',
        name: 'DEdecor'
      },
      subject: `✅ Reserva Confirmada - DeDecor`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">✅ ¡Reserva Confirmada!</h2>
          
          <p>Hola <strong>${clientName}</strong>,</p>
          
          <p>¡Excelente noticia! Tu reserva ha sido confirmada.</p>
          
          <div style="background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #155724; margin-top: 0;">📅 Detalles de tu Cita</h3>
            <p><strong>Servicio:</strong> ${service}</p>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Hora:</strong> ${time}</p>
            <p><strong>Estado:</strong> <span style="color: #28a745; font-weight: bold;">CONFIRMADA</span></p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #856404;">
              <strong>📝 Recordatorios:</strong><br>
              • Llega 10 minutos antes<br>
              • Trae cualquier material o fotos que quieras revisar<br>
              • Si necesitas cancelar, contáctanos con 24h de anticipación
            </p>
          </div>
          
          <p>¡Esperamos verte pronto!</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; font-size: 14px; color: #6c757d;">
              <strong>DeDecor</strong><br>
              Consultoría de Decoración<br>
              Email: dedecorinfo@gmail.com
            </p>
          </div>
        </div>
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Email de confirmación final enviado al CLIENTE');
    return true;
  } catch (error) {
    console.error('❌ Error enviando confirmación final:', error);
    return false;
  }
};

module.exports = {
  configureSendGrid,
  sendAdminNotification,
  sendClientConfirmation,
  sendFinalConfirmation
};
