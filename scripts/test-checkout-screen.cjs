const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9245',
  '--disable-gpu',
  '--window-size=1280,1100',
  'http://localhost:3000/checkout.html'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9245/json');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('checkout.html')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    ws.onopen = () => {
      let id = 1;
      const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));
      send('Page.enable');
      send('Runtime.enable');

      setTimeout(() => {
        send('Runtime.evaluate', {
          expression: `
            localStorage.setItem('pulpoffe-basket-v1', JSON.stringify({
              'gold-choco-orange__100g': 2,
              'diamond-freeze-dried-pure__100g': 1
            }));
            window.location.reload();
          `
        });
      }, 1000);

      setTimeout(() => {
        send('Page.captureScreenshot', { format: 'png' });
      }, 3500);

      ws.onmessage = evt => {
        const msg = JSON.parse(evt.data);
        if (msg.result && msg.result.data) {
          fs.writeFileSync('C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a/screen-checkout-dedicated-step.png', Buffer.from(msg.result.data, 'base64'));
          console.log('Saved screen-checkout-dedicated-step.png successfully!');
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
}, 2200);
