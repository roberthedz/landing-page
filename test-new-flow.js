const axios = require('axios');

console.log('🔍 Probando nuevo flujo de confirmación automática...');

const BASE_URL = 'https://landing-page-534b.onrender.com';

async function testNewFlow() {
  try {
    // Crear una reserva de prueba
    console.log('📝 Creando reserva de prueba...');
    
    const bookingData = {
      id: `test-auto-confirm-${Date.now()}`,
      clientName: 'Roberto Hernández',
      clientEmail: 'roberthernandez144@gmail.com',
      clientPhone: '+1234567890',
      service: 'Decoración de Mesa',
      serviceDuration: '60 min',
      servicePrice: '$50',
      date: '2024-01-31',
      time: '11:00 AM',
      type: 'Decoración de Mesa',
      notes: 'Prueba de confirmación automática'
    };
    
    const createResponse = await axios.post(`${BASE_URL}/api/bookings`, bookingData);
    console.log('✅ Reserva creada:', createResponse.data);
    
    const bookingId = createResponse.data.bookingId;
    console.log('📋 ID de reserva:', bookingId);
    
    // Esperar un momento para que se procese la confirmación automática
    console.log('⏳ Esperando confirmación automática...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar el estado del sistema
    console.log('🔍 Verificando estado del sistema...');
    const statusResponse = await axios.get(`${BASE_URL}/api/system-status`);
    
    // Buscar nuestra reserva en las últimas reservas
    const ultimasReservas = statusResponse.data.ultimosReservas || [];
    const nuestraReserva = ultimasReservas.find(r => r.id === bookingId);
    
    if (nuestraReserva) {
      console.log('📊 Estado de la reserva:', {
        id: nuestraReserva.id,
        cliente: nuestraReserva.cliente,
        estado: nuestraReserva.estado,
        fecha: nuestraReserva.fecha,
        hora: nuestraReserva.hora
      });
      
      if (nuestraReserva.estado === 'confirmed') {
        console.log('🎉 ¡ÉXITO! La reserva se confirmó automáticamente');
        console.log('📧 Los emails de confirmación deberían haberse enviado');
      } else {
        console.log('⚠️ La reserva no se confirmó automáticamente. Estado:', nuestraReserva.estado);
      }
    } else {
      console.log('❌ No se encontró la reserva en el sistema');
    }
    
    console.log('\n📧 Revisa los emails en:');
    console.log('   - dedecorinfo@gmail.com (admin)');
    console.log('   - roberthernandez144@gmail.com (cliente)');
    
  } catch (error) {
    console.error('❌ Error en el flujo:', error.message);
    if (error.response) {
      console.error('📄 Respuesta del servidor:', error.response.data);
    }
  }
}

// Ejecutar prueba
testNewFlow();
