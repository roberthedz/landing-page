const mongoose = require('mongoose');

const uri = 'mongodb+srv://rhzamora144:86e6FbGM00uV78RP@cluster0.4vwcokw.mongodb.net/reservas?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔗 Iniciando test de conexión...');
console.log('📍 Cluster: cluster0.4vwcokw.mongodb.net');
console.log('�� Usuario: rhzamora144');
console.log('💾 Base de datos: reservas');
console.log('');
console.log('⏳ Intentando conectar (timeout: 30s)...');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  family: 4
})
.then(() => {
  console.log('');
  console.log('✅ ¡CONEXIÓN EXITOSA!');
  console.log('✅ MongoDB Atlas está funcionando');
  return mongoose.connection.db.admin().listDatabases();
})
.then((result) => {
  console.log('✅ Bases de datos disponibles:', result.databases.map(db => db.name).join(', '));
  process.exit(0);
})
.catch((error) => {
  console.log('');
  console.error('❌ ERROR DE CONEXIÓN');
  console.error('Tipo:', error.name);
  console.error('Mensaje:', error.message);
  console.log('');
  console.log('🔧 DIAGNÓSTICO:');
  
  if (error.message.includes('ECONNREFUSED')) {
    console.log('   - Problema de red o DNS local');
    console.log('   - Intenta:');
    console.log('     1. Cambiar DNS a 8.8.8.8');
    console.log('     2. Desactivar VPN si tienes');
    console.log('     3. Probar desde otra red (hotspot móvil)');
  } else if (error.message.includes('authentication')) {
    console.log('   - Usuario o contraseña incorrectos');
    console.log('   - Verifica credenciales en MongoDB Atlas');
  } else {
    console.log('   - Error desconocido');
    console.log('   - Contacta soporte de MongoDB Atlas');
  }
  
  process.exit(1);
});
