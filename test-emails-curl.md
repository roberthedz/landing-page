# 🧪 Comandos curl para probar emails

## Servidor
**URL Base:** https://landing-page-1-77xa.onrender.com/api

---

## 1️⃣ Email de Notificación al ADMIN

```bash
curl -X POST "https://landing-page-1-77xa.onrender.com/api/test/admin-email" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Cliente de Prueba",
    "clientEmail": "cliente@test.com",
    "clientPhone": "1234567890",
    "service": "Servicio de Prueba",
    "date": "11/05/2025",
    "time": "10:00 AM",
    "notes": "Esta es una prueba de email al admin"
  }'
```

**Destinatario:** dedecorinfo@gmail.com

---

## 2️⃣ Email de Confirmación Inicial al CLIENTE

```bash
curl -X POST "https://landing-page-1-77xa.onrender.com/api/test/client-confirmation" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Cliente de Prueba",
    "clientEmail": "rhzamora144@gmail.com",
    "service": "Servicio de Prueba",
    "date": "11/05/2025",
    "time": "10:00 AM"
  }'
```

**Destinatario:** rhzamora144@gmail.com (o el email que especifiques)

---

## 3️⃣ Email de Confirmación FINAL al CLIENTE

```bash
curl -X POST "https://landing-page-1-77xa.onrender.com/api/test/client-final-confirmation" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Cliente de Prueba",
    "clientEmail": "rhzamora144@gmail.com",
    "service": "Servicio de Prueba",
    "date": "11/05/2025",
    "time": "10:00 AM"
  }'
```

**Destinatario:** rhzamora144@gmail.com (o el email que especifiques)

---

## 4️⃣ Flujo Completo (ambos emails en paralelo)

```bash
curl -X POST "https://landing-page-1-77xa.onrender.com/api/test/booking-flow" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Cliente de Prueba Completo",
    "clientEmail": "rhzamora144@gmail.com",
    "clientPhone": "1234567890",
    "service": "Servicio de Prueba Completo",
    "date": "11/05/2025",
    "time": "10:00 AM",
    "notes": "Prueba del flujo completo de booking"
  }'
```

**Destinatarios:** 
- Admin: dedecorinfo@gmail.com
- Cliente: rhzamora144@gmail.com (o el email que especifiques)

---

## 📝 Nota

**Espera 2-3 minutos después de hacer push** para que Render despliegue los cambios antes de probar estos endpoints.

---

## 🔍 Verificar estado del servidor

```bash
curl "https://landing-page-1-77xa.onrender.com/api/health" | python3 -m json.tool
```

El campo `email` debe mostrar `"configured"` si Gmail está configurado correctamente.

