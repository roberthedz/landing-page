# 🔧 SOLUCIÓN AL PROBLEMA DE MONGODB ATLAS

**Fecha:** 30 de Septiembre, 2025  
**Error identificado:** `queryTxt ECONNREFUSED cluster0.4vwcokw.mongodb.net`

---

## 🚨 DIAGNÓSTICO CONFIRMADO

```
❌ MongoDB Atlas NO es accesible desde tu máquina
❌ DNS resuelve pero la conexión es rechazada
❌ Tanto mongosh como Node.js fallan al conectar
```

---

## 🎯 CAUSAS MÁS PROBABLES (en orden de probabilidad)

### 1. IP NO está en Whitelist ⚠️ (90% probable)
MongoDB Atlas bloquea todas las IPs por defecto excepto las que están en la whitelist.

### 2. Cluster está PAUSADO 💤 (5% probable)
Los clusters free tier se pausan automáticamente después de inactividad.

### 3. Credenciales incorrectas 🔑 (3% probable)
Usuario, contraseña o nombre de base de datos incorrectos.

### 4. Problema de red local 🌐 (2% probable)
Firewall, VPN o ISP bloqueando la conexión.

---

## ✅ SOLUCIÓN PASO A PASO

### PASO 1: Verificar y Agregar IP a Whitelist

1. **Ir a MongoDB Atlas**
   ```
   URL: https://cloud.mongodb.com/v2
   ```

2. **Login con tus credenciales**
   - Usuario: rhzamora144@gmail.com (o el que uses)

3. **Ir a Network Access**
   ```
   Menú lateral → Security → Network Access
   ```

4. **Ver IPs permitidas**
   - Busca si hay alguna IP en la lista
   - Si está vacía o solo tiene IPs específicas, ese es el problema

5. **Agregar 0.0.0.0/0** (permite todas las IPs)
   ```
   Click en "ADD IP ADDRESS"
   → Click en "ALLOW ACCESS FROM ANYWHERE"
   → Click en "Confirm"
   ```

   **Resultado esperado:**
   ```
   IP Address: 0.0.0.0/0
   Comment: Allow from anywhere
   Status: ACTIVE (verde)
   ```

---

### PASO 2: Verificar Estado del Cluster

1. **Ir a Database**
   ```
   Menú lateral → Deployment → Database
   ```

2. **Verificar el cluster**
   ```
   Nombre: Cluster0
   Estado debe mostrar: 
   - ✅ RUNNING (con círculo verde)
   - ❌ Si dice PAUSED → Click en "Resume"
   ```

3. **Si está pausado:**
   ```
   Click en los 3 puntos (⋯) del cluster
   → Click en "Resume"
   → Esperar 1-2 minutos
   ```

---

### PASO 3: Verificar String de Conexión

1. **Obtener nueva URI**
   ```
   En Database → Click en "Connect" del Cluster0
   → "Connect your application"
   → Driver: Node.js
   → Version: 5.5 or later
   → Copiar la URI
   ```

2. **La URI debe verse así:**
   ```
   mongodb+srv://rhzamora144:<password>@cluster0.4vwcokw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

3. **Reemplazar `<password>` con tu contraseña:**
   ```
   86e6FbGM00uV78RP
   ```

4. **Agregar el nombre de la base de datos:**
   ```
   mongodb+srv://rhzamora144:86e6FbGM00uV78RP@cluster0.4vwcokw.mongodb.net/reservas?retryWrites=true&w=majority&appName=Cluster0
   ```

---

### PASO 4: Verificar Usuario y Contraseña

1. **Ir a Database Access**
   ```
   Menú lateral → Security → Database Access
   ```

2. **Verificar usuario**
   ```
   Usuario: rhzamora144
   Auth Method: SCRAM (default)
   Database User Privileges: At least read and write to any database
   ```

3. **Si no existe el usuario o no recuerdas la contraseña:**
   ```
   Click en "EDIT" del usuario
   → Click en "Edit Password"
   → Generar nueva contraseña
   → Copiar y actualizar en server-production.js
   ```

---

### PASO 5: Probar Conexión desde Línea de Comandos

Después de hacer los cambios, prueba:

```bash
cd landing-page

# Crear archivo de prueba rápido
cat > test-connection-quick.js << 'EOF'
const mongoose = require('mongoose');

const uri = 'mongodb+srv://rhzamora144:86e6FbGM00uV78RP@cluster0.4vwcokw.mongodb.net/reservas?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔗 Conectando...');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 30000,
  family: 4
})
.then(() => {
  console.log('✅ ¡ÉXITO! MongoDB Atlas funciona');
  process.exit(0);
})
.catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
EOF

# Ejecutar prueba
node test-connection-quick.js
```

---

## 🎯 DESPUÉS DE ARREGLAR MONGODB

### 1. Actualizar timeout en server-production.js

Si la conexión funciona pero es lenta:

```javascript
// Línea 24 de server-production.js
await mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 30000, // ← Cambiar de 10000 a 30000
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  family: 4
});
```

### 2. Reiniciar el servidor

```bash
# Detener servidor actual
pkill -f "node server-production.js"

# Iniciar servidor
PORT=3000 node server-production.js
```

### 3. Verificar que funciona

```bash
# Probar endpoint
curl http://localhost:3000/api/health

# Debe responder con:
# {"status":"ok","mongodb":"connected",...}
```

---

## 📊 CHECKLIST DE VERIFICACIÓN

Marca cada item después de verificarlo:

- [ ] **IP Whitelist:** 0.0.0.0/0 agregado y ACTIVE
- [ ] **Cluster:** Estado RUNNING (verde)
- [ ] **Usuario:** rhzamora144 existe y tiene permisos
- [ ] **Contraseña:** 86e6FbGM00uV78RP es correcta
- [ ] **URI:** Copiada correctamente en server-production.js
- [ ] **Test:** node test-connection-quick.js funciona
- [ ] **Servidor:** Reiniciado y respondiendo
- [ ] **Endpoints:** /api/booked-slots funciona sin timeout

---

## 🚀 COMANDOS RÁPIDOS PARA TESTING

Una vez arreglado MongoDB, ejecuta:

```bash
# 1. Test rápido de conexión
node test-connection-quick.js

# 2. Iniciar servidor
PORT=3000 node server-production.js &

# 3. Probar endpoints
curl "http://localhost:3000/api/health"
curl "http://localhost:3000/api/booked-slots?date=10/01/2025"

# 4. Crear reserva de prueba
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Test Post-Fix",
    "clientEmail": "test@test.com",
    "clientPhone": "1234567890",
    "service": "Test",
    "serviceDuration": "60 min",
    "servicePrice": "$100",
    "date": "10/15/2025",
    "time": "3:00 PM",
    "type": "consulta-individual"
  }'

# Debería responder:
# {"success":true,"emailsSent":true,"bookingSaved":true}
#                                    ↑ ¡AHORA SÍ GUARDA!
```

---

## ❓ PREGUNTAS FRECUENTES

### ¿Por qué 0.0.0.0/0 en whitelist?

**Respuesta:** Para desarrollo/testing es lo más fácil. En producción deberías usar IPs específicas.

**Alternativa para producción:**
```
1. Obtener IP del servidor de producción
2. Agregar solo esa IP en whitelist
3. Más seguro que permitir todas
```

### ¿Cómo sé si MongoDB Atlas está funcionando?

**Señales de éxito:**
- ✅ Endpoint `/api/health` responde con "mongodb":"connected"
- ✅ Endpoint `/api/booked-slots` responde en < 1 segundo
- ✅ Crear reserva responde con "bookingSaved":true
- ✅ No hay mensajes de timeout en los logs

### ¿Qué pasa si sigo viendo timeout?

**Opciones:**
1. Aumentar timeout a 30-60 segundos
2. Verificar que no haya VPN activa
3. Verificar que no haya firewall bloqueando
4. Probar desde otra red (por ejemplo, móvil hotspot)

---

## 📞 SI TODO FALLA

Si después de todos los pasos anteriores MongoDB Atlas sigue sin conectar:

### Opción A: Usar MongoDB local temporalmente

```bash
# Instalar MongoDB localmente
brew install mongodb-community

# Iniciar MongoDB
brew services start mongodb-community

# Cambiar URI en server-production.js:
const mongoUri = 'mongodb://localhost:27017/reservas';
```

### Opción B: Crear nuevo cluster en MongoDB Atlas

```
1. Ir a https://cloud.mongodb.com/v2
2. Create New Cluster (free tier)
3. Esperar 5-10 minutos
4. Configurar whitelist (0.0.0.0/0)
5. Crear usuario nuevo
6. Copiar nueva URI
7. Actualizar server-production.js
```

### Opción C: Contactar soporte de MongoDB Atlas

```
Soporte: https://www.mongodb.com/cloud/atlas/support
Email: support@mongodb.com
Chat: Disponible en el dashboard de Atlas
```

---

## ✅ RESULTADO ESPERADO

Después de aplicar la solución:

```
ANTES:
❌ MongoDB timeout (10s)
❌ bookedSlots: []
❌ bookingSaved: false
❌ Sistema al 40%

DESPUÉS:
✅ MongoDB conecta (< 1s)
✅ bookedSlots: [datos reales]
✅ bookingSaved: true
✅ Sistema al 100%
```

---

**Autor:** Diagnóstico automatizado  
**Última actualización:** 30 de Septiembre, 2025  
**Estado:** Pendiente de aplicar solución
