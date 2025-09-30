#!/bin/bash

# Script para probar la API de envío de emails
# Asegúrate de que el servidor esté corriendo en el puerto 3000

echo "🧪 Probando API de envío de emails..."
echo "======================================"

# URL base del servidor
BASE_URL="http://localhost:3000"

echo ""
echo "1️⃣ Probando endpoint de reserva completa (/api/bookings):"
echo "--------------------------------------------------------"

curl -X POST "${BASE_URL}/api/bookings" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "clientName": "Test User",
    "clientEmail": "test@example.com",
    "clientPhone": "3051234567",
    "service": "Consulta de Decoración",
    "date": "09/30/2025",
    "time": "3:00 PM",
    "type": "consulta-individual",
    "notes": "Prueba de API con curl"
  }' \
  -w "\n\n⏱️  Tiempo total: %{time_total}s\n" \
  -v

echo ""
echo "2️⃣ Probando endpoint de email de reserva (/api/send-booking-email):"
echo "----------------------------------------------------------------"

curl -X POST "${BASE_URL}/api/send-booking-email" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "clientEmail": "test@example.com",
    "clientName": "Test User",
    "bookingDetails": {
      "id": "test-booking-123",
      "phone": "3051234567",
      "service": "Consulta de Decoración",
      "date": "09/30/2025",
      "time": "3:00 PM",
      "type": "consulta-individual"
    }
  }' \
  -w "\n\n⏱️  Tiempo total: %{time_total}s\n" \
  -v

echo ""
echo "3️⃣ Probando endpoint de email de contacto (/api/send-contact-email):"
echo "------------------------------------------------------------------"

curl -X POST "${BASE_URL}/api/send-contact-email" \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "clientEmail": "test@example.com",
    "clientName": "Test User",
    "contactDetails": {
      "phone": "3051234567",
      "message": "Mensaje de prueba desde curl",
      "date": "09/30/2025"
    }
  }' \
  -w "\n\n⏱️  Tiempo total: %{time_total}s\n" \
  -v

echo ""
echo "4️⃣ Verificando estado del sistema (/api/system-status):"
echo "----------------------------------------------------"

curl -X GET "${BASE_URL}/api/system-status" \
  -H "Origin: http://localhost:3000" \
  -w "\n\n⏱️  Tiempo total: %{time_total}s\n" \
  -v

echo ""
echo "✅ Pruebas completadas"
echo "====================="
echo "Revisa los logs del servidor para ver si los emails se enviaron correctamente."
echo "También verifica tu bandeja de entrada en dedecorinfo@gmail.com"
