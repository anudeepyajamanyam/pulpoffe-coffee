const { spawn } = require('child_process');
const fs = require('fs');

const brainDir = 'C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a';

async function testWithChrome(options) {
  const { url, width = 1280, height = 900, evaluate, outFile, delay = 2000 } = options;

  return new Promise((resolve, reject) => {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const chromeProc = spawn(chromePath, [
      '--headless=new',
      '--remote-debugging-port=9226',
      '--disable-gpu',
      `--window-size=${width},${height}`,
      url
    ]);

    setTimeout(async () => {
      try {
        const listRes = await fetch('http://127.0.0.1:9226/json');
        const tabs = await listRes.json();
        const tab = tabs[0];
        if (!tab) throw new Error('Tab not found');

        const ws = new WebSocket(tab.webSocketDebuggerUrl);

        ws.onopen = () => {
          let id = 1;
          const send = (method, params = {}) => ws.send(JSON.stringify({ id: id++, method, params }));
          send('Page.enable');
          send('Runtime.enable');

          let evalResult = null;

          if (evaluate) {
            setTimeout(() => {
              send('Runtime.evaluate', { expression: evaluate, returnByValue: true });
            }, 600);
          }

          setTimeout(() => {
            if (outFile) {
              send('Page.captureScreenshot', { format: 'png' });
            } else {
              ws.close();
              chromeProc.kill();
              resolve(evalResult);
            }
          }, delay);

          ws.onmessage = evt => {
            const msg = JSON.parse(evt.data);
            if (msg.result && msg.result.result) {
              evalResult = msg.result.result.value;
            }
            if (msg.result && msg.result.data) {
              fs.writeFileSync(outFile, Buffer.from(msg.result.data, 'base64'));
              ws.close();
              chromeProc.kill();
              resolve(evalResult);
            }
          };
        };
      } catch (err) {
        chromeProc.kill();
        reject(err);
      }
    }, 1500);
  });
}

async function run() {
  console.log('--- Test 1: Add to basket green feedback on shop.html ---');
  const test1 = await testWithChrome({
    url: 'http://localhost:3000/shop.html',
    width: 1280,
    height: 900,
    evaluate: `
      (() => {
        const btn = document.querySelector('.add-basket');
        if (btn) btn.click();
        const style = btn ? window.getComputedStyle(btn) : null;
        return {
          text: btn?.textContent,
          bg: style?.backgroundColor,
          color: style?.color,
          toastVisible: document.querySelector('.basket-toast')?.classList.contains('visible')
        };
      })()
    `,
    delay: 1500,
    outFile: `${brainDir}/screen-add-to-basket-green.png`
  });
  console.log('Result 1:', test1);

  console.log('--- Test 2: Mobile navigation header options (390x844) ---');
  const test2 = await testWithChrome({
    url: 'http://localhost:3000/index.html',
    width: 390,
    height: 844,
    evaluate: `
      (() => {
        const toggle = document.querySelector('#menu-toggle');
        if (toggle) toggle.click();
        const drawer = document.querySelector('#mobile-menu');
        const links = Array.from(drawer?.querySelectorAll('.mobile-nav-link') || []).map(a => a.textContent.trim());
        return {
          toggleVisible: !toggle?.hidden && window.getComputedStyle(toggle).display !== 'none',
          drawerVisible: !drawer?.hidden && window.getComputedStyle(drawer).display !== 'none',
          links
        };
      })()
    `,
    delay: 1500,
    outFile: `${brainDir}/screen-mobile-menu-open.png`
  });
  console.log('Result 2:', test2);

  console.log('--- Test 3: Logo consistency on contact.html?type=b2b ---');
  const test3 = await testWithChrome({
    url: 'http://localhost:3000/contact.html?type=b2b',
    width: 1280,
    height: 900,
    evaluate: `
      (() => {
        const logoImg = document.querySelector('a.logo img');
        return {
          logoSrc: logoImg?.getAttribute('src'),
          logoVisible: !!logoImg
        };
      })()
    `,
    delay: 1200,
    outFile: `${brainDir}/screen-contact-logo-fixed.png`
  });
  console.log('Result 3:', test3);

  console.log('--- Test 4: Proceed to Checkout on cart.html ---');
  const test4 = await testWithChrome({
    url: 'http://localhost:3000/cart.html',
    width: 1280,
    height: 900,
    evaluate: `
      (() => {
        // Pre-populate basket
        const b = { 'gold-choco-orange-100g': 2, 'diamond-freeze-dried-pure-100g': 1 };
        localStorage.setItem('pulpoffe_basket_v1', JSON.stringify(b));
        location.reload();
      })()
    `,
    delay: 1000
  });

  // Re-run cart with items and click proceed to checkout
  const test4b = await testWithChrome({
    url: 'http://localhost:3000/cart.html',
    width: 1280,
    height: 900,
    evaluate: `
      (() => {
        const btn = document.querySelector('#cart-page-checkout-btn');
        if (btn) btn.click();
        const modal = document.querySelector('#checkout-modal');
        return {
          modalOpen: modal?.hasAttribute('open'),
          nameInput: !!document.querySelector('#chk-name'),
          subtotal: document.querySelector('#modal-subtotal')?.textContent,
          grandTotal: document.querySelector('#modal-grand-total')?.textContent
        };
      })()
    `,
    delay: 1800,
    outFile: `${brainDir}/screen-cart-checkout-modal-open.png`
  });
  console.log('Result 4:', test4b);

  console.log('All 4 test suites finished successfully!');
}

run().catch(console.error);
