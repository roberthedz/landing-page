/**
 * Configuración de email con Resend (API REST)
 * Solución moderna y confiable que funciona desde cualquier host
 */

const { Resend } = require('resend');

// Clientes de Resend (uno para admin, otro para clientes)
let resendClientAdmin = null;
let resendClientGeneral = null;

// Verificar configuración de email
const configureEmail = () => {
  const apiKeyAdmin = process.env.RESEND_API_KEY_ADMIN;
  const apiKeyGeneral = process.env.RESEND_API_KEY;
  
  // Si hay API key de admin, usar esa para admin; si no, usar la general
  const hasAdminKey = !!apiKeyAdmin;
  const hasGeneralKey = !!apiKeyGeneral;
  
  if (!hasAdminKey && !hasGeneralKey) {
    console.warn('⚠️ RESEND_API_KEY o RESEND_API_KEY_ADMIN no configuradas - emails deshabilitados');
    return false;
  }
  
  try {
    if (hasAdminKey) {
      resendClientAdmin = new Resend(apiKeyAdmin);
      console.log('✅ Resend ADMIN configurado correctamente');
    }
    
    if (hasGeneralKey) {
      resendClientGeneral = new Resend(apiKeyGeneral);
      console.log('✅ Resend GENERAL configurado correctamente');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error configurando Resend:', error.message);
    return false;
  }
};

// Obtener cliente para admin (prioriza RESEND_API_KEY_ADMIN)
const getResendClientAdmin = () => {
  const apiKeyAdmin = process.env.RESEND_API_KEY_ADMIN;
  const apiKeyGeneral = process.env.RESEND_API_KEY;
  
  // Priorizar API key de admin
  if (apiKeyAdmin) {
    if (!resendClientAdmin) {
      resendClientAdmin = new Resend(apiKeyAdmin);
    }
    return resendClientAdmin;
  }
  
  // Si no hay API key de admin, usar la general
  if (apiKeyGeneral) {
    if (!resendClientGeneral) {
      resendClientGeneral = new Resend(apiKeyGeneral);
    }
    return resendClientGeneral;
  }
  
  throw new Error('RESEND_API_KEY_ADMIN o RESEND_API_KEY no configurada');
};

// Obtener cliente para clientes (usa RESEND_API_KEY)
const getResendClientGeneral = () => {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY no configurada');
  }
  
  if (!resendClientGeneral) {
    resendClientGeneral = new Resend(apiKey);
  }
  return resendClientGeneral;
};

// Función para enviar email de nueva reserva al admin
const sendAdminNotification = async (bookingData) => {
  try {
    const { bookingId, clientName, clientEmail, clientPhone, service, date, time, notes } = bookingData;
    
    const baseUrl = process.env.BASE_URL || 'https://dedecorinfo.com';
    const confirmUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=confirm`;
    const rejectUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=reject`;
    
    const resend = getResendClientAdmin(); // Usar cliente de admin
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Solicitud de Reserva - DEdecor</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
                <tr>
                  <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-bottom: 2px solid #007bff;">
                    <h1 style="margin: 0; color: #2c3e50; font-size: 24px; font-weight: bold;">Solicitud de Reserva</h1>
                    <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 14px;">DEdecor - Decoración de Interiores</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Has recibido una nueva solicitud de reserva:</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
                      <tr>
                        <td style="padding: 20px;">
                          <h3 style="margin: 0 0 15px 0; color: #155724; font-size: 18px;">Detalles de la Reserva</h3>
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr><td style="padding: 5px 0; font-weight: bold; width: 120px; color: #155724;">Cliente:</td><td style="padding: 5px 0; color: #333333;">${clientName}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold; color: #155724;">Email:</td><td style="padding: 5px 0; color: #333333;">${clientEmail}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold; color: #155724;">Teléfono:</td><td style="padding: 5px 0; color: #333333;">${clientPhone}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold; color: #155724;">Servicio:</td><td style="padding: 5px 0; color: #333333;">${service}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold; color: #155724;">Fecha:</td><td style="padding: 5px 0; color: #333333;">${date}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold; color: #155724;">Hora:</td><td style="padding: 5px 0; color: #333333;">${time}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold; color: #155724;">Notas:</td><td style="padding: 5px 0; color: #333333;">${notes || 'Sin notas adicionales'}</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0; font-size: 16px; color: #333333;">Por favor, confirma o rechaza esta solicitud:</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                      <tr>
                        <td style="text-align: center;">
                          <a href="${confirmUrl}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-right: 10px; display: inline-block;">Confirmar Reserva</a>
                          <a href="${rejectUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Rechazar Reserva</a>
                        </td>
                      </tr>
                    </table>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e9ecef; border-radius: 8px; margin: 20px 0;">
                      <tr>
                        <td style="padding: 15px; text-align: center;">
                          <h4 style="margin: 0 0 10px 0; color: #495057; font-size: 16px;">Información de Contacto</h4>
                          <p style="margin: 0; font-size: 14px; color: #333333;"><strong>DEdecor - Decoración de Interiores</strong></p>
                          <p style="margin: 0; font-size: 14px; color: #333333;">Email: dedecorinfo@gmail.com</p>
                          <p style="margin: 0; font-size: 14px; color: #333333;">Sistema de Reservas Profesional</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    const textContent = `
SOLICITUD DE RESERVA - DEDECOR

Has recibido una nueva solicitud de reserva:

DETALLES DE LA RESERVA:
Cliente: ${clientName}
Email: ${clientEmail}
Teléfono: ${clientPhone}
Servicio: ${service}
Fecha: ${date}
Hora: ${time}
Notas: ${notes || 'Sin notas adicionales'}

Por favor, confirma o rechaza esta solicitud:
- Confirmar: ${confirmUrl}
- Rechazar: ${rejectUrl}

INFORMACIÓN DE CONTACTO:
DEdecor - Decoración de Interiores
Email: dedecorinfo@gmail.com
Sistema de Reservas Profesional
    `;
    
    const { data, error } = await resend.emails.send({
      from: 'DEdecor <onboarding@resend.dev>', // TODO: Cambiar a tu dominio después de verificarlo en Resend
      to: 'dedecorinfo@gmail.com',
      subject: `Solicitud de Reserva - ${clientName}`,
      html: htmlContent,
      text: textContent
    });
    
    if (error) {
      throw new Error(error.message || 'Error enviando email');
    }
    
    console.log('✅ Email de notificación enviado al ADMIN');
    return true;
  } catch (error) {
    console.error('❌ Error enviando notificación al admin:', error.message || error);
    throw error;
  }
};

// Función para enviar email de confirmación inicial al cliente
const sendClientConfirmation = async (bookingData) => {
  try {
    const { clientName, clientEmail, service, date, time } = bookingData;
    
    const resend = getResendClientGeneral(); // Usar cliente general para clientes
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Solicitud de Reserva Recibida - DEdecor</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
                <tr>
                  <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-bottom: 2px solid #007bff;">
                    <h1 style="margin: 0; color: #2c3e50; font-size: 24px; font-weight: bold;">Solicitud Recibida</h1>
                    <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 14px;">DEdecor - Decoración de Interiores</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Hola <strong>${clientName}</strong>,</p>
                    <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Hemos recibido tu solicitud de reserva. Un miembro de nuestro equipo la revisará y te confirmará en breve.</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
                      <tr>
                        <td style="padding: 20px;">
                          <h3 style="margin: 0 0 15px 0; color: #155724; font-size: 18px;">Detalles de tu Solicitud</h3>
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr><td style="padding: 5px 0; font-weight: bold; width: 120px; color: #155724;">Servicio:</td><td style="padding: 5px 0; color: #333333;">${service}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold; color: #155724;">Fecha:</td><td style="padding: 5px 0; color: #333333;">${date}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold; color: #155724;">Hora:</td><td style="padding: 5px 0; color: #333333;">${time}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold; color: #155724;">Estado:</td><td style="padding: 5px 0; color: #333333;">PENDIENTE DE CONFIRMACIÓN</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0; font-size: 16px; color: #333333;">Recibirás un email cuando tu reserva sea confirmada.</p>
                    <p style="margin: 20px 0; font-size: 16px; color: #333333;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e9ecef; border-radius: 8px; margin: 20px 0;">
                      <tr>
                        <td style="padding: 15px; text-align: center;">
                          <h4 style="margin: 0 0 10px 0; color: #495057; font-size: 16px;">Información de Contacto</h4>
                          <p style="margin: 0; font-size: 14px; color: #333333;"><strong>DEdecor - Decoración de Interiores</strong></p>
                          <p style="margin: 0; font-size: 14px; color: #333333;">Email: dedecorinfo@gmail.com</p>
                          <p style="margin: 0; font-size: 14px; color: #333333;">Sistema de Reservas Profesional</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    const textContent = `
SOLICITUD DE RESERVA RECIBIDA - DEDECOR

Hola ${clientName},

Hemos recibido tu solicitud de reserva. Un miembro de nuestro equipo la revisará y te confirmará en breve.

DETALLES DE TU SOLICITUD:
Servicio: ${service}
Fecha: ${date}
Hora: ${time}
Estado: PENDIENTE DE CONFIRMACIÓN

Recibirás un email cuando tu reserva sea confirmada.
Si tienes alguna pregunta, no dudes en contactarnos.

INFORMACIÓN DE CONTACTO:
DEdecor - Decoración de Interiores
Email: dedecorinfo@gmail.com
Sistema de Reservas Profesional
    `;
    
    const { data, error } = await resend.emails.send({
      from: 'DEdecor <onboarding@resend.dev>', // TODO: Cambiar a tu dominio después de verificarlo en Resend
      to: clientEmail,
      subject: 'Hemos recibido tu solicitud de reserva',
      html: htmlContent,
      text: textContent
    });
    
    if (error) {
      throw new Error(error.message || 'Error enviando email');
    }
    
    console.log('✅ Email de confirmación enviado al CLIENTE');
    return true;
  } catch (error) {
    console.error('❌ Error enviando confirmación al cliente:', error.message || error);
    throw error;
  }
};

// Función para enviar email de confirmación final al cliente
const sendFinalConfirmation = async (bookingData) => {
  try {
    const { clientName, clientEmail, service, date, time } = bookingData;
    
    console.log(`📧 sendFinalConfirmation - Preparando email para: ${clientEmail}`);
    
    if (!clientName || !clientEmail || !service || !date || !time) {
      throw new Error(`Faltan datos requeridos: clientName=${!!clientName}, clientEmail=${!!clientEmail}, service=${!!service}, date=${!!date}, time=${!!time}`);
    }
    
    const resend = getResendClientGeneral(); // Usar cliente general para clientes
    console.log(`📧 Cliente Resend obtenido para enviar a: ${clientEmail}`);
    
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reserva Confirmada - DEdecor</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
                <tr>
                  <td style="padding: 30px; text-align: center; background-color: #d4edda; border-bottom: 2px solid #28a745;">
                    <h1 style="margin: 0; color: #28a745; font-size: 24px; font-weight: bold;">¡Reserva Confirmada!</h1>
                    <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 14px;">DEdecor - Decoración de Interiores</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Hola <strong>${clientName}</strong>,</p>
                    <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Nos complace informarte que tu reserva ha sido <strong>confirmada exitosamente</strong>.</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #d4edda; border-radius: 8px; border-left: 4px solid #28a745;">
                      <tr>
                        <td style="padding: 20px;">
                          <h3 style="margin: 0 0 15px 0; color: #155724; font-size: 18px;">Detalles de tu Cita</h3>
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr><td style="padding: 5px 0; font-weight: bold; width: 120px; color: #155724;">Servicio:</td><td style="padding: 5px 0; color: #333333;">${service}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold; color: #155724;">Fecha:</td><td style="padding: 5px 0; color: #333333;">${date}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold; color: #155724;">Hora:</td><td style="padding: 5px 0; color: #333333;">${time}</td></tr>
                            <tr><td style="padding: 5px 0; font-weight: bold; color: #155724;">Estado:</td><td style="padding: 5px 0; color: #333333;">CONFIRMADA</td></tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <p style="margin: 20px 0; font-size: 16px; color: #333333;">¡Esperamos verte pronto!</p>
                    
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #e9ecef; border-radius: 8px; margin: 20px 0;">
                      <tr>
                        <td style="padding: 15px; text-align: center;">
                          <h4 style="margin: 0 0 10px 0; color: #495057; font-size: 16px;">Información de Contacto</h4>
                          <p style="margin: 0; font-size: 14px; color: #333333;"><strong>DEdecor - Decoración de Interiores</strong></p>
                          <p style="margin: 0; font-size: 14px; color: #333333;">Email: dedecorinfo@gmail.com</p>
                          <p style="margin: 0; font-size: 14px; color: #333333;">Sistema de Reservas Profesional</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;
    
    const textContent = `
¡RESERVA CONFIRMADA! - DEDECOR

Hola ${clientName},

Nos complace informarte que tu reserva ha sido confirmada exitosamente.

DETALLES DE TU CITA:
Servicio: ${service}
Fecha: ${date}
Hora: ${time}
Estado: CONFIRMADA

¡Esperamos verte pronto!

INFORMACIÓN DE CONTACTO:
DEdecor - Decoración de Interiores
Email: dedecorinfo@gmail.com
Sistema de Reservas Profesional
    `;
    
    console.log(`📧 Enviando email vía Resend a: ${clientEmail}`);
    console.log(`📧 From: DEdecor <onboarding@resend.dev>`);
    console.log(`📧 Subject: Reserva Confirmada - ${service}`);
    
    const { data, error } = await resend.emails.send({
      from: 'DEdecor <onboarding@resend.dev>', // TODO: Cambiar a tu dominio después de verificarlo en Resend
      to: clientEmail,
      subject: `Reserva Confirmada - ${service}`,
      html: htmlContent,
      text: textContent
    });
    
    if (error) {
      console.error('❌ Error de Resend:', error);
      console.error('❌ Código de error:', error.name || 'N/A');
      console.error('❌ Mensaje de error:', error.message || 'N/A');
      throw new Error(error.message || 'Error enviando email');
    }
    
    console.log('✅ Email de confirmación final enviado al CLIENTE exitosamente');
    console.log('✅ ID del email:', data?.id || 'N/A');
    return true;
  } catch (error) {
    console.error('❌ Error completo enviando confirmación final:', error);
    console.error('❌ Stack trace:', error.stack);
    throw error;
  }
};

module.exports = {
  configureEmail,
  sendAdminNotification,
  sendClientConfirmation,
  sendFinalConfirmation
};
