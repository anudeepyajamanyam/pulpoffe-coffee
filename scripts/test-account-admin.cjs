const { spawn } = require('child_process');
const fs = require('fs');

const brainDir = 'C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a';

async function testPage(port, url, outFile) {
  return new Promise((resolve, reject) => {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const chromeProc = spawn(chromePath, [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      '--disable-gpu',
      '--window-size=1280,950',
      url
    ]);

    setTimeout(async () => {
      try {
        const listRes = await fetch(`http://127.0.0.1:${port}/json`);
        const tabs = await listRes.json();
        const tab = tabs[0];
        const ws = new WebSocket(tab.webSocketDebuggerUrl);

        ws.onopen = () => {
          let id = 1;
          const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));
          send('Page.enable');

          setTimeout(() => {
            send('Page.captureScreenshot', { format: 'png' });
          }, 1500);

          ws.onmessage = evt => {
            const msg = JSON.parse(evt.data);
            if (msg.result && msg.result.data) {
              fs.writeFileSync(outFile, Buffer.from(msg.result.data, 'base64'));
              console.log(`Saved: ${outFile}`);
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
    }, 2000);
  });
}

async function run() {
  await testPage(9247, 'http://localhost:3000/account.html', `${brainDir}/screen-account-clean.png`);
  await testPage(9248, 'http://localhost:3000/admin.html', `${brainDir}/screen-admin-clean.png`);
  console.log('Both captured successfully!');
}

run().catch(console.error);
