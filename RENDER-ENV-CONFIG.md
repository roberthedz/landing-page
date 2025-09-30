# 🔧 CONFIGURACIÓN DE VARIABLES DE ENTORNO EN RENDER

## Variables requeridas para SendGrid:

### 1. SENDGRID_API_KEY
- **Valor:** Tu API Key de SendGrid
- **Cómo obtenerla:**
  1. Ve a https://sendgrid.com
  2. Crea una cuenta gratuita
  3. Ve a Settings → API Keys
  4. Crea una nueva API Key con permisos "Full Access"
  5. Copia la API Key generada

### 2. BASE_URL (opcional)
- **Valor:** https://dedecorinfo.com
- **Propósito:** Para generar URLs de confirmación en los emails

## 📋 PASOS PARA CONFIGURAR EN RENDER:

### Paso 1: Ir a la configuración de tu servicio
1. Ve a tu dashboard de Render
2. Selecciona tu servicio `landing-page-1`
3. Ve a la pestaña "Environment"

### Paso 2: Agregar variables de entorno
1. Haz clic en "Add Environment Variable"
2. Agrega las siguientes variables:

```
SENDGRID_API_KEY = tu_api_key_aqui
BASE_URL = https://dedecorinfo.com
```

### Paso 3: Verificar configuración
- Las variables aparecerán en la lista
- Asegúrate de que estén marcadas como "Secret" si contienen información sensible

### Paso 4: Redesplegar
- Render detectará los cambios automáticamente
- O puedes hacer un "Manual Deploy" si es necesario

## 🧪 VERIFICAR QUE FUNCIONA:

Una vez configurado, puedes verificar que funciona:

```bash
curl https://landing-page-1-77xa.onrender.com/api/health
```

Deberías ver:
```json
{
  "email": "configured"
}
```

En lugar de:
```json
{
  "email": "not-configured"
}
```

## 🔒 SEGURIDAD:

- ✅ **Nunca** hardcodees credenciales en el código
- ✅ **Siempre** usa variables de entorno para datos sensibles
- ✅ **Rota** las API Keys periódicamente
- ✅ **Usa** permisos mínimos necesarios en SendGrid

## 📧 VENTAJAS DE SENDGRID:

- ✅ **Más confiable** que SMTP directo
- ✅ **Mejor deliverability** (llegada a inbox)
- ✅ **Estadísticas** de envío
- ✅ **Plantillas** de email profesionales
- ✅ **Escalable** para grandes volúmenes
- ✅ **API segura** con autenticación por token
