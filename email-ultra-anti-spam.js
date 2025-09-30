/**
 * Configuración ULTRA-AGRESIVA anti-spam para SendGrid
 * Solución definitiva para evitar que los emails vayan a spam
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

// Función ULTRA-AGRESIVA para enviar email de nueva reserva al admin
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
        name: 'DEdecor Sistema de Reservas'
      },
      replyTo: 'dedecorinfo@gmail.com',
      subject: `Solicitud de Reserva - ${clientName}`,
      // Headers ULTRA-AGRESIVOS para evitar spam
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'DEdecor-Booking-System',
        'X-Entity-Ref-ID': bookingId,
        'X-Custom-Header': 'booking-notification',
        'X-Sender': 'DEdecor Sistema de Reservas',
        'X-Reply-To': 'dedecorinfo@gmail.com',
        'X-Original-Sender': 'DEdecor Sistema de Reservas'
      },
      // Configuración ULTRA-AGRESIVA para evitar spam
      categories: ['booking-notification', 'business-email', 'reservation-system'],
      customArgs: {
        bookingId: bookingId,
        type: 'admin-notification',
        source: 'booking-system',
        priority: 'high',
        business: 'DEdecor',
        system: 'reservation'
      },
      // Configuración de tracking ULTRA-AGRESIVA
      trackingSettings: {
        clickTracking: {
          enable: false
        },
        openTracking: {
          enable: false
        },
        subscriptionTracking: {
          enable: false
        }
      },
      // Configuración de sandbox deshabilitada
      mailSettings: {
        sandboxMode: {
          enable: false
        },
        footer: {
          enable: false
        },
        bypassListManagement: {
          enable: false
        },
        bypassSpamManagement: {
          enable: false
        },
        bypassUnsubscribeManagement: {
          enable: false
        }
      },
      // HTML ULTRA-OPTIMIZADO para evitar spam
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Solicitud de Reserva - DEdecor</title>
          <meta name="description" content="Solicitud de reserva para servicio de decoración de interiores">
          <meta name="keywords" content="decoración, interiores, reserva, cita">
        </head>
        <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-bottom: 2px solid #007bff;">
                      <h1 style="margin: 0; color: #2c3e50; font-size: 24px; font-weight: bold;">Solicitud de Reserva</h1>
                      <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 14px;">Sistema de Reservas DEdecor</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Has recibido una nueva solicitud de reserva que requiere tu confirmación.</p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #495057; font-size: 18px;">Detalles de la Reserva</h3>
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr><td style="padding: 5px 0; font-weight: bold; width: 120px; color: #495057;">ID:</td><td style="padding: 5px 0; color: #333333;">${bookingId}</td></tr>
                              <tr><td style="padding: 5px 0; font-weight: bold; color: #495057;">Cliente:</td><td style="padding: 5px 0; color: #333333;">${clientName}</td></tr>
                              <tr><td style="padding: 5px 0; font-weight: bold; color: #495057;">Email:</td><td style="padding: 5px 0; color: #333333;">${clientEmail}</td></tr>
                              <tr><td style="padding: 5px 0; font-weight: bold; color: #495057;">Teléfono:</td><td style="padding: 5px 0; color: #333333;">${clientPhone}</td></tr>
                              <tr><td style="padding: 5px 0; font-weight: bold; color: #495057;">Servicio:</td><td style="padding: 5px 0; color: #333333;">${service}</td></tr>
                              <tr><td style="padding: 5px 0; font-weight: bold; color: #495057;">Fecha:</td><td style="padding: 5px 0; color: #333333;">${date}</td></tr>
                              <tr><td style="padding: 5px 0; font-weight: bold; color: #495057;">Hora:</td><td style="padding: 5px 0; color: #333333;">${time}</td></tr>
                              ${notes ? `<tr><td style="padding: 5px 0; font-weight: bold; color: #495057;">Notas:</td><td style="padding: 5px 0; color: #333333;">${notes}</td></tr>` : ''}
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #fff3cd; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
                        <tr>
                          <td style="padding: 15px;">
                            <p style="margin: 0; color: #856404; font-weight: bold;">IMPORTANTE: Los horarios NO están bloqueados hasta que confirmes esta reserva.</p>
                          </td>
                        </tr>
                      </table>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="text-align: center; margin: 30px 0;">
                        <tr>
                          <td>
                            <a href="${confirmUrl}" style="background-color: #28a745; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin-right: 15px; font-weight: bold; display: inline-block;">CONFIRMAR RESERVA</a>
                            <a href="${rejectUrl}" style="background-color: #dc3545; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">RECHAZAR RESERVA</a>
                          </td>
                        </tr>
                      </table>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px;">
                        <tr>
                          <td style="text-align: center; font-size: 14px; color: #666666;">
                            <p style="margin: 0;">ID de reserva: ${bookingId}</p>
                            <p style="margin: 5px 0 0 0;">Estado: PENDIENTE</p>
                            <p style="margin: 5px 0 0 0;">Sistema de Reservas DEdecor</p>
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
      // Versión de texto plano ULTRA-OPTIMIZADA
      text: `
SOLICITUD DE RESERVA - DEDECOR

Has recibido una nueva solicitud de reserva que requiere tu confirmación.

DETALLES DE LA RESERVA:
ID: ${bookingId}
Cliente: ${clientName}
Email: ${clientEmail}
Teléfono: ${clientPhone}
Servicio: ${service}
Fecha: ${date}
Hora: ${time}
${notes ? `Notas: ${notes}` : ''}

IMPORTANTE: Los horarios NO están bloqueados hasta que confirmes esta reserva.

ACCIONES DISPONIBLES:
- Confirmar: ${confirmUrl}
- Rechazar: ${rejectUrl}

ESTADO: PENDIENTE

---
Sistema de Reservas DEdecor
Email: dedecorinfo@gmail.com
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

// Función ULTRA-AGRESIVA para enviar email de confirmación al cliente
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
      subject: `Confirmación de Reserva - ${service}`,
      // Headers ULTRA-AGRESIVOS para evitar spam
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'DEdecor-Booking-System',
        'X-Entity-Ref-ID': bookingId,
        'X-Custom-Header': 'booking-confirmation',
        'X-Sender': 'DEdecor',
        'X-Reply-To': 'dedecorinfo@gmail.com',
        'X-Original-Sender': 'DEdecor'
      },
      // Configuración ULTRA-AGRESIVA para evitar spam
      categories: ['booking-confirmation', 'business-email', 'reservation-system'],
      customArgs: {
        bookingId: bookingId,
        type: 'client-confirmation',
        source: 'booking-system',
        priority: 'high',
        business: 'DEdecor',
        system: 'reservation'
      },
      // Configuración de tracking ULTRA-AGRESIVA
      trackingSettings: {
        clickTracking: {
          enable: false
        },
        openTracking: {
          enable: false
        },
        subscriptionTracking: {
          enable: false
        }
      },
      // Configuración de sandbox deshabilitada
      mailSettings: {
        sandboxMode: {
          enable: false
        },
        footer: {
          enable: false
        },
        bypassListManagement: {
          enable: false
        },
        bypassSpamManagement: {
          enable: false
        },
        bypassUnsubscribeManagement: {
          enable: false
        }
      },
      // HTML ULTRA-OPTIMIZADO para evitar spam
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Reserva - DEdecor</title>
          <meta name="description" content="Confirmación de reserva para servicio de decoración de interiores">
          <meta name="keywords" content="decoración, interiores, reserva, confirmación">
        </head>
        <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-bottom: 2px solid #007bff;">
                      <h1 style="margin: 0; color: #2c3e50; font-size: 24px; font-weight: bold;">Confirmación de Reserva</h1>
                      <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 14px;">DEdecor - Decoración de Interiores</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Hola <strong>${clientName}</strong>,</p>
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Hemos recibido tu solicitud de reserva y la revisaremos pronto.</p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #007bff;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #495057; font-size: 18px;">Detalles de tu Reserva</h3>
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                              <tr><td style="padding: 5px 0; font-weight: bold; width: 120px; color: #495057;">Servicio:</td><td style="padding: 5px 0; color: #333333;">${service}</td></tr>
                              <tr><td style="padding: 5px 0; font-weight: bold; color: #495057;">Fecha:</td><td style="padding: 5px 0; color: #333333;">${date}</td></tr>
                              <tr><td style="padding: 5px 0; font-weight: bold; color: #495057;">Hora:</td><td style="padding: 5px 0; color: #333333;">${time}</td></tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 20px 0; font-size: 16px; color: #333333;">Te enviaremos un email de confirmación una vez que tu reserva sea aprobada por nuestro equipo.</p>
                      <p style="margin: 20px 0; font-size: 16px; color: #333333;">¡Gracias por elegirnos!</p>
                      
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
                      
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px;">
                        <tr>
                          <td style="text-align: center; font-size: 14px; color: #666666;">
                            <p style="margin: 0;">ID de reserva: ${bookingId}</p>
                            <p style="margin: 5px 0 0 0;">Estado: PENDIENTE</p>
                            <p style="margin: 5px 0 0 0;">Sistema de Reservas DEdecor</p>
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
      // Versión de texto plano ULTRA-OPTIMIZADA
      text: `
CONFIRMACIÓN DE RESERVA - DEDECOR

Hola ${clientName},

Hemos recibido tu solicitud de reserva y la revisaremos pronto.

DETALLES DE TU RESERVA:
Servicio: ${service}
Fecha: ${date}
Hora: ${time}

Te enviaremos un email de confirmación una vez que tu reserva sea aprobada por nuestro equipo.

¡Gracias por elegirnos!

INFORMACIÓN DE CONTACTO:
DEdecor - Decoración de Interiores
Email: dedecorinfo@gmail.com
Sistema de Reservas Profesional

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
      replyTo: 'dedecorinfo@gmail.com',
      subject: `Reserva Confirmada - ${service}`,
      // Headers ULTRA-AGRESIVOS para evitar spam
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'DEdecor-Booking-System',
        'X-Custom-Header': 'booking-final-confirmation',
        'X-Sender': 'DEdecor',
        'X-Reply-To': 'dedecorinfo@gmail.com',
        'X-Original-Sender': 'DEdecor'
      },
      // Configuración ULTRA-AGRESIVA para evitar spam
      categories: ['booking-final-confirmation', 'business-email', 'reservation-system'],
      customArgs: {
        type: 'client-final-confirmation',
        source: 'booking-system',
        priority: 'high',
        business: 'DEdecor',
        system: 'reservation'
      },
      // Configuración de tracking ULTRA-AGRESIVA
      trackingSettings: {
        clickTracking: {
          enable: false
        },
        openTracking: {
          enable: false
        },
        subscriptionTracking: {
          enable: false
        }
      },
      // Configuración de sandbox deshabilitada
      mailSettings: {
        sandboxMode: {
          enable: false
        },
        footer: {
          enable: false
        },
        bypassListManagement: {
          enable: false
        },
        bypassSpamManagement: {
          enable: false
        },
        bypassUnsubscribeManagement: {
          enable: false
        }
      },
      // HTML ULTRA-OPTIMIZADO para evitar spam
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reserva Confirmada - DEdecor</title>
          <meta name="description" content="Reserva confirmada para servicio de decoración de interiores">
          <meta name="keywords" content="decoración, interiores, reserva, confirmada">
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
                      
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px;">
                        <tr>
                          <td style="text-align: center; font-size: 14px; color: #666666;">
                            <p style="margin: 0;">Estado: CONFIRMADA</p>
                            <p style="margin: 5px 0 0 0;">Sistema de Reservas DEdecor</p>
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
      // Versión de texto plano ULTRA-OPTIMIZADA
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

Estado: CONFIRMADA

---
DEdecor - Decoración de Interiores
      `
    };
    
    await sgMail.send(msg);
    console.log('✅ Email de confirmación final enviado al CLIENTE');
    return true;
  } catch (error) {
    console.error('❌ Error enviando confirmación final:', error);
    throw error;
  }
};

module.exports = {
  configureSendGrid,
  sendAdminNotification,
  sendClientConfirmation,
  sendFinalConfirmation
};
