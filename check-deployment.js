const https = require('https');

console.log('🔍 Verificando deployment en Render...\n');

function checkAPI(path, description) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'dedecorinfo.com',
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'Deployment-Check/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const isJSON = res.headers['content-type']?.includes('application/json');
        console.log(`${description}:`);
        console.log(`  Status: ${res.statusCode}`);
        console.log(`  Content-Type: ${res.headers['content-type'] || 'unknown'}`);
        console.log(`  Response: ${isJSON ? 'JSON ✅' : 'HTML ❌'}`);
        
        if (isJSON) {
          try {
            const parsed = JSON.parse(data);
            console.log(`  Data: ${JSON.stringify(parsed, null, 2)}`);
          } catch (e) {
            console.log(`  Data: ${data.substring(0, 200)}...`);
          }
        }
        console.log('');
        resolve(isJSON);
      });
    });

    req.on('error', (error) => {
      console.log(`${description}: ERROR - ${error.message}\n`);
      resolve(false);
    });

    req.end();
  });
}

async function main() {
  const results = [];
  
  // Verificar APIs principales
  results.push(await checkAPI('/api/system-status', '🩺 API System Status'));
  results.push(await checkAPI('/api/booked-slots', '📅 API Booked Slots'));
  results.push(await checkAPI('/api/health', '❤️ API Health'));
  
  const successCount = results.filter(r => r).length;
  console.log('='.repeat(50));
  console.log(`RESULTADO: ${successCount}/${results.length} APIs funcionando correctamente`);
  
  if (successCount === results.length) {
    console.log('🎉 ¡DEPLOYMENT EXITOSO! El servidor está actualizado.');
    console.log('✅ Puedes hacer reservas y los horarios se bloquearán automáticamente.');
  } else {
    console.log('❌ Deployment incompleto. Render aún no ha aplicado los cambios.');
    console.log('💡 Ve a Render Dashboard y haz "Manual Deploy".');
  }
  console.log('='.repeat(50));
}

main(); 