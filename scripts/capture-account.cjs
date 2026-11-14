const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const brainDir = 'C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a';
const tmpDir = path.join(os.tmpdir(), 'chrome_acc_' + Date.now());

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9250',
  '--disable-gpu',
  `--user-data-dir=${tmpDir}`,
  '--window-size=1280,950',
  'http://localhost:3000/account.html'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9250/json');
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
          fs.writeFileSync(`${brainDir}/screen-account-clean.png`, Buffer.from(msg.result.data, 'base64'));
          console.log('Saved screen-account-clean.png');
          ws.close();
          chromeProc.kill();
          process.exit(0);
        }
      };
    };
  } catch (err) {
    console.error(err);
    chromeProc.kill();
    process.exit(1);
  }
}, 2000);
