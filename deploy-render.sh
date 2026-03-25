#!/bin/bash

# ─── Deploy a Render via GitHub ──────────────────────────────────────────────
# Uso: ./deploy-render.sh "mensaje del commit"
# Si no se pasa mensaje, usa la fecha/hora actual.
# Render detecta el push y despliega automáticamente.

set -e

cd "/Users/roberthernandez/Documents/landing page/landing-page"

echo ""
echo "╔════════════════════════════════════════╗"
echo "║        🚀  Deploy a Render             ║"
echo "╚════════════════════════════════════════╝"
echo ""

# ── 1. Verificar que no hay conflictos ───────────────────────────────────────
echo "🔍 Verificando estado del repositorio..."
git status --short
echo ""

# ── 2. Build de producción ───────────────────────────────────────────────────
echo "🔨 Generando build de producción..."
CI=false npm run build
echo "✅ Build listo"
echo ""

# ── 3. Commit y push ─────────────────────────────────────────────────────────
MENSAJE="${1:-Deploy $(date '+%Y-%m-%d %H:%M')}"

echo "📦 Preparando commit: \"$MENSAJE\""
git add -A
git commit -m "$MENSAJE" || echo "⚠️  Sin cambios nuevos que commitear"
echo ""

echo "⬆️  Subiendo a GitHub (rama main)..."
git push origin main
echo ""

echo "╔════════════════════════════════════════╗"
echo "║  ✅  Push exitoso                      ║"
echo "║  Render iniciará el deploy en ~1 min   ║"
echo "║  https://dashboard.render.com          ║"
echo "╚════════════════════════════════════════╝"
echo ""
