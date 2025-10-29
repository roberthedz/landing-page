const { configureEmail, sendFinalConfirmation } = require('./src/config/emailConfig');

console.log('🔍 Probando configuración de email...');

// Simular variable de entorno
process.env.GMAIL_APP_PASSWORD = 'ihrvuveqsskjxyog';

const emailConfigured = configureEmail();
console.log('Email configurado:', emailConfigured);

if (emailConfigured) {
  console.log('📧 Enviando email de prueba...');
  sendFinalConfirmation({
    clientName: 'Test User',
    clientEmail: 'rhzamora144@gmail.com',
    service: 'Test Service',
    date: '11/02/2025',
    time: '3:00 PM'
  }).then(() => {
    console.log('✅ Email enviado exitosamente');
  }).catch((error) => {
    console.error('❌ Error enviando email:', error.message);
  });
} else {
  console.log('❌ Email no configurado');
}
