# 📧 Guía de Solución de Problemas de Email

## 🚨 Problema Actual
**Estado del email:** ERROR  
**Síntoma:** No llegan emails a `dedecorinfo@gmail.com`  
**Causa:** Configuración de Gmail rota

## 🔍 Diagnóstico Realizado

### ✅ Lo que SÍ funciona:
- Sistema de reservas (respuesta instantánea)
- Base de datos (guardando reservas correctamente)
- APIs administrativas (funcionando perfectamente)
- Estructura de emails (código correcto)

### ❌ Lo que NO funciona:
- Envío de emails (transportador con error)
- Notificaciones al admin
- Confirmaciones al cliente

## 🔧 Soluciones

### **Solución 1: Renovar Contraseña de Aplicación Gmail (Recomendado)**

1. **Ve a Gmail App Passwords:**
   ```
   https://myaccount.google.com/apppasswords
   ```

2. **Inicia sesión con:**
   ```
   Email: dedecorinfo@gmail.com
   Contraseña: [tu contraseña normal de Gmail]
   ```

3. **Genera nueva contraseña de aplicación:**
   - Selecciona "Correo"
   - Selecciona "Otro (nombre personalizado)"
   - Escribe: "DeDecor Reservas"
   - Copia la contraseña generada (16 caracteres)

4. **Actualiza server-production.js:**
   ```javascript
   // Línea ~109
   auth: {
     user: 'dedecorinfo@gmail.com',
     pass: 'NUEVA_CONTRASEÑA_AQUÍ' // Reemplazar ihrvuveqsskjxyog
   }
   ```

### **Solución 2: Verificar Configuración 2FA**

1. **Ve a Seguridad de Google:**
   ```
   https://myaccount.google.com/security
   ```

2. **Verifica que esté activado:**
   - Verificación en 2 pasos: ACTIVADA
   - Sin 2FA, las contraseñas de aplicación no funcionan

### **Solución 3: Verificar Límites y Bloqueos**

1. **Revisa actividad reciente:**
   ```
   https://myaccount.google.com/device-activity
   ```

2. **Verifica límites:**
   - Gmail: ~500 emails/día
   - Si se alcanzó, esperar 24 horas

3. **Revisa alertas de seguridad:**
   - Buscar emails de Google sobre actividad sospechosa
   - Desbloquear si es necesario

## 🧪 Cómo Probar Después del Fix

### **Paso 1: Después de actualizar la contraseña**
```bash
# Hacer deploy
git add server-production.js
git commit -m "fix: Update Gmail app password for email system"
git push origin main
```

### **Paso 2: Esperar 3-5 minutos y probar**
```bash
# Probar email de contacto
curl -X POST https://landing-page-534b.onrender.com/api/send-contact-email \
  -H "Content-Type: application/json" \
  -d '{
    "clientEmail": "test@test.com",
    "clientName": "Test Email Fix",
    "contactDetails": {
      "message": "Prueba después del fix de Gmail",
      "date": "10/06/2025"
    }
  }'
```

### **Paso 3: Verificar resultado**
```bash
# Debería devolver:
{"success":true}

# Y deberías recibir email en dedecorinfo@gmail.com
```

## 🎯 Alternativas Si Gmail No Funciona

### **Opción A: Usar otro servicio de email**
```javascript
// En server-production.js, cambiar a SendGrid, Mailgun, etc.
const emailTransporter = nodemailer.createTransporter({
  service: 'SendGrid', // o 'Mailgun'
  auth: {
    user: 'apikey',
    pass: 'TU_API_KEY_AQUÍ'
  }
});
```

### **Opción B: Configuración SMTP directa**
```javascript
const emailTransporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'dedecorinfo@gmail.com',
    pass: 'NUEVA_CONTRASEÑA_APP'
  }
});
```

## 📞 Para el Cliente

**Mensaje temporal:**
"El sistema de reservas está funcionando perfectamente - las reservas se procesan instantáneamente. Estamos solucionando un problema menor con las notificaciones por email que estará resuelto en unos minutos."

## ✅ Próximos Pasos

1. **Renovar contraseña Gmail** (5 minutos)
2. **Deploy del fix** (3 minutos)
3. **Probar emails** (1 minuto)
4. **✅ Sistema 100% funcional**

---

**Tiempo total estimado:** 10 minutos para solución completa
