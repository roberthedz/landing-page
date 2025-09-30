/**
 * Script de prueba para configuración ultra-agresiva anti-spam
 * Verifica que la configuración funciona correctamente
 */

const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('❌ SENDGRID_API_KEY no configurada');
  process.exit(1);
}

sgMail.setApiKey(apiKey);

async function testUltraAntiSpam() {
  console.log('🧪 PROBANDO CONFIGURACIÓN ULTRA-AGRESIVA ANTI-SPAM');
  console.log('Implementando solución definitiva para evitar spam');
  console.log('');

  try {
    const msg = {
      to: 'rhzamora144@gmail.com',
      from: {
        email: 'dedecorinfo@gmail.com',
        name: 'DEdecor Sistema de Reservas'
      },
      replyTo: 'dedecorinfo@gmail.com',
      subject: 'Prueba Ultra-Agresiva Anti-Spam - DEdecor',
      // Headers ULTRA-AGRESIVOS para evitar spam
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'DEdecor-Booking-System',
        'X-Entity-Ref-ID': 'test-ultra-anti-spam',
        'X-Custom-Header': 'ultra-anti-spam-test',
        'X-Sender': 'DEdecor Sistema de Reservas',
        'X-Reply-To': 'dedecorinfo@gmail.com',
        'X-Original-Sender': 'DEdecor Sistema de Reservas'
      },
      // Configuración ULTRA-AGRESIVA para evitar spam
      categories: ['ultra-anti-spam-test', 'business-email', 'reservation-system'],
      customArgs: {
        testId: 'ultra-anti-spam-test',
        type: 'ultra-anti-spam-test',
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
        }
      },
      // HTML ULTRA-OPTIMIZADO para evitar spam
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Prueba Ultra-Agresiva Anti-Spam - DEdecor</title>
          <meta name="description" content="Prueba de configuración ultra-agresiva anti-spam para sistema de reservas">
          <meta name="keywords" content="decoración, interiores, reserva, anti-spam, prueba">
        </head>
        <body style="margin: 0; padding: 0; background-color: #ffffff; font-family: Arial, sans-serif; line-height: 1.6; color: #333333;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff;">
            <tr>
              <td align="center" style="padding: 20px;">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px;">
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-bottom: 2px solid #007bff;">
                      <h1 style="margin: 0; color: #2c3e50; font-size: 24px; font-weight: bold;">Prueba Ultra-Agresiva Anti-Spam</h1>
                      <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 14px;">Sistema de Reservas DEdecor</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333;">Este es un email de prueba para verificar que la configuración ultra-agresiva anti-spam funciona correctamente.</p>
                      
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #d4edda; border-radius: 8px; border-left: 4px solid #28a745;">
                        <tr>
                          <td style="padding: 20px;">
                            <h3 style="margin: 0 0 15px 0; color: #155724; font-size: 18px;">Configuración Ultra-Agresiva Aplicada</h3>
                            <ul style="margin: 0; color: #155724; font-size: 14px;">
                              <li>Headers ultra-optimizados para evitar spam</li>
                              <li>Estructura HTML con tablas para máxima compatibilidad</li>
                              <li>Tracking deshabilitado para evitar spam</li>
                              <li>Configuración de sandbox y bypass optimizada</li>
                              <li>Versión de texto plano ultra-optimizada</li>
                              <li>Meta tags optimizados</li>
                              <li>Estructura de tabla para compatibilidad</li>
                            </ul>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 20px 0; font-size: 16px; color: #333333;">Si recibes este email en tu bandeja de entrada (no en spam), la configuración ultra-agresiva está funcionando correctamente.</p>
                      
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
                            <p style="margin: 0;">Test ID: ultra-anti-spam-test</p>
                            <p style="margin: 5px 0 0 0;">Timestamp: ${new Date().toISOString()}</p>
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
PRUEBA ULTRA-AGRESIVA ANTI-SPAM - DEDECOR

Este es un email de prueba para verificar que la configuración ultra-agresiva anti-spam funciona correctamente.

CONFIGURACIÓN ULTRA-AGRESIVA APLICADA:
- Headers ultra-optimizados para evitar spam
- Estructura HTML con tablas para máxima compatibilidad
- Tracking deshabilitado para evitar spam
- Configuración de sandbox y bypass optimizada
- Versión de texto plano ultra-optimizada
- Meta tags optimizados
- Estructura de tabla para compatibilidad

Si recibes este email en tu bandeja de entrada (no en spam), la configuración ultra-agresiva está funcionando correctamente.

INFORMACIÓN DE CONTACTO:
DEdecor - Decoración de Interiores
Email: dedecorinfo@gmail.com
Sistema de Reservas Profesional

Test ID: ultra-anti-spam-test
Timestamp: ${new Date().toISOString()}

---
Sistema de Reservas DEdecor
      `
    };
    
    console.log('📤 Enviando email de prueba con configuración ultra-agresiva...');
    const result = await sgMail.send(msg);
    
    console.log('✅ Email enviado exitosamente');
    console.log('📊 Resultado:', result);
    console.log('📧 Revisa tu email: rhzamora144@gmail.com');
    console.log('');
    console.log('🎯 CONFIGURACIÓN ULTRA-AGRESIVA APLICADA:');
    console.log('  ✅ Headers ultra-optimizados para evitar spam');
    console.log('  ✅ Estructura HTML con tablas para máxima compatibilidad');
    console.log('  ✅ Tracking deshabilitado para evitar spam');
    console.log('  ✅ Configuración de sandbox y bypass optimizada');
    console.log('  ✅ Versión de texto plano ultra-optimizada');
    console.log('  ✅ Meta tags optimizados');
    console.log('  ✅ Estructura de tabla para compatibilidad');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('1. Revisa tu bandeja de entrada');
    console.log('2. Si llega a spam, marca como "No es spam"');
    console.log('3. Agrega dedecorinfo@gmail.com a contactos');
    console.log('4. Configura filtros en Gmail');
    console.log('5. Considera configurar dominio autenticado en SendGrid');
    console.log('6. Monitorea la reputación del dominio');
    console.log('');
    console.log('🔧 HERRAMIENTAS DE DIAGNÓSTICO:');
    console.log('  • Mail Tester: https://www.mail-tester.com/');
    console.log('  • MXToolbox: https://mxtoolbox.com/');
    console.log('  • SendGrid Activity Dashboard');
    console.log('  • Gmail Postmaster Tools');
    
  } catch (error) {
    console.error('❌ Error enviando email:');
    console.error('Código:', error.code);
    console.error('Mensaje:', error.message);
    
    if (error.response) {
      console.error('Respuesta HTTP:', error.response.status);
      console.error('Body:', error.response.body);
    }
  }
}

testUltraAntiSpam();
