const nodemailer = require('nodemailer');

// Configuración del transportador de email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dedecorinfo@gmail.com',
    pass: 'DEdecor25!'
  },
  tls: {
    rejectUnauthorized: false
  },
  secure: true
});

// Función para enviar un email de prueba
async function sendTestEmail() {
  try {
    // Enviar email
    const info = await transporter.sendMail({
      from: '"Sistema de Reservas DeDecor" <dedecorinfo@gmail.com>',
      to: 'dedecorinfo@gmail.com', // Enviar a la misma dirección para prueba
      subject: 'Email de prueba - Sistema de Reservas',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a6163;">Email de Prueba</h2>
          <p>Este es un email de prueba para verificar la configuración de Nodemailer.</p>
          <p>Si estás recibiendo este email, significa que la configuración es correcta.</p>
          <p>Fecha y hora de envío: ${new Date().toLocaleString()}</p>
        </div>
      `
    });

    console.log('Email enviado correctamente:', info.messageId);
  } catch (error) {
    console.error('Error al enviar el email:', error);
  }
}

// Ejecutar la función
sendTestEmail(); 