const { spawn } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

// Test mobile menu on shop.html (uses feedback.js for menu logic)
const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9231',
  '--disable-gpu',
  '--window-size=390,844',
  'http://localhost:3000/shop.html'
]);

setTimeout(async () => {
  try {
    const listRes = await fetch('http://127.0.0.1:9231/json');
    const tabs = await listRes.json();
    const tab = tabs.find(t => t.url.includes('shop.html')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    ws.onopen = () => {
      let id = 1;
      const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));
      send('Page.enable');
      send('Runtime.enable');

      // Wait for DOMContentLoaded to ensure feedback.js's listener has bound
      setTimeout(() => {
        send('Runtime.evaluate', {
          expression: `
            const toggle = document.getElementById('menu-toggle');
            const drawer = document.getElementById('mobile-menu');
            const info = {
              toggleExists: !!toggle,
              drawerExists: !!drawer,
              toggleBound: !!(toggle && toggle._pulpoffeNavBound),
              drawerHidden: drawer ? drawer.hidden : 'N/A'
            };
            if (toggle) toggle.click();
            info.afterClick = { drawerHidden: drawer ? drawer.hidden : 'N/A', ariaExpanded: toggle?.getAttribute('aria-expanded') };
            JSON.stringify(info);
          `,
          returnByValue: true
        });
      }, 1500);

      setTimeout(() => {
        send('Page.captureScreenshot', { format: 'png' });
      }, 2200);

      ws.onmessage = evt => {
        const msg = JSON.parse(evt.data);
        if (msg.result?.result?.value) {
          console.log('JS eval result:', msg.result.result.value);
        }
        if (msg.result?.data) {
          fs.writeFileSync('C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a/screen-shop-mobile-menu.png', Buffer.from(msg.result.data, 'base64'));
          console.log('Saved screen-shop-mobile-menu.png');
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
