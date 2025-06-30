const fs = require('fs');
const path = require('path');

// Contenido del archivo .env
const envContent = `# Configuración del servidor
PORT=3000
NODE_ENV=development # Cambiar a 'production' en producción

# Credenciales de email (solo necesarias en producción)
EMAIL_USER=dedecorinfo@gmail.com
EMAIL_PASS=DEdecor25!

# Para usar este archivo en producción:
# 1. Reemplaza los valores con tus credenciales reales
# 2. Asegúrate de NO incluir el archivo .env en el control de versiones
`;

// Ruta del archivo .env
const envPath = path.join(__dirname, '.env');

// Verificar si el archivo ya existe
if (fs.existsSync(envPath)) {
  console.log('El archivo .env ya existe. Si deseas recrearlo, elimínalo primero.');
} else {
  // Crear el archivo .env
  fs.writeFileSync(envPath, envContent);
  console.log('Archivo .env creado exitosamente.');
  console.log('Recuerda reemplazar las credenciales con valores reales en producción.');
}

// Crear archivo .gitignore si no existe
const gitignorePath = path.join(__dirname, '.gitignore');
const gitignoreContent = `# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# production
/build

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

npm-debug.log*
yarn-debug.log*
yarn-error.log*
`;

if (!fs.existsSync(gitignorePath)) {
  fs.writeFileSync(gitignorePath, gitignoreContent);
  console.log('Archivo .gitignore creado exitosamente.');
} else {
  // Verificar si .env está en .gitignore
  const currentGitignore = fs.readFileSync(gitignorePath, 'utf8');
  if (!currentGitignore.includes('.env')) {
    fs.appendFileSync(gitignorePath, '\n.env\n');
    console.log('Añadido .env a .gitignore.');
  }
}

console.log('\nConfigura las variables de entorno en el archivo .env para producción.');
console.log('En desarrollo, los emails se simulan en la consola del servidor.'); 