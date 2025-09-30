# 📊 ¿Qué se intenta guardar en MongoDB?

**Pregunta:** ¿Qué datos intenta guardar el servidor en MongoDB cuando se crea una reserva?

---

## 🎯 Respuesta Rápida

Se intenta guardar **UN DOCUMENTO DE RESERVA** con toda la información del cliente y el servicio solicitado en la colección `bookings` de MongoDB Atlas.

---

## 📦 Estructura del Documento que se Guarda

### 🔹 Modelo: `Booking` (Reserva)

Cuando haces click en "Confirmar Reserva", se intenta crear este documento en MongoDB:

```javascript
{
  // 🆔 IDENTIFICACIÓN
  id: "booking-1727738400000-742",           // ID único generado
  status: "pending",                          // Estado inicial: PENDIENTE
  
  // 👤 INFORMACIÓN DEL CLIENTE
  clientName: "Robert Hernandez",             // Nombre completo
  clientEmail: "rhzamoral44@gmail.com",       // Email del cliente
  clientPhone: "3058336269",                  // Teléfono de contacto
  
  // 🎨 INFORMACIÓN DEL SERVICIO
  service: "Consulta de Decoración",          // Nombre del servicio
  serviceDuration: "60 min",                  // Duración del servicio
  servicePrice: "$150",                       // Precio del servicio
  
  // 📅 INFORMACIÓN DE LA CITA
  date: "10/01/2025",                         // Fecha seleccionada (MM/DD/YYYY)
  time: "10:00 AM",                           // Hora seleccionada
  type: "consulta-individual",                // Tipo de cita
  
  // 📝 INFORMACIÓN ADICIONAL
  notes: "Necesito decorar mi sala...",       // Notas del cliente (opcional)
  
  // ⏰ METADATOS AUTOMÁTICOS
  createdAt: 2025-09-30T16:30:00.000Z,       // Fecha de creación (auto)
  updatedAt: 2025-09-30T16:30:00.000Z        // Fecha de actualización (auto)
}
```

---

## 📋 Ejemplo Real de la Última Prueba

Esto es **exactamente** lo que intentó guardar en la prueba que acabamos de hacer:

```json
{
  "id": "test-flujo-completo-001",
  "status": "pending",
  "clientName": "Robert Hernandez - PRUEBA FLUJO",
  "clientEmail": "rhzamoral44@gmail.com",
  "clientPhone": "3058336269",
  "service": "Consulta de Decoración - TEST",
  "serviceDuration": "60 min",
  "servicePrice": "$150",
  "date": "10/01/2025",
  "time": "10:00 AM",
  "type": "consulta-individual",
  "notes": "Esta es una prueba del flujo completo de emails optimizado",
  "createdAt": "2025-09-30T16:30:00.000Z",
  "updatedAt": "2025-09-30T16:30:00.000Z"
}
```

---

## 🗃️ Colecciones en MongoDB

El sistema usa **3 colecciones** diferentes:

### 1️⃣ **Colección: `bookings`** (Reservas)
**Propósito:** Guardar todas las reservas/solicitudes

**Esquema:**
```javascript
{
  id: String (único),
  status: String ['pending', 'confirmed', 'rejected', 'cancelled'],
  clientName: String,
  clientEmail: String,
  clientPhone: String,
  service: String,
  serviceDuration: String,
  servicePrice: String,
  date: String,
  time: String,
  type: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2️⃣ **Colección: `bookedslots`** (Horarios Bloqueados)
**Propósito:** Bloquear horarios cuando una reserva es CONFIRMADA

**Esquema:**
```javascript
{
  date: String,           // "10/01/2025"
  time: String,           // "10:00 AM"
  bookingId: String,      // "booking-xxx"
  reason: String,         // "Consulta individual"
  createdAt: Date
}
```

**Nota:** Los horarios se crean **SOLO cuando el admin confirma** la reserva, NO cuando el cliente la solicita.

### 3️⃣ **Colección: `contactmessages`** (Mensajes de Contacto)
**Propósito:** Guardar mensajes del formulario de contacto

**Esquema:**
```javascript
{
  id: String (único),
  clientName: String,
  clientEmail: String,
  phone: String,
  message: String,
  date: String,
  createdAt: Date
}
```

---

## 🔄 Flujo Completo de Datos

### Momento 1: Cliente hace click en "Confirmar Reserva"
```
📱 FRONTEND (Booking.js)
    ↓
    Envía datos del formulario
    ↓
🌐 BACKEND (server-production.js)
    ↓
📧 1. ENVÍA EMAILS (PRIORIDAD)
    ├─→ Email al Admin
    └─→ Email al Cliente
    ↓
💾 2. INTENTA GUARDAR EN MongoDB
    ├─→ Colección: "bookings"
    └─→ Status: "pending"
```

**Estado después del click:**
- ✅ Emails enviados (admin + cliente)
- ⏳ Reserva guardada como "pending" (si MongoDB funciona)
- ❌ Horarios NO bloqueados todavía

### Momento 2: Admin hace click en "Confirmar Reserva" (en el email)
```
📧 EMAIL del Admin
    ↓
    Click en "✅ CONFIRMAR RESERVA"
    ↓
🌐 BACKEND (/confirm-booking?id=xxx&action=confirm)
    ↓
💾 1. ACTUALIZA Status en MongoDB
    └─→ Status: "pending" → "confirmed"
    ↓
🔒 2. BLOQUEA HORARIOS
    └─→ Crea documentos en "bookedslots"
    ↓
📧 3. ENVÍA EMAIL FINAL al Cliente
    └─→ "¡Tu reserva ha sido confirmada!"
```

**Estado después de confirmación del admin:**
- ✅ Reserva confirmada (status: "confirmed")
- ✅ Horarios bloqueados en la base de datos
- ✅ Email de confirmación final al cliente

---

## 🎨 Diagrama Visual

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO HACE RESERVA                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────┐
         │   Datos del Formulario      │
         ├─────────────────────────────┤
         │ • Nombre                    │
         │ • Email                     │
         │ • Teléfono                  │
         │ • Servicio                  │
         │ • Fecha                     │
         │ • Hora                      │
         │ • Notas                     │
         └──────────┬──────────────────┘
                    │
                    ▼
         ┌─────────────────────────────┐
         │   SERVIDOR RECIBE           │
         └──────────┬──────────────────┘
                    │
            ┌───────┴───────┐
            │               │
            ▼               ▼
    ┌──────────────┐  ┌──────────────┐
    │ 📧 EMAILS    │  │ 💾 MongoDB   │
    │ (PRIORIDAD)  │  │ (OPCIONAL)   │
    ├──────────────┤  ├──────────────┤
    │ ✅ Admin     │  │ Colección:   │
    │ ✅ Cliente   │  │ "bookings"   │
    └──────────────┘  └──────────────┘
         ✅                ⚠️
      ENVIADOS       puede fallar
                    (no afecta emails)
```

---

## 📊 Ejemplo de Datos Guardados en Producción

Si tienes **10 clientes** que hacen reservas, en MongoDB tendrías:

### Colección `bookings` (10 documentos):
```javascript
[
  {
    id: "booking-001",
    status: "pending",
    clientName: "María García",
    service: "Habitación Cerrada 12x12",
    date: "10/01/2025",
    time: "9:00 AM",
    ...
  },
  {
    id: "booking-002",
    status: "confirmed",
    clientName: "Juan Pérez",
    service: "Paquete Esencial",
    date: "10/02/2025",
    time: "10:00 AM",
    ...
  },
  // ... 8 reservas más
]
```

### Colección `bookedslots` (solo reservas confirmadas):
```javascript
[
  // Solo la reserva de Juan Pérez (que fue confirmada)
  {
    date: "10/02/2025",
    time: "10:00 AM",
    bookingId: "booking-002",
    reason: "Consulta individual"
  }
]
```

---

## ⚙️ ¿Para qué sirve guardar esto en MongoDB?

### ✅ Ventajas de tener MongoDB funcionando:

1. **📊 Historial completo:**
   - Ver todas las reservas pasadas
   - Estadísticas de servicios más solicitados
   - Análisis de horarios más populares

2. **🔍 Búsqueda y gestión:**
   - Buscar reservas por cliente
   - Filtrar por fecha, servicio, estado
   - Gestionar confirmaciones/rechazos

3. **🔒 Control de horarios:**
   - Bloquear horarios automáticamente
   - Evitar dobles reservas
   - Sincronización en tiempo real

4. **📈 Dashboard de administración:**
   - Ver reservas pendientes
   - Estadísticas del negocio
   - Reportes mensuales

### ⚠️ Pero si MongoDB falla:

- ✅ **Los emails SIEMPRE se envían** (esto es lo crítico)
- ✅ El admin recibe notificación por email
- ✅ El cliente recibe confirmación de recepción
- ⚠️ No hay persistencia en base de datos (temporal)
- ⚠️ Hay que gestionar manualmente con los emails

---

## 🎯 Conclusión

**MongoDB intenta guardar:**

1. 📝 **Toda la información de la reserva** (cliente + servicio + fecha/hora)
2. ⏰ **Estado inicial: "pending"** (esperando confirmación del admin)
3. 📊 **Metadatos automáticos** (fecha de creación, etc.)

**Pero lo más importante:**

Los **EMAILS se envían PRIMERO**, independientemente de si MongoDB funciona o no. Esto garantiza que tanto el admin como el cliente estén notificados de la nueva solicitud.

---

**Base de datos:** MongoDB Atlas  
**Nombre de la BD:** `reservas`  
**Colecciones principales:**
- `bookings` - Reservas
- `bookedslots` - Horarios bloqueados  
- `contactmessages` - Mensajes de contacto

---

**Última actualización:** 30 de Septiembre, 2025
