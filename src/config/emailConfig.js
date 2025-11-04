/**
 * Configuración de email con Nodemailer + Gmail (GRATIS)
 * Solución simple y confiable para envío de emails
 */

const nodemailer = require('nodemailer');

// Transporter global para reutilizar conexiones
let globalTransporter = null;

// Configurar transportador de Gmail
const createTransporter = () => {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  
  if (!appPassword) {
    console.error('❌ GMAIL_APP_PASSWORD no está configurada');
    throw new Error('GMAIL_APP_PASSWORD no configurada');
  }
  
  // Reutilizar transporter si ya existe
  if (globalTransporter) {
    return globalTransporter;
  }
  
  console.log('🔧 Configurando Nodemailer con Gmail SMTP...');
  console.log('📧 Usuario:', 'dedecorinfo@gmail.com');
  console.log('🔑 Contraseña configurada:', appPassword ? 'Sí (' + appPassword.length + ' caracteres)' : 'No');
  
  // Configuración optimizada para Render - probar múltiples métodos
  // Método 1: service: 'gmail' (a veces funciona mejor)
  try {
    globalTransporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'dedecorinfo@gmail.com',
        pass: appPassword
      },
      // Pool de conexiones para mejor rendimiento
      pool: true,
      maxConnections: 1,
      maxMessages: 3,
      // Timeouts más cortos para detectar problemas rápido
      connectionTimeout: 10000, // 10 segundos
      socketTimeout: 10000, // 10 segundos
      greetingTimeout: 10000, // 10 segundos
      // TLS configurado explícitamente
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      }
    });
    
    console.log('✅ Transporter creado con service: gmail');
    return globalTransporter;
  } catch (error) {
    console.warn('⚠️ Error con service: gmail, intentando configuración SMTP explícita:', error.message);
  }
  
  // Método 2: Configuración SMTP explícita con puerto 587 (TLS)
  // Este es más confiable desde algunos hosts
  globalTransporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // false para 587
    requireTLS: true,
    auth: {
      user: 'dedecorinfo@gmail.com',
      pass: appPassword
    },
    // Pool de conexiones
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
    // Timeouts
    connectionTimeout: 10000,
    socketTimeout: 10000,
    greetingTimeout: 10000,
    // TLS específico
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
      ciphers: 'SSLv3'
    },
    debug: false,
    logger: false
  });
  
  console.log('✅ Transporter creado con configuración SMTP explícita (puerto 587)');
  return globalTransporter;
};

// Helper para enviar email con timeout y reintentos
const sendEmailWithTimeout = async (transporter, mailOptions, timeoutMs = 25000, retries = 2) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await Promise.race([
        transporter.sendMail(mailOptions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error(`Timeout: Email tardó demasiado en enviarse (intento ${attempt}/${retries})`)), timeoutMs)
        )
      ]);
      return result;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.warn(`⚠️ Intento ${attempt} falló, reintentando...`, error.message);
      // Esperar un poco antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// Verificar configuración de email
const configureEmail = () => {
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  
  if (!appPassword) {
    console.warn('⚠️ GMAIL_APP_PASSWORD no configurada - emails deshabilitados');
    return false;
  }
  
  console.log('✅ Gmail configurado correctamente');
  return true;
};

// Función para enviar email de nueva reserva al admin
const sendAdminNotification = async (bookingData) => {
  try {
    const { bookingId, clientName, clientEmail, clientPhone, service, date, time, notes } = bookingData;
    
    const baseUrl = process.env.BASE_URL || 'https://dedecorinfo.com';
    const confirmUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=confirm`;
    const rejectUrl = `${baseUrl}/confirm-booking?id=${bookingId}&action=reject`;
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: '"Sistema de Reservas DEdecor" <dedecorinfo@gmail.com>',
      to: 'dedecorinfo@gmail.com',
      subject: `Solicitud de Reserva - ${clientName}`,
      html: `
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
      `,
      text: `
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
      `
    };
    
    await sendEmailWithTimeout(transporter, mailOptions, 30000);
    console.log('✅ Email de notificación enviado al ADMIN');
    return true;
  } catch (error) {
    console.error('❌ Error enviando notificación al admin:', error.message || error);
    throw error;
  }
};

// Función para enviar email de confirmación al cliente
const sendClientConfirmation = async (bookingData) => {
  try {
    const { clientName, clientEmail, service, date, time } = bookingData;
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: '"DEdecor" <dedecorinfo@gmail.com>',
      to: clientEmail,
      subject: 'Hemos recibido tu solicitud de reserva',
      html: `
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
      `,
      text: `
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
      `
    };
    
    await sendEmailWithTimeout(transporter, mailOptions, 30000);
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
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: '"DEdecor" <dedecorinfo@gmail.com>',
      to: clientEmail,
      subject: `Reserva Confirmada - ${service}`,
      html: `
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
      `,
      text: `
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
      `
    };
    
    await sendEmailWithTimeout(transporter, mailOptions, 30000);
    console.log('✅ Email de confirmación final enviado al CLIENTE');
    return true;
  } catch (error) {
    console.error('❌ Error enviando confirmación final:', error.message || error);
    throw error;
  }
};

module.exports = {
  configureEmail,
  createTransporter,
  sendAdminNotification,
  sendClientConfirmation,
  sendFinalConfirmation
};