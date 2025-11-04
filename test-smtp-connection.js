/**
 * Script de prueba para diagnosticar conexión SMTP
 * Este script prueba la conexión SMTP directamente desde el servidor
 */

const nodemailer = require('nodemailer');
const dns = require('dns');
const net = require('net');

const appPassword = process.env.GMAIL_APP_PASSWORD || 'test';

console.log('🔍 DIAGNÓSTICO PROFUNDO DE CONEXIÓN SMTP');
console.log('==========================================\n');

// 1. Verificar DNS
console.log('1️⃣ VERIFICANDO RESOLUCIÓN DNS...');
dns.resolve4('smtp.gmail.com', (err, addresses) => {
  if (err) {
    console.error('❌ Error resolviendo DNS:', err.message);
  } else {
    console.log('✅ DNS resuelto correctamente:', addresses);
  }
});

// 2. Probar conexión TCP directa
console.log('\n2️⃣ PROBANDO CONEXIÓN TCP DIRECTA...');
const testSocket = net.createConnection(465, 'smtp.gmail.com', () => {
  console.log('✅ Conexión TCP establecida al puerto 465');
  testSocket.end();
});

testSocket.on('error', (err) => {
  console.error('❌ Error en conexión TCP:', err.message);
  console.error('   Código:', err.code);
  console.error('   Esto indica que Render BLOQUEA el puerto 465');
});

testSocket.setTimeout(10000, () => {
  console.error('❌ Timeout en conexión TCP (10 segundos)');
  testSocket.destroy();
  console.error('   Esto indica que Render BLOQUEA o no puede alcanzar el puerto 465');
});

// 3. Probar Nodemailer con diferentes configuraciones
console.log('\n3️⃣ PROBANDO NODEMAILER...');

// Configuración 1: service: 'gmail'
console.log('\n   a) service: gmail');
const transporter1 = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dedecorinfo@gmail.com',
    pass: appPassword
  }
});

transporter1.verify((error, success) => {
  if (error) {
    console.error('   ❌ Error:', error.message);
    console.error('   Código:', error.code);
  } else {
    console.log('   ✅ Conexión exitosa con service: gmail');
  }
});

// Configuración 2: SMTP explícito puerto 465
console.log('\n   b) SMTP explícito puerto 465');
const transporter2 = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'dedecorinfo@gmail.com',
    pass: appPassword
  },
  connectionTimeout: 10000
});

transporter2.verify((error, success) => {
  if (error) {
    console.error('   ❌ Error:', error.message);
    console.error('   Código:', error.code);
  } else {
    console.log('   ✅ Conexión exitosa con puerto 465');
  }
});

// Configuración 3: SMTP explícito puerto 587
console.log('\n   c) SMTP explícito puerto 587');
const transporter3 = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'dedecorinfo@gmail.com',
    pass: appPassword
  },
  connectionTimeout: 10000
});

transporter3.verify((error, success) => {
  if (error) {
    console.error('   ❌ Error:', error.message);
    console.error('   Código:', error.code);
  } else {
    console.log('   ✅ Conexión exitosa con puerto 587');
  }
  
  // Cerrar después de probar todo
  setTimeout(() => {
    console.log('\n📋 RESUMEN DEL DIAGNÓSTICO:');
    console.log('Si todas las conexiones fallan, Render probablemente bloquea SMTP');
    process.exit(0);
  }, 15000);
});

