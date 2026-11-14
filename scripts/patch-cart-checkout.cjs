const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const cartPath = path.join(root, 'dist/cart.html');
const shopPath = path.join(root, 'dist/shop.js');

// 1. Update cart.html
let cart = fs.readFileSync(cartPath, 'utf8');

// Replace checkout button with a direct link to checkout.html
cart = cart.replace(/<button id="cart-page-checkout-btn"[\s\S]*?<\/button>/i,
  '<a href="checkout.html" id="cart-page-checkout-btn" class="btn p" style="width:100%;justify-content:center;margin-top:20px;padding:14px;font-size:1rem;text-decoration:none;display:flex">Proceed to Checkout →</a>');

// Remove checkout modal completely from cart.html
cart = cart.replace(/<!-- Checkout Modal -->[\s\S]*?<\/dialog>/i, '');

fs.writeFileSync(cartPath, cart, 'utf8');
console.log('cart.html updated with direct link to checkout.html, popup modal removed.');

// 2. Update shop.js
let shop = fs.readFileSync(shopPath, 'utf8');

// Update openChkModal to navigate directly to checkout.html
const oldOpenChk = `function openChkModal() {
  if (!Object.keys(basket).length) {
    alert('Your basket is currently empty. Please choose a handcrafted coffee first!');
    return;
  }
  renderBasket();
  close();
  if (chkModal) {
    chkModal.showModal();
    document.body.style.overflow = 'hidden';
    refreshCheckoutAuthBanner();
    autofillSavedDetails();
    const firstInput = $('#chk-name');
    firstInput?.focus();
  }
}`;

const newOpenChk = `function openChkModal() {
  if (!Object.keys(basket).length) {
    alert('Your basket is currently empty. Please choose a handcrafted coffee first!');
    return;
  }
  window.location.href = 'checkout.html';
}`;

if (shop.includes(oldOpenChk)) {
  shop = shop.replace(oldOpenChk, newOpenChk);
  console.log('shop.js openChkModal updated to redirect to checkout.html');
} else {
  // Regex replacement fallback
  shop = shop.replace(/function openChkModal\(\)[\s\S]*?firstInput\?\.focus\(\);\s*\}\s*\}/, newOpenChk);
  console.log('shop.js openChkModal updated via regex');
}

// Ensure buy-razorpay-btn navigates to checkout.html
shop = shop.replace(/\$\('#buy-razorpay-btn'\)\?\.addEventListener\('click'[\s\S]*?\}\);/g, `
  const buyBtn = $('#buy-razorpay-btn');
  if (buyBtn) {
    buyBtn.addEventListener('click', () => {
      openChkModal();
    });
  }
`);

fs.writeFileSync(shopPath, shop, 'utf8');
console.log('shop.js updated successfully.');
