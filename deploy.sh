#!/bin/bash

# Script para desplegar la aplicación en GoDaddy
echo "Iniciando proceso de despliegue para dedecorinfo.com"

# 1. Construir la aplicación React
echo "Construyendo la aplicación React..."
npm run build
if [ $? -ne 0 ]; then
  echo "Error al construir la aplicación"
  exit 1
fi
echo "Aplicación React construida correctamente"

# 2. Crear carpeta para el servidor Node.js
echo "Preparando archivos del servidor..."
mkdir -p deploy/node_app
mkdir -p deploy/public_html

# 3. Copiar archivos del build a public_html
echo "Copiando archivos estáticos a public_html..."
cp -r build/* deploy/public_html/

# 4. Copiar archivos del servidor a node_app
echo "Copiando archivos del servidor a node_app..."
cp server.js deploy/node_app/
cp package.json deploy/node_app/
cp package-lock.json deploy/node_app/

# 5. Crear archivo .env para producción
echo "Creando archivo .env para producción..."
cat > deploy/node_app/.env << EOL
PORT=3000
GMAIL_APP_PASSWORD=ihrvuveqsskjxyog
NODE_ENV=production
EOL

# 6. Crear README con instrucciones
echo "Creando instrucciones de despliegue..."
cat > deploy/README.txt << EOL
INSTRUCCIONES DE DESPLIEGUE PARA DEDECORINFO.COM

1. Sube todos los archivos de la carpeta 'public_html' a la carpeta 'public_html' de tu hosting en GoDaddy.

2. Crea una carpeta llamada 'node_app' en la raíz de tu hosting (fuera de public_html).

3. Sube todos los archivos de la carpeta 'node_app' a la carpeta 'node_app' de tu hosting.

4. En el panel de control de GoDaddy (cPanel):
   - Busca la sección "Configuración de Node.js"
   - Crea una nueva aplicación Node.js:
     * Ruta de la aplicación: /node_app
     * Punto de entrada: server.js
     * Versión de Node.js: Selecciona la más reciente disponible
     * Modo de inicio: Producción

5. Accede a la terminal de tu hosting y ejecuta:
   cd node_app
   npm install

6. Inicia la aplicación Node.js desde el panel de control de GoDaddy.

7. Asegúrate de que el dominio dedecorinfo.com esté correctamente configurado para apuntar a tu hosting.

Si tienes problemas:
- Verifica los registros de error en cPanel > Registros > Registros de error
- Contacta al soporte de GoDaddy si no encuentras la opción para configurar Node.js
EOL

echo "¡Despliegue preparado!"
echo "Los archivos están listos en la carpeta 'deploy'"
echo "Sigue las instrucciones en deploy/README.txt para completar el despliegue en GoDaddy" 