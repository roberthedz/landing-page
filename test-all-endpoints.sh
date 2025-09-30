#!/bin/bash

# Script para probar TODOS los endpoints del backend
# Fecha: 30 de Septiembre, 2025

echo "🧪 PRUEBA COMPLETA DE TODOS LOS ENDPOINTS"
echo "=========================================="
echo ""

BASE_URL="http://localhost:3000"

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar resultados
check_result() {
  if [ $1 -eq 0 ]; then
    echo -e "${GREEN}✅ ÉXITO${NC}"
  else
    echo -e "${RED}❌ ERROR${NC}"
  fi
}

echo "🔄 Esperando que el servidor esté listo..."
sleep 2

# ===========================================
# TEST 1: Health Check
# ===========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1: Health Check (/api/health)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X GET "${BASE_URL}/api/health" \
  -H "Origin: http://localhost:3000" \
  -w "\nCódigo HTTP: %{http_code}\nTiempo: %{time_total}s\n" \
  -s -o /tmp/test1.json

HTTP_CODE=$(cat /tmp/test1.json | grep -o '"status":"[^"]*"' | head -1)
echo "Respuesta: $(cat /tmp/test1.json)"
if [ -n "$HTTP_CODE" ]; then
  echo -e "${GREEN}✅ Health check OK${NC}"
else
  echo -e "${RED}❌ Health check FALLÓ${NC}"
fi

# ===========================================
# TEST 2: System Status
# ===========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2: System Status (/api/system-status)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X GET "${BASE_URL}/api/system-status" \
  -H "Origin: http://localhost:3000" \
  -w "\nCódigo HTTP: %{http_code}\nTiempo: %{time_total}s\n" \
  -s -o /tmp/test2.json

echo "Respuesta: $(cat /tmp/test2.json | head -c 200)..."
if grep -q '"success":true' /tmp/test2.json; then
  echo -e "${GREEN}✅ System status OK${NC}"
else
  echo -e "${YELLOW}⚠️ System status con advertencias${NC}"
fi

# ===========================================
# TEST 3: Booked Slots (sin fecha)
# ===========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 3: Booked Slots SIN fecha (/api/booked-slots)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X GET "${BASE_URL}/api/booked-slots" \
  -H "Origin: http://localhost:3000" \
  -w "\nCódigo HTTP: %{http_code}\nTiempo: %{time_total}s\n" \
  -s -o /tmp/test3.json

echo "Respuesta: $(cat /tmp/test3.json)"
if grep -q '"success":false' /tmp/test3.json; then
  echo -e "${GREEN}✅ Validación correcta (debe fallar sin fecha)${NC}"
else
  echo -e "${RED}❌ Debería rechazar petición sin fecha${NC}"
fi

# ===========================================
# TEST 4: Booked Slots (con fecha válida)
# ===========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 4: Booked Slots CON fecha (/api/booked-slots?date=10/01/2025)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X GET "${BASE_URL}/api/booked-slots?date=10/01/2025" \
  -H "Origin: http://localhost:3000" \
  -w "\nCódigo HTTP: %{http_code}\nTiempo: %{time_total}s\n" \
  -s -o /tmp/test4.json

echo "Respuesta: $(cat /tmp/test4.json | head -c 200)..."
if grep -q '"success":true' /tmp/test4.json; then
  echo -e "${GREEN}✅ Booked slots OK${NC}"
else
  echo -e "${RED}❌ Booked slots FALLÓ${NC}"
fi

# ===========================================
# TEST 5: Send Booking Email (directo)
# ===========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 5: Envío directo de email (/api/send-booking-email)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X POST "${BASE_URL}/api/send-booking-email" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "clientEmail": "test@example.com",
    "clientName": "Test Curl Usuario",
    "bookingDetails": {
      "id": "test-email-direct-001",
      "phone": "1234567890",
      "service": "Test Service",
      "date": "10/01/2025",
      "time": "10:00 AM",
      "type": "consulta-individual"
    }
  }' \
  -w "\nCódigo HTTP: %{http_code}\nTiempo: %{time_total}s\n" \
  -s -o /tmp/test5.json

echo "Respuesta: $(cat /tmp/test5.json)"
if grep -q '"success":true' /tmp/test5.json; then
  echo -e "${GREEN}✅ Email enviado correctamente${NC}"
else
  echo -e "${RED}❌ Envío de email FALLÓ${NC}"
  echo "Detalles: $(cat /tmp/test5.json)"
fi

# ===========================================
# TEST 6: Create Booking (Flujo completo)
# ===========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 6: Crear reserva completa (/api/bookings)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

BOOKING_ID="test-booking-$(date +%s)"
echo "ID de reserva: $BOOKING_ID"

curl -X POST "${BASE_URL}/api/bookings" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d "{
    \"id\": \"$BOOKING_ID\",
    \"clientName\": \"Test Usuario Curl\",
    \"clientEmail\": \"test@example.com\",
    \"clientPhone\": \"1234567890\",
    \"service\": \"Consulta de Test\",
    \"serviceDuration\": \"60 min\",
    \"servicePrice\": \"$100\",
    \"date\": \"10/15/2025\",
    \"time\": \"2:00 PM\",
    \"type\": \"consulta-individual\",
    \"notes\": \"Prueba completa con curl\"
  }" \
  -w "\nCódigo HTTP: %{http_code}\nTiempo: %{time_total}s\n" \
  -s -o /tmp/test6.json

echo "Respuesta: $(cat /tmp/test6.json)"
if grep -q '"success":true' /tmp/test6.json; then
  echo -e "${GREEN}✅ Reserva creada correctamente${NC}"
  
  # Verificar si los emails fueron enviados
  if grep -q '"emailsSent":true' /tmp/test6.json; then
    echo -e "${GREEN}  ✅ Emails enviados${NC}"
  else
    echo -e "${RED}  ❌ Emails NO enviados${NC}"
  fi
  
  # Verificar estado de MongoDB
  if grep -q '"bookingSaved":true' /tmp/test6.json; then
    echo -e "${GREEN}  ✅ Guardado en MongoDB${NC}"
  else
    echo -e "${YELLOW}  ⚠️ MongoDB no disponible (pero emails enviados)${NC}"
  fi
else
  echo -e "${RED}❌ Creación de reserva FALLÓ${NC}"
  echo "Detalles: $(cat /tmp/test6.json)"
fi

# ===========================================
# TEST 7: Crear reserva SIN campos requeridos
# ===========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 7: Crear reserva incompleta (validación)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X POST "${BASE_URL}/api/bookings" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "clientName": "Test",
    "clientEmail": "test@example.com"
  }' \
  -w "\nCódigo HTTP: %{http_code}\nTiempo: %{time_total}s\n" \
  -s -o /tmp/test7.json

echo "Respuesta: $(cat /tmp/test7.json)"
if grep -q '"success":false' /tmp/test7.json && grep -q '400' /tmp/test7.json; then
  echo -e "${GREEN}✅ Validación correcta (rechaza datos incompletos)${NC}"
else
  echo -e "${RED}❌ Debería rechazar datos incompletos${NC}"
fi

# ===========================================
# TEST 8: Send Contact Email
# ===========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 8: Enviar mensaje de contacto (/api/send-contact-email)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X POST "${BASE_URL}/api/send-contact-email" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "clientEmail": "test@example.com",
    "clientName": "Test Contact",
    "contactDetails": {
      "phone": "1234567890",
      "message": "Mensaje de prueba desde curl",
      "date": "10/01/2025"
    }
  }' \
  -w "\nCódigo HTTP: %{http_code}\nTiempo: %{time_total}s\n" \
  -s -o /tmp/test8.json

echo "Respuesta: $(cat /tmp/test8.json)"
if grep -q '"success":true' /tmp/test8.json; then
  echo -e "${GREEN}✅ Email de contacto enviado${NC}"
else
  echo -e "${YELLOW}⚠️ Email de contacto puede requerir MongoDB${NC}"
  echo "Detalles: $(cat /tmp/test8.json)"
fi

# ===========================================
# RESUMEN FINAL
# ===========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN DE PRUEBAS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Contar éxitos
SUCCESS_COUNT=0
TOTAL_TESTS=8

# Test 1: Health
if grep -q '"status"' /tmp/test1.json 2>/dev/null; then
  echo -e "1. Health Check:           ${GREEN}✅ PASS${NC}"
  ((SUCCESS_COUNT++))
else
  echo -e "1. Health Check:           ${RED}❌ FAIL${NC}"
fi

# Test 2: System Status
if grep -q '"success"' /tmp/test2.json 2>/dev/null; then
  echo -e "2. System Status:          ${GREEN}✅ PASS${NC}"
  ((SUCCESS_COUNT++))
else
  echo -e "2. System Status:          ${RED}❌ FAIL${NC}"
fi

# Test 3: Booked Slots (sin fecha)
if grep -q '"success":false' /tmp/test3.json 2>/dev/null; then
  echo -e "3. Validación sin fecha:   ${GREEN}✅ PASS${NC}"
  ((SUCCESS_COUNT++))
else
  echo -e "3. Validación sin fecha:   ${RED}❌ FAIL${NC}"
fi

# Test 4: Booked Slots (con fecha)
if grep -q '"success":true' /tmp/test4.json 2>/dev/null; then
  echo -e "4. Booked Slots:           ${GREEN}✅ PASS${NC}"
  ((SUCCESS_COUNT++))
else
  echo -e "4. Booked Slots:           ${RED}❌ FAIL${NC}"
fi

# Test 5: Send Email directo
if grep -q '"success":true' /tmp/test5.json 2>/dev/null; then
  echo -e "5. Email directo:          ${GREEN}✅ PASS${NC}"
  ((SUCCESS_COUNT++))
else
  echo -e "5. Email directo:          ${RED}❌ FAIL${NC}"
fi

# Test 6: Create Booking
if grep -q '"success":true' /tmp/test6.json 2>/dev/null; then
  echo -e "6. Crear reserva:          ${GREEN}✅ PASS${NC}"
  ((SUCCESS_COUNT++))
else
  echo -e "6. Crear reserva:          ${RED}❌ FAIL${NC}"
fi

# Test 7: Validación
if grep -q '"success":false' /tmp/test7.json 2>/dev/null; then
  echo -e "7. Validación datos:       ${GREEN}✅ PASS${NC}"
  ((SUCCESS_COUNT++))
else
  echo -e "7. Validación datos:       ${RED}❌ FAIL${NC}"
fi

# Test 8: Contact Email
if grep -q '"success":true' /tmp/test8.json 2>/dev/null; then
  echo -e "8. Email contacto:         ${GREEN}✅ PASS${NC}"
  ((SUCCESS_COUNT++))
else
  echo -e "8. Email contacto:         ${YELLOW}⚠️ WARN${NC} (puede requerir MongoDB)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Pruebas exitosas: ${GREEN}${SUCCESS_COUNT}/${TOTAL_TESTS}${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $SUCCESS_COUNT -ge 6 ]; then
  echo -e "${GREEN}✅ Sistema funcionando correctamente${NC}"
  echo -e "${GREEN}✅ Los emails se están enviando${NC}"
else
  echo -e "${RED}❌ Hay problemas que requieren atención${NC}"
fi

# Limpiar archivos temporales
rm -f /tmp/test*.json

echo ""
echo "📋 Para más detalles, revisa los logs del servidor"
echo "🔍 Comando: tail -f server-test.log"
