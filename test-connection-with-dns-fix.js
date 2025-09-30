const mongoose = require('mongoose');
const dns = require('dns');

// Forzar uso de DNS de Google
dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = 'mongodb+srv://rhzamora144:86e6FbGM00uV78RP@cluster0.4vwcokw.mongodb.net/reservas?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔗 Iniciando test con DNS de Google forzado...');
console.log('📡 DNS Servers:', dns.getServers());
console.log('');
console.log('⏳ Intentando conectar...');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  family: 4
})
.then(() => {
  console.log('');
  console.log('✅ ¡CONEXIÓN EXITOSA!');
  console.log('✅ MongoDB Atlas está funcionando');
  return mongoose.connection.db.admin().ping();
})
.then(() => {
  console.log('✅ Ping exitoso - Base de datos responde');
  console.log('');
  console.log('🎉 ¡PROBLEMA RESUELTO!');
  console.log('Puedes iniciar el servidor ahora.');
  process.exit(0);
})
.catch((error) => {
  console.log('');
  console.error('❌ ERROR:', error.message);
  console.log('');
  console.log('El problema persiste. Necesitas cambiar DNS del sistema.');
  process.exit(1);
});
