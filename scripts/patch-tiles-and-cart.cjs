const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const indexHtmlPath = path.join(root, 'dist/index.html');
const shopHtmlPath = path.join(root, 'dist/shop.html');
const tokensCssPath = path.join(root, 'dist/brand/v2-tokens.css');
const shopJsPath = path.join(root, 'dist/shop.js');

// 1. Remove tile-count from index.html
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Replace tile-count tags
indexHtml = indexHtml.replace(/<span class="tile-count">[\s\S]*?<\/span>/g, '');

fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('1. Removed tile counts from dist/index.html');

// 2. Update v2-tokens.css with blended background images and mobile responsiveness
let tokensCss = fs.readFileSync(tokensCssPath, 'utf8');

const tileStyles = `
/* Photographic Luxury Collection Tiles (Blended Estate Imagery) */
.t1 {
  background: linear-gradient(180deg, rgba(46, 25, 12, 0.78) 0%, rgba(22, 11, 5, 0.94) 100%),
              url('../media/estate/estate-cherries-hands-3-1280.webp') center/cover no-repeat !important;
}
.t2 {
  background: linear-gradient(180deg, rgba(38, 30, 24, 0.80) 0%, rgba(18, 14, 11, 0.95) 100%),
              url('../media/estate/estate-cherries-hands-1-1280.webp') center/cover no-repeat !important;
}
.t3 {
  background: linear-gradient(180deg, rgba(12, 42, 10, 0.78) 0%, rgba(5, 20, 4, 0.95) 100%),
              url('../media/estate/estate-canopy-1-1280.webp') center/cover no-repeat !important;
}
.t4 {
  background: linear-gradient(180deg, rgba(32, 20, 13, 0.80) 0%, rgba(16, 9, 5, 0.95) 100%),
              url('../media/estate/estate-hero-landscape-1280.webp') center/cover no-repeat !important;
}

.tile {
  position: relative !important;
  min-height: 330px !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  text-decoration: none !important;
  color: #FFFFFF !important;
  padding: 26px 24px !important;
  border: 1px solid rgba(255, 255, 255, 0.14) !important;
  box-shadow: 0 10px 28px rgba(0,0,0,0.32) !important;
  transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease !important;
}

.tile:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 18px 42px rgba(0,0,0,0.5) !important;
  border-color: rgba(200, 157, 102, 0.45) !important;
}

.tile-top {
  position: relative !important;
  z-index: 2 !important;
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
}

.tile-badge {
  font-size: 0.72rem !important;
  letter-spacing: 1.2px !important;
  text-transform: uppercase !important;
  color: var(--honey) !important;
  font-family: var(--disp) !important;
  font-weight: 600 !important;
  background: rgba(0,0,0,0.4) !important;
  padding: 4px 10px !important;
  border-radius: 3px !important;
  border: 1px solid rgba(200, 157, 102, 0.25) !important;
}

@media (max-width: 960px) {
  .g4 {
    grid-template-columns: 1fr 1fr !important;
    gap: 16px !important;
  }
}
@media (max-width: 580px) {
  .g4 {
    grid-template-columns: 1fr !important;
    gap: 14px !important;
  }
  .tile {
    min-height: auto !important;
    padding: 24px 20px !important;
  }
  .tile h3 {
    font-size: 1.45rem !important;
  }
}

/* ══════════════════════════════════════════════════════════════════
   MODERN LUXURY BASKET SLIDE DRAWER
   ══════════════════════════════════════════════════════════════════ */
#basket-dialog {
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: auto !important;
  margin: 0 0 0 auto !important;
  height: 100vh !important;
  max-height: 100vh !important;
  width: min(460px, 100vw) !important;
  background: #170F0A !important;
  color: #F5EBE1 !important;
  border: none !important;
  border-left: 1px solid rgba(200, 157, 102, 0.25) !important;
  box-shadow: -15px 0 50px rgba(0, 0, 0, 0.65) !important;
  padding: 0 !important;
  display: flex !important;
  flex-direction: column !important;
  z-index: 9999 !important;
  box-sizing: border-box !important;
}

#basket-dialog::backdrop {
  background: rgba(12, 7, 3, 0.75) !important;
  backdrop-filter: blur(5px) !important;
}

.basket-drawer-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 20px 24px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: #1C120D !important;
}

.basket-drawer-header h2 {
  font-size: 1.35rem !important;
  color: #FFFFFF !important;
  margin: 0 !important;
  font-family: var(--disp) !important;
}

.basket-drawer-close {
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #FFFFFF !important;
  width: 32px !important;
  height: 32px !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 1.1rem !important;
  transition: background 0.18s ease, border-color 0.18s ease !important;
}

.basket-drawer-close:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: var(--honey) !important;
}

.basket-delivery-bar {
  padding: 8px 24px !important;
  background: rgba(200, 157, 102, 0.1) !important;
  border-bottom: 1px solid rgba(200, 157, 102, 0.2) !important;
  font-size: 0.8rem !important;
  color: var(--honey-lt) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
}

.basket-drawer-body {
  flex: 1 !important;
  overflow-y: auto !important;
  padding: 16px 24px !important;
}

.basket-drawer-footer {
  padding: 20px 24px !important;
  border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
  background: #130B07 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
}
`;

tokensCss += tileStyles;
fs.writeFileSync(tokensCssPath, tokensCss, 'utf8');
console.log('2. Appended blended tile and basket drawer styles to v2-tokens.css');

// 3. New Basket Drawer Markup
const basketDrawerHTML = `  <!-- Dialogs (Cart & Checkout) -->
  <dialog id="basket-dialog" aria-labelledby="basket-title">
    <div class="basket-drawer-header">
      <h2 id="basket-title">Your Basket</h2>
      <button class="basket-close basket-drawer-close" aria-label="Close basket">&times;</button>
    </div>
    <div id="basket-delivery-banner" class="basket-delivery-bar">
      <span id="delivery-progress-text">Free express delivery on orders ₹1,000+</span>
      <span style="font-weight:600;color:#fff">Kodagu Direct</span>
    </div>
    <div id="cart-auth-notice" style="font-size:0.8rem;color:#D9CDB6;padding:8px 24px;background:rgba(0,0,0,0.25);border-bottom:1px solid rgba(255,255,255,0.06)">
      <span>Order history &amp; blend tracking</span> · <a href="account.html" style="color:var(--honey-lt);text-decoration:underline">Sign in / Register →</a>
    </div>
    <div id="basket-items" class="basket-drawer-body"></div>
    <div class="basket-drawer-footer">
      <div style="display:flex;justify-content:space-between;font-size:0.88rem;color:#D9CDB6">
        <span>Items Subtotal</span><span id="breakdown-subtotal">₹0.00</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:0.88rem;color:#D9CDB6">
        <span>Estimated Delivery (Coorg to You)</span><span id="breakdown-shipping">FREE</span>
      </div>
      <div style="display:flex;justify-content:space-between;border-top:1px solid rgba(255,255,255,0.15);padding-top:10px;font-weight:600;font-size:1.05rem">
        <span>Total Payable (5% GST Incl.)</span><strong id="basket-total-amount" style="color:var(--honey-lt)">₹0.00</strong>
      </div>
      <button id="buy-razorpay-btn" class="btn p" style="width:100%;justify-content:center;padding:12px;font-size:0.95rem">Proceed to Checkout →</button>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px">
        <a href="cart.html" style="font-size:0.82rem;color:var(--honey-lt);text-decoration:underline">View Full Cart Page ↗</a>
        <a class="link" href="contact.html?type=b2b&amp;from=basket" style="font-size:0.82rem;color:#AAA">B2B Quote →</a>
      </div>
      <p id="basket-status" role="status" style="font-size:0.82rem;color:var(--honey-lt);text-align:center;margin:0"></p>
    </div>
  </dialog>`;

// Update shop.html basket-dialog
let shopHtml = fs.readFileSync(shopHtmlPath, 'utf8');
shopHtml = shopHtml.replace(/<dialog id="basket-dialog"[\s\S]*?<\/dialog>/, basketDrawerHTML.trim());
fs.writeFileSync(shopHtmlPath, shopHtml, 'utf8');
console.log('3. Updated dist/shop.html with modern basket drawer');

// Update index.html basket-dialog
indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/<dialog id="basket-dialog"[\s\S]*?<\/dialog>/, basketDrawerHTML.trim());
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('4. Updated dist/index.html with modern basket drawer');
