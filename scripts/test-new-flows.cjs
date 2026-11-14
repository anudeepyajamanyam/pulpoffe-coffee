const { spawn } = require('child_process');
const fs = require('fs');

const brainDir = 'C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a';

async function captureTab(port, url, width, height, setupScript, captureDelay, outFile) {
  return new Promise((resolve, reject) => {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const chromeProc = spawn(chromePath, [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      '--disable-gpu',
      `--window-size=${width},${height}`,
      url
    ]);

    setTimeout(async () => {
      try {
        const listRes = await fetch(`http://127.0.0.1:${port}/json`);
        const tabs = await listRes.json();
        const tab = tabs[0];
        if (!tab) throw new Error('Tab not found');

        const ws = new WebSocket(tab.webSocketDebuggerUrl);

        ws.onopen = () => {
          let id = 1;
          const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));
          send('Page.enable');
          send('Runtime.enable');

          if (setupScript) {
            setTimeout(() => {
              send('Runtime.evaluate', { expression: setupScript });
            }, 800);
          }

          setTimeout(() => {
            send('Page.captureScreenshot', { format: 'png' });
          }, captureDelay);

          ws.onmessage = evt => {
            const msg = JSON.parse(evt.data);
            if (msg.result && msg.result.data) {
              fs.writeFileSync(outFile, Buffer.from(msg.result.data, 'base64'));
              console.log(`Saved screenshot: ${outFile}`);
              ws.close();
              chromeProc.kill();
              resolve();
            }
          };
        };
      } catch (err) {
        chromeProc.kill();
        reject(err);
      }
    }, 1800);
  });
}

async function run() {
  console.log('1. Testing dedicated multi-step checkout.html with populated basket...');
  await captureTab(
    9240,
    'http://localhost:3000/checkout.html',
    1280,
    1100,
    `
      localStorage.setItem('pulpoffe-basket-v1', JSON.stringify({
        'gold-choco-orange__100g': 2,
        'silver-prime-70-30__100g': 1
      }));
      window.location.reload();
    `,
    3200,
    `${brainDir}/screen-dedicated-checkout.png`
  );

  console.log('2. Testing homepage header User Icon & Google Login Popover (Levista style)...');
  await captureTab(
    9241,
    'http://localhost:3000/index.html',
    1280,
    900,
    `
      const userBtn = document.getElementById('header-user-btn');
      if (userBtn) userBtn.click();
    `,
    2000,
    `${brainDir}/screen-header-user-popover.png`
  );

  console.log('3. Testing clean customer account login page (account.html)...');
  await captureTab(
    9242,
    'http://localhost:3000/account.html',
    1280,
    950,
    `
      localStorage.removeItem('pulpoffe_user');
      localStorage.removeItem('pulpoffe_token');
    `,
    1500,
    `${brainDir}/screen-account-clean-login.png`
  );

  console.log('4. Testing clean admin page (admin.html)...');
  await captureTab(
    9243,
    'http://localhost:3000/admin.html',
    1280,
    950,
    null,
    1500,
    `${brainDir}/screen-admin-clean.png`
  );

  console.log('All tests completed successfully!');
}

run().catch(console.error);
