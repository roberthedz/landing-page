const mongoose = require('mongoose');

// Intentar con URI estándar (sin srv)
const uris = [
  // URI con SRV (la actual)
  'mongodb+srv://rhzamora144:86e6FbGM00uV78RP@cluster0.4vwcokw.mongodb.net/reservas?retryWrites=true&w=majority',
  // URI directa (sin SRV) - probamos los 3 nodos del replica set
  'mongodb://rhzamora144:86e6FbGM00uV78RP@cluster0-shard-00-00.4vwcokw.mongodb.net:27017,cluster0-shard-00-01.4vwcokw.mongodb.net:27017,cluster0-shard-00-02.4vwcokw.mongodb.net:27017/reservas?ssl=true&replicaSet=atlas-123abc-shard-0&authSource=admin&retryWrites=true&w=majority'
];

console.log('🔗 Probando conexión directa (sin SRV)...\n');

async function testConnection(uri, index) {
  console.log(`Intento ${index + 1}: ${uri.includes('srv') ? 'Con SRV' : 'Sin SRV (directo)'}`);
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      family: 4
    });
    
    console.log('✅ ¡FUNCIONA CON ESTA URI!\n');
    console.log('URI que funciona:');
    console.log(uri.replace(/:[^:@]*@/, ':***@'));
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.log(`❌ Falló: ${error.message}\n`);
    await mongoose.disconnect();
    return false;
  }
}

(async () => {
  for (let i = 0; i < uris.length; i++) {
    const result = await testConnection(uris[i], i);
    if (result !== false) break;
  }
  
  console.log('❌ Ninguna URI funcionó. Problema de red/DNS confirmado.');
  process.exit(1);
})();
