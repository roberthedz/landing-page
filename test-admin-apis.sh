#!/bin/bash

# Script para probar las APIs administrativas después del deploy

BASE_URL="https://landing-page-534b.onrender.com/api"

echo "🧪 Probando APIs Administrativas en Render..."
echo "================================================"

# Test 1: Health Check
echo "1. 🔍 Probando Health Check..."
curl -s "$BASE_URL/health" | jq . || echo "❌ Health check falló"
echo ""

# Test 2: System Status
echo "2. 📊 Probando System Status..."
curl -s "$BASE_URL/system-status" | jq . || echo "❌ System status falló"
echo ""

# Test 3: Admin Login
echo "3. 🔐 Probando Admin Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/admin/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"dedecorAdmin"}')

echo "$LOGIN_RESPONSE" | jq . || echo "❌ Login falló"

# Extraer token si el login fue exitoso
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token' 2>/dev/null)

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
  echo "✅ Login exitoso, token obtenido"
  
  # Test 4: Admin Bookings
  echo ""
  echo "4. 📋 Probando Admin Bookings..."
  curl -s -H "Authorization: Basic $TOKEN" "$BASE_URL/admin/bookings" | jq . || echo "❌ Admin bookings falló"
  
  # Test 5: Block Date (prueba)
  echo ""
  echo "5. 🔒 Probando Block Date..."
  curl -s -X POST "$BASE_URL/admin/block-date" \
    -H "Content-Type: application/json" \
    -H "Authorization: Basic $TOKEN" \
    -d '{"date":"12/25/2024","reason":"Prueba de deploy"}' | jq . || echo "❌ Block date falló"
  
else
  echo "❌ No se pudo obtener token, saltando pruebas autenticadas"
fi

echo ""
echo "🎉 Pruebas completadas!"
echo "Si todas las pruebas pasaron, el panel admin debería funcionar en:"
echo "https://dedecorinfo.com/admin"
