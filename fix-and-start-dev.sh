#!/bin/bash

# Script para arreglar dependencias e iniciar servidor de desarrollo
# Uso: ./fix-and-start-dev.sh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

cd "/Users/roberthernandez/Documents/landing page/landing-page"

echo "🔧 Arreglando dependencias..."
echo ""

# Limpiar dependencias
echo "1/3 Limpiando dependencias anteriores..."
rm -rf node_modules package-lock.json
echo "✅ Limpiado"
echo ""

# Reinstalar
echo "2/3 Reinstalando dependencias (esto puede tardar 30-40 segundos)..."
npm install
echo "✅ Dependencias instaladas"
echo ""

# Iniciar servidor
echo "3/3 Iniciando servidor de desarrollo..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 Servidor iniciando..."
echo "🌐 Se abrirá en: http://localhost:3000"
echo "📝 Verás los logs aquí abajo"
echo "⏸️  Presiona Ctrl+C para detener"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

BROWSER=none npm run dev

