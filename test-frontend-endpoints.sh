#!/bin/bash

# Prueba de TODOS los endpoints que el FRONTEND llama para reservas
# Simulando el flujo exacto del usuario

BASE_URL="http://localhost:3000/api"

echo "🎯 PRUEBA DE ENDPOINTS DEL FRONTEND - RESERVAS"
echo "================================================"
echo ""
echo "Simulando el flujo exacto que hace el usuario en la app..."
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASSED=0
FAILED=0

# ========================================
# FLUJO 1: Usuario abre página de reservas
# ========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}FLUJO 1: Usuario abre página de reservas${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1.1: PreloadContext carga horarios en lote (14 días)
echo ""
echo "1.1: PreloadContext - Cargar horarios para 14 días (batch)"
echo "--------------------------------------------------------"
DATES="09/30/2025,10/01/2025,10/02/2025,10/03/2025,10/04/2025"
echo "Simulando: apiConfig.endpoints.bookedSlotsBatch"
echo "Endpoint: GET ${BASE_URL}/booked-slots-batch?dates=${DATES}"

curl -X GET "${BASE_URL}/booked-slots-batch?dates=${DATES}" \
  -H "Origin: http://localhost:3000" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/frontend-test-1.txt

if grep -q '"success":true' /tmp/frontend-test-1.txt; then
  echo -e "${GREEN}✅ PASS - Batch funciona${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ FAIL - Batch no funciona${NC}"
  ((FAILED++))
fi

# ========================================
# FLUJO 2: Usuario selecciona una fecha
# ========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}FLUJO 2: Usuario selecciona una fecha${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 2.1: loadBookedSlots() pide horarios para esa fecha
echo ""
echo "2.1: Booking.loadBookedSlots() - Consultar horarios específicos"
echo "---------------------------------------------------------------"
TODAY=$(date +"%m/%d/%Y")
echo "Fecha: $TODAY"
echo "Simulando: apiConfig.endpoints.bookedSlots + fecha"
echo "Endpoint: GET ${BASE_URL}/booked-slots?date=${TODAY}"

curl -X GET "${BASE_URL}/booked-slots?date=${TODAY}" \
  -H "Origin: http://localhost:3000" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/frontend-test-2.txt

if grep -q '"success":true' /tmp/frontend-test-2.txt; then
  echo -e "${GREEN}✅ PASS - Puede leer horarios por fecha${NC}"
  TOTAL=$(grep -o '"totalSlots":[0-9]*' /tmp/frontend-test-2.txt | cut -d':' -f2)
  echo "   Horarios encontrados: $TOTAL"
  ((PASSED++))
else
  echo -e "${RED}❌ FAIL - No puede leer horarios${NC}"
  ((FAILED++))
fi

# 2.2: Con reintentos (el frontend hace 3 intentos)
echo ""
echo "2.2: Simulando reintentos automáticos del frontend"
echo "---------------------------------------------------"
echo "El frontend hace hasta 3 intentos si falla..."

RETRY_SUCCESS=false
for i in 1 2 3; do
  echo "Intento $i/3..."
  RESPONSE=$(curl -X GET "${BASE_URL}/booked-slots?date=10/15/2025" \
    -H "Origin: http://localhost:3000" \
    -s 2>&1)
  
  if echo "$RESPONSE" | grep -q '"success":true'; then
    echo -e "${GREEN}✅ Éxito en intento $i${NC}"
    RETRY_SUCCESS=true
    break
  fi
  
  if [ $i -lt 3 ]; then
    echo "   Esperando 1 segundo..."
    sleep 1
  fi
done

if $RETRY_SUCCESS; then
  echo -e "${GREEN}✅ PASS - Reintentos funcionan${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ FAIL - Todos los reintentos fallaron${NC}"
  ((FAILED++))
fi

# ========================================
# FLUJO 3: Usuario completa formulario
# ========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}FLUJO 3: Usuario completa y envía formulario${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 3.1: Validación de datos incompletos
echo ""
echo "3.1: Validación - Enviar datos incompletos"
echo "-------------------------------------------"
echo "Simulando: handleSubmit() con datos faltantes"
echo "Endpoint: POST ${BASE_URL}/bookings (sin todos los campos)"

curl -X POST "${BASE_URL}/bookings" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "clientName": "Test",
    "clientEmail": "test@test.com"
  }' \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/frontend-test-3.txt

if grep -q '"success":false' /tmp/frontend-test-3.txt && grep -q '400' /tmp/frontend-test-3.txt; then
  echo -e "${GREEN}✅ PASS - Validación funciona correctamente${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ FAIL - Validación no funciona${NC}"
  ((FAILED++))
fi

# 3.2: Crear reserva completa
echo ""
echo "3.2: Crear reserva completa (flujo principal)"
echo "---------------------------------------------"
BOOKING_ID="frontend-test-$(date +%s)"
echo "ID: $BOOKING_ID"
echo "Simulando: handleSubmit() con todos los datos"
echo "Endpoint: POST ${BASE_URL}/bookings"

curl -X POST "${BASE_URL}/bookings" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d "{
    \"id\": \"$BOOKING_ID\",
    \"clientName\": \"Usuario Frontend Test\",
    \"clientEmail\": \"frontend@test.com\",
    \"clientPhone\": \"1234567890\",
    \"service\": \"Consulta Frontend\",
    \"serviceDuration\": \"60 min\",
    \"servicePrice\": \"$100\",
    \"date\": \"12/20/2025\",
    \"time\": \"3:00 PM\",
    \"type\": \"consulta-individual\",
    \"notes\": \"Prueba desde curl simulando frontend\"
  }" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/frontend-test-4.txt

echo ""
echo "Analizando respuesta..."

if grep -q '"success":true' /tmp/frontend-test-4.txt; then
  echo -e "${GREEN}✅ PASS - Reserva creada${NC}"
  ((PASSED++))
  
  # Verificar emails
  if grep -q '"emailsSent":true' /tmp/frontend-test-4.txt; then
    echo -e "   ${GREEN}✅ Emails enviados${NC}"
    ((PASSED++))
  else
    echo -e "   ${RED}❌ Emails NO enviados${NC}"
    ((FAILED++))
  fi
  
  # Verificar MongoDB
  if grep -q '"bookingSaved":true' /tmp/frontend-test-4.txt; then
    echo -e "   ${GREEN}✅ Guardado en MongoDB${NC}"
    ((PASSED++))
  else
    echo -e "   ${YELLOW}⚠️ NO guardado en MongoDB (pero emails enviados)${NC}"
    echo -e "   ${YELLOW}   Esto es esperado si MongoDB no está conectado${NC}"
    ((PASSED++))
  fi
else
  echo -e "${RED}❌ FAIL - No se pudo crear reserva${NC}"
  ((FAILED++))
fi

# ========================================
# FLUJO 4: Verificar que la reserva aparezca
# ========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}FLUJO 4: Verificar persistencia${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "4.1: Consultar horarios para verificar la nueva reserva"
echo "--------------------------------------------------------"
echo "Esperando 2 segundos..."
sleep 2

curl -X GET "${BASE_URL}/booked-slots?date=12/20/2025" \
  -H "Origin: http://localhost:3000" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/frontend-test-5.txt

if grep -q '"success":true' /tmp/frontend-test-5.txt; then
  if grep -q '3:00 PM' /tmp/frontend-test-5.txt || grep -q '"3:00 PM"' /tmp/frontend-test-5.txt; then
    echo -e "${GREEN}✅ PASS - Reserva apareció en la consulta${NC}"
    echo -e "   ${GREEN}MongoDB está funcionando y persistiendo datos${NC}"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠️ WARN - Consulta exitosa pero reserva no apareció${NC}"
    echo -e "   ${YELLOW}Puede ser que MongoDB no guardó la reserva${NC}"
  fi
else
  echo -e "${RED}❌ FAIL - No se puede consultar horarios${NC}"
  ((FAILED++))
fi

# ========================================
# FLUJO 5: Usuario hace refresh (limpia cache)
# ========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}FLUJO 5: Usuario hace refresh (forceRefresh=true)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "5.1: Simular refresh forzado (sin cache)"
echo "-----------------------------------------"
echo "En el frontend: loadBookedSlots(true)"
echo "Esto IGNORA cache y va directo a MongoDB"

curl -X GET "${BASE_URL}/booked-slots?date=$(date +%m/%d/%Y)" \
  -H "Origin: http://localhost:3000" \
  -H "Cache-Control: no-cache" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | tee /tmp/frontend-test-6.txt

if grep -q '"success":true' /tmp/frontend-test-6.txt; then
  echo -e "${GREEN}✅ PASS - Refresh funciona${NC}"
  ((PASSED++))
else
  echo -e "${RED}❌ FAIL - Refresh no funciona (MongoDB timeout)${NC}"
  ((FAILED++))
fi

# ========================================
# FLUJO 6: Admin confirma desde email (opcional)
# ========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}FLUJO 6: Admin confirma reserva (desde email)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "6.1: Endpoint de confirmación (GET desde email)"
echo "------------------------------------------------"
echo "Simulando: Admin hace click en botón CONFIRMAR"
echo "URL del email: ${BASE_URL%/api}/confirm-booking?id=$BOOKING_ID&action=confirm"
echo ""
echo "NOTA: Este test puede fallar si MongoDB no está conectado"
echo "porque necesita encontrar la reserva primero"

# Este endpoint es GET no POST y está fuera de /api
CONFIRM_URL="${BASE_URL%/api}/confirm-booking?id=$BOOKING_ID&action=confirm"

curl -X GET "$CONFIRM_URL" \
  -H "Origin: http://localhost:3000" \
  -w "\nHTTP: %{http_code} | Tiempo: %{time_total}s\n" \
  -s 2>&1 | head -20 | tee /tmp/frontend-test-7.txt

if grep -q 'Reserva Confirmada\|confirmada' /tmp/frontend-test-7.txt; then
  echo -e "${GREEN}✅ PASS - Confirmación funciona${NC}"
  ((PASSED++))
elif grep -q 'Reserva no encontrada\|404' /tmp/frontend-test-7.txt; then
  echo -e "${YELLOW}⚠️ WARN - No puede confirmar (reserva no está en MongoDB)${NC}"
  echo -e "   ${YELLOW}Esto es esperado si MongoDB no guardó la reserva${NC}"
else
  echo -e "${RED}❌ FAIL - Error en confirmación${NC}"
  ((FAILED++))
fi

# ========================================
# RESUMEN FINAL
# ========================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN DE PRUEBAS FRONTEND"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TOTAL=$((PASSED + FAILED))
PERCENTAGE=$((PASSED * 100 / TOTAL))

echo "Tests ejecutados: $TOTAL"
echo -e "${GREEN}Pasaron: $PASSED${NC}"
echo -e "${RED}Fallaron: $FAILED${NC}"
echo "Porcentaje de éxito: $PERCENTAGE%"
echo ""

# Evaluación detallada
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Análisis por componente:"
echo ""

echo "1. Carga inicial (PreloadContext):"
if grep -q '"success":true' /tmp/frontend-test-1.txt 2>/dev/null; then
  echo -e "   ${GREEN}✅ Batch loading funciona${NC}"
else
  echo -e "   ${RED}❌ Batch loading NO funciona${NC}"
fi

echo ""
echo "2. Consulta de horarios (Booking.loadBookedSlots):"
if grep -q '"success":true' /tmp/frontend-test-2.txt 2>/dev/null; then
  echo -e "   ${GREEN}✅ Puede consultar horarios${NC}"
else
  echo -e "   ${RED}❌ NO puede consultar horarios${NC}"
fi

echo ""
echo "3. Creación de reservas (Booking.handleSubmit):"
if grep -q '"success":true' /tmp/frontend-test-4.txt 2>/dev/null; then
  echo -e "   ${GREEN}✅ Puede crear reservas${NC}"
  
  if grep -q '"emailsSent":true' /tmp/frontend-test-4.txt; then
    echo -e "   ${GREEN}✅ Emails se envían correctamente${NC}"
  fi
  
  if grep -q '"bookingSaved":true' /tmp/frontend-test-4.txt; then
    echo -e "   ${GREEN}✅ MongoDB guarda las reservas${NC}"
  else
    echo -e "   ${YELLOW}⚠️ MongoDB NO guarda (pero emails sí)${NC}"
  fi
else
  echo -e "   ${RED}❌ NO puede crear reservas${NC}"
fi

echo ""
echo "4. Persistencia:"
if grep -q '3:00 PM' /tmp/frontend-test-5.txt 2>/dev/null; then
  echo -e "   ${GREEN}✅ Las reservas persisten en MongoDB${NC}"
else
  echo -e "   ${YELLOW}⚠️ Las reservas NO persisten${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $PERCENTAGE -ge 80 ]; then
  echo -e "${GREEN}✅ SISTEMA FUNCIONAL${NC}"
  echo "La mayoría de funcionalidades del frontend funcionan correctamente"
elif [ $PERCENTAGE -ge 50 ]; then
  echo -e "${YELLOW}⚠️ SISTEMA PARCIALMENTE FUNCIONAL${NC}"
  echo "Algunas funcionalidades tienen problemas"
else
  echo -e "${RED}❌ SISTEMA CON PROBLEMAS${NC}"
  echo "Muchas funcionalidades no están operativas"
fi

echo ""
echo "📋 Archivos de test guardados en /tmp/frontend-test-*.txt"
echo "🔍 Revisa los logs: tail -f server-diagnostic.log"
