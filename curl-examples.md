# Comandos cURL para probar la API de emails

## 1. Probar creación de reserva completa (envía emails automáticamente)

```bash
curl -X POST "http://localhost:3000/api/bookings" \
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
  -v
```

## 2. Probar envío de email de reserva específico

```bash
curl -X POST "http://localhost:3000/api/send-booking-email" \
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
  -v
```

## 3. Probar envío de email de contacto

```bash
curl -X POST "http://localhost:3000/api/send-contact-email" \
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
  -v
```

## 4. Verificar estado del sistema

```bash
curl -X GET "http://localhost:3000/api/system-status" \
  -H "Origin: http://localhost:3000" \
  -v
```

## 5. Verificar salud del sistema

```bash
curl -X GET "http://localhost:3000/api/health" \
  -H "Origin: http://localhost:3000" \
  -v
```

## Notas importantes:

1. **Asegúrate de que el servidor esté corriendo** en el puerto 3000
2. **Revisa los logs del servidor** para ver si hay errores
3. **Verifica la bandeja de entrada** de `dedecorinfo@gmail.com`
4. **Los emails se envían a dos direcciones:**
   - Al admin: `dedecorinfo@gmail.com`
   - Al cliente: el email proporcionado en la petición

## Para probar en producción:

Cambia `http://localhost:3000` por la URL de tu servidor en producción (ej: `https://landing-page-534b.onrender.com`)