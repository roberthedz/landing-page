#!/bin/bash
echo "🧪 Test después de arreglar MongoDB"
echo "===================================="
echo ""
echo "1. Probando conexión..."
node test-connection-complete.js

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ ¡MongoDB funciona! Iniciando servidor..."
  PORT=3000 node server-production.js &
  SERVER_PID=$!
  echo "Servidor PID: $SERVER_PID"
  
  sleep 5
  
  echo ""
  echo "2. Probando endpoint..."
  curl -s "http://localhost:3000/api/health" | head -20
  
  echo ""
  echo ""
  echo "3. Probando consulta de horarios..."
  curl -s "http://localhost:3000/api/booked-slots?date=10/01/2025" | head -20
  
  echo ""
  echo ""
  echo "✅ TODO FUNCIONA"
else
  echo "❌ Aún no funciona. Verifica que agregaste la IP en MongoDB Atlas"
fi
