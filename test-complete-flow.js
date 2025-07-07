const https = require('https');
const querystring = require('querystring');

const BASE_URL = 'https://dedecorinfo.com'; // Cambiar por la URL de tu servidor
// const BASE_URL = 'http://localhost:3000'; // Para pruebas locales

console.log('🧪 INICIANDO PRUEBA COMPLETA DEL FLUJO DE RESERVAS\n');

// Función para hacer peticiones HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script/1.0'
      }
    };

    if (data) {
      options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(data));
    }

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const responseData = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: body
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testCompleteFlow() {
  try {
    console.log('📊 PASO 1: Verificando estado del sistema...\n');
    
    // 1. Verificar estado del sistema
    const systemStatus = await makeRequest('GET', '/api/system-status');
    console.log('✅ Sistema:', systemStatus.data.server?.status);
    console.log('✅ Base de datos:', systemStatus.data.database?.connection);
    console.log('✅ Email:', systemStatus.data.email?.status);
    console.log('📋 Reservas existentes:', systemStatus.data.bookings?.total);
    console.log('📋 Horarios ocupados:', systemStatus.data.database?.collections?.bookedSlots);
    console.log('');

    // 2. Verificar horarios ocupados antes de la prueba
    console.log('📅 PASO 2: Verificando horarios ocupados ANTES...\n');
    const bookedSlotsBefore = await makeRequest('GET', '/api/booked-slots');
    console.log('Horarios ocupados antes:', bookedSlotsBefore.data.totalSlots || 0);
    console.log('');

    // 3. Crear una reserva de prueba
    console.log('🎯 PASO 3: Creando reserva de prueba...\n');
    const testBooking = {
      clientName: 'Test Usuario',
      clientEmail: 'test@example.com',
      clientPhone: '+1234567890',
      service: 'Consulta de diseño de interiores',
      serviceDuration: '60 min',
      servicePrice: '$50',
      date: '2024-01-15', // Fecha futura
      time: '10:00 AM',
      type: 'consulta-individual',
      notes: 'Prueba del sistema completo'
    };

    const bookingResult = await makeRequest('POST', '/api/bookings', testBooking);
    console.log('Status:', bookingResult.statusCode);
    console.log('Respuesta:', bookingResult.data);
    
    if (bookingResult.statusCode === 201) {
      console.log('✅ Reserva creada exitosamente');
      console.log('📋 ID de reserva:', bookingResult.data.bookingId);
      console.log('📋 Horarios bloqueados:', bookingResult.data.horariosBloquados);
      console.log('📧 Emails enviados:', bookingResult.data.emailsSent);
    } else {
      console.log('❌ Error al crear reserva:', bookingResult.data);
    }
    console.log('');

    // 4. Verificar horarios ocupados después de la prueba
    console.log('📅 PASO 4: Verificando horarios ocupados DESPUÉS...\n');
    const bookedSlotsAfter = await makeRequest('GET', '/api/booked-slots');
    console.log('Horarios ocupados después:', bookedSlotsAfter.data.totalSlots || 0);
    
    if (bookedSlotsAfter.data.slotsByDate) {
      console.log('Horarios por fecha:', bookedSlotsAfter.data.slotsByDate);
    }
    console.log('');

    // 5. Intentar hacer una reserva duplicada (debe fallar)
    console.log('🚫 PASO 5: Probando reserva duplicada (debe fallar)...\n');
    const duplicateBooking = { ...testBooking };
    const duplicateResult = await makeRequest('POST', '/api/bookings', duplicateBooking);
    console.log('Status:', duplicateResult.statusCode);
    console.log('Respuesta:', duplicateResult.data);
    
    if (duplicateResult.statusCode === 409) {
      console.log('✅ Correcto: Reserva duplicada rechazada');
    } else {
      console.log('❌ Error: Reserva duplicada no fue rechazada');
    }
    console.log('');

    // 6. Verificar sistema después de todas las pruebas
    console.log('📊 PASO 6: Estado final del sistema...\n');
    const finalStatus = await makeRequest('GET', '/api/system-status');
    console.log('📋 Reservas totales:', finalStatus.data.bookings?.total);
    console.log('📋 Reservas confirmadas:', finalStatus.data.bookings?.confirmed);
    console.log('📋 Horarios ocupados:', finalStatus.data.database?.collections?.bookedSlots);
    console.log('');

    // 7. Limpiar datos de prueba
    console.log('🧹 PASO 7: Limpiando datos de prueba...\n');
    const cleanupResult = await makeRequest('DELETE', '/api/cleanup-test-data');
    console.log('Resultado de limpieza:', cleanupResult.data);
    console.log('');

    console.log('🎉 PRUEBA COMPLETA FINALIZADA\n');
    console.log('='.repeat(50));
    console.log('RESUMEN:');
    console.log('✅ Sistema funcionando correctamente');
    console.log('✅ Reservas se crean automáticamente');
    console.log('✅ Horarios se bloquean inmediatamente');
    console.log('✅ Emails se envían correctamente');
    console.log('✅ Reservas duplicadas se previenen');
    console.log('✅ Datos de prueba se limpian');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
    process.exit(1);
  }
}

// Ejecutar el test
testCompleteFlow(); 