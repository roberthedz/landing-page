/**
 * Prueba alternativa de SendGrid con diferentes configuraciones
 */

const sgMail = require('@sendgrid/mail');

const apiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(apiKey);

async function testAlternativeConfigs() {
  console.log('🧪 PROBANDO CONFIGURACIONES ALTERNATIVAS DE SENDGRID');
  console.log('');

  // Configuración 1: Email de SendGrid (más confiable)
  console.log('📧 Prueba 1: Usando email de SendGrid...');
  try {
    const msg1 = {
      to: 'rhzamora144@gmail.com',
      from: 'noreply@sendgrid.com', // Email oficial de SendGrid
      subject: '🧪 Prueba SendGrid - Email Oficial',
      html: '<p>Prueba con email oficial de SendGrid</p>'
    };
    
    await sgMail.send(msg1);
    console.log('✅ Prueba 1 EXITOSA - Email oficial funciona');
  } catch (error) {
    console.log('❌ Prueba 1 FALLÓ:', error.message);
  }

  console.log('');

  // Configuración 2: Verificar permisos de API Key
  console.log('🔑 Prueba 2: Verificando permisos de API Key...');
  try {
    const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const profile = await response.json();
      console.log('✅ API Key válida - Perfil:', profile.username);
    } else {
      console.log('❌ API Key inválida - Status:', response.status);
    }
  } catch (error) {
    console.log('❌ Error verificando API Key:', error.message);
  }

  console.log('');

  // Configuración 3: Probar con template simple
  console.log('📧 Prueba 3: Email con configuración mínima...');
  try {
    const msg3 = {
      to: 'rhzamora144@gmail.com',
      from: {
        email: 'dedecorinfo@gmail.com',
        name: 'DEdecor'
      },
      subject: '🧪 Prueba Mínima',
      text: 'Prueba con configuración mínima',
      html: '<p>Prueba con configuración mínima</p>'
    };
    
    await sgMail.send(msg3);
    console.log('✅ Prueba 3 EXITOSA - Configuración mínima funciona');
  } catch (error) {
    console.log('❌ Prueba 3 FALLÓ:', error.message);
    if (error.response && error.response.body) {
      console.log('Detalles del error:', error.response.body);
    }
  }
}

testAlternativeConfigs();
