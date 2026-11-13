const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '../dist/shop.js');
let content = fs.readFileSync(file, 'utf8');

// 1. Upgrade feedback in addToBasket
const target1 = `  // Visual & tactile feedback on clicked button
  if (triggerBtn) {
    triggerBtn.classList.add('added');
    const oldText = triggerBtn.textContent;
    triggerBtn.textContent = '✓ Added to basket!';
    setTimeout(() => {
      triggerBtn.classList.remove('added');
      triggerBtn.textContent = oldText;
    }, 1400);
  }`;

const replacement1 = `  // Visual & tactile feedback on clicked button (Vivid Green)
  if (triggerBtn) {
    triggerBtn.classList.add('added');
    triggerBtn.classList.add('btn-added');
    const oldText = triggerBtn.textContent;
    const oldBg = triggerBtn.style.background;
    const oldColor = triggerBtn.style.color;
    const oldBorder = triggerBtn.style.borderColor;
    triggerBtn.style.setProperty('background', '#2E7D32', 'important');
    triggerBtn.style.setProperty('background-color', '#2E7D32', 'important');
    triggerBtn.style.setProperty('color', '#FFFFFF', 'important');
    triggerBtn.style.setProperty('border-color', '#2E7D32', 'important');
    triggerBtn.textContent = '✓ Added to basket';
    setTimeout(() => {
      triggerBtn.classList.remove('added');
      triggerBtn.classList.remove('btn-added');
      triggerBtn.style.background = oldBg;
      triggerBtn.style.color = oldColor;
      triggerBtn.style.borderColor = oldBorder;
      triggerBtn.textContent = oldText;
    }, 1500);
  }`;

if (content.includes(target1)) {
  content = content.replace(target1, replacement1);
  console.log('addToBasket upgraded with green feedback.');
} else {
  console.log('target1 not found in shop.js');
}

// 2. Expose openChkModal & attach cart-page-checkout-btn inside IIFE
const target2 = `function openChkModal() {
  if (!Object.keys(basket).length) return;
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

const replacement2 = `function openChkModal() {
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
}
window.openChkModal = openChkModal;

// Dedicated listener for Proceed to Checkout from cart page
document.addEventListener('click', e => {
  if (e.target && e.target.closest('#cart-page-checkout-btn')) {
    e.preventDefault();
    openChkModal();
  }
});`;

if (content.includes(target2)) {
  content = content.replace(target2, replacement2);
  console.log('openChkModal and delegated listener updated inside IIFE.');
} else {
  console.log('target2 not found in shop.js');
}

// 3. Add mobile menu toggle handler if not already present
if (!content.includes('menu-toggle')) {
  console.log('Checking menu-toggle');
}

// Replace outer line 1401 to be safe
content = content.replace(/\$\('#cart-page-checkout-btn'\)\?\.addEventListener\('click',\s*\(\)\s*=>\s*\{\s*openChkModal\(\);\s*\}\);/g,
  '// Delegated cart checkout listener handled inside IIFE');

fs.writeFileSync(file, content, 'utf8');
console.log('dist/shop.js updated successfully.');
