#!/bin/bash

echo "🔧 SOLUCIÓN AL PROBLEMA DE DNS"
echo "================================"
echo ""
echo "El problema es DNS local, no MongoDB Atlas."
echo "Opciones:"
echo ""
echo "1. OPCIÓN A: Cambiar DNS manualmente"
echo "   - System Settings → Network → Wi-Fi"
echo "   - Click 'Details' → DNS"
echo "   - Agregar: 8.8.8.8 y 8.8.4.4"
echo ""
echo "2. OPCIÓN B: Cambiar DNS desde terminal (requiere contraseña)"
echo "   sudo networksetup -setdnsservers Wi-Fi 8.8.8.8 8.8.4.4"
echo ""
echo "3. OPCIÓN C: Usar hotspot de tu teléfono"
echo ""
echo "4. OPCIÓN D: Intentar flush DNS cache"
read -p "¿Quieres intentar flush DNS cache? (s/n): " respuesta

if [ "$respuesta" = "s" ]; then
  echo ""
  echo "Ejecuta este comando manualmente:"
  echo "sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder"
fi

echo ""
echo "Después de cambiar DNS, ejecuta:"
echo "node test-connection-complete.js"
