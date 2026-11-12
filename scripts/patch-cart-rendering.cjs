const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const shopJsPath = path.join(root, 'dist/shop.js');

let shopJs = fs.readFileSync(shopJsPath, 'utf8');

// Target the end of subtotal calculation in renderBasket
const targetBreakdown = `  if ($('#breakdown-subtotal')) $('#breakdown-subtotal').textContent = subtotal > 0 ? inr(subtotal) : '₹0.00';
  if ($('#breakdown-shipping')) $('#breakdown-shipping').textContent = subtotal === 0 ? '₹0.00' : (shipping === 0 ? 'FREE' : '₹60.00');
  if ($('#basket-total-amount')) $('#basket-total-amount').textContent = subtotal > 0 ? inr(grandTotal) : '₹0.00';`;

const replacementBreakdown = `  if ($('#breakdown-subtotal')) $('#breakdown-subtotal').textContent = subtotal > 0 ? inr(subtotal) : '₹0.00';
  if ($('#breakdown-shipping')) $('#breakdown-shipping').textContent = subtotal === 0 ? '₹0.00' : (shipping === 0 ? 'FREE' : '₹60.00');
  if ($('#basket-total-amount')) $('#basket-total-amount').textContent = subtotal > 0 ? inr(grandTotal) : '₹0.00';

  const delBanner = $('#delivery-progress-text');
  if (delBanner) {
    if (subtotal === 0) {
      delBanner.textContent = 'Free express delivery on orders ₹1,000+';
    } else if (subtotal < 1000) {
      delBanner.textContent = 'Add ' + inr(1000 - subtotal) + ' more for FREE Delivery';
    } else {
      delBanner.textContent = '✨ You\\'ve unlocked FREE Express Delivery!';
    }
  }

  // Render Full Cart Page if present (cart.html)
  const cartPageList = $('#cart-page-items-list');
  const cartPageEmpty = $('#cart-page-empty');
  const cartPageActive = $('#cart-page-active');
  if (cartPageList) {
    if (!entries.length) {
      if (cartPageEmpty) cartPageEmpty.style.display = 'block';
      if (cartPageActive) cartPageActive.style.display = 'none';
    } else {
      if (cartPageEmpty) cartPageEmpty.style.display = 'none';
      if (cartPageActive) cartPageActive.style.display = 'grid';
      cartPageList.replaceChildren();

      if ($('#cart-page-subtotal')) $('#cart-page-subtotal').textContent = inr(subtotal);
      if ($('#cart-page-shipping')) $('#cart-page-shipping').textContent = shipping === 0 ? 'FREE' : '₹60.00';
      if ($('#cart-page-total')) $('#cart-page-total').textContent = inr(grandTotal);

      const statusTxt = $('#cart-delivery-status-text');
      if (statusTxt) {
        if (subtotal < 1000) {
          statusTxt.innerHTML = '🚚 Add <strong>' + inr(1000 - subtotal) + '</strong> more for <strong>FREE Delivery</strong>';
        } else {
          statusTxt.innerHTML = '✨ <strong>FREE Express Delivery Unlocked!</strong> Dispatched fresh from Kodagu.';
        }
      }

      for (const [id, n] of entries) {
        const p = resolveProduct(id);
        const row = document.createElement('div');
        row.className = 'cart-page-item-row';
        row.style.cssText = 'display:flex;align-items:center;gap:18px;padding:18px 0;border-bottom:1px solid var(--line);flex-wrap:wrap';

        const img = document.createElement('img');
        img.src = p.image || 'media/products/gold-choco-orange.webp';
        img.alt = p.name;
        img.style.cssText = 'width:68px;height:68px;object-fit:contain;background:radial-gradient(circle,#f5efe6,#e5d9c5);border-radius:8px;padding:6px;flex-shrink:0';

        const details = document.createElement('div');
        details.style.cssText = 'flex:1;min-width:160px';

        const title = document.createElement('h3');
        title.textContent = p.name;
        title.style.cssText = 'font-size:1.05rem;margin:0 0 4px;color:var(--ink);font-family:var(--disp)';

        const meta = document.createElement('p');
        meta.textContent = (p.range || 'Estate Roast') + ' · ' + p.pack;
        meta.style.cssText = 'font-size:0.82rem;color:var(--muted);margin:0';

        const unitPrice = document.createElement('p');
        unitPrice.textContent = inr(p.price) + ' per pack';
        unitPrice.style.cssText = 'font-size:0.82rem;color:var(--accent);margin:4px 0 0;font-weight:500';

        details.append(title, meta, unitPrice);

        const qtyWrap = document.createElement('div');
        qtyWrap.style.cssText = 'display:flex;align-items:center;gap:8px;border:1px solid var(--line);border-radius:6px;padding:4px 10px;background:var(--card)';

        const decBtn = document.createElement('button');
        decBtn.textContent = '−';
        decBtn.setAttribute('aria-label', 'Decrease ' + p.name);
        decBtn.style.cssText = 'background:none;border:none;color:var(--ink);font-size:1.1rem;cursor:pointer;padding:0 4px;font-weight:600';
        decBtn.addEventListener('click', () => {
          if (n - 1 <= 0) delete basket[id]; else basket[id] = n - 1;
          persist();
          renderBasket();
        });

        const qtySpan = document.createElement('span');
        qtySpan.textContent = n;
        qtySpan.style.cssText = 'min-width:24px;text-align:center;font-weight:600;color:var(--ink);font-size:0.95rem';

        const incBtn = document.createElement('button');
        incBtn.textContent = '+';
        incBtn.setAttribute('aria-label', 'Increase ' + p.name);
        incBtn.style.cssText = 'background:none;border:none;color:var(--ink);font-size:1.1rem;cursor:pointer;padding:0 4px;font-weight:600';
        incBtn.addEventListener('click', () => {
          basket[id] = Math.min(99, n + 1);
          persist();
          renderBasket();
        });

        qtyWrap.append(decBtn, qtySpan, incBtn);

        const totalCol = document.createElement('div');
        totalCol.style.cssText = 'min-width:80px;text-align:right';
        const linePrice = document.createElement('strong');
        linePrice.textContent = inr(p.price * n);
        linePrice.style.cssText = 'font-size:1.05rem;color:var(--ink);display:block';
        totalCol.append(linePrice);

        const removeBtn = document.createElement('button');
        removeBtn.innerHTML = '&times;';
        removeBtn.setAttribute('aria-label', 'Remove ' + p.name);
        removeBtn.style.cssText = 'background:none;border:none;color:var(--muted);font-size:1.3rem;cursor:pointer;padding:4px 8px;line-height:1';
        removeBtn.addEventListener('click', () => {
          delete basket[id];
          persist();
          renderBasket();
        });

        row.append(img, details, qtyWrap, totalCol, removeBtn);
        cartPageList.append(row);
      }
    }
  }`;

shopJs = shopJs.replace(targetBreakdown, replacementBreakdown);

// Also hook up #cart-page-checkout-btn
if (!shopJs.includes('cart-page-checkout-btn')) {
  shopJs += `\n$('#cart-page-checkout-btn')?.addEventListener('click', () => { openChkModal(); });\n`;
}

fs.writeFileSync(shopJsPath, shopJs, 'utf8');
console.log('Successfully patched dist/shop.js with full cart page support');
