const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const tokensPath = path.join(root, 'dist/brand/v2-tokens.css');
const shopHtmlPath = path.join(root, 'dist/shop.html');
const indexHtmlPath = path.join(root, 'dist/index.html');
const shopJsPath = path.join(root, 'dist/shop.js');

// 1. Update v2-tokens.css for product image studio backdrop
let tokensCss = fs.readFileSync(tokensPath, 'utf8');
tokensCss = tokensCss.replace(
  /\.product-card-img-wrap\s*\{[\s\S]*?border-bottom: 1px solid var\(--line\) !important;\s*padding: 16px !important;\s*\}/,
  `.product-card-img-wrap {
  position: relative !important;
  background: radial-gradient(circle at 50% 45%, #F5EFE6 0%, #E5D9C5 100%) !important;
  aspect-ratio: 1 / 1 !important;
  overflow: hidden !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  border-bottom: 1px solid var(--line) !important;
  padding: 12px !important;
}`
);

tokensCss = tokensCss.replace(
  /:root\[data-theme="dark"\] \.product-card-img-wrap,[\s\S]*?background: #241812 !important;\s*\}\s*\}/,
  `:root[data-theme="dark"] .product-card-img-wrap,
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .product-card-img-wrap {
    background: radial-gradient(circle at 50% 45%, #291C14 0%, #160D08 100%) !important;
  }
}`
);

fs.writeFileSync(tokensPath, tokensCss, 'utf8');
console.log('1. Updated v2-tokens.css with warm studio gradient backdrop');

// 2. Checkout Modal HTML definition
const checkoutModalHTML = `  <!-- Checkout Modal -->
  <dialog id="checkout-modal" aria-labelledby="checkout-modal-title" style="padding:24px;border:1px solid var(--honey);background:#1A120D;color:#F5F5F5;width:min(520px,94vw);border-radius:6px;max-height:92vh;overflow-y:auto">
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:14px;margin-bottom:16px">
      <h2 id="checkout-modal-title" style="font-size:1.35rem;color:#fff;margin:0;font-family:var(--disp)">Complete Your Order</h2>
      <button type="button" id="close-checkout-modal" style="background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer">&times;</button>
    </div>

    <!-- Sign In / Auto-Fill Callout Card -->
    <div id="checkout-auth-card" style="background:rgba(200,157,102,0.08);border:1px solid rgba(200,157,102,0.25);border-radius:6px;padding:12px 14px;margin-bottom:16px;display:flex;flex-direction:column;gap:6px">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
        <div style="display:flex;align-items:center;gap:8px">
          <span style="font-size:1.1rem;color:var(--honey)">☕</span>
          <strong id="chk-auth-title" style="font-size:0.86rem;color:#F5EBE1">Save details for future roasts?</strong>
        </div>
        <button type="button" id="chk-auth-action-btn" style="background:transparent;border:1px solid var(--honey);color:var(--honey);font-size:0.75rem;padding:4px 10px;border-radius:3px;cursor:pointer;font-weight:600;letter-spacing:0.5px">SIGN IN</button>
      </div>
      <p id="chk-auth-desc" style="margin:0;font-size:0.78rem;color:#C4B6A4;line-height:1.4">
        Sign in to auto-fill your saved address and track your Kodagu roasts, or continue below as a guest.
      </p>

      <!-- Inline Quick Sign-In Form (collapsible) -->
      <div id="chk-inline-signin" style="display:none;margin-top:8px;padding-top:10px;border-top:1px dashed rgba(200,157,102,0.25)">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <input type="email" id="chk-inline-email" placeholder="Account email" style="width:100%;padding:8px 10px;background:#241811;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:4px;font-size:0.82rem">
          <input type="password" id="chk-inline-password" placeholder="Password" style="width:100%;padding:8px 10px;background:#241811;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:4px;font-size:0.82rem">
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px">
          <span id="chk-inline-error" style="font-size:0.74rem;color:#e57373"></span>
          <div style="display:flex;gap:6px">
            <button type="button" id="chk-inline-cancel" style="background:none;border:none;color:#aaa;font-size:0.75rem;cursor:pointer">Cancel</button>
            <button type="button" id="chk-inline-submit" class="btn p" style="padding:4px 12px;font-size:0.78rem">Sign In &amp; Fill</button>
          </div>
        </div>
      </div>
    </div>

    <form id="online-checkout-form" style="display:flex;flex-direction:column;gap:14px">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <label style="font-size:0.85rem;color:#D9CDB6">Full Name *<input type="text" id="chk-name" required placeholder="Your name" style="width:100%;padding:10px;background:#241811;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:4px;margin-top:4px"></label>
        <label style="font-size:0.85rem;color:#D9CDB6">Phone *<input type="tel" id="chk-phone" required placeholder="+91 98765 43210" style="width:100%;padding:10px;background:#241811;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:4px;margin-top:4px"></label>
      </div>
      <label style="font-size:0.85rem;color:#D9CDB6">Email *<input type="email" id="chk-email" required placeholder="you@example.com" style="width:100%;padding:10px;background:#241811;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:4px;margin-top:4px"></label>
      <label style="font-size:0.85rem;color:#D9CDB6">Street Address *<input type="text" id="chk-address" required placeholder="House / Street / Area" style="width:100%;padding:10px;background:#241811;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:4px;margin-top:4px"></label>
      <div style="display:grid;grid-template-columns:1fr 1.2fr 1.2fr;gap:10px">
        <label style="font-size:0.85rem;color:#D9CDB6">PIN Code *
          <input type="text" id="chk-pincode" required pattern="[0-9]{6}" maxlength="6" placeholder="560001" style="width:100%;padding:10px;background:#241811;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:4px;margin-top:4px">
          <small id="pincode-status" style="display:block;font-size:0.72rem;color:var(--honey-lt);margin-top:4px;min-height:14px"></small>
        </label>
        <label style="font-size:0.85rem;color:#D9CDB6">City / District *
          <input type="text" id="chk-city" required placeholder="Bangalore" style="width:100%;padding:10px;background:#241811;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:4px;margin-top:4px">
        </label>
        <label style="font-size:0.85rem;color:#D9CDB6">State *
          <input type="text" id="chk-state" required placeholder="Karnataka" style="width:100%;padding:10px;background:#241811;border:1px solid rgba(255,255,255,0.2);color:#fff;border-radius:4px;margin-top:4px">
        </label>
      </div>

      <!-- Save details checkbox -->
      <label style="display:flex;align-items:flex-start;gap:8px;font-size:0.82rem;color:#D9CDB6;cursor:pointer;margin-top:2px;user-select:none">
        <input type="checkbox" id="chk-save-details" checked style="accent-color:var(--honey);margin-top:2px">
        <span>Save this contact &amp; delivery info for faster 1-click checkout on future orders</span>
      </label>

      <div style="background:rgba(0,0,0,0.3);padding:12px;border-radius:4px;margin-top:6px">
        <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:#D9CDB6"><span>Items Total:</span><span id="modal-subtotal">₹0.00</span></div>
        <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:#D9CDB6"><span>Delivery:</span><span id="modal-shipping">FREE</span></div>
        <div style="display:flex;justify-content:space-between;font-size:1rem;font-weight:600;color:#fff;border-top:1px solid rgba(255,255,255,0.15);padding-top:6px;margin-top:6px"><span>Total Payable:</span><strong id="modal-grand-total" style="color:var(--honey-lt)">₹0.00</strong></div>
      </div>
      <button type="submit" id="modal-pay-btn" class="btn p" style="width:100%;justify-content:center;margin-top:6px">Proceed to Secure Payment (Razorpay) →</button>
      <p id="checkout-feedback" role="status" style="font-size:0.85rem;color:var(--honey-lt);text-align:center;margin:0"></p>
    </form>
  </dialog>`;

// Replace #checkout-modal in shop.html
let shopHtml = fs.readFileSync(shopHtmlPath, 'utf8');
shopHtml = shopHtml.replace(/<!-- Checkout Modal -->[\s\S]*?<\/dialog>/, checkoutModalHTML.trim());
// Also clean cupping-img background in shop.html
shopHtml = shopHtml.replace(
  'aspect-ratio:1/1;object-fit:contain;background:#fff;',
  'aspect-ratio:1/1;object-fit:contain;background:radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(20,13,8,0.7) 100%);border:1px solid rgba(255,255,255,0.1);'
);
fs.writeFileSync(shopHtmlPath, shopHtml, 'utf8');
console.log('2. Updated dist/shop.html checkout modal & cupping image styling');

// Replace #checkout-modal in index.html
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/<!-- Checkout Modal -->[\s\S]*?<\/dialog>/, checkoutModalHTML.trim());
fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
console.log('3. Updated dist/index.html checkout modal markup');
