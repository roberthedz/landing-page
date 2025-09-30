# 📧 SOLUCIÓN: Emails en Render.com

**Problema:** Render bloquea conexiones SMTP salientes en el plan gratuito  
**Error:** `Connection timeout ETIMEDOUT`

---

## 🎯 SOLUCIONES (Elige una)

### SOLUCIÓN A: Usar SendGrid (RECOMENDADA para Render) ⭐

SendGrid es gratis hasta 100 emails/día y funciona perfectamente en Render.

#### 1. Crear cuenta en SendGrid
```
1. Ve a: https://sendgrid.com/
2. Sign Up (es gratis)
3. Verifica tu email
4. Crear API Key:
   - Settings → API Keys
   - Create API Key
   - Full Access
   - COPIAR la key (solo se muestra 1 vez)
```

#### 2. Modificar server-production.js:

```javascript
// Reemplazar líneas 110-125 con:

const emailTransporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey', // Siempre es 'apikey'
    pass: 'TU_API_KEY_DE_SENDGRID_AQUI'
  }
});
```

#### 3. Configurar en Render

Variables de entorno:
```
SENDGRID_API_KEY=TU_API_KEY_AQUI
```

---

### SOLUCIÓN B: Gmail con configuración especial

Si quieres seguir con Gmail, necesitas:

#### 1. Usar App Password de Gmail
```
1. Ve a: https://myaccount.google.com/security
2. Activa "2-Step Verification"
3. Ve a: App passwords
4. Genera password para "Mail"
5. COPIA el password de 16 caracteres
```

#### 2. Verificar que Render permite SMTP

Algunos proveedores bloquean SMTP saliente. Render PUEDE permitirlo pero con configuración especial.

#### 3. Contactar soporte de Render
```
Si Gmail sigue dando timeout en Render:
1. Ve a: https://render.com/support
2. Pregunta: "¿Permiten conexiones SMTP salientes?"
3. Si dicen NO → Usar SendGrid (Solución A)
```

---

### SOLUCIÓN C: Mailgun (Alternativa)

Similar a SendGrid, gratis hasta cierto límite.

```
1. Cuenta: https://mailgun.com/
2. API Key gratuita
3. Cambiar configuración igual que SendGrid
```

---

## 🚀 IMPLEMENTACIÓN RÁPIDA (SendGrid)

### Paso 1: Instalar SendGrid (opcional, nodemailer ya lo soporta)

```bash
# No necesario, nodemailer ya soporta SendGrid
```

### Paso 2: Actualizar código

```javascript
// server-production.js líneas 110-125

const emailTransporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY || 'SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  },
  tls: {
    rejectUnauthorized: false
  }
});
```

### Paso 3: Variable de entorno en Render

```
Dashboard → Service → Environment
→ Add Environment Variable

Key: SENDGRID_API_KEY
Value: SG.XXXXXXX (tu API key)
```

### Paso 4: Deploy

```bash
git add server-production.js server.js
git commit -m "Fix: Usar SendGrid para emails en Render"
git push origin main
```

Render detectará el push y hará redeploy automático.

---

## ⚠️ MIENTRAS TANTO (Solución Temporal)

Si no quieres configurar SendGrid ahora mismo, puedes:

### Opción temporal: Aumentar timeouts de SMTP

Ya lo hicimos (30s connectionTimeout, 60s socketTimeout).

Esto PUEDE funcionar si Render permite SMTP pero con latencia alta.

---

## 🧪 PROBAR SI FUNCIONA

Después de hacer deploy:

```bash
# Test del servidor
curl https://landing-page-534b.onrender.com/api/health

# Test de email directo
curl -X POST "https://landing-page-534b.onrender.com/api/send-booking-email" \
  -H "Content-Type: application/json" \
  -d '{
    "clientEmail": "test@example.com",
    "clientName": "Test",
    "bookingDetails": {
      "id": "test-001",
      "phone": "123",
      "service": "Test",
      "date": "10/01/2025",
      "time": "10:00 AM",
      "type": "consulta-individual"
    }
  }'
```

**Resultado esperado:**
```json
{"success": true}
```

**Si da error:**
- Render bloquea SMTP
- Necesitas usar SendGrid

---

## 📊 COMPARACIÓN

| Servicio | Costo | Emails/mes | Funciona en Render |
|----------|-------|------------|-------------------|
| Gmail SMTP | Gratis | Ilimitado* | ⚠️ Puede bloquearse |
| SendGrid | Gratis | 100/día | ✅ Sí |
| Mailgun | Gratis | 100/día | ✅ Sí |

*Gmail puede bloquear si envías muchos

---

## ✅ RECOMENDACIÓN FINAL

**Para producción en Render: Usa SendGrid**

1. Es gratis (100 emails/día es suficiente)
2. Funciona perfecto en Render
3. Más confiable que Gmail
4. Fácil de configurar (5 minutos)

**Pasos:**
1. Crear cuenta SendGrid
2. Obtener API Key
3. Actualizar server-production.js (líneas 110-125)
4. Agregar variable de entorno en Render
5. Deploy

---

**Estado actual:**
- ✅ MongoDB: Funcionando
- ⚠️ Emails: Gmail bloqueado en Render
- ✅ Código: Listo para SendGrid
- 🚀 Deploy: Listo después de configurar SendGrid
