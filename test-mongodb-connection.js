const { connectDB, disconnectDB } = require('./src/config/database');
const Booking = require('./src/models/Booking');
const BookedSlot = require('./src/models/BookedSlot');
const ContactMessage = require('./src/models/ContactMessage');

async function testMongoDBConnection() {
  console.log('🧪 Iniciando prueba de conexión a MongoDB Atlas...\n');
  
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log('✅ Conexión exitosa a MongoDB Atlas\n');
    
    // Prueba 1: Crear una reserva de prueba
    console.log('📝 Prueba 1: Creando reserva de prueba...');
    const testBooking = new Booking({
      id: `test-booking-${Date.now()}`,
      status: 'pending',
      clientName: 'Cliente de Prueba',
      clientEmail: 'test@example.com',
      clientPhone: '+1234567890',
      service: 'Consulta de Prueba',
      serviceDuration: '60 min',
      servicePrice: '$100',
      date: '15/07/2024',
      time: '10:00 AM',
      type: 'consulta',
      notes: 'Esta es una reserva de prueba'
    });
    
    await testBooking.save();
    console.log('✅ Reserva de prueba creada exitosamente');
    console.log(`   ID: ${testBooking.id}`);
    console.log(`   Cliente: ${testBooking.clientName}\n`);
    
    // Prueba 2: Crear un horario ocupado
    console.log('⏰ Prueba 2: Creando horario ocupado...');
    const testSlot = new BookedSlot({
      date: '15/07/2024',
      time: '10:00 AM',
      bookingId: testBooking.id,
      reason: 'Consulta de prueba'
    });
    
    await testSlot.save();
    console.log('✅ Horario ocupado creado exitosamente');
    console.log(`   Fecha: ${testSlot.date} a las ${testSlot.time}\n`);
    
    // Prueba 3: Crear un mensaje de contacto
    console.log('💬 Prueba 3: Creando mensaje de contacto...');
    const testMessage = new ContactMessage({
      id: `test-message-${Date.now()}`,
      clientName: 'Cliente de Prueba',
      clientEmail: 'test@example.com',
      phone: '+1234567890',
      message: 'Este es un mensaje de prueba para verificar la conexión',
      date: new Date().toLocaleDateString()
    });
    
    await testMessage.save();
    console.log('✅ Mensaje de contacto creado exitosamente');
    console.log(`   Mensaje: ${testMessage.message}\n`);
    
    // Prueba 4: Verificar que los datos se guardaron
    console.log('🔍 Prueba 4: Verificando datos guardados...');
    
    const bookingCount = await Booking.countDocuments();
    const slotCount = await BookedSlot.countDocuments();
    const messageCount = await ContactMessage.countDocuments();
    
    console.log(`✅ Datos verificados:`);
    console.log(`   Reservas en BD: ${bookingCount}`);
    console.log(`   Horarios ocupados: ${slotCount}`);
    console.log(`   Mensajes de contacto: ${messageCount}\n`);
    
    // Limpiar datos de prueba
    console.log('🧹 Limpiando datos de prueba...');
    await Booking.deleteOne({ id: testBooking.id });
    await BookedSlot.deleteOne({ _id: testSlot._id });
    await ContactMessage.deleteOne({ id: testMessage.id });
    console.log('✅ Datos de prueba eliminados\n');
    
    console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('🔗 MongoDB Atlas está funcionando correctamente');
    console.log('✨ Tu sistema de reservas está listo para producción\n');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verifica que MONGODB_URI esté configurada correctamente');
    console.log('2. Asegúrate de que tu cluster esté activo en MongoDB Atlas');
    console.log('3. Confirma que permitiste acceso desde cualquier IP');
    console.log('4. Revisa que la contraseña en la cadena de conexión sea correcta');
  } finally {
    // Desconectar
    await disconnectDB();
    console.log('👋 Desconectado de MongoDB Atlas');
    process.exit(0);
  }
}

// Ejecutar las pruebas
testMongoDBConnection(); 