/**
 * Prueba con la configuración corregida de SendGrid
 */

const sgMail = require('@sendgrid/mail');

const apiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(apiKey);

async function testFixedConfiguration() {
  console.log('🧪 PROBANDO CONFIGURACIÓN CORREGIDA DE SENDGRID');
  console.log('');

  try {
    const msg = {
      to: 'rhzamora144@gmail.com',
      from: {
        email: 'dedecorinfo@gmail.com',
        name: 'DEdecor'
      },
      subject: '🎉 ¡SendGrid Funcionando! - ' + new Date().toISOString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">🎉 ¡SendGrid Funcionando!</h2>
          <p>Esta es una prueba con la configuración corregida.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <div style="background: #d4edda; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #155724;">
              ✅ SendGrid está funcionando correctamente con la configuración corregida
            </p>
          </div>
          <p>Ahora los emails del sistema de reservas funcionarán perfectamente.</p>
        </div>
      `
    };
    
    console.log('📤 Enviando email con configuración corregida...');
    const result = await sgMail.send(msg);
    
    console.log('✅ ¡EMAIL ENVIADO EXITOSAMENTE!');
    console.log('📊 Resultado:', result);
    console.log('📧 Revisa tu email: rhzamora144@gmail.com');
    console.log('');
    console.log('🎉 ¡SENDGRID ESTÁ FUNCIONANDO!');
    console.log('Ahora puedes hacer deploy del servidor actualizado.');
    
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

testFixedConfiguration();
