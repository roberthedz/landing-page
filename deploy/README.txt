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
