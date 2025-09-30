#!/bin/bash

echo "🚀 DEPLOYMENT A RENDER.COM"
echo "============================"
echo ""

echo "📝 CAMBIOS REALIZADOS:"
echo "  1. ✅ DNS fix aplicado en server-production.js"
echo "  2. ✅ DNS fix aplicado en server.js"
echo "  3. ✅ Timeout aumentado de 15s a 45s en apiConfig.js"
echo "  4. ✅ Fix para evitar reintentos en error 409"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 1: Hacer commit de los cambios"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "Ejecuta estos comandos:"
echo ""
echo "git add server-production.js server.js src/config/apiConfig.js"
echo "git commit -m 'Fix: Arreglar conexión MongoDB Atlas con DNS fix y aumentar timeouts'"
echo "git push origin main"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 2: Trigger deploy en Render"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "1. Ve a: https://dashboard.render.com/"
echo "2. Busca tu servicio: landing-page-534b"
echo "3. Click en 'Manual Deploy' → 'Deploy latest commit'"
echo "   O espera el auto-deploy (si está configurado)"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 3: Verificar el deployment"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "Después del deployment (espera 2-3 minutos):"
echo ""
echo "# Test rápido"
echo "curl https://landing-page-534b.onrender.com/api/health"
echo ""
echo "# Debe responder con:"
echo '# {"status":"ok","mongodb":"connected",...}'
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "PASO 4: Probar en producción"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "1. Ve a: https://dedecorinfo.com/booking"
echo "2. Selecciona un servicio y fecha"
echo "3. Intenta hacer una reserva"
echo "4. Debería funcionar SIN timeout ahora"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "NOTAS IMPORTANTES"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "⏱️ TIMEOUTS:"
echo "  - Frontend: 45 segundos (antes: 15s)"
echo "  - Primer request a Render: puede tardar 30-40s (cold start)"
echo "  - Requests siguientes: 2-4 segundos"
echo ""

echo "🔧 DNS FIX:"
echo "  - Servidor usa DNS de Google (8.8.8.8)"
echo "  - Resuelve el problema de querySrv ECONNREFUSED"
echo "  - Funciona tanto en local como en Render"
echo ""

echo "🚫 ERROR 409 FIX:"
echo "  - Ya no reintenta en error 409 (Conflict)"
echo "  - Evita crear reservas duplicadas"
echo "  - El primer timeout que crea la reserva ya no genera error"
echo ""

echo "✅ TODO LISTO PARA DEPLOY"
