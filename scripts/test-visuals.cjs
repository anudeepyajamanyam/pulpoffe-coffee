const { spawn } = require('child_process');
const fs = require('fs');

async function capture(url, width, height, script, outFile) {
  return new Promise((resolve, reject) => {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const chromeProc = spawn(chromePath, [
      '--headless=new',
      '--remote-debugging-port=9225',
      '--disable-gpu',
      `--window-size=${width},${height}`,
      url
    ]);

    setTimeout(async () => {
      try {
        const listRes = await fetch('http://127.0.0.1:9225/json');
        const tabs = await listRes.json();
        const tab = tabs[0];
        if (!tab) throw new Error('Tab not found');

        const ws = new WebSocket(tab.webSocketDebuggerUrl);

        ws.onopen = () => {
          let id = 1;
          const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));
          send('Page.enable');
          send('Runtime.enable');

          if (script) {
            setTimeout(() => {
              send('Runtime.evaluate', { expression: script });
            }, 800);
          }

          setTimeout(() => {
            send('Page.captureScreenshot', { format: 'png' });
          }, script ? 2200 : 1500);

          ws.onmessage = evt => {
            const msg = JSON.parse(evt.data);
            if (msg.result && msg.result.data) {
              fs.writeFileSync(outFile, Buffer.from(msg.result.data, 'base64'));
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
  const brainDir = 'C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a';

  console.log('1. Capturing desktop collection tiles...');
  await capture(
    'http://localhost:3000/index.html',
    1280,
    1000,
    `document.querySelector('#coffees').scrollIntoView();`,
    `${brainDir}/screen-tiles-desktop.png`
  );

  console.log('2. Capturing mobile collection tiles...');
  await capture(
    'http://localhost:3000/index.html',
    390,
    844,
    `document.querySelector('#coffees').scrollIntoView();`,
    `${brainDir}/screen-tiles-mobile.png`
  );

  console.log('3. Capturing modern basket slide drawer...');
  await capture(
    'http://localhost:3000/shop.html',
    1280,
    1000,
    `
      window.basket = window.basket || {};
      window.basket['gold-choco-orange-100g'] = 2;
      window.basket['silver-prime-70-30-100g'] = 1;
      if (typeof renderBasket === 'function') renderBasket();
      const dlg = document.querySelector('#basket-dialog');
      if (dlg) dlg.showModal();
    `,
    `${brainDir}/screen-basket-drawer.png`
  );

  console.log('4. Capturing dedicated cart page...');
  await capture(
    'http://localhost:3000/cart.html',
    1280,
    1000,
    `
      window.basket = window.basket || {};
      window.basket['gold-choco-orange-100g'] = 2;
      window.basket['diamond-freeze-dried-pure-100g'] = 1;
      if (typeof renderBasket === 'function') renderBasket();
    `,
    `${brainDir}/screen-cart-page.png`
  );

  console.log('All screenshots captured successfully!');
}

run().catch(console.error);
