const mongoose = require('mongoose');

// Configuración de MongoDB Atlas
const connectDB = async () => {
  try {
    // URL de conexión directa a MongoDB Atlas
    const mongoUri = 'mongodb+srv://rhzamora144:86e6FbGM00uV78RP@cluster0.4vwcokw.mongodb.net/reservas?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('🔗 Conectando a MongoDB Atlas...');
    
    // Conectar a MongoDB Atlas
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout después de 5s en lugar de 30s
      socketTimeoutMS: 45000, // Cerrar sockets después de 45s de inactividad
      maxPoolSize: 10, // Mantener hasta 10 conexiones de socket
      serverSelectionTimeoutMS: 5000, // Timeout de selección de servidor
      socketTimeoutMS: 45000, // Timeout de socket
      family: 4 // Usar IPv4, omitir IPv6
    });
    
    console.log('✅ Conectado a MongoDB Atlas exitosamente');
    
    // Manejar eventos de conexión
    mongoose.connection.on('connected', () => {
      console.log('🟢 Mongoose conectado a MongoDB Atlas');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Error de conexión MongoDB:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('🔴 Mongoose desconectado de MongoDB Atlas');
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

// Función para desconectar de MongoDB
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('🔴 Desconectado de MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error al desconectar de MongoDB:', error);
  }
};

module.exports = { connectDB, disconnectDB }; 