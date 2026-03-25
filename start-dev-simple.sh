#!/bin/bash

# Script simple para iniciar servidor de desarrollo
# Este script te mostrará los logs en tiempo real

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

cd "/Users/roberthernandez/Documents/landing page/landing-page"

echo "🚀 Iniciando servidor de desarrollo..."
echo "📍 Ubicación: $(pwd)"
echo "🔧 Node: $(node -v)"
echo ""
echo "⏳ El servidor está compilando..."
echo "📝 Verás los logs aquí abajo"
echo "🌐 Cuando termine, se abrirá en: http://localhost:3000"
echo ""
echo "Presiona Ctrl+C para detener"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Ejecutar y mostrar output en tiempo real
BROWSER=none npm run dev

