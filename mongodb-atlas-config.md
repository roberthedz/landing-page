# Configuración de MongoDB Atlas

## Variables de Entorno para Render.com

En tu dashboard de Render.com, ve a "Environment Variables" y agrega estas variables:

```bash
# MongoDB Atlas - OBLIGATORIO
MONGODB_URI=mongodb+srv://dedecor-admin:TU_PASSWORD@reservas-cluster.xxxxx.mongodb.net/dedecor-reservas

# Email Configuration - OBLIGATORIO
EMAIL_USER=dedecorinfo@gmail.com
EMAIL_PASS=tu_app_password_de_gmail

# Environment
NODE_ENV=production
PORT=3000
```

## Cómo obtener MONGODB_URI

1. Ve a MongoDB Atlas: https://cloud.mongodb.com/
2. Accede a tu cluster
3. Clic en "Connect" → "Connect your application"
4. Copia la cadena de conexión
5. Reemplaza `<password>` con tu contraseña real
6. Añade `/dedecor-reservas` al final

## Ejemplo de MONGODB_URI:
```
mongodb+srv://dedecor-admin:MiPassword123@reservas-cluster.abcde.mongodb.net/dedecor-reservas
```

## ¡IMPORTANTE!
- Nunca compartas tu MONGODB_URI
- Asegúrate de reemplazar `<password>` con tu contraseña real
- El nombre de la base de datos debe ser `dedecor-reservas` 