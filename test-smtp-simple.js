// Test simple de conexión SMTP
const nodemailer = require('nodemailer');
const net = require('net');
const dns = require('dns');

console.log('🔍 DIAGNÓSTICO SMTP\n');

// 1. DNS
console.log('1. Verificando DNS...');
dns.resolve4('smtp.gmail.com', (err, addresses) => {
  if (err) {
    console.error('   ❌ DNS Error:', err.message);
  } else {
    console.log('   ✅ DNS OK:', addresses.join(', '));
  }
});

// 2. TCP Connection
console.log('\n2. Probando conexión TCP al puerto 465...');
const socket = net.createConnection(465, 'smtp.gmail.com');
socket.on('connect', () => {
  console.log('   ✅ Puerto 465 ACCESIBLE desde Render');
  socket.end();
});
socket.on('error', (err) => {
  console.error('   ❌ Puerto 465 BLOQUEADO:', err.code);
  console.error('      Esto confirma que Render bloquea SMTP');
});
socket.setTimeout(10000, () => {
  console.error('   ❌ Timeout - Puerto 465 no accesible');
  socket.destroy();
});

// 3. Nodemailer
console.log('\n3. Probando Nodemailer...');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dedecorinfo@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'test'
  }
});

setTimeout(() => {
  transporter.verify((error, success) => {
    if (error) {
      console.error('   ❌ Nodemailer Error:', error.code || error.message);
    } else {
      console.log('   ✅ Nodemailer OK');
    }
    process.exit(0);
  });
}, 2000);
