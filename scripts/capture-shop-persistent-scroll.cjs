const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9253',
  '--disable-gpu',
  '--window-size=1280,1000',
  'http://localhost:3000/shop.html'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9253/json');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('shop.html')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    ws.onopen = () => {
      let id = 1;
      const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));
      send('Page.enable');
      send('Runtime.enable');

      // Scroll to cards and click Add to basket on first card
      setTimeout(() => {
        send('Runtime.evaluate', {
          expression: `
            window.scrollTo({ top: 380, behavior: 'instant' });
            const btn = document.querySelector('.product-card .add-basket');
            if (btn) btn.click();
          `
        });
      }, 1000);

      // Wait 3 seconds to prove it persists permanently
      setTimeout(() => {
        send('Page.captureScreenshot', { format: 'png' });
      }, 3500);

      ws.onmessage = evt => {
        const msg = JSON.parse(evt.data);
        if (msg.result && msg.result.data) {
          const outPath = 'C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a/screen-shop-persistent-scroll.png';
          fs.writeFileSync(outPath, Buffer.from(msg.result.data, 'base64'));
          console.log('Saved screen-shop-persistent-scroll.png successfully!');
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
