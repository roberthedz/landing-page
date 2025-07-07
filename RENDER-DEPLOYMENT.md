# 🚀 Despliegue en Render.com con MongoDB Atlas

## ✅ Qué hemos hecho

1. **Agregamos MongoDB Atlas** como base de datos persistente
2. **Instalamos mongoose** para conectar con MongoDB
3. **Creamos schemas** para Reservas, Horarios Ocupados y Mensajes
4. **Nuevo servidor** (`server-mongodb.js`) que usa MongoDB Atlas
5. **Actualizado package.json** para usar el nuevo servidor

## 📋 Pasos para Desplegar

### 1. Configurar MongoDB Atlas

#### Crear Cuenta GRATUITA
1. Ve a: https://cloud.mongodb.com/
2. Crea tu cuenta
3. Crea un proyecto: "DeDecor-Reservas"
4. Crea un cluster M0 (GRATUITO)
5. Nombre del cluster: "reservas-cluster"

#### Configurar Seguridad
1. **Database Access:**
   - Usuario: `dedecor-admin`
   - Contraseña: [Genera una segura]
   - Rol: `Atlas admin`

2. **Network Access:**
   - Permitir acceso desde cualquier IP: `0.0.0.0/0`

#### Obtener Connection String
1. Ve a "Connect" → "Connect your application"
2. Copia la cadena de conexión
3. Reemplaza `<password>` con tu contraseña
4. Añade `/dedecor-reservas` al final

**Ejemplo:**
```
mongodb+srv://dedecor-admin:MiPassword123@reservas-cluster.abcde.mongodb.net/dedecor-reservas
```

### 2. Configurar Variables de Entorno en Render.com

En tu dashboard de Render.com, ve a "Environment Variables" y agrega:

```bash
# MongoDB Atlas (OBLIGATORIO)
MONGODB_URI=mongodb+srv://dedecor-admin:TU_PASSWORD@reservas-cluster.xxxxx.mongodb.net/dedecor-reservas

# Email Configuration (OBLIGATORIO)
EMAIL_USER=dedecorinfo@gmail.com
EMAIL_PASS=tu_app_password_de_gmail

# Environment
NODE_ENV=production
PORT=3000
```

### 3. Desplegar en Render.com

1. **Conectar tu repositorio** a Render.com
2. **Configurar Build Settings:**
   - Build Command: `npm install`
   - Start Command: `npm start`
3. **Añadir las variables de entorno** (paso anterior)
4. **Desplegar**

## 🎉 Resultado

**¡Ahora las reservas NUNCA se perderán!**

### ✅ Ventajas de MongoDB Atlas:
- **Persistent Storage:** Los datos están seguros en la nube
- **Auto-scaling:** Se adapta automáticamente a la carga
- **Backups automáticos:** Respaldos diarios automáticos
- **Monitoring:** Monitoreo en tiempo real
- **Multi-región:** Disponible globalmente
- **99.995% Uptime:** Garantía de disponibilidad

### 📊 Capacidad GRATUITA:
- **512 MB de almacenamiento** (miles de reservas)
- **100 conexiones simultáneas**
- **Transferencia de datos ilimitada**

## 🔧 Verificación

Una vez desplegado, puedes verificar que todo funciona:

1. **Haz una reserva de prueba**
2. **Verifica en MongoDB Atlas** que se guardó
3. **Reinicia el servicio en Render.com**
4. **Verifica que la reserva sigue ahí**

## 📚 Logs y Monitoreo

- **Render.com:** Ve a "Logs" para ver los logs del servidor
- **MongoDB Atlas:** Ve a "Monitoring" para ver la actividad de la base de datos

## 🆘 Solución de Problemas

### Error: "MONGODB_URI no está definida"
- Verifica que añadiste la variable de entorno en Render.com
- Asegúrate de que la cadena de conexión sea correcta

### Error: "Unable to connect to MongoDB"
- Verifica que tu cluster esté activo
- Confirma que permitiste acceso desde cualquier IP (0.0.0.0/0)
- Revisa que la contraseña sea correcta

### Error en emails
- Verifica EMAIL_USER y EMAIL_PASS
- Asegúrate de usar App Password de Gmail (no la contraseña normal)

## 📱 Próximos Pasos

Con MongoDB Atlas configurado, puedes:
1. **Añadir más funcionalidades** sin preocuparte por el almacenamiento
2. **Escalar** tu aplicación según crezca tu negocio
3. **Monitorear** el uso y rendimiento
4. **Backup automático** de todos los datos

¡Tu sistema de reservas ahora es **profesional y confiable**! 🎯 