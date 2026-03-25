# Instrucciones para Generar el Build

## Problema Actual
Tu proyecto requiere **Node 20.x** pero tienes **Node v24.9.0** instalado, lo que causa incompatibilidades.

## Solución Recomendada: Instalar nvm y usar Node 20

### Paso 1: Instalar nvm (Node Version Manager)

Ejecuta en tu terminal:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

Luego recarga tu terminal o ejecuta:
```bash
source ~/.zshrc
```

### Paso 2: Instalar Node 20

```bash
nvm install 20
nvm use 20
```

Verifica que esté usando Node 20:
```bash
node -v
# Debería mostrar: v20.x.x
```

### Paso 3: Reinstalar dependencias y hacer build

```bash
cd "/Users/roberthernandez/Documents/landing page/landing-page"
rm -rf node_modules package-lock.json
npm install
./build-production.sh
```

## Alternativa Rápida (si tienes acceso a otra máquina)

Si tienes acceso a otra computadora con Node 20:
1. Copia todo el proyecto
2. Ejecuta `npm install` y `npm run build`
3. Copia la carpeta `build/` de vuelta

## Estructura del Build

Una vez generado correctamente, la carpeta `build/` contendrá:
- `index.html`
- `static/` (con CSS y JS minificados)
- `images/`
- `asset-manifest.json`
- Otros archivos estáticos

Esta carpeta `build/` es lo que debes subir al servidor.

