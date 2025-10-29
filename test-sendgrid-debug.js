/**
 * Script de debug para SendGrid
 * Prueba el envío de emails y verifica configuración
 */

const { configureSendGrid, sendFinalConfirmation } = require('./src/config/emailConfig');

async function testSendGrid() {
  console.log('🧪 INICIANDO PRUEBA DE SENDGRID');
  console.log('================================');
  
  // 1. Verificar configuración
  console.log('\n1️⃣ Verificando configuración de SendGrid...');
  const isConfigured = configureSendGrid();
  console.log('   - SendGrid configurado:', isConfigured);
  
  if (!isConfigured) {
    console.log('❌ SendGrid no está configurado. Verifica SENDGRID_API_KEY');
    return;
  }
  
  // 2. Probar envío de email
  console.log('\n2️⃣ Probando envío de email de confirmación...');
  
  const testData = {
    clientName: 'Cliente de Prueba',
    clientEmail: 'dedecorinfo@gmail.com', // Enviar a nosotros para verificar
    service: 'Consulta de Prueba',
    date: '10/03/2025',
    time: '2:00 PM'
  };
  
  try {
    console.log('   - Datos de prueba:', testData);
    const result = await sendFinalConfirmation(testData);
    console.log('   - Resultado:', result);
    console.log('✅ Email enviado exitosamente');
  } catch (error) {
    console.log('❌ Error enviando email:');
    console.log('   - Message:', error.message);
    console.log('   - Code:', error.code);
    console.log('   - Response:', error.response?.body);
    console.log('   - Status:', error.response?.statusCode);
  }
  
  console.log('\n🏁 Prueba completada');
}

// Ejecutar prueba
testSendGrid().catch(console.error);
