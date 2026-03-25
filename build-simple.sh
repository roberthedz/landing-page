#!/bin/bash

# Script simple para generar build
# Ejecuta: ./build-simple.sh

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

cd "/Users/roberthernandez/Documents/landing page/landing-page"

rm -rf node_modules/.cache
GENERATE_SOURCEMAP=false npm run build

echo ""
echo "✅ Build completado!"
echo "📦 Carpeta build/ lista en: $(pwd)/build"


