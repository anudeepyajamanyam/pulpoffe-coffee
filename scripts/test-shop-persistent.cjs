const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9250',
  '--disable-gpu',
  '--window-size=1280,950',
  'http://localhost:3000/shop.html'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9250/json');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('shop.html')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    ws.onopen = () => {
      let id = 1;
      const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));
      send('Page.enable');
      send('Runtime.enable');

      // Step 1: Click the first product's "Add to basket +" button
      setTimeout(() => {
        console.log('Clicking Add to basket on first product card...');
        send('Runtime.evaluate', {
          expression: `
            const btn = document.querySelector('.product-card .add-basket');
            if (btn) btn.click();
            'Clicked: ' + !!btn;
          `
        });
      }, 1000);

      // Step 2: After 2.5s (long after the old 1.5s timeout would have vanished), capture screenshot to prove it stays persistent green!
      setTimeout(() => {
        console.log('Capturing persistent quantity controller screenshot after 2.5s...');
        send('Page.captureScreenshot', { format: 'png' });
      }, 3500);

      ws.onmessage = evt => {
        const msg = JSON.parse(evt.data);
        if (msg.result && msg.result.data) {
          const outPath = 'C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a/screen-shop-persistent-qty.png';
          fs.writeFileSync(outPath, Buffer.from(msg.result.data, 'base64'));
          console.log('Saved screen-shop-persistent-qty.png successfully!');
          ws.close();
          chromeProc.kill();
          process.exit(0);
        }
      };
    };
  } catch (err) {
    console.error('Error:', err);
    chromeProc.kill();
    process.exit(1);
  }
}, 1500);
