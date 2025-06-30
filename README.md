# DeDecor - Sistema de Reservas

Este proyecto implementa un sistema de reservas para la empresa DeDecor, permitiendo a los clientes agendar citas para servicios de decoración de interiores.

## Características

- Formulario de reserva con validación completa
- Sistema de confirmación por email
- Gestión de horarios ocupados
- Confirmación/rechazo de reservas por parte de la empresa
- Notificaciones por email a clientes y empresa

## Requisitos

- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

## Instalación

1. Clonar el repositorio:
```
git clone <url-del-repositorio>
cd landing-page
```

2. Instalar dependencias:
```
npm install
```

## Configuración

### Simulación de Emails en Desarrollo

En el entorno de desarrollo, los emails no se envían realmente sino que se simulan y se muestran en la consola del servidor. Esto facilita las pruebas sin necesidad de configurar credenciales reales.

Para ver los emails simulados, simplemente ejecuta la aplicación en modo desarrollo y observa la consola del servidor.

### Configuración de Email para Producción

Para el entorno de producción, necesitarás configurar credenciales reales. Recomendamos usar una "Contraseña de aplicación" de Google en lugar de la contraseña normal:

1. Ve a tu cuenta de Google > Seguridad > Verificación en dos pasos (actívala si no lo está)
2. Luego ve a "Contraseñas de aplicaciones"
3. Genera una nueva contraseña para la aplicación
4. Configura las variables de entorno:
   ```
   EMAIL_USER=dedecorinfo@gmail.com
   EMAIL_PASS=tu-contraseña-de-aplicación
   ```

Puedes configurar estas variables en el servidor donde despliegues la aplicación o en un archivo `.env` (asegúrate de no incluirlo en el control de versiones).

### Configuración de Plantillas de Email

Las plantillas de email están configuradas en `src/config/emailTemplates.js`. En un entorno de producción, deberías crear plantillas específicas para cada tipo de email en EmailJS.

## Ejecución

### Desarrollo

Para ejecutar la aplicación en modo desarrollo:

```
npm run dev
```

Este comando inicia tanto el servidor Node.js como la aplicación React.

- El servidor se ejecuta en: http://localhost:3000
- La aplicación React se ejecuta en: http://localhost:3001

### Producción

Para compilar la aplicación para producción:

```
npm run build
```

Para ejecutar solo el servidor (después de compilar):

```
npm run server
```

## Flujo de Reservas

1. **Cliente hace una reserva**:
   - Completa el formulario con sus datos
   - Selecciona servicio, fecha y hora
   - El sistema verifica que el horario no esté ocupado
   - Al confirmar, se envía un email a dedecorinfo@gmail.com con los detalles
   - El cliente recibe un email de confirmación indicando que su reserva está pendiente

2. **Empresa gestiona la reserva**:
   - Recibe un email con los detalles y botones para aceptar/rechazar
   - Al hacer clic en un botón, se redirige a una página web que procesa la acción

3. **Confirmación o rechazo**:
   - Si se acepta: Se marca el horario como ocupado y se envía email al cliente
   - Si se rechaza: Se envía email al cliente informando que su reserva fue rechazada

## Estructura del Proyecto

- `server.js`: Servidor Node.js con Express
- `src/components/Booking.js`: Componente principal del formulario de reserva
- `src/pages/BookingConfirmation.js`: Página para confirmar/rechazar reservas
- `src/config/emailTemplates.js`: Configuración de plantillas de email

## Notas Importantes

- En un entorno de producción, se recomienda:
  - Usar una base de datos real en lugar de localStorage
  - Configurar variables de entorno para credenciales sensibles
  - Implementar autenticación para la confirmación/rechazo de reservas
  - Añadir un panel de administración para gestionar todas las reservas

## API REST

El sistema proporciona una API REST para interactuar con el sistema de reservas. A continuación se detallan los endpoints disponibles y ejemplos de uso con curl.

### 1. Crear una nueva reserva

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "clientName": "Nombre Cliente",
    "clientEmail": "cliente@ejemplo.com",
    "clientPhone": "123456789",
    "service": "ChairCraft Revive",
    "servicePrice": "$99",
    "date": "15/08/2023",
    "time": "10:00",
    "type": "presencial",
    "notes": "Notas adicionales"
  }'
```

Respuesta:
```json
{
  "success": true,
  "bookingId": "booking-1234567890-123"
}
```

### 2. Confirmar una reserva

```bash
curl -X POST http://localhost:3000/api/bookings/booking-1234567890-123/status \
  -H "Content-Type: application/json" \
  -d '{
    "action": "confirm"
  }'
```

Respuesta:
```json
{
  "success": true,
  "message": "Reserva confirmada exitosamente"
}
```

### 3. Rechazar una reserva

```bash
curl -X POST http://localhost:3000/api/bookings/booking-1234567890-123/status \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reject"
  }'
```

Respuesta:
```json
{
  "success": true,
  "message": "Reserva rechazada exitosamente"
}
```

### 4. Cancelar una reserva confirmada

```bash
curl -X POST http://localhost:3000/api/bookings/booking-1234567890-123/cancel
```

Respuesta:
```json
{
  "success": true,
  "message": "Reserva cancelada exitosamente"
}
```

### 5. Obtener horarios ocupados

```bash
curl -X GET http://localhost:3000/api/booked-slots
```

Respuesta:
```json
[
  {
    "date": "15/08/2023",
    "time": "10:00",
    "bookingId": "booking-1234567890-123"
  }
]
```

### 6. Listar todas las reservas

```bash
curl -X GET http://localhost:3000/api/bookings
```

Respuesta:
```json
[
  {
    "id": "booking-1234567890-123",
    "clientName": "Nombre Cliente",
    "service": "ChairCraft Revive",
    "date": "15/08/2023",
    "time": "10:00",
    "status": "confirmed"
  },
  {
    "id": "booking-1234567891-456",
    "clientName": "Otro Cliente",
    "service": "Vase Visionaries",
    "date": "16/08/2023",
    "time": "11:00",
    "status": "pending"
  }
]
```

### 7. Listar reservas por estado

```bash
curl -X GET http://localhost:3000/api/bookings?status=confirmed
```

Respuesta:
```json
[
  {
    "id": "booking-1234567890-123",
    "clientName": "Nombre Cliente",
    "service": "ChairCraft Revive",
    "date": "15/08/2023",
    "time": "10:00",
    "status": "confirmed"
  }
]
```

### Notas sobre la API:

1. Reemplaza `booking-1234567890-123` con el ID real de la reserva que obtengas al crearla.
2. Para cancelar una reserva, esta debe estar previamente confirmada.
3. Al cancelar una reserva, el horario se libera automáticamente y puede ser reservado nuevamente.
4. Todos los endpoints devuelven respuestas en formato JSON.
5. Puedes filtrar las reservas por estado usando los valores: `pending`, `confirmed`, `rejected` o `cancelled`.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# Guía para publicar la web en GoDaddy

Esta guía explica cómo publicar la aplicación web en el dominio dedecorinfo.com usando el hosting compartido de GoDaddy.

## Paso 1: Preparar la aplicación para producción

1. Primero, construye la aplicación React para producción:

```bash
cd landing-page
npm run build
```

Este comando creará una carpeta `build` con todos los archivos estáticos optimizados.

2. Modifica el archivo `server.js` para servir los archivos estáticos:

```javascript
// Añade esta línea al principio del archivo server.js
const path = require('path');

// Asegúrate de que esta línea esté presente (ya debería estarlo)
app.use(express.static(path.join(__dirname, 'build')));

// Añade esta ruta al final del archivo, antes de app.listen
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
```

3. Crea un archivo `.htaccess` en la carpeta `build`:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Para redirigir las solicitudes de API al servidor Node.js
<IfModule mod_proxy.c>
  ProxyPreserveHost On
  ProxyPass /api http://localhost:3000/api
  ProxyPassReverse /api http://localhost:3000/api
</IfModule>
```

## Paso 2: Configurar el hosting en GoDaddy

1. Inicia sesión en tu cuenta de GoDaddy.
2. Ve a "Mis productos" y selecciona el hosting asociado a dedecorinfo.com.
3. Haz clic en "Administrar" y luego en "cPanel".

## Paso 3: Subir los archivos al servidor

1. En cPanel, busca y haz clic en "Administrador de archivos".
2. Navega hasta la carpeta `public_html`.
3. Sube todos los archivos de la carpeta `build` a la carpeta `public_html`.
4. Crea una carpeta llamada `node_app` en la raíz del hosting (fuera de public_html).
5. Sube los siguientes archivos a la carpeta `node_app`:
   - server.js
   - package.json
   - package-lock.json
   - Cualquier otro archivo necesario para el servidor

## Paso 4: Configurar Node.js en el servidor compartido

1. En cPanel, busca "Configuración de Node.js".
   - Si no encuentras esta opción, es posible que necesites contactar al soporte de GoDaddy para activar Node.js en tu hosting.

2. Crea una nueva aplicación Node.js:
   - Ruta de la aplicación: `/node_app`
   - Punto de entrada: `server.js`
   - Versión de Node.js: Selecciona la versión más reciente disponible
   - Modo de inicio: Producción
   - Puertos: Usa el puerto que te asigne GoDaddy (anótalo)

3. Haz clic en "Crear" para iniciar la aplicación.

## Paso 5: Instalar dependencias

1. En cPanel, busca y haz clic en "Terminal".
2. Navega a la carpeta de la aplicación:

```bash
cd node_app
```

3. Instala las dependencias:

```bash
npm install
```

## Paso 6: Configurar variables de entorno

1. Crea un archivo `.env` en la carpeta `node_app`:

```
PORT=3000
GMAIL_APP_PASSWORD=ihrvuveqsskjxyog
NODE_ENV=production
```

## Paso 7: Configurar el servicio para que se ejecute permanentemente

1. En cPanel, busca "Administrador de procesos de Node.js".
2. Asegúrate de que tu aplicación esté configurada para reiniciarse automáticamente.

## Paso 8: Configurar el dominio

1. En cPanel, busca "Dominios".
2. Asegúrate de que dedecorinfo.com esté correctamente configurado para apuntar a tu hosting.

## Solución de problemas comunes

### El servidor Node.js no se inicia
- Verifica los registros de error en cPanel > Registros > Registros de error.
- Asegúrate de que todas las dependencias estén instaladas.
- Comprueba que el puerto configurado en el archivo server.js coincida con el puerto asignado por GoDaddy.

### La aplicación React no carga correctamente
- Verifica que el archivo .htaccess esté correctamente configurado.
- Comprueba que todos los archivos estáticos se hayan subido correctamente.
- Limpia la caché del navegador.

### Las API no funcionan
- Verifica que las rutas de API estén correctamente configuradas en el servidor.
- Comprueba que el proxy en .htaccess esté correctamente configurado.

## Notas importantes

- GoDaddy puede tener limitaciones en el uso de Node.js en hosting compartido. Si experimentas problemas de rendimiento, considera actualizar a un plan de hosting VPS o dedicado.
- Asegúrate de mantener seguras tus credenciales de email y otras claves sensibles.
- Configura correctamente CORS en el servidor para permitir solicitudes desde tu dominio.
# landing-page
