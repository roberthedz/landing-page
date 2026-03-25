/**
 * Gmail SMTP sender usando módulos nativos de Node.js
 * No requiere instalación de dependencias externas.
 */
const tls = require('tls');

function encodeBase64(str) {
  return Buffer.from(str).toString('base64');
}

function buildMimeMessage({ from, to, subject, html }) {
  const boundary = `----=_Boundary_${Date.now()}`;
  const lines = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=utf-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    encodeBase64(html),
    `--${boundary}--`,
  ];
  return lines.join('\r\n');
}

function sendGmail({ from, to, subject, html, user, pass }) {
  return new Promise((resolve, reject) => {
    const message = buildMimeMessage({ from, to, subject, html });
    let step = 0;
    let buffer = '';

    const socket = tls.connect(
      { host: 'smtp.gmail.com', port: 465, servername: 'smtp.gmail.com' },
      () => { /* TLS connected */ }
    );

    socket.setTimeout(15000);

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('SMTP timeout'));
    });

    socket.on('error', (err) => {
      reject(new Error(`SMTP socket error: ${err.message}`));
    });

    const send = (cmd) => {
      socket.write(cmd + '\r\n');
    };

    socket.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\r\n');
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        if (!line) continue;
        const code = parseInt(line.substring(0, 3), 10);

        if (step === 0 && code === 220) {
          send(`EHLO smtp.gmail.com`);
          step = 1;
        } else if (step === 1 && (code === 250 || code === 220)) {
          if (!line.startsWith('250-') && !line.startsWith('220-')) {
            send(`AUTH LOGIN`);
            step = 2;
          }
        } else if (step === 2 && code === 334) {
          send(encodeBase64(user));
          step = 3;
        } else if (step === 3 && code === 334) {
          send(encodeBase64(pass));
          step = 4;
        } else if (step === 4 && code === 235) {
          send(`MAIL FROM:<${user}>`);
          step = 5;
        } else if (step === 5 && code === 250) {
          send(`RCPT TO:<${to}>`);
          step = 6;
        } else if (step === 6 && code === 250) {
          send(`DATA`);
          step = 7;
        } else if (step === 7 && code === 354) {
          send(message);
          send(`\r\n.`);
          step = 8;
        } else if (step === 8 && code === 250) {
          send(`QUIT`);
          step = 9;
        } else if (step === 9 && code === 221) {
          socket.destroy();
          resolve(true);
        } else if (code >= 400) {
          socket.destroy();
          reject(new Error(`SMTP error ${code}: ${line}`));
        }
      }
    });
  });
}

module.exports = { sendGmail };
