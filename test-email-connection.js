const nodemailer = require('nodemailer');

// Configuración de email (misma que en server-production.js)
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'dedecorinfo@gmail.com',
    pass: process.env.EMAIL_PASS || 'vsblbhiyccryicmr'
  },
  // Configuración adicional para mejorar la conexión
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
  rateDelta: 20000,
  rateLimit: 5
});

console.log('🔍 Probando conexión de email...');
console.log('📧 Usuario:', process.env.EMAIL_USER || 'dedecorinfo@gmail.com');
console.log('🔑 Contraseña:', process.env.EMAIL_PASS ? '***configurada***' : '***hardcoded***');

// Verificar la configuración de email
emailTransporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error en la configuración de email:', error);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verificar que la contraseña de aplicación de Gmail sea válida');
    console.log('2. Habilitar "Acceso de aplicaciones menos seguras" en Gmail');
    console.log('3. Usar OAuth2 en lugar de contraseña de aplicación');
    console.log('4. Verificar que el email tenga 2FA habilitado');
    console.log('\n📋 Para generar nueva contraseña de aplicación:');
    console.log('1. Ir a Google Account > Seguridad');
    console.log('2. Activar 2FA si no está activado');
    console.log('3. Ir a "Contraseñas de aplicaciones"');
    console.log('4. Generar nueva contraseña para "Mail"');
    console.log('5. Usar esa contraseña en lugar de la actual');
  } else {
    console.log('✅ Servidor de email configurado correctamente');
    console.log('📧 Conexión exitosa con Gmail SMTP');
  }
});

// Función para probar envío de email
const testEmailSend = async () => {
  try {
    console.log('\n📤 Probando envío de email de prueba...');
    
    const result = await emailTransporter.sendMail({
      from: '"Test DeDecor" <dedecorinfo@gmail.com>',
      to: 'dedecorinfo@gmail.com',
      subject: '🧪 Email de prueba - Conexión SMTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6163;">🧪 Email de Prueba</h2>
          <p>Este es un email de prueba para verificar que la conexión SMTP funciona correctamente.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Servidor:</strong> Gmail SMTP</p>
          <p>Si recibes este email, la configuración está funcionando correctamente.</p>
        </div>
      `
    });
    
    console.log('✅ Email de prueba enviado exitosamente:', result.messageId);
  } catch (error) {
    console.error('❌ Error al enviar email de prueba:', error);
  }
};

// Ejecutar prueba después de 2 segundos
setTimeout(testEmailSend, 2000);
