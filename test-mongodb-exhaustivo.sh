#!/bin/bash

# Prueba EXHAUSTIVA de todos los endpoints relacionados con MongoDB
# Para diagnosticar exactamente qué funciona y qué no

BASE_URL="http://localhost:3000"

echo "🔍 DIAGNÓSTICO EXHAUSTIVO DE MONGODB"
echo "====================================="
echo ""

# Test 1: Intentar leer horarios para HOY
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1: Leer horarios para HOY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TODAY=$(date +"%m/%d/%Y")
echo "Fecha: $TODAY"

curl -X GET "${BASE_URL}/api/booked-slots?date=${TODAY}" \
  -H "Origin: http://localhost:3000" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/mongodb-test1.txt

echo ""
echo "Resultado:"
if grep -q '"success":true' /tmp/mongodb-test1.txt; then
  echo "✅ FUNCIONA - MongoDB respondió correctamente"
  SLOTS=$(grep -o '"bookedSlots":\[.*\]' /tmp/mongodb-test1.txt | head -1)
  echo "Slots encontrados: $SLOTS"
elif grep -q '"success":false' /tmp/mongodb-test1.txt; then
  ERROR=$(grep -o '"error":"[^"]*"' /tmp/mongodb-test1.txt | head -1)
  echo "❌ FALLO - $ERROR"
else
  echo "⚠️ TIMEOUT o error de conexión"
fi

# Test 2: Intentar leer horarios para el futuro
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2: Leer horarios para fecha futura"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
FUTURE_DATE="12/01/2025"
echo "Fecha: $FUTURE_DATE"

curl -X GET "${BASE_URL}/api/booked-slots?date=${FUTURE_DATE}" \
  -H "Origin: http://localhost:3000" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/mongodb-test2.txt

echo ""
echo "Resultado:"
if grep -q '"success":true' /tmp/mongodb-test2.txt; then
  echo "✅ FUNCIONA"
  TOTAL=$(grep -o '"totalSlots":[0-9]*' /tmp/mongodb-test2.txt | head -1)
  echo "MongoDB respondió: $TOTAL"
else
  echo "❌ FALLO"
fi

# Test 3: Intentar leer MÚLTIPLES fechas
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 3: Leer horarios en LOTE (batch)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
DATES="10/01/2025,10/02/2025,10/03/2025"
echo "Fechas: $DATES"

curl -X GET "${BASE_URL}/api/booked-slots-batch?dates=${DATES}" \
  -H "Origin: http://localhost:3000" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/mongodb-test3.txt

echo ""
echo "Resultado:"
if grep -q '"success":true' /tmp/mongodb-test3.txt; then
  echo "✅ FUNCIONA - Consulta batch exitosa"
else
  echo "❌ FALLO - Consulta batch falló"
fi

# Test 4: Verificar estado REAL de MongoDB
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 4: Estado detallado del sistema"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X GET "${BASE_URL}/api/system-status" \
  -H "Origin: http://localhost:3000" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/mongodb-test4.txt

echo ""
echo "Analizando respuesta del sistema..."
if grep -q '"database"' /tmp/mongodb-test4.txt; then
  DB_STATUS=$(grep -o '"status":"[^"]*"' /tmp/mongodb-test4.txt | head -1)
  echo "Estado DB: $DB_STATUS"
  
  if grep -q '"bookings":[0-9]' /tmp/mongodb-test4.txt; then
    BOOKINGS=$(grep -o '"bookings":[0-9]*' /tmp/mongodb-test4.txt | head -1)
    echo "✅ Reservas en DB: $BOOKINGS"
  fi
  
  if grep -q '"bookedSlots":[0-9]' /tmp/mongodb-test4.txt; then
    SLOTS=$(grep -o '"bookedSlots":[0-9]*' /tmp/mongodb-test4.txt | head -1)
    echo "✅ Horarios en DB: $SLOTS"
  fi
fi

# Test 5: Intentar CREAR una reserva y ver si guarda
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 5: Crear reserva de prueba"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TEST_ID="diagnostic-test-$(date +%s)"
echo "ID: $TEST_ID"

curl -X POST "${BASE_URL}/api/bookings" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d "{
    \"id\": \"$TEST_ID\",
    \"clientName\": \"Diagnostic Test\",
    \"clientEmail\": \"diagnostic@test.com\",
    \"clientPhone\": \"0000000000\",
    \"service\": \"Test Service\",
    \"serviceDuration\": \"60 min\",
    \"servicePrice\": \"$0\",
    \"date\": \"12/31/2025\",
    \"time\": \"11:00 AM\",
    \"type\": \"consulta-individual\",
    \"notes\": \"Prueba diagnóstica\"
  }" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/mongodb-test5.txt

echo ""
echo "Analizando resultado de creación..."
if grep -q '"success":true' /tmp/mongodb-test5.txt; then
  echo "✅ Reserva procesada"
  
  if grep -q '"emailsSent":true' /tmp/mongodb-test5.txt; then
    echo "  ✅ Emails enviados"
  fi
  
  if grep -q '"bookingSaved":true' /tmp/mongodb-test5.txt; then
    echo "  ✅ GUARDADO EN MONGODB"
  elif grep -q '"bookingSaved":false' /tmp/mongodb-test5.txt; then
    echo "  ❌ NO guardado en MongoDB"
  fi
fi

# Test 6: Verificar si la reserva quedó guardada
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 6: Verificar persistencia"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Esperando 2 segundos..."
sleep 2

curl -X GET "${BASE_URL}/api/booked-slots?date=12/31/2025" \
  -H "Origin: http://localhost:3000" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/mongodb-test6.txt

echo ""
if grep -q '"11:00 AM"' /tmp/mongodb-test6.txt || grep -q '11:00 AM' /tmp/mongodb-test6.txt; then
  echo "✅ LA RESERVA SE GUARDÓ Y SE PUEDE LEER DE MONGODB"
else
  echo "❌ La reserva NO apareció en la consulta"
fi

# Test 7: Probar health check con detalle
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 7: Health check detallado"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X GET "${BASE_URL}/api/health" \
  -H "Origin: http://localhost:3000" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/mongodb-test7.txt

echo ""
if grep -q '"mongodb":"connected"' /tmp/mongodb-test7.txt; then
  echo "✅ MongoDB reporta: CONECTADO"
  
  if grep -q '"reservas"' /tmp/mongodb-test7.txt; then
    TOTAL=$(grep -o '"reservas":[0-9]*' /tmp/mongodb-test7.txt | head -1)
    echo "   Total reservas: $TOTAL"
  fi
  
  if grep -q '"horarios"' /tmp/mongodb-test7.txt; then
    TOTAL=$(grep -o '"horarios":[0-9]*' /tmp/mongodb-test7.txt | head -1)
    echo "   Total horarios: $TOTAL"
  fi
  
  if grep -q '"ultimasReservas"' /tmp/mongodb-test7.txt; then
    echo "   ✅ Puede listar reservas recientes"
  fi
elif grep -q '"mongodb":"disconnected"' /tmp/mongodb-test7.txt; then
  echo "❌ MongoDB reporta: DESCONECTADO"
else
  echo "⚠️ Estado de MongoDB: INDETERMINADO"
fi

# RESUMEN FINAL
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN DEL DIAGNÓSTICO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PASSED=0
TOTAL=7

# Evaluar cada test
echo "Resultados por test:"

if grep -q '"success":true' /tmp/mongodb-test1.txt 2>/dev/null; then
  echo "  Test 1 (Leer HOY):      ✅ PASS"
  ((PASSED++))
else
  echo "  Test 1 (Leer HOY):      ❌ FAIL"
fi

if grep -q '"success":true' /tmp/mongodb-test2.txt 2>/dev/null; then
  echo "  Test 2 (Leer futuro):   ✅ PASS"
  ((PASSED++))
else
  echo "  Test 2 (Leer futuro):   ❌ FAIL"
fi

if grep -q '"success":true' /tmp/mongodb-test3.txt 2>/dev/null; then
  echo "  Test 3 (Leer batch):    ✅ PASS"
  ((PASSED++))
else
  echo "  Test 3 (Leer batch):    ❌ FAIL"
fi

if grep -q '"database"' /tmp/mongodb-test4.txt 2>/dev/null; then
  echo "  Test 4 (System status): ✅ PASS"
  ((PASSED++))
else
  echo "  Test 4 (System status): ❌ FAIL"
fi

if grep -q '"success":true' /tmp/mongodb-test5.txt 2>/dev/null; then
  echo "  Test 5 (Crear):         ✅ PASS"
  ((PASSED++))
else
  echo "  Test 5 (Crear):         ❌ FAIL"
fi

if grep -q '11:00 AM' /tmp/mongodb-test6.txt 2>/dev/null; then
  echo "  Test 6 (Persistencia):  ✅ PASS"
  ((PASSED++))
else
  echo "  Test 6 (Persistencia):  ❌ FAIL"
fi

if grep -q '"mongodb"' /tmp/mongodb-test7.txt 2>/dev/null; then
  echo "  Test 7 (Health):        ✅ PASS"
  ((PASSED++))
else
  echo "  Test 7 (Health):        ❌ FAIL"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Score: $PASSED/$TOTAL tests pasaron"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $PASSED -ge 5 ]; then
  echo "✅ MongoDB está FUNCIONANDO (mayoría de tests pasaron)"
elif [ $PASSED -ge 3 ]; then
  echo "⚠️ MongoDB está PARCIALMENTE funcional"
else
  echo "❌ MongoDB está FALLANDO (mayoría de tests fallaron)"
fi

echo ""
echo "📋 Archivos de diagnóstico guardados en /tmp/mongodb-test*.txt"
echo "🔍 Revisa los logs del servidor: tail -f server-diagnostic.log"
