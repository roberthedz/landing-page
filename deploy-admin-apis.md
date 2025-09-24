# 🚀 Guía para Desplegar APIs Admin a Render

## Problema Actual
Las APIs administrativas (`/api/admin/*`) solo están en tu servidor local, pero el frontend está apuntando a Render para las APIs normales.

## Soluciones

### ✅ **Solución Inmediata: Servidor Local para Admin**

He configurado el sistema para que cuando accedas a `/admin`, automáticamente use tu servidor local (`localhost:3001`) para las APIs administrativas.

**Pasos:**
1. Asegúrate de que tu servidor local esté corriendo en puerto 3001
2. Ve a `https://dedecorinfo.com/admin`
3. Las APIs admin se conectarán automáticamente a `localhost:3001`
4. Las APIs normales seguirán usando Render

### 🌐 **Solución Permanente: Desplegar a Render**

Para que funcione completamente en producción, sigue estos pasos:

#### 1. Subir Cambios a tu Repositorio Git
```bash
git add .
git commit -m "feat: Add admin panel with date blocking functionality"
git push origin main
```

#### 2. Render Desplegará Automáticamente
Render detectará los cambios y desplegará automáticamente las nuevas APIs.

#### 3. Verificar Despliegue
Una vez desplegado, verifica que las APIs admin funcionen:
```bash
# Test login
curl -X POST https://landing-page-534b.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"dedecorAdmin"}'

# Test health check
curl https://landing-page-534b.onrender.com/api/health
```

#### 4. Revertir Configuración Local
Después del despliegue, puedes revertir la configuración para usar solo Render:
```javascript
// En src/config/apiConfig.js, cambiar de:
if (window.location.pathname === '/admin') {
  return 'http://localhost:3001/api';
}

// A:
// (eliminar esa condición)
```

## 🔧 Configuración Actual

### Para Desarrollo/Pruebas Inmediatas:
- **Panel Admin:** `localhost:3001/api/admin/*`
- **APIs Normales:** `https://landing-page-534b.onrender.com/api/*`

### Para Producción (después del despliegue):
- **Todo:** `https://landing-page-534b.onrender.com/api/*`

## 🚨 Importante

1. **Servidor Local:** Debe estar corriendo en puerto 3001 para que funcione el admin
2. **CORS:** Tu servidor local debe permitir conexiones desde `dedecorinfo.com`
3. **Seguridad:** En producción, considera cambiar las credenciales admin

## 🎯 Prueba Rápida

1. Inicia tu servidor local: `npm start` o `node server.js`
2. Ve a `https://dedecorinfo.com/admin`
3. Login con: `admin` / `dedecorAdmin`
4. ¡Deberías poder bloquear fechas!

Si tienes problemas de CORS, verifica que tu servidor local tenga configurado:
```javascript
'https://dedecorinfo.com',
'http://dedecorinfo.com'
```
en la lista de orígenes permitidos.
