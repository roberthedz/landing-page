const sgMail = require('@sendgrid/mail');

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'rhzamora144@gmail.com',
  from: {
    email: 'dedecorinfo@gmail.com',
    name: 'DEdecor Test'
  },
  subject: 'Test Email - SendGrid Directo',
  text: 'Este es un email de prueba enviado directamente desde SendGrid.',
  html: '<p>Este es un <strong>email de prueba</strong> enviado directamente desde SendGrid.</p>'
};

sgMail.send(msg)
  .then(() => {
    console.log('✅ Email enviado exitosamente');
  })
  .catch((error) => {
    console.error('❌ Error enviando email:', error);
  });
