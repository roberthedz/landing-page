#!/bin/bash

# Script para diagnosticar y arreglar la conexión a MongoDB Atlas
# Fecha: 30 de Septiembre, 2025

echo "🔧 DIAGNÓSTICO Y ARREGLO DE MONGODB ATLAS"
echo "=========================================="
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Datos de conexión
CLUSTER_HOST="cluster0.4vwcokw.mongodb.net"
FULL_URI="mongodb+srv://rhzamora144:86e6FbGM00uV78RP@cluster0.4vwcokw.mongodb.net/reservas?retryWrites=true&w=majority&appName=Cluster0"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 1: Verificar conectividad de red"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Verificar resolución DNS
echo "1.1: Probar resolución DNS del cluster..."
if nslookup $CLUSTER_HOST > /dev/null 2>&1; then
  echo -e "${GREEN}✅ DNS resuelve correctamente${NC}"
  nslookup $CLUSTER_HOST | grep "Address:" | tail -3
else
  echo -e "${RED}❌ DNS NO resuelve${NC}"
  echo ""
  echo -e "${YELLOW}SOLUCIÓN: Problema de DNS local${NC}"
  echo "Opciones:"
  echo "1. Cambiar DNS a 8.8.8.8 (Google) o 1.1.1.1 (Cloudflare)"
  echo "2. Reiniciar router/modem"
  echo "3. Verificar firewall"
  exit 1
fi

echo ""

# Test 2: Verificar conectividad TCP
echo "1.2: Probar conectividad TCP al puerto 27017..."
if nc -z -w5 $CLUSTER_HOST 27017 > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Puerto 27017 accesible${NC}"
else
  echo -e "${YELLOW}⚠️ Puerto 27017 no responde directamente${NC}"
  echo "   (Esto es normal para MongoDB Atlas con SRV)"
fi

echo ""

# Test 3: Verificar TLS/SSL
echo "1.3: Verificar certificados SSL..."
if openssl s_client -connect $CLUSTER_HOST:27017 -servername $CLUSTER_HOST < /dev/null 2>/dev/null | grep -q "Verify return code: 0"; then
  echo -e "${GREEN}✅ Certificados SSL válidos${NC}"
else
  echo -e "${YELLOW}⚠️ No se pudo verificar SSL (puede ser normal)${NC}"
fi

echo ""

# Test 4: Probar con mongosh si está instalado
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 2: Probar conexión con MongoDB Shell"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if command -v mongosh &> /dev/null; then
  echo "2.1: Intentando conectar con mongosh..."
  echo "Comando: mongosh '$FULL_URI' --eval 'db.runCommand({ping: 1})'"
  echo ""
  
  timeout 15 mongosh "$FULL_URI" --eval "db.runCommand({ping: 1})" 2>&1 | tee /tmp/mongosh-test.log
  
  if grep -q "ok: 1" /tmp/mongosh-test.log; then
    echo ""
    echo -e "${GREEN}✅ CONEXIÓN EXITOSA con mongosh${NC}"
    echo -e "${GREEN}MongoDB Atlas está funcionando correctamente${NC}"
  else
    echo ""
    echo -e "${RED}❌ CONEXIÓN FALLÓ con mongosh${NC}"
  fi
else
  echo -e "${YELLOW}⚠️ mongosh no está instalado${NC}"
  echo "Para instalar: brew install mongosh"
  echo ""
  echo "Continuando con otros diagnósticos..."
fi

echo ""

# Test 5: Probar con Node.js directamente
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 3: Probar conexión con Node.js"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cat > /tmp/test-mongodb-connection.js << 'EOF'
const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://rhzamora144:86e6FbGM00uV78RP@cluster0.4vwcokw.mongodb.net/reservas?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔗 Intentando conectar a MongoDB Atlas...');
console.log('⏱️ Timeout: 15 segundos');

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 15000,
  family: 4
})
.then(() => {
  console.log('✅ CONEXIÓN EXITOSA');
  console.log('✅ MongoDB Atlas está funcionando');
  
  // Hacer una consulta de prueba
  return mongoose.connection.db.admin().ping();
})
.then(() => {
  console.log('✅ Ping exitoso');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ ERROR DE CONEXIÓN');
  console.error('Tipo de error:', error.name);
  console.error('Mensaje:', error.message);
  
  if (error.name === 'MongooseServerSelectionError') {
    console.error('\n🔧 DIAGNÓSTICO:');
    console.error('1. El servidor no puede seleccionar un nodo de MongoDB');
    console.error('2. Posibles causas:');
    console.error('   - IP no está en whitelist de MongoDB Atlas');
    console.error('   - Cluster pausado o detenido');
    console.error('   - Problema de red/firewall');
    console.error('   - DNS no resuelve correctamente');
  }
  
  process.exit(1);
});

setTimeout(() => {
  console.error('⏱️ TIMEOUT - La conexión tardó más de 15 segundos');
  process.exit(1);
}, 15000);
EOF

echo "3.1: Ejecutando test de conexión con Node.js..."
node /tmp/test-mongodb-connection.js 2>&1 | tee /tmp/node-mongo-test.log

NODE_EXIT_CODE=${PIPESTATUS[0]}

echo ""

if [ $NODE_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}✅ ¡ÉXITO! MongoDB Atlas funciona correctamente${NC}"
  echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo "El problema puede estar en:"
  echo "1. Configuración específica del servidor"
  echo "2. Variables de entorno"
  echo "3. Timeout muy corto (10s en producción)"
  echo ""
  echo "RECOMENDACIÓN: Aumentar timeout a 30 segundos"
else
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}❌ MongoDB Atlas NO está accesible${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  echo -e "${YELLOW}POSIBLES SOLUCIONES:${NC}"
  echo ""
  echo "1️⃣ Verificar IP Whitelist en MongoDB Atlas:"
  echo "   - Ir a: https://cloud.mongodb.com/v2"
  echo "   - Network Access → IP Access List"
  echo "   - Agregar: 0.0.0.0/0 (permite cualquier IP)"
  echo ""
  echo "2️⃣ Verificar que el cluster esté activo:"
  echo "   - Ir a: https://cloud.mongodb.com/v2"
  echo "   - Database → Clusters"
  echo "   - Estado debe ser: RUNNING (verde)"
  echo ""
  echo "3️⃣ Verificar credenciales:"
  echo "   - Usuario: rhzamora144"
  echo "   - Contraseña: 86e6FbGM00uV78RP"
  echo "   - Database: reservas"
  echo ""
  echo "4️⃣ Regenerar URI de conexión:"
  echo "   - Database → Connect"
  echo "   - Connect your application"
  echo "   - Copiar nueva URI"
fi

echo ""

# Test 6: Verificar configuración alternativa
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 4: Probar configuraciones alternativas"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "4.1: Probar con timeout extendido (30s)..."

cat > /tmp/test-mongodb-timeout.js << 'EOF'
const mongoose = require('mongoose');

const mongoUri = 'mongodb+srv://rhzamora144:86e6FbGM00uV78RP@cluster0.4vwcokw.mongodb.net/reservas?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoUri, {
  serverSelectionTimeoutMS: 30000, // 30 segundos
  socketTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  family: 4
})
.then(() => {
  console.log('✅ Conexión exitosa con timeout extendido');
  process.exit(0);
})
.catch((error) => {
  console.error('❌ Falló incluso con timeout extendido');
  process.exit(1);
});
EOF

node /tmp/test-mongodb-timeout.js 2>&1

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Funciona con timeout más largo${NC}"
  echo ""
  echo "SOLUCIÓN: Aumentar serverSelectionTimeoutMS a 30000 en server-production.js"
fi

echo ""

# Resumen final
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 RESUMEN DEL DIAGNÓSTICO"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $NODE_EXIT_CODE -eq 0 ]; then
  echo -e "${GREEN}Estado: MongoDB Atlas está ACCESIBLE${NC}"
  echo ""
  echo "Próximos pasos:"
  echo "1. Verificar configuración del servidor"
  echo "2. Aumentar timeout si es necesario"
  echo "3. Reiniciar servidor de producción"
else
  echo -e "${RED}Estado: MongoDB Atlas NO es accesible${NC}"
  echo ""
  echo "Acción requerida:"
  echo "1. Verificar IP Whitelist (0.0.0.0/0)"
  echo "2. Verificar que cluster esté RUNNING"
  echo "3. Verificar credenciales"
  echo "4. Contactar soporte de MongoDB Atlas si persiste"
fi

echo ""
echo "📋 Logs guardados en:"
echo "   - /tmp/mongosh-test.log"
echo "   - /tmp/node-mongo-test.log"
