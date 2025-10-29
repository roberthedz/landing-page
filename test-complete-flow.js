/**
 * Script para probar el flujo completo de reserva
 * 1. Crear reserva
 * 2. Simular clic en botón de confirmar
 * 3. Verificar que se envíe email al cliente
 */

const axios = require('axios');

const API_BASE = 'https://landing-page-1-77xa.onrender.com';

async function testCompleteFlow() {
  console.log('🧪 PROBANDO FLUJO COMPLETO DE RESERVA');
  console.log('====================================');
  
  try {
    // 1. Crear una reserva de prueba
    console.log('\n1️⃣ Creando reserva de prueba...');
    const bookingId = 'TEST-FLOW-' + Date.now();
    const bookingData = {
      id: bookingId,
      clientName: 'Cliente Test Flow',
      clientEmail: 'dedecorinfo@gmail.com', // Para recibir el email
      clientPhone: '555-0123',
      service: 'Consulta de Prueba Flow',
      date: '10/04/2025',
      time: '3:00 PM',
      notes: 'Prueba de flujo completo'
    };
    
    const bookingResponse = await axios.post(`${API_BASE}/api/bookings`, bookingData);
    console.log('   - Respuesta de reserva:', bookingResponse.data);
    
    if (!bookingResponse.data.success) {
      throw new Error('Error creando reserva: ' + bookingResponse.data.error);
    }
    
    console.log('   - ID de reserva creada:', bookingId);
    
    // 2. Simular clic en botón de confirmar
    console.log('\n2️⃣ Simulando clic en botón de confirmar...');
    const confirmUrl = `${API_BASE}/confirm-booking?id=${bookingId}&action=confirm`;
    console.log('   - URL de confirmación:', confirmUrl);
    
    const confirmResponse = await axios.get(confirmUrl);
    console.log('   - Respuesta de confirmación recibida');
    console.log('   - Status:', confirmResponse.status);
    
    // 3. Verificar que la reserva esté confirmada
    console.log('\n3️⃣ Verificando estado de la reserva...');
    const bookingCheckResponse = await axios.get(`${API_BASE}/api/bookings/${bookingId}`);
    console.log('   - Estado de reserva:', bookingCheckResponse.data.booking.status);
    
    if (bookingCheckResponse.data.booking.status === 'confirmed') {
      console.log('✅ Reserva confirmada correctamente');
    } else {
      console.log('❌ Reserva NO fue confirmada');
    }
    
    // 4. Verificar que el horario esté bloqueado
    console.log('\n4️⃣ Verificando que el horario esté bloqueado...');
    const slotsResponse = await axios.get(`${API_BASE}/api/booked-slots-batch?dates=10/04/2025`);
    console.log('   - Horarios bloqueados:', slotsResponse.data.slotsByDate);
    
    const isBlocked = slotsResponse.data.slotsByDate['10/04/2025']?.some(slot => 
      slot.time === '3:00 PM' && slot.bookingId === bookingId
    );
    
    if (isBlocked) {
      console.log('✅ Horario bloqueado correctamente');
    } else {
      console.log('❌ Horario NO fue bloqueado');
    }
    
    console.log('\n🏁 Flujo completo probado');
    console.log('📧 Revisa tu email (dedecorinfo@gmail.com) para ver si llegó la confirmación');
    
  } catch (error) {
    console.error('❌ Error en el flujo:', error.message);
    if (error.response) {
      console.error('   - Status:', error.response.status);
      console.error('   - Data:', error.response.data);
    }
  }
}

// Ejecutar prueba
testCompleteFlow();
