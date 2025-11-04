#!/bin/bash

# Script para probar los endpoints de email vía curl
# Servidor: https://landing-page-1-77xa.onrender.com

SERVER_URL="https://landing-page-1-77xa.onrender.com/api"

echo "🧪 PROBANDO ENDPOINTS DE EMAIL"
echo "================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para probar un endpoint
test_endpoint() {
    local name=$1
    local endpoint=$2
    local data=$3
    
    echo -e "${YELLOW}📧 Probando: ${name}${NC}"
    echo "Endpoint: POST ${endpoint}"
    echo "Datos: ${data}"
    echo ""
    
    response=$(curl -s -w "\n%{http_code}" -X POST "${SERVER_URL}${endpoint}" \
        -H "Content-Type: application/json" \
        -d "${data}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ]; then
        echo -e "${GREEN}✅ ÉXITO (HTTP ${http_code})${NC}"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
    else
        echo -e "${RED}❌ ERROR (HTTP ${http_code})${NC}"
        echo "$body"
    fi
    echo ""
    echo "----------------------------------------"
    echo ""
}

# TEST 1: Email de notificación al ADMIN
echo "TEST 1: Email de notificación al ADMIN"
test_endpoint "Notificación al Admin" "/test/admin-email" '{
  "clientName": "Cliente de Prueba",
  "clientEmail": "cliente@test.com",
  "clientPhone": "1234567890",
  "service": "Servicio de Prueba",
  "date": "11/05/2025",
  "time": "10:00 AM",
  "notes": "Esta es una prueba de email al admin"
}'

sleep 2

# TEST 2: Email de confirmación inicial al CLIENTE
echo "TEST 2: Email de confirmación inicial al CLIENTE"
test_endpoint "Confirmación Inicial Cliente" "/test/client-confirmation" '{
  "clientName": "Cliente de Prueba",
  "clientEmail": "rhzamora144@gmail.com",
  "service": "Servicio de Prueba",
  "date": "11/05/2025",
  "time": "10:00 AM"
}'

sleep 2

# TEST 3: Email de confirmación FINAL al CLIENTE
echo "TEST 3: Email de confirmación FINAL al CLIENTE"
test_endpoint "Confirmación Final Cliente" "/test/client-final-confirmation" '{
  "clientName": "Cliente de Prueba",
  "clientEmail": "rhzamora144@gmail.com",
  "service": "Servicio de Prueba",
  "date": "11/05/2025",
  "time": "10:00 AM"
}'

sleep 2

# TEST 4: Flujo completo (ambos emails)
echo "TEST 4: Flujo completo (ambos emails en paralelo)"
test_endpoint "Flujo Completo" "/test/booking-flow" '{
  "clientName": "Cliente de Prueba Completo",
  "clientEmail": "rhzamora144@gmail.com",
  "clientPhone": "1234567890",
  "service": "Servicio de Prueba Completo",
  "date": "11/05/2025",
  "time": "10:00 AM",
  "notes": "Prueba del flujo completo de booking"
}'

echo ""
echo "✅ TODAS LAS PRUEBAS COMPLETADAS"
echo ""
echo "📬 Verifica los emails en:"
echo "   - Admin: dedecorinfo@gmail.com"
echo "   - Cliente: rhzamora144@gmail.com"

