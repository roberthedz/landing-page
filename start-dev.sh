#!/bin/bash

# Script para iniciar servidor de desarrollo
# Uso: ./start-dev.sh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

cd "/Users/roberthernandez/Documents/landing page/landing-page"

echo "🚀 Iniciando servidor de desarrollo..."
echo "📝 Node: $(node -v)"
echo "📝 NPM: $(npm -v)"
echo ""
echo "El servidor se abrirá en: http://localhost:3000"
echo "Presiona Ctrl+C para detener el servidor"
echo ""

BROWSER=none npm run dev

