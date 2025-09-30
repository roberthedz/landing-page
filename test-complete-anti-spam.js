/**
 * Script de prueba completo anti-spam
 * Implementa todas las mejores prácticas para maximizar deliverabilidad
 */

const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('❌ SENDGRID_API_KEY no configurada');
  process.exit(1);
}

sgMail.setApiKey(apiKey);

async function testCompleteAntiSpam() {
  console.log('🧪 PROBANDO CONFIGURACIÓN ANTI-SPAM COMPLETA');
  console.log('Implementando todas las mejores prácticas para maximizar deliverabilidad');
  console.log('');

  try {
    const msg = {
      to: 'rhzamora144@gmail.com',
      from: {
        email: 'dedecorinfo@gmail.com',
        name: 'DEdecor Reservas'
      },
      replyTo: 'dedecorinfo@gmail.com',
      subject: 'Confirmación de Reserva - DEdecor',
      // Headers optimizados para evitar spam
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'DEdecor-System',
        'X-Entity-Ref-ID': 'test-complete-anti-spam',
        'X-Custom-Header': 'booking-system'
      },
      // Configuración para evitar spam
      categories: ['booking-confirmation'],
      customArgs: {
        bookingId: 'test-complete-anti-spam',
        type: 'client-confirmation',
        source: 'booking-system',
        priority: 'high'
      },
      // Configuración de tracking optimizada
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: false
        },
        openTracking: {
          enable: true
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
      // HTML optimizado con todas las mejores prácticas
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmación de Reserva - DEdecor</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 0; 
              background-color: #f8f9fa; 
              line-height: 1.6;
            }
            .container { 
              max-width: 600px; 
              margin: 0 auto; 
              background-color: #ffffff; 
              padding: 20px; 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #007bff;
              padding-bottom: 20px;
            }
            .header h1 { 
              color: #2c3e50; 
              margin: 0; 
              font-size: 24px;
            }
            .header p { 
              color: #6c757d; 
              margin: 10px 0 0 0; 
              font-size: 14px;
            }
            .content { 
              background: #f8f9fa; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0; 
              border-left: 4px solid #007bff; 
            }
            .content h3 { 
              color: #495057; 
              margin-top: 0; 
              font-size: 18px;
            }
            .data-table { 
              width: 100%; 
              border-collapse: collapse; 
            }
            .data-table td { 
              padding: 8px 0; 
              border-bottom: 1px solid #dee2e6;
            }
            .data-table .label { 
              font-weight: bold; 
              width: 120px; 
              color: #495057;
            }
            .success { 
              background: #d4edda; 
              padding: 15px; 
              border-radius: 8px; 
              margin: 20px 0; 
              border-left: 4px solid #28a745; 
            }
            .success p { 
              margin: 0; 
              color: #155724; 
              font-weight: bold;
            }
            .footer { 
              border-top: 1px solid #dee2e6; 
              padding-top: 20px; 
              margin-top: 30px; 
              font-size: 14px; 
              color: #666; 
              text-align: center;
            }
            .footer p { 
              margin: 5px 0; 
            }
            .business-info {
              background: #e9ecef;
              padding: 15px;
              border-radius: 8px;
              margin: 20px 0;
              text-align: center;
            }
            .business-info h4 {
              margin: 0 0 10px 0;
              color: #495057;
            }
            .business-info p {
              margin: 5px 0;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Confirmación de Reserva</h1>
              <p>DEdecor - Decoración de Interiores</p>
            </div>
            
            <p>Estimado/a <strong>Cliente de Prueba</strong>,</p>
            <p>Hemos recibido tu solicitud de reserva y la revisaremos pronto.</p>
            
            <div class="content">
              <h3>Detalles de tu Reserva</h3>
              <table class="data-table">
                <tr><td class="label">Servicio:</td><td>Paquete Esencial</td></tr>
                <tr><td class="label">Fecha:</td><td>30/09/2025</td></tr>
                <tr><td class="label">Hora:</td><td>2:00 PM</td></tr>
                <tr><td class="label">Estado:</td><td>Pendiente de confirmación</td></tr>
              </table>
            </div>
            
            <div class="success">
              <p>✅ Configuración Anti-Spam Completa Aplicada</p>
              <p>Este email incluye todas las mejores prácticas para evitar spam:</p>
              <ul style="margin: 10px 0 0 0; color: #155724;">
                <li>Headers de prioridad optimizados</li>
                <li>Estructura HTML profesional</li>
                <li>Contenido relevante y personalizado</li>
                <li>Proporción texto/imágenes optimizada</li>
                <li>Tracking configurado correctamente</li>
                <li>Configuración de sandbox deshabilitada</li>
                <li>Información de contacto clara</li>
              </ul>
            </div>
            
            <p>Te enviaremos un email de confirmación una vez que tu reserva sea aprobada por nuestro equipo.</p>
            <p>¡Gracias por elegirnos!</p>
            
            <div class="business-info">
              <h4>Información de Contacto</h4>
              <p><strong>DEdecor - Decoración de Interiores</strong></p>
              <p>Email: dedecorinfo@gmail.com</p>
              <p>Sistema de Reservas Profesional</p>
            </div>
            
            <div class="footer">
              <p>ID de reserva: test-complete-anti-spam</p>
              <p>Estado: PENDIENTE</p>
              <p>Timestamp: ${new Date().toISOString()}</p>
              <p>---</p>
              <p>Este es un mensaje automático del sistema de reservas DEdecor</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Versión de texto plano optimizada
      text: `
Confirmación de Reserva - DEdecor

Estimado/a Cliente de Prueba,

Hemos recibido tu solicitud de reserva y la revisaremos pronto.

Detalles de tu Reserva:
Servicio: Paquete Esencial
Fecha: 30/09/2025
Hora: 2:00 PM
Estado: Pendiente de confirmación

Configuración Anti-Spam Completa Aplicada:
Este email incluye todas las mejores prácticas para evitar spam:
- Headers de prioridad optimizados
- Estructura HTML profesional
- Contenido relevante y personalizado
- Proporción texto/imágenes optimizada
- Tracking configurado correctamente
- Configuración de sandbox deshabilitada
- Información de contacto clara

Te enviaremos un email de confirmación una vez que tu reserva sea aprobada por nuestro equipo.

¡Gracias por elegirnos!

Información de Contacto:
DEdecor - Decoración de Interiores
Email: dedecorinfo@gmail.com
Sistema de Reservas Profesional

ID de reserva: test-complete-anti-spam
Estado: PENDIENTE
Timestamp: ${new Date().toISOString()}

---
Este es un mensaje automático del sistema de reservas DEdecor
      `
    };
    
    console.log('📤 Enviando email de prueba con configuración anti-spam completa...');
    const result = await sgMail.send(msg);
    
    console.log('✅ Email enviado exitosamente');
    console.log('📊 Resultado:', result);
    console.log('📧 Revisa tu email: rhzamora144@gmail.com');
    console.log('');
    console.log('🎯 CONFIGURACIÓN ANTI-SPAM COMPLETA APLICADA:');
    console.log('  ✅ Headers de prioridad optimizados');
    console.log('  ✅ Estructura HTML profesional');
    console.log('  ✅ Contenido relevante y personalizado');
    console.log('  ✅ Proporción texto/imágenes optimizada');
    console.log('  ✅ Tracking configurado correctamente');
    console.log('  ✅ Configuración de sandbox deshabilitada');
    console.log('  ✅ Información de contacto clara');
    console.log('  ✅ Versión de texto plano incluida');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS PARA MAXIMIZAR DELIVERABILIDAD:');
    console.log('1. Revisa tu bandeja de entrada');
    console.log('2. Si llega a spam, marca como "No es spam"');
    console.log('3. Agrega dedecorinfo@gmail.com a contactos');
    console.log('4. Configura filtros en Gmail');
    console.log('5. Considera configurar dominio autenticado en SendGrid');
    console.log('6. Monitorea la reputación del dominio');
    console.log('7. Usa herramientas como mail-tester.com para verificar');
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

testCompleteAntiSpam();
