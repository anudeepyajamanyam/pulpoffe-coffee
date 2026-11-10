(()=>{
const $=s=>document.querySelector(s);
const groups={instant:'Instant coffee',flavoured:'Flavoured instant',fermented:'Fermented coffee',roasted:'Roasted coffee'};

const DEFAULT_PRODUCTS = [
  {"id": "freeze-dried", "group": "instant", "name": "Freeze-dried pure instant", "note": "100% coffee", "pack": "100g jar", "price": 420},
  {"id": "agglomerated-pure", "group": "instant", "name": "Agglomerated pure instant", "note": "100% coffee", "pack": "100g pouch", "price": 340},
  {"id": "agglomerated-60", "group": "instant", "name": "Agglomerated 60 / 40", "note": "60% coffee · 40% chicory", "pack": "200g pouch", "price": 280},
  {"id": "agglomerated-70", "group": "instant", "name": "Agglomerated 70 / 30", "note": "70% coffee · 30% chicory", "pack": "200g pouch", "price": 310},
  {"id": "spray-pure", "group": "instant", "name": "Spray-dried pure instant", "note": "100% coffee", "pack": "100g pouch", "price": 290},
  {"id": "spray-60", "group": "instant", "name": "Spray-dried 60 / 40", "note": "60% coffee · 40% chicory", "pack": "200g pouch", "price": 240},
  {"id": "spray-70", "group": "instant", "name": "Spray-dried 70 / 30", "note": "70% coffee · 30% chicory", "pack": "200g pouch", "price": 260},
  {"id": "flavour-spiced", "group": "flavoured", "name": "Spiced instant coffee", "note": "Warm cardamom and cinnamon infusion", "pack": "100g tin", "price": 490},
  {"id": "flavour-almond", "group": "flavoured", "name": "Almond instant coffee", "note": "Nutty, subtly sweet toasted almond notes", "pack": "100g tin", "price": 490},
  {"id": "flavour-hazelnut", "group": "flavoured", "name": "Hazelnut instant coffee", "note": "Rich creamy roasted hazelnut notes", "pack": "100g tin", "price": 490},
  {"id": "flavour-choco-orange", "group": "flavoured", "name": "Choco Orange instant coffee", "note": "Dark cocoa with vibrant zesty orange", "pack": "100g tin", "price": 490},
  {"id": "flavour-caramel", "group": "flavoured", "name": "Caramel instant coffee", "note": "Silky burnt sugar & butterscotch finish", "pack": "100g tin", "price": 490},
  {"id": "flavour-cardamom", "group": "flavoured", "name": "Cardamom instant coffee", "note": "Traditional aromatic Coorg cardamom", "pack": "100g tin", "price": 490},
  {"id": "flavour-vanilla", "group": "flavoured", "name": "Vanilla instant coffee", "note": "Madagascar Bourbon vanilla aroma", "pack": "100g tin", "price": 490},
  {"id": "flavour-mint", "group": "flavoured", "name": "Mint instant coffee", "note": "Crisp peppermint balanced with rich coffee", "pack": "100g tin", "price": 490},
  {"id": "flavour-berry", "group": "flavoured", "name": "Berry instant coffee", "note": "Wild blackberry and red currant notes", "pack": "100g tin", "price": 490},
  {"id": "fermented-whiskey-barrel-aged", "group": "fermented", "name": "Whiskey barrel aged coffee", "note": "Oak, peat and caramel fermented notes", "pack": "250g bag", "price": 850},
  {"id": "fermented-pineapple", "group": "fermented", "name": "Pineapple coffee", "note": "Tropical anaerobic fruit fermentation", "pack": "250g bag", "price": 780},
  {"id": "fermented-cinnamon", "group": "fermented", "name": "Cinnamon coffee", "note": "Co-fermented with real Ceylon cinnamon", "pack": "250g bag", "price": 780},
  {"id": "fermented-wine", "group": "fermented", "name": "Wine yeast fermented coffee", "note": "Red berry acidity and winey sweetness", "pack": "250g bag", "price": 820},
  {"id": "roasted-pure", "group": "roasted", "name": "Pure roasted coffee", "note": "Medium-dark roast 100% Arabica & Robusta", "pack": "250g bag", "price": 450},
  {"id": "roasted-60", "group": "roasted", "name": "60 / 40 roasted blend", "note": "Traditional South Indian filter coffee blend", "pack": "500g bag", "price": 380},
  {"id": "roasted-70", "group": "roasted", "name": "70 / 30 roasted blend", "note": "Bold body, balanced filter coffee blend", "pack": "500g bag", "price": 420},
  {"id": "roasted-80", "group": "roasted", "name": "80 / 20 roasted blend", "note": "High coffee intensity with smooth finish", "pack": "500g bag", "price": 460}
];

let list = [];
let drawProducts = () => {};
const priceText = p => [p.pack, p.price == null ? 'Price on enquiry' : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(p.price)].filter(Boolean).join(' · ');
const storageKey = 'pulpoffe-basket-v1';
let basket = {};

async function loadProducts() {
  let data = null;
  for (const endpoint of ['/api/products', '/api/products.json', 'api/products.json']) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().startsWith('{')) {
          const parsed = JSON.parse(text);
          if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
            data = parsed;
            break;
          }
        }
      }
    } catch {}
  }

  list = (data && data.products) ? data.products : DEFAULT_PRODUCTS;

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const p of list) {
        const n = Number(saved[p.id]);
        if (Number.isInteger(n) && n > 0) basket[p.id] = Math.min(n, 99);
      }
    }
  } catch {}

  persist();
  drawProducts();
}

loadProducts().catch(() => {
  list = DEFAULT_PRODUCTS;
  persist();
  drawProducts();
});

function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(basket)); } catch {}
  document.querySelectorAll('.basket-count').forEach(n => n.textContent = Object.values(basket).reduce((a, b) => a + b, 0));
}

const dialog = $('#basket-dialog');
let basketTrigger;

document.querySelectorAll('.basket-open').forEach(b => b.addEventListener('click', () => {
  basketTrigger = b;
  renderBasket();
  if (dialog) {
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }
}));

function close() {
  if (dialog) {
    dialog.close();
    document.body.style.overflow = '';
    basketTrigger?.focus();
  }
}

$('.basket-close')?.addEventListener('click', close);
dialog?.addEventListener('cancel', () => { document.body.style.overflow = ''; });
dialog?.addEventListener('click', e => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) close();
  }
});

function renderBasket() {
  const host = $('#basket-items');
  if (!host) return;
  host.replaceChildren();
  const entries = Object.entries(basket);
  if ($('#save-basket')) $('#save-basket').disabled = !entries.length;
  if ($('#buy-razorpay-btn')) $('#buy-razorpay-btn').disabled = !entries.length;
  if ($('#basket-status')) $('#basket-status').textContent = '';

  const token = localStorage.getItem('pulpoffe_token') || localStorage.getItem('pulpoffe-jwt');
  const badge = $('#cart-auth-notice');
  if (badge) {
    if (token) {
      badge.innerHTML = '<span>Signed in</span><a href="account.html">View order & blend history →</a>';
    } else {
      badge.innerHTML = '<span>Track orders & blend brief:</span> <a href="account.html">Sign in / Register →</a>';
    }
  }

  let subtotal = 0;
  for (const [id, n] of entries) {
    const item = list.find(x => x.id === id);
    if (item && item.price) subtotal += item.price * n;
  }
  const shipping = subtotal > 0 ? (subtotal >= 1000 ? 0 : 60) : 0;
  const grandTotal = subtotal + shipping;

  const inr = v => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);
  if ($('#breakdown-subtotal')) $('#breakdown-subtotal').textContent = subtotal > 0 ? inr(subtotal) : '₹0.00';
  if ($('#breakdown-shipping')) $('#breakdown-shipping').textContent = subtotal === 0 ? '₹0.00' : (shipping === 0 ? 'FREE' : '₹60.00');
  if ($('#basket-total-amount')) $('#basket-total-amount').textContent = subtotal > 0 ? inr(grandTotal) : '₹0.00';

  if ($('#modal-subtotal')) $('#modal-subtotal').textContent = inr(subtotal);
  if ($('#modal-shipping')) $('#modal-shipping').textContent = shipping === 0 ? 'FREE' : '₹60.00';
  if ($('#modal-grand-total')) $('#modal-grand-total').textContent = inr(grandTotal);

  if (!entries.length) {
    const p = document.createElement('p');
    p.className = 'basket-empty';
    p.textContent = 'Your basket is waiting for a favourite.';
    const a = document.createElement('a');
    a.href = 'shop.html';
    a.className = 'button outline';
    a.textContent = 'Explore the coffees ↗';
    host.append(p, a);
    return;
  }

  for (const [id, n] of entries) {
    const p = list.find(p => p.id === id) || { name: id, group: 'instant', price: 0 };
    const row = document.createElement('div');
    row.className = 'basket-item';
    const img = document.createElement('img');
    img.src = p.image || `assets/${p.group}.webp`;
    img.alt = '';
    const copy = document.createElement('div'), h = document.createElement('h3'), note = document.createElement('p'), controls = document.createElement('div');
    h.textContent = p.name;
    note.textContent = priceText(p);
    controls.className = 'quantity-controls';
    for (const [text, label, delta] of [['−', 'Decrease ' + p.name, -1], ['+', 'Increase ' + p.name, 1]]) {
      const b = document.createElement('button');
      b.textContent = text;
      b.setAttribute('aria-label', label);
      b.disabled = delta === 1 && n >= 99;
      b.addEventListener('click', () => {
        const next = n + delta;
        if (next <= 0) delete basket[id]; else basket[id] = Math.min(99, next);
        persist();
        renderBasket();
      });
      controls.append(b);
      if (delta === -1) {
        const amount = document.createElement('span');
        amount.textContent = n;
        amount.setAttribute('aria-label', 'Quantity ' + n);
        controls.append(amount);
      }
    }
    const remove = document.createElement('button');
    remove.className = 'remove-item';
    remove.textContent = 'Remove';
    remove.setAttribute('aria-label', 'Remove ' + p.name);
    remove.addEventListener('click', () => {
      delete basket[id];
      persist();
      renderBasket();
    });
    controls.append(remove);
    copy.append(h, note, controls);
    row.append(img, copy);
    host.append(row);
  }
}

let toastTimer;
function addToBasket(p) {
  basket[p.id] = Math.min(99, (basket[p.id] || 0) + 1);
  persist();
  const toast = $('.basket-toast');
  if (toast) {
    toast.textContent = p.name + ' added to your basket';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
  }
  renderBasket();
  if (dialog && !dialog.open) {
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  }
}

// Full Online Order Steps & Checkout Modal Flow
const chkModal = $('#checkout-modal');
const closeChkModal = () => chkModal?.close();
$('#close-checkout-modal')?.addEventListener('click', closeChkModal);
chkModal?.addEventListener('click', e => {
  if (e.target === chkModal) {
    const r = chkModal.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeChkModal();
  }
});

const buyBtn = $('#buy-razorpay-btn');
if (buyBtn) {
  buyBtn.addEventListener('click', () => {
    const entries = Object.entries(basket);
    if (!entries.length) return;

    const token = localStorage.getItem('pulpoffe_token') || localStorage.getItem('pulpoffe-jwt');
    if ($('#checkout-user-status')) {
      $('#checkout-user-status').textContent = token ? '✓ Signed In' : 'Guest Express Checkout';
    }

    try {
      const savedUser = JSON.parse(localStorage.getItem('pulpoffe_user') || '{}');
      if (savedUser.name && $('#chk-name') && !$('#chk-name').value) $('#chk-name').value = savedUser.name;
      if (savedUser.email && $('#chk-email') && !$('#chk-email').value) $('#chk-email').value = savedUser.email;
    } catch {}

    renderBasket();
    dialog?.close();
    chkModal?.showModal();
  });
}

$('#online-checkout-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const entries = Object.entries(basket);
  if (!entries.length) return;

  let subtotal = 0;
  for (const [id, n] of entries) {
    const item = list.find(x => x.id === id);
    if (item && item.price) subtotal += item.price * n;
  }
  const shipping = subtotal >= 1000 ? 0 : 60;
  const payable = subtotal + shipping;

  const name = $('#chk-name').value.trim();
  const phone = $('#chk-phone').value.trim();
  const email = $('#chk-email').value.trim();
  const address = $('#chk-address').value.trim() + ', ' + $('#chk-city').value.trim() + ', ' + $('#chk-state').value.trim() + ' - ' + $('#chk-pincode').value.trim();

  const feedback = $('#checkout-feedback');
  const payBtn = $('#modal-pay-btn');
  if (payBtn) payBtn.disabled = true;
  if (feedback) feedback.textContent = 'Authorizing payment…';

  const orderId = 'PLF-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const orderItems = entries.map(([id, n]) => {
    const item = list.find(x => x.id === id);
    return { id, name: item ? item.name : id, qty: n, price: item ? item.price : 0 };
  });

  function completeOrder(paymentRef) {
    const newOrder = {
      id: orderId,
      ref: paymentRef || ('RZP_DEMO_' + Math.random().toString(36).substring(2, 8).toUpperCase()),
      createdAt: new Date().toISOString(),
      customer: { name, phone, email },
      shippingAddress: address,
      items: orderItems,
      subtotal,
      shipping,
      total: payable
    };

    try {
      const orders = JSON.parse(localStorage.getItem('pulpoffe_orders_v1') || '[]');
      orders.unshift(newOrder);
      localStorage.setItem('pulpoffe_orders_v1', JSON.stringify(orders));
    } catch {}

    basket = {};
    persist();
    renderBasket();
    chkModal?.close();

    alert(
      '☕ PULPOFFE COFFEE ORDER CONFIRMED!\n\n' +
      'Order Reference: ' + newOrder.id + '\n' +
      'Payment Reference: ' + newOrder.ref + '\n' +
      'Total Amount: ₹' + payable.toFixed(2) + '\n\n' +
      'Delivering fresh Kodagu coffee to:\n' + address + '\n\n' +
      'Thank you, ' + name + '! You can track this in My account.'
    );
    if (payBtn) payBtn.disabled = false;
    if (feedback) feedback.textContent = '';
  }

  // Check if user set a custom valid Razorpay Key
  const customRzpKey = window.RAZORPAY_KEY_ID || localStorage.getItem('pulpoffe_rzp_key');
  if (customRzpKey && customRzpKey.startsWith('rzp_') && typeof Razorpay !== 'undefined') {
    try {
      const rzp = new Razorpay({
        key: customRzpKey,
        amount: Math.round(payable * 100),
        currency: 'INR',
        name: 'Pulpoffe Coffee Atelier',
        description: 'Kodagu Coffee Order ' + orderId,
        image: 'assets/pulpoffe-mark-light.svg',
        prefill: { name, email, contact: phone },
        notes: { shipping_address: address },
        theme: { color: '#b08d57' },
        handler: function(resp) {
          completeOrder(resp.razorpay_payment_id);
        },
        modal: {
          ondismiss: function() {
            if (payBtn) payBtn.disabled = false;
            if (feedback) feedback.textContent = 'Checkout was cancelled.';
          }
        }
      });
      rzp.open();
      return;
    } catch {}
  }

  // Demo payment simulation
  setTimeout(() => {
    const confirmed = confirm(
      '☕ PULPOFFE SECURE PAYMENT (DEMO GATEWAY)\n' +
      '═══════════════════════════════════════════\n' +
      'Customer: ' + name + ' (' + phone + ')\n' +
      'Address: ' + address + '\n' +
      'Total Payable: ₹' + payable.toFixed(2) + '\n\n' +
      'Supported: Razorpay UPI (GPay/PhonePe), Cards, Netbanking.\n\n' +
      'Click OK to authorize payment and place your order.'
    );
    if (confirmed) {
      if (feedback) feedback.textContent = 'Payment authorized. Sealing order…';
      setTimeout(() => completeOrder(), 350);
    } else {
      if (payBtn) payBtn.disabled = false;
      if (feedback) feedback.textContent = 'Checkout was cancelled.';
    }
  }, 250);
});

$('#save-basket')?.addEventListener('click', () => {
  if (!Object.keys(basket).length) return;
  const lines = Object.entries(basket).map(([id, n]) => `${n} × ${(list.find(p => p.id === id) || {}).name} — ${priceText(list.find(p => p.id === id) || {})}`);
  const text = 'PULPOFFE — COFFEE ENQUIRY\n\n' + lines.join('\n') + '\n\nPlease confirm available pack sizes, prices, shipping and payment options.\n\nThis is a saved selection brief from Pulpoffe Coffee Atelier.\n';
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Pulpoffe-coffee-selection.txt';
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  if ($('#basket-status')) $('#basket-status').textContent = 'Selection downloaded. No enquiry has been sent.';
});

document.querySelectorAll('.basket-send').forEach(a => a.addEventListener('click', () => {
  try {
    const lines = Object.entries(basket).map(([id, n]) => `${n} × ${(list.find(p => p.id === id) || {}).name}`);
    sessionStorage.setItem('pulpoffe-enquiry-selection', lines.join('\n'));
  } catch {}
}));

if ($('#product-grid')) {
  let group = new URLSearchParams(location.search).get('collection') || 'all';
  if (!Object.hasOwn(groups, group)) group = 'all';
  let term = '';
  function render() {
    document.querySelectorAll('[data-shop-filter]').forEach(b => {
      const on = b.dataset.shopFilter === group;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    const selected = list.filter(p => (group === 'all' || p.group === group) && `${p.name} ${p.note}`.toLowerCase().includes(term));
    const grid = $('#product-grid');
    grid.replaceChildren();
    for (const [i, p] of selected.entries()) {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.style.setProperty('--i', i % 4);
      const img = document.createElement('img');
      img.src = p.image || `assets/${p.group}.webp`;
      img.alt = `Illustrative ${groups[p.group].toLowerCase()} scene`;
      img.loading = 'lazy';
      const copy = document.createElement('div'), category = document.createElement('p'), h = document.createElement('h2'), note = document.createElement('p'), price = document.createElement('p'), button = document.createElement('button');
      category.className = 'product-category';
      category.textContent = groups[p.group];
      h.textContent = p.name;
      note.className = 'product-note';
      note.textContent = p.note;
      price.className = 'product-price';
      price.textContent = priceText(p);
      button.className = 'add-basket';
      button.textContent = 'Add to basket +';
      button.setAttribute('aria-label', 'Add ' + p.name + ' to basket');
      button.addEventListener('click', () => addToBasket(p));
      copy.append(category, h, note, price, button);
      card.append(img, copy);
      grid.append(card);
    }
    if ($('#product-count')) $('#product-count').textContent = `${selected.length} coffee${selected.length === 1 ? '' : 's'} to explore`;
    if ($('#no-products')) $('#no-products').hidden = !!selected.length;
  }
  document.querySelectorAll('[data-shop-filter]').forEach(b => b.addEventListener('click', () => {
    group = b.dataset.shopFilter;
    const u = new URL(location.href);
    if (group === 'all') u.searchParams.delete('collection'); else u.searchParams.set('collection', group);
    history.replaceState(null, '', u);
    render();
  }));
  $('#product-search')?.addEventListener('input', e => {
    term = e.target.value.trim().toLowerCase();
    render();
  });
  drawProducts = render;
}

if ($('#year') && !$('#year').textContent) $('#year').textContent = new Date().getFullYear();
if (!$('#blend-form')) {
  const menu = $('#menu-toggle');
  menu?.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    if ($('#mobile-menu')) $('#mobile-menu').hidden = open;
  });
}
})();
