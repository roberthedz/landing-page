/**
 * Script para probar el flujo completo de reservas
 * 
 * Este script simula:
 * 1. Un cliente haciendo una reserva
 * 2. La empresa confirmando la reserva
 * 3. Verificación de que el horario queda ocupado
 */

const axios = require('axios');

// URL base de la API
const API_URL = 'http://localhost:3000/api';

// Datos de prueba
const testBooking = {
  clientName: 'Cliente de Prueba',
  clientEmail: 'cliente@example.com',
  clientPhone: '123-456-7890',
  service: 'ChairCraft Revive',
  servicePrice: '$99',
  date: '15/08/2023',
  time: '10:00',
  type: 'presencial',
  notes: 'Esta es una reserva de prueba'
};

// Función para probar el flujo completo
async function testBookingFlow() {
  console.log('=== INICIANDO PRUEBA DE FLUJO DE RESERVAS ===');
  
  try {
    // 1. Crear una nueva reserva
    console.log('\n1. Creando una nueva reserva...');
    const bookingData = {
      clientName: 'Cliente Prueba',
      clientEmail: 'cliente@ejemplo.com',
      clientPhone: '123456789',
      service: 'ChairCraft Revive',
      servicePrice: '$99',
      date: '15/08/2023',
      time: '10:00',
      type: 'presencial',
      notes: 'Esta es una reserva de prueba'
    };
    
    const createResponse = await axios.post(`${API_URL}/bookings`, bookingData);
    
    if (!createResponse.data.success) {
      throw new Error('Error al crear la reserva');
    }
    
    const bookingId = createResponse.data.bookingId;
    console.log(`   ✓ Reserva creada con ID: ${bookingId}`);
    
    // 2. Enviar emails de notificación
    console.log('\n2. Enviando emails de notificación...');
    const emailData = {
      clientName: bookingData.clientName,
      clientEmail: bookingData.clientEmail,
      bookingDetails: {
        service: bookingData.service,
        date: bookingData.date,
        time: bookingData.time,
        phone: bookingData.clientPhone,
        type: bookingData.type,
        notes: bookingData.notes
      },
      confirmUrl: `http://localhost:3000/confirm-booking?id=${bookingId}&action=confirm`,
      rejectUrl: `http://localhost:3000/confirm-booking?id=${bookingId}&action=reject`
    };
    
    const emailResponse = await axios.post(`${API_URL}/send-booking-email`, emailData);
    
    if (!emailResponse.data.success) {
      throw new Error('Error al enviar emails de notificación');
    }
    
    console.log('   ✓ Emails de notificación enviados');
    
    // 3. Verificar horarios ocupados (debería estar vacío aún)
    console.log('\n3. Verificando horarios ocupados (antes de confirmar)...');
    const slotsBeforeResponse = await axios.get(`${API_URL}/booked-slots`);
    console.log(`   ✓ Horarios ocupados: ${slotsBeforeResponse.data.length} (debería ser 0)`);
    
    // 4. Confirmar la reserva
    console.log('\n4. Confirmando la reserva...');
    const confirmResponse = await axios.post(`${API_URL}/bookings/${bookingId}/status`, { action: 'confirm' });
    
    if (!confirmResponse.data.success) {
      throw new Error('Error al confirmar la reserva');
    }
    
    console.log('   ✓ Reserva confirmada exitosamente');
    
    // 5. Verificar horarios ocupados (debería tener uno)
    console.log('\n5. Verificando horarios ocupados (después de confirmar)...');
    const slotsAfterResponse = await axios.get(`${API_URL}/booked-slots`);
    console.log(`   ✓ Horarios ocupados: ${slotsAfterResponse.data.length} (debería ser 1)`);
    
    if (slotsAfterResponse.data.length > 0) {
      const slot = slotsAfterResponse.data[0];
      console.log(`   ✓ Horario ocupado: ${slot.date} a las ${slot.time}`);
    }
    
    // 6. Cancelar la reserva
    console.log('\n6. Cancelando la reserva...');
    const cancelResponse = await axios.post(`${API_URL}/bookings/${bookingId}/cancel`);
    
    if (!cancelResponse.data.success) {
      throw new Error('Error al cancelar la reserva');
    }
    
    console.log('   ✓ Reserva cancelada exitosamente');
    
    // 7. Verificar horarios ocupados después de cancelar (debería estar vacío)
    console.log('\n7. Verificando horarios ocupados (después de cancelar)...');
    const slotsAfterCancelResponse = await axios.get(`${API_URL}/booked-slots`);
    console.log(`   ✓ Horarios ocupados: ${slotsAfterCancelResponse.data.length} (debería ser 0)`);
    
    console.log('\n=== PRUEBA COMPLETADA EXITOSAMENTE ===');
  } catch (error) {
    console.error('\n❌ ERROR EN LA PRUEBA:');
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Datos: ${JSON.stringify(error.response.data)}`);
    } else {
      console.error(`   ${error.message}`);
    }
    console.error('\n=== PRUEBA FALLIDA ===');
  }
}

// Ejecutar la prueba
testBookingFlow(); 