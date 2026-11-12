const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9223',
  '--disable-gpu',
  '--window-size=1280,1100',
  'http://localhost:3000/shop.html'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9223/json');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('shop.html'));
    if (!tab) throw new Error('Tab not found');

    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    ws.onopen = () => {
      let id = 1;
      const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));

      send('Page.enable');
      send('Runtime.enable');

      setTimeout(() => {
        send('Runtime.evaluate', {
          expression: `
            const chk = document.querySelector('#checkout-modal');
            if (chk) chk.showModal();
            // Click SIGN IN
            const btn = document.querySelector('#chk-auth-action-btn');
            if (btn) btn.click();
          `
        });
      }, 1200);

      setTimeout(() => {
        send('Page.captureScreenshot', { format: 'png' });
      }, 2500);

      ws.onmessage = evt => {
        const msg = JSON.parse(evt.data);
        if (msg.result && msg.result.data) {
          const outPath = 'C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a/screen-checkout-signin-open.png';
          fs.writeFileSync(outPath, Buffer.from(msg.result.data, 'base64'));
          console.log('Saved screen-checkout-signin-open.png!');
          ws.close();
          chromeProc.kill();
          process.exit(0);
        }
      };
    };
  } catch (err) {
    console.error('Error:', err.message);
    chromeProc.kill();
    process.exit(1);
  }
}, 2000);
