/**
 * Script para probar la configuración anti-spam de emails
 */

const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
  console.error('❌ SENDGRID_API_KEY no configurada');
  process.exit(1);
}

sgMail.setApiKey(apiKey);

async function testAntiSpamEmail() {
  console.log('🧪 PROBANDO CONFIGURACIÓN ANTI-SPAM');
  console.log('');

  try {
    const msg = {
      to: 'rhzamora144@gmail.com', // Tu email para recibir la prueba
      from: {
        email: 'dedecorinfo@gmail.com',
        name: 'DEdecor'
      },
      replyTo: 'dedecorinfo@gmail.com',
      subject: 'Prueba Anti-Spam - DEdecor',
      // Headers para mejorar deliverabilidad
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      },
      // Configuración para evitar spam
      categories: ['test-email'],
      customArgs: {
        testId: 'anti-spam-test',
        type: 'test-email'
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Prueba Anti-Spam</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8f9fa;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin: 0;">Prueba Anti-Spam</h1>
              <p style="color: #6c757d; margin: 10px 0 0 0;">DEdecor - Decoración de Interiores</p>
            </div>
            
            <p>Este es un email de prueba para verificar que la configuración anti-spam funciona correctamente.</p>
            
            <div style="background: #e6ffe6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
              <p style="margin: 0; color: #155724;">
                <strong>✅ Configuración Anti-Spam Aplicada:</strong>
              </p>
              <ul style="margin: 10px 0 0 0; color: #155724;">
                <li>Headers de prioridad configurados</li>
                <li>Reply-To configurado</li>
                <li>Categorías y customArgs definidos</li>
                <li>HTML y texto plano incluidos</li>
                <li>Estructura HTML optimizada</li>
              </ul>
            </div>
            
            <p>Si recibes este email en tu bandeja de entrada (no en spam), la configuración está funcionando correctamente.</p>
            
            <div style="border-top: 1px solid #dee2e6; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
              <p style="margin: 0;">Timestamp: ${new Date().toISOString()}</p>
              <p style="margin: 5px 0 0 0;">Test ID: anti-spam-test</p>
            </div>
          </div>
        </body>
        </html>
      `,
      // Versión de texto plano para evitar spam
      text: `
Prueba Anti-Spam - DEdecor

Este es un email de prueba para verificar que la configuración anti-spam funciona correctamente.

Configuración Anti-Spam Aplicada:
- Headers de prioridad configurados
- Reply-To configurado
- Categorías y customArgs definidos
- HTML y texto plano incluidos
- Estructura HTML optimizada

Si recibes este email en tu bandeja de entrada (no en spam), la configuración está funcionando correctamente.

Timestamp: ${new Date().toISOString()}
Test ID: anti-spam-test
      `
    };
    
    console.log('📤 Enviando email de prueba con configuración anti-spam...');
    const result = await sgMail.send(msg);
    
    console.log('✅ Email enviado exitosamente');
    console.log('📊 Resultado:', result);
    console.log('📧 Revisa tu email: rhzamora144@gmail.com');
    console.log('');
    console.log('🎯 CONFIGURACIÓN ANTI-SPAM APLICADA:');
    console.log('  ✅ Headers de prioridad');
    console.log('  ✅ Reply-To configurado');
    console.log('  ✅ Categorías y customArgs');
    console.log('  ✅ HTML y texto plano');
    console.log('  ✅ Estructura optimizada');
    console.log('');
    console.log('📋 PRÓXIMOS PASOS:');
    console.log('1. Revisa tu bandeja de entrada');
    console.log('2. Si llega a spam, marca como "No es spam"');
    console.log('3. Agrega dedecorinfo@gmail.com a contactos');
    console.log('4. Configura filtros en Gmail si es necesario');
    
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

testAntiSpamEmail();
