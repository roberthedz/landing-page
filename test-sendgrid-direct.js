/**
 * Script de prueba directa de SendGrid
 * Para diagnosticar el error 403
 */

const sgMail = require('@sendgrid/mail');

// Configurar SendGrid
const apiKey = process.env.SENDGRID_API_KEY;

if (!apiKey) {
  console.error('❌ SENDGRID_API_KEY no está configurada');
  console.log('Configura la variable de entorno:');
  console.log('export SENDGRID_API_KEY="tu_api_key_aqui"');
  process.exit(1);
}

console.log('🔑 API Key configurada:', apiKey.substring(0, 10) + '...');
sgMail.setApiKey(apiKey);

// Función para probar envío de email
async function testSendGrid() {
  console.log('📧 Probando envío de email con SendGrid...');
  
  try {
    const msg = {
      to: 'rhzamora144@gmail.com', // Tu email para recibir la prueba
      from: 'dedecorinfo@gmail.com', // Email verificado
      subject: '🧪 Prueba de SendGrid - ' + new Date().toISOString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">🧪 Prueba de SendGrid</h2>
          <p>Este es un email de prueba enviado directamente desde la consola.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>API Key:</strong> ${apiKey.substring(0, 10)}...</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #28a745;">
              ✅ Si recibes este email, SendGrid está funcionando correctamente
            </p>
          </div>
        </div>
      `
    };
    
    console.log('📤 Enviando email de prueba...');
    const result = await sgMail.send(msg);
    
    console.log('✅ Email enviado exitosamente!');
    console.log('📊 Resultado:', result);
    console.log('📧 Revisa tu email: rhzamora144@gmail.com');
    
  } catch (error) {
    console.error('❌ Error enviando email:');
    console.error('Código:', error.code);
    console.error('Mensaje:', error.message);
    
    if (error.response) {
      console.error('Respuesta HTTP:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Body:', error.response.body);
    }
    
    // Análisis del error
    if (error.code === 403) {
      console.log('\n🔍 ANÁLISIS DEL ERROR 403:');
      console.log('1. API Key incorrecta o expirada');
      console.log('2. API Key sin permisos de Mail Send');
      console.log('3. Sender email no verificado');
      console.log('4. Cuenta en modo sandbox');
      console.log('5. Límites de envío alcanzados');
    }
  }
}

// Ejecutar prueba
testSendGrid();
