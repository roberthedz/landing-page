#!/bin/bash

# Script para generar build de producción
# Uso: ./build-production.sh

set -e  # Detener si hay errores

echo "🚀 Iniciando build de producción..."
echo "📂 Directorio: $(pwd)"
echo ""

# Cargar nvm y usar Node 20
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# Verificar Node y npm
echo "🔍 Verificando entorno..."
echo "Node: $(node -v)"
echo "npm: $(npm -v)"
echo ""

# Limpiar cache (NO borrar node_modules ni build completo, solo cache)
echo "🧹 Limpiando cache..."
rm -rf node_modules/.cache
echo "✅ Cache limpiado"
echo ""

# Ejecutar build con opciones optimizadas
echo "🔨 Ejecutando build de producción..."
echo "⏳ Esto puede tardar 2-5 minutos..."
echo ""

GENERATE_SOURCEMAP=false npm run build

echo ""
echo "✅ Build completado exitosamente!"
echo ""
echo "📦 Carpeta build/ lista para subir al servidor:"
echo "   $(pwd)/build"
echo ""
echo "📋 Contenido de build/:"
ls -lh build/ | head -15
echo ""
echo "🎉 ¡Listo para publicar!"

