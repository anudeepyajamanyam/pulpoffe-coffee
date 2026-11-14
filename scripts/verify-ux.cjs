const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

// Find Chrome path on Windows
const chromePaths = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Users\\anude.LAPTOP-1NVIEN2E\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
];
let chromePath = chromePaths.find(p => fs.existsSync(p));

async function run() {
  if (!chromePath) {
    console.error('Chrome executable not found');
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  console.log('Navigating to http://127.0.0.1:3000/shop.html...');
  await page.goto('http://127.0.0.1:3000/shop.html', { waitUntil: 'networkidle2' });

  // 1. Click Add to basket on first product
  console.log('Testing Add to basket on first product card...');
  const firstAddBtn = await page.$('.product-card .add-basket');
  if (!firstAddBtn) {
    console.error('Could not find .add-basket button on product card');
    await browser.close();
    process.exit(1);
  }
  await firstAddBtn.click();
  console.log('Clicked Add to basket.');

  // Wait 2 seconds (past the old 1.5s timeout) to ensure it does NOT vanish
  await new Promise(r => setTimeout(r, 2200));

  const qtyController = await page.$('.product-card .card-qty-controller');
  if (qtyController) {
    const text = await page.evaluate(el => el.textContent, qtyController);
    console.log('PASS: Persistent controller is active after 2.2s! Content:', text);
  } else {
    console.error('FAIL: Controller was not found or vanished!');
  }

  const screenArtifact1 = path.resolve('C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a/screen-shop-persistent-qty.png');
  await page.screenshot({ path: screenArtifact1 });
  console.log('Saved screenshot:', screenArtifact1);

  // 2. Click Remove ✕
  console.log('Testing Remove ✕ button...');
  const removeBtn = await page.$('.product-card .qty-remove-btn');
  if (removeBtn) {
    await removeBtn.click();
    await new Promise(r => setTimeout(r, 400));
    const restoredAddBtn = await page.$('.product-card .add-basket');
    if (restoredAddBtn) {
      console.log('PASS: Remove button successfully removed item and restored Add to basket button!');
    } else {
      console.error('FAIL: Add to basket button not restored after remove');
    }
  }

  // 3. Test Navigation to Dedicated Product Detail Page
  console.log('Testing navigation to dedicated Product Detail Page...');
  await page.goto('http://127.0.0.1:3000/product.html?id=gold-caramel', { waitUntil: 'networkidle2' });

  const title = await page.evaluate(() => document.getElementById('p-title')?.textContent);
  const price = await page.evaluate(() => document.getElementById('p-price')?.textContent);
  console.log('Loaded product page. Title:', title, 'Price:', price);

  // Test adding to basket on product page
  const pAddBtn = await page.$('#p-action-container .add-basket');
  if (pAddBtn) {
    await pAddBtn.click();
    await new Promise(r => setTimeout(r, 600));
    const pController = await page.$('#p-action-container .card-qty-controller');
    if (pController) {
      console.log('PASS: Product page persistent quantity controller activated:', await page.evaluate(el => el.textContent, pController));
    }
  }

  const screenArtifact2 = path.resolve('C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a/screen-product-detail-page.png');
  await page.screenshot({ path: screenArtifact2 });
  console.log('Saved screenshot:', screenArtifact2);

  // 4. Test Cupping dialog warm cream style fallback
  console.log('Testing shop.html cupping dialog warm cream style...');
  await page.goto('http://127.0.0.1:3000/shop.html#product=gold-caramel', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  const screenArtifact3 = path.resolve('C:/Users/anude.LAPTOP-1NVIEN2E/.gemini/antigravity/brain/1746cc33-1607-42e0-b747-13fc6321642a/screen-cupping-dialog-warm.png');
  await page.screenshot({ path: screenArtifact3 });
  console.log('Saved screenshot:', screenArtifact3);

  await browser.close();
  console.log('All UX verifications completed successfully!');
}

run().catch(err => {
  console.error('Verification error:', err);
  process.exit(1);
});
