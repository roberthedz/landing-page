/**
 * Script de prueba avanzado para configuración anti-spam
 * Incluye mejores prácticas para maximizar deliverabilidad
 */

const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('❌ SENDGRID_API_KEY no configurada');
  process.exit(1);
}

sgMail.setApiKey(apiKey);

async function testAdvancedAntiSpam() {
  console.log('🧪 PROBANDO CONFIGURACIÓN ANTI-SPAM AVANZADA');
  console.log('');

  try {
    const msg = {
      to: 'rhzamora144@gmail.com',
      from: {
        email: 'dedecorinfo@gmail.com',
        name: 'DEdecor Reservas'
      },
      replyTo: 'dedecorinfo@gmail.com',
      subject: 'Prueba Anti-Spam Avanzada - DEdecor',
      // Configuración avanzada anti-spam
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high',
        'X-Mailer': 'DEdecor-System',
        'X-Entity-Ref-ID': 'test-advanced-anti-spam'
      },
      // Configuración para evitar spam
      categories: ['test-email'],
      customArgs: {
        testId: 'advanced-anti-spam-test',
        type: 'test-email',
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
          <title>Prueba Anti-Spam Avanzada</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #2c3e50; margin: 0; }
            .header p { color: #6c757d; margin: 10px 0 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff; }
            .content h3 { color: #495057; margin-top: 0; }
            .success { background: #d4edda; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745; }
            .success p { margin: 0; color: #155724; }
            .footer { border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Prueba Anti-Spam Avanzada</h1>
              <p>DEdecor - Sistema de Reservas</p>
            </div>
            
            <p>Este es un email de prueba para verificar que la configuración anti-spam avanzada funciona correctamente.</p>
            
            <div class="success">
              <p><strong>✅ Configuración Anti-Spam Avanzada Aplicada:</strong></p>
              <ul style="margin: 10px 0 0 0; color: #155724;">
                <li>Headers de prioridad optimizados</li>
                <li>Reply-To configurado</li>
                <li>Categorías y customArgs avanzados</li>
                <li>Tracking configurado</li>
                <li>HTML y texto plano optimizados</li>
                <li>Estructura HTML profesional</li>
                <li>Configuración de sandbox deshabilitada</li>
              </ul>
            </div>
            
            <p>Si recibes este email en tu bandeja de entrada (no en spam), la configuración avanzada está funcionando correctamente.</p>
            
            <div class="footer">
              <p>Timestamp: ${new Date().toISOString()}</p>
              <p>Test ID: advanced-anti-spam-test</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Versión de texto plano optimizada
      text: `
Prueba Anti-Spam Avanzada - DEdecor

Este es un email de prueba para verificar que la configuración anti-spam avanzada funciona correctamente.

Configuración Anti-Spam Avanzada Aplicada:
- Headers de prioridad optimizados
- Reply-To configurado
- Categorías y customArgs avanzados
- Tracking configurado
- HTML y texto plano optimizados
- Estructura HTML profesional
- Configuración de sandbox deshabilitada

Si recibes este email en tu bandeja de entrada (no en spam), la configuración avanzada está funcionando correctamente.

Timestamp: ${new Date().toISOString()}
Test ID: advanced-anti-spam-test

---
DEdecor - Sistema de Reservas
      `
    };
    
    console.log('📤 Enviando email de prueba con configuración anti-spam avanzada...');
    const result = await sgMail.send(msg);
    
    console.log('✅ Email enviado exitosamente');
    console.log('📊 Resultado:', result);
    console.log('📧 Revisa tu email: rhzamora144@gmail.com');
    console.log('');
    console.log('🎯 CONFIGURACIÓN ANTI-SPAM AVANZADA APLICADA:');
    console.log('  ✅ Headers de prioridad optimizados');
    console.log('  ✅ Reply-To configurado');
    console.log('  ✅ Categorías y customArgs avanzados');
    console.log('  ✅ Tracking configurado');
    console.log('  ✅ HTML y texto plano optimizados');
    console.log('  ✅ Estructura HTML profesional');
    console.log('  ✅ Configuración de sandbox deshabilitada');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS PARA MAXIMIZAR DELIVERABILIDAD:');
    console.log('1. Revisa tu bandeja de entrada');
    console.log('2. Si llega a spam, marca como "No es spam"');
    console.log('3. Agrega dedecorinfo@gmail.com a contactos');
    console.log('4. Configura filtros en Gmail');
    console.log('5. Considera configurar dominio autenticado en SendGrid');
    console.log('6. Monitorea la reputación del dominio');
    
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

testAdvancedAntiSpam();
