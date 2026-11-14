const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9251',
  '--disable-gpu',
  '--window-size=1280,1050',
  'http://localhost:3000/product.html?id=gold-caramel'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9251/json');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('product.html')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    ws.onopen = () => {
      let id = 1;
      const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));
      send('Page.enable');
      send('Runtime.enable');

      setTimeout(() => {
        console.log('Capturing dedicated product page screenshot...');
        send('Page.captureScreenshot', { format: 'png' });
      }, 1500);

      ws.onmessage = evt => {
        const msg = JSON.parse(evt.data);
        if (msg.result && msg.result.data) {
          const outPath = 'C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a/screen-product-detail-page.png';
          fs.writeFileSync(outPath, Buffer.from(msg.result.data, 'base64'));
          console.log('Saved screen-product-detail-page.png successfully!');
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
