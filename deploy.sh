#!/bin/bash

echo "🚀 Iniciando proceso de despliegue..."

# Hacer el build
echo "📦 Haciendo build de la aplicación..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completado exitosamente"
    
    # Crear directorio de despliegue si no existe
    if [ ! -d "deploy/public_html" ]; then
        mkdir -p deploy/public_html
    fi
    
    # Copiar archivos del build al directorio de despliegue
    echo "📋 Copiando archivos..."
    cp -r build/* deploy/public_html/
    
    echo "✅ Archivos copiados a deploy/public_html/"
    echo "📁 Contenido del directorio de despliegue:"
    ls -la deploy/public_html/
    
    echo ""
    echo "🎉 ¡Despliegue completado!"
    echo "📝 Ahora puedes subir los archivos de la carpeta 'deploy/public_html/' a tu servidor"
    echo "💡 Recuerda limpiar la caché del navegador (Ctrl+F5) para ver los cambios"
    
else
    echo "❌ Error en el build"
    exit 1
fi 