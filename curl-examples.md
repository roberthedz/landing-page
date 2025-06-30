# Ejemplos de comandos curl para la API de DeDecor

## 1. Crear una nueva reserva

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Nombre Cliente",
    "clientEmail": "cliente@ejemplo.com",
    "clientPhone": "123456789",
    "service": "ChairCraft Revive",
    "servicePrice": "$99",
    "date": "15/08/2023",
    "time": "10:00",
    "type": "presencial",
    "notes": "Notas adicionales"
  }'
```

Respuesta:
```json
{
  "success": true,
  "bookingId": "booking-1234567890-123"
}
```

## 2. Confirmar una reserva

```bash
curl -X POST http://localhost:3000/api/bookings/booking-1234567890-123/status \
  -H "Content-Type: application/json" \
  -d '{
    "action": "confirm"
  }'
```

Respuesta:
```json
{
  "success": true,
  "message": "Reserva confirmada exitosamente"
}
```

## 3. Rechazar una reserva

```bash
curl -X POST http://localhost:3000/api/bookings/booking-1234567890-123/status \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reject"
  }'
```

Respuesta:
```json
{
  "success": true,
  "message": "Reserva rechazada exitosamente"
}
```

## 4. Cancelar una reserva confirmada

```bash
curl -X POST http://localhost:3000/api/bookings/booking-1234567890-123/cancel
```

Respuesta:
```json
{
  "success": true,
  "message": "Reserva cancelada exitosamente"
}
```

## 5. Obtener horarios ocupados

```bash
curl -X GET http://localhost:3000/api/booked-slots
```

Respuesta:
```json
[
  {
    "date": "15/08/2023",
    "time": "10:00",
    "bookingId": "booking-1234567890-123"
  }
]
```

## 6. Listar todas las reservas

```bash
curl -X GET http://localhost:3000/api/bookings
```

Respuesta:
```json
[
  {
    "id": "booking-1234567890-123",
    "clientName": "Nombre Cliente",
    "service": "ChairCraft Revive",
    "date": "15/08/2023",
    "time": "10:00",
    "status": "confirmed"
  },
  {
    "id": "booking-1234567891-456",
    "clientName": "Otro Cliente",
    "service": "Vase Visionaries",
    "date": "16/08/2023",
    "time": "11:00",
    "status": "pending"
  }
]
```

## 7. Listar reservas por estado

```bash
curl -X GET http://localhost:3000/api/bookings?status=confirmed
```

Respuesta:
```json
[
  {
    "id": "booking-1234567890-123",
    "clientName": "Nombre Cliente",
    "service": "ChairCraft Revive",
    "date": "15/08/2023",
    "time": "10:00",
    "status": "confirmed"
  }
]
```

## Notas importantes:

1. Reemplaza `booking-1234567890-123` con el ID real de la reserva que obtengas al crearla.
2. Para cancelar una reserva, esta debe estar previamente confirmada.
3. Al cancelar una reserva, el horario se libera automáticamente y puede ser reservado nuevamente.
4. Todos los endpoints devuelven respuestas en formato JSON.
5. Puedes filtrar las reservas por estado usando los valores: `pending`, `confirmed`, `rejected` o `cancelled`. 