#!/bin/bash

# Script para configurar Node 20 y generar el build
# Ejecuta: ./setup-node20-and-build.sh

set -e

echo "🔧 Configurando Node 20 con nvm..."

# Cargar nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# Instalar Node 20 si no está instalado
if ! nvm list 2>/dev/null | grep -q "v20"; then
    echo "📦 Instalando Node 20..."
    nvm install 20
fi

# Usar Node 20 (instalar si aún no existe)
echo "🔄 Cambiando a Node 20..."
nvm use 20 || nvm install 20 && nvm use 20

echo "✅ Node version: $(node -v)"
echo "✅ npm version: $(npm -v)"
echo ""

# Ir al directorio del proyecto
cd "/Users/roberthernandez/Documents/landing page/landing-page"

# Limpiar e instalar dependencias
echo "🧹 Limpiando dependencias anteriores..."
rm -rf node_modules package-lock.json

echo "📦 Instalando dependencias con Node 20..."
npm install

echo ""
echo "🔨 Generando build de producción..."
GENERATE_SOURCEMAP=false npm run build

echo ""
echo "✅ Build completado exitosamente!"
echo "📦 Carpeta build/ lista en: $(pwd)/build"
echo ""
ls -lh build/ | head -15

