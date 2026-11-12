(()=>{
const $ = s => document.querySelector(s);

const groups = {
  all: 'All coffees',
  gold: 'Gold Range · Flavoured Granular',
  silver: 'Silver Range · Filter & Pure',
  diamond: 'Diamond Range · Single-Estate',
  // Backward compatibility aliases
  instant: 'Silver & Diamond Blends',
  flavoured: 'Gold Range · Flavoured Granular',
  fermented: 'Specialty Harvests',
  roasted: 'Kodagu Roast Profiles'
};

const OFFICIAL_PRODUCTS = [
  // ── GOLD RANGE (Flavoured Specialty Granular) ──
  {
    id: "gold-choco-orange",
    name: "Choco Orange",
    tier: "Gold",
    group: "gold",
    range: "Gold Range · Granular",
    processing: "Granular",
    note: "Dark cocoa with vibrant zesty orange",
    pack: "100g pouch",
    price: 246,
    prices: { "100g": 246, "200g": 491, "250g": 614, "500g": 1229 },
    flavorNotes: ["Dark Cocoa", "Orange Peel", "Caramel", "Vanilla"],
    description: "A bold pairing of dark cocoa and bright orange peel, unexpected and unforgettable. Sourced from high-altitude Kodagu estates.",
    origin: "Kodagu, Karnataka",
    featured: true,
    rating: 4.9,
    acidity: 65, body: 75, aroma: 90, sweetness: 85,
    waterTemp: "90°C", ratio: "1.5 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Pairs beautifully with warm whole milk or poured over ice with a splash of cream.",
    image: "media/products/gold-choco-orange.webp"
  },
  {
    id: "gold-caramel",
    name: "Caramel",
    tier: "Gold",
    group: "gold",
    range: "Gold Range · Granular",
    processing: "Granular",
    note: "Silky burnt sugar & butterscotch finish",
    pack: "100g pouch",
    price: 283,
    prices: { "100g": 283, "200g": 566, "250g": 708, "500g": 1415 },
    flavorNotes: ["Caramel", "Brown Sugar", "Toasted Nuts", "Cream"],
    description: "Silky caramel sweetness with a buttery toasted finish that lingers long. Pure artisanal comfort.",
    origin: "Kodagu, Karnataka",
    featured: true,
    rating: 4.8,
    acidity: 45, body: 80, aroma: 85, sweetness: 92,
    waterTemp: "90°C", ratio: "1.5 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Best paired with warm oat milk for a café-style golden latte.",
    image: "media/products/gold-caramel.webp"
  },
  {
    id: "gold-hazelnut",
    name: "Hazelnut",
    tier: "Gold",
    group: "gold",
    range: "Gold Range · Granular",
    processing: "Granular",
    note: "Rich creamy roasted hazelnut notes",
    pack: "100g pouch",
    price: 210,
    prices: { "100g": 210, "200g": 419, "250g": 524, "500g": 1048 },
    flavorNotes: ["Hazelnut", "Milk Chocolate", "Buttery", "Smooth"],
    description: "Creamy hazelnut notes layered over rich Kodagu coffee for an indulgent everyday cup.",
    origin: "Kodagu, Karnataka",
    featured: false,
    rating: 4.7,
    acidity: 40, body: 75, aroma: 88, sweetness: 80,
    waterTemp: "90°C", ratio: "1.5 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Ideal with milk, hot or cold. A cosy favourite.",
    image: "media/products/gold-hazelnut.webp"
  },
  {
    id: "gold-almond",
    name: "Almond",
    tier: "Gold",
    group: "gold",
    range: "Gold Range · Granular",
    processing: "Granular",
    note: "Nutty, subtly sweet toasted almond notes",
    pack: "100g pouch",
    price: 231,
    prices: { "100g": 231, "200g": 461, "250g": 576, "500g": 1153 },
    flavorNotes: ["Almond", "Toasted Grain", "Mild Caramel", "Clean Finish"],
    description: "A smooth, nutty blend with gentle almond warmth and a clean lingering finish.",
    origin: "Kodagu, Karnataka",
    featured: false,
    rating: 4.6,
    acidity: 50, body: 70, aroma: 82, sweetness: 75,
    waterTemp: "90°C", ratio: "1.5 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Perfect for lattes and flat whites, pairs well with dairy and plant milks.",
    image: "media/products/gold-almond.webp"
  },
  {
    id: "gold-cardamom",
    name: "Cardamom",
    tier: "Gold",
    group: "gold",
    range: "Gold Range · Granular",
    processing: "Granular",
    note: "Traditional aromatic Coorg cardamom",
    pack: "100g pouch",
    price: 243,
    prices: { "100g": 243, "200g": 486, "250g": 608, "500g": 1216 },
    flavorNotes: ["Cardamom", "Cinnamon", "Dark Chocolate", "Earthy Spice"],
    description: "Traditional spice heritage in every sip, cardamom-forward with a warming Western Ghats depth.",
    origin: "Karnataka Spice Belt",
    featured: false,
    rating: 4.7,
    acidity: 55, body: 85, aroma: 94, sweetness: 70,
    waterTemp: "92°C", ratio: "1.5 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Traditionally served with hot milk or condensed milk for a rich kadak experience.",
    image: "media/products/gold-cardamom.webp"
  },
  {
    id: "gold-berry",
    name: "Berry",
    tier: "Gold",
    group: "gold",
    range: "Gold Range · Granular",
    processing: "Granular",
    note: "Wild berry brightness with floral honey",
    pack: "100g pouch",
    price: 242,
    prices: { "100g": 242, "200g": 484, "250g": 605, "500g": 1210 },
    flavorNotes: ["Blueberry", "Cranberry", "Floral", "Wild Honey"],
    description: "Wild berry brightness with delicate floral honey notes, offering a naturally complex and refreshing cup.",
    origin: "Kodagu, Karnataka",
    featured: true,
    rating: 4.8,
    acidity: 75, body: 65, aroma: 90, sweetness: 85,
    waterTemp: "88°C", ratio: "1.5 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Best enjoyed black, or over ice with tonic or cold cream.",
    image: "media/products/gold-berry.webp"
  },
  {
    id: "gold-vanilla",
    name: "Vanilla",
    tier: "Gold",
    group: "gold",
    range: "Gold Range · Granular",
    processing: "Granular",
    note: "Soft Madagascar vanilla warmth",
    pack: "100g pouch",
    price: 242,
    prices: { "100g": 242, "200g": 484, "250g": 605, "500g": 1210 },
    flavorNotes: ["Vanilla", "Cream", "Gentle Sweetness", "Smooth"],
    description: "Soft vanilla warmth over velvety Kodagu coffee, effortlessly elegant and comforting.",
    origin: "Kodagu, Karnataka",
    featured: false,
    rating: 4.7,
    acidity: 45, body: 75, aroma: 86, sweetness: 88,
    waterTemp: "90°C", ratio: "1.5 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Delicious as a hot latte or blended into an iced vanilla frappé.",
    image: "media/products/gold-vanilla.webp"
  },
  {
    id: "gold-mint",
    name: "Mint",
    tier: "Gold",
    group: "gold",
    range: "Gold Range · Granular",
    processing: "Granular",
    note: "Crisp peppermint balanced with rich coffee",
    pack: "100g pouch",
    price: 240,
    prices: { "100g": 240, "200g": 480, "250g": 600, "500g": 1200 },
    flavorNotes: ["Fresh Mint", "Light Citrus", "Clean", "Cooling"],
    description: "A refreshing mint note over smooth dark roast, crisp, clean, and reviving.",
    origin: "Nilgiris Foothills",
    featured: false,
    rating: 4.5,
    acidity: 60, body: 65, aroma: 88, sweetness: 72,
    waterTemp: "88°C", ratio: "1.5 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Superb shaken over ice with a sprig of fresh mint.",
    image: "media/products/gold-mint.webp"
  },

  // ── SILVER RANGE (South Indian Filter & Pure Blends) ──
  {
    id: "silver-agglo-pure",
    name: "Agglo Pure",
    tier: "Silver",
    group: "silver",
    range: "Silver Range · Pure Granular",
    processing: "Granular",
    note: "100% pure instant coffee · Zero chicory",
    pack: "100g pouch",
    price: 183,
    prices: { "100g": 183, "200g": 365, "250g": 457, "500g": 914 },
    flavorNotes: ["Pure Coffee", "Mild Brightness", "Clean", "Honest"],
    description: "Pure granular coffee with no chicory and no compromise. Just honest, unblended Kodagu highland coffee.",
    origin: "Karnataka, India",
    featured: true,
    rating: 4.9,
    acidity: 60, body: 80, aroma: 85, sweetness: 70,
    waterTemp: "92°C", ratio: "1 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "For purists: exceptional black, Americano style, or with minimal dash of milk.",
    image: "media/products/silver-agglo-pure.webp"
  },
  {
    id: "silver-agglo-prime70",
    name: "Agglo Prime 70",
    tier: "Silver",
    group: "silver",
    range: "Silver Range · Granular 70:30",
    processing: "Granular",
    note: "70% coffee · 30% chicory granular",
    pack: "100g pouch",
    price: 151,
    prices: { "100g": 151, "200g": 302, "250g": 378, "500g": 756 },
    flavorNotes: ["Robust", "Chicory Warmth", "Smooth Body", "Earthy"],
    description: "Granular 70:30 blend with richer texture, deeper body, and warm caramelised chicory character.",
    origin: "Karnataka, India",
    featured: false,
    rating: 4.7,
    acidity: 35, body: 88, aroma: 80, sweetness: 75,
    waterTemp: "92°C", ratio: "1.5 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Dissolves instantly in hot milk for that signature South Indian foam and richness.",
    image: "media/products/silver-agglo-prime70.webp"
  },
  {
    id: "silver-agglo-imperial60",
    name: "Agglo Imperial 60",
    tier: "Silver",
    group: "silver",
    range: "Silver Range · Granular 60:40",
    processing: "Granular",
    note: "60% coffee · 40% chicory granular",
    pack: "100g pouch",
    price: 146,
    prices: { "100g": 146, "200g": 292, "250g": 365, "500g": 730 },
    flavorNotes: ["Chicory", "Roasted Earth", "Robust", "Lingering Finish"],
    description: "Full-bodied 60:40 granular coffee with an earthy, rich decoction character and bold lingering finish.",
    origin: "Kodagu, Karnataka",
    featured: false,
    rating: 4.6,
    acidity: 25, body: 95, aroma: 78, sweetness: 72,
    waterTemp: "95°C", ratio: "2 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Best enjoyed with boiling hot milk and frothed from a height (davarah style).",
    image: "media/products/silver-agglo-imperial60.webp"
  },
  {
    id: "silver-prime70",
    name: "Prime 70",
    tier: "Silver",
    group: "silver",
    range: "Silver Range · Spray Dried",
    processing: "Spray Dried",
    note: "70% coffee · 30% chicory spray-dried",
    pack: "100g pouch",
    price: 143,
    prices: { "100g": 143, "200g": 286, "250g": 357, "500g": 714 },
    flavorNotes: ["Roasted Grain", "Mild Chicory", "Clean Body", "Gentle Finish"],
    description: "A classic everyday blend with clean 70:30 coffee-to-chicory ratio, smooth, balanced and satisfying.",
    origin: "Karnataka, India",
    featured: false,
    rating: 4.6,
    acidity: 40, body: 80, aroma: 76, sweetness: 70,
    waterTemp: "90°C", ratio: "1 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Quick morning brew with hot milk or sweetened black coffee.",
    image: "media/products/silver-prime70.webp"
  },
  {
    id: "silver-imperial60",
    name: "Imperial 60",
    tier: "Silver",
    group: "silver",
    range: "Silver Range · Spray Dried",
    processing: "Spray Dried",
    note: "60% coffee · 40% chicory spray-dried",
    pack: "100g pouch",
    price: 136,
    prices: { "100g": 136, "200g": 271, "250g": 339, "500g": 678 },
    flavorNotes: ["Deep Chicory", "Dark Roast", "Full Body", "Classic Filter Taste"],
    description: "Bold 60:40 blend for lovers of strong, chicory-rich South Indian filter coffee in instant convenience.",
    origin: "Kodagu, Karnataka",
    featured: false,
    rating: 4.5,
    acidity: 20, body: 92, aroma: 74, sweetness: 68,
    waterTemp: "95°C", ratio: "1.5 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "With hot frothed milk and jaggery or raw sugar.",
    image: "media/products/silver-imperial60.webp"
  },

  // ── DIAMOND RANGE (Pinnacle Luxury Single-Estate) ──
  {
    id: "diamond-freeze-dried",
    name: "Freeze Dried",
    tier: "Diamond",
    group: "diamond",
    range: "Diamond Range · Freeze Dried",
    processing: "Freeze Dried",
    note: "100% pure freeze-dried single estate",
    pack: "100g jar",
    price: 357,
    prices: { "100g": 357, "200g": 714, "250g": 893, "500g": 1785 },
    flavorNotes: ["Dark Chocolate", "Smoked Oak", "Molasses", "Full Body"],
    description: "The pinnacle of instant coffee. Flash-frozen and vacuum-dehydrated at sub-zero temperatures to preserve every volatile aromatic oil of the fresh harvest.",
    origin: "Kodagu, Karnataka",
    featured: true,
    rating: 5.0,
    acidity: 70, body: 88, aroma: 98, sweetness: 85,
    waterTemp: "85°C – 90°C", ratio: "1 to 1.5 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Best experienced pure black or with a single drop of milk to reveal subtle berry and oak aromatics.",
    image: "media/products/diamond-freeze_dried.webp"
  },
  {
    id: "diamond-spiced",
    name: "Spiced Reserve",
    tier: "Diamond",
    group: "diamond",
    range: "Diamond Range · Spiced Granular",
    processing: "Granular",
    note: "Whole Western Ghats natural spices infusion",
    pack: "100g pouch",
    price: 294,
    prices: { "100g": 294, "200g": 588, "250g": 735, "500g": 1470 },
    flavorNotes: ["Natural Spice", "Dark Roast", "Warming Cinnamon", "Complex Depth"],
    description: "A rare limited-run blend of single-estate coffee infused with hand-selected Western Ghats whole spices. Aromatic, rich, and commanding.",
    origin: "Karnataka Spice Estates",
    featured: true,
    rating: 4.9,
    acidity: 50, body: 90, aroma: 96, sweetness: 78,
    waterTemp: "90°C", ratio: "1.5 tsp / 150ml", steepTime: "Instant dissolution",
    servingSuggestion: "Try with steamed cinnamon milk or warm honey for a deeply restorative cup.",
    image: "media/products/diamond-spiced.webp"
  }
];

// Helper to look up an item or its pack-size variant
function resolveProduct(id) {
  if (id.includes('__')) {
    const [baseId, size] = id.split('__');
    const base = OFFICIAL_PRODUCTS.find(p => p.id === baseId);
    if (base) {
      const price = base.prices?.[size] ?? base.price;
      return {
        ...base,
        id: id,
        baseId: baseId,
        selectedSize: size,
        name: `${base.name} (${size})`,
        pack: `${size} pack`,
        price: price
      };
    }
  }
  return OFFICIAL_PRODUCTS.find(p => p.id === id) || { name: id, group: 'gold', price: 0, pack: '100g' };
}

let list = OFFICIAL_PRODUCTS;
let drawProducts = () => {};
const inr = v => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);
const priceText = p => [p.pack, p.price == null ? 'Price on enquiry' : inr(p.price)].filter(Boolean).join(' · ');
const storageKey = 'pulpoffe-basket-v1';
let basket = {};

async function loadProducts() {
  list = OFFICIAL_PRODUCTS;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const [id, count] of Object.entries(saved)) {
        const n = Number(count);
        if (Number.isInteger(n) && n > 0) basket[id] = Math.min(n, 99);
      }
    }
  } catch {}

  persist();
  drawProducts();
}

loadProducts().catch(() => {
  list = OFFICIAL_PRODUCTS;
  persist();
  drawProducts();
});

function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(basket)); } catch {}
  document.querySelectorAll('.basket-count').forEach(n => {
    n.textContent = Object.values(basket).reduce((a, b) => a + b, 0);
  });
}

// ── Basket Drawer Handling ──
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

function addToBasket(productOrVariant) {
  const id = productOrVariant.id;
  basket[id] = (basket[id] || 0) + 1;
  persist();
  toast(`Added ${productOrVariant.name} to basket.`);
  renderBasket();
}

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
      badge.innerHTML = '<span>Signed in</span> · <a href="account.html" style="color:var(--honey-lt);text-decoration:underline">View order &amp; blend history →</a>';
    } else {
      badge.innerHTML = '<span>Track orders &amp; blend brief:</span> <a href="account.html" style="color:var(--honey-lt);text-decoration:underline">Sign in / Register →</a>';
    }
  }

  let subtotal = 0;
  for (const [id, n] of entries) {
    const item = resolveProduct(id);
    if (item && item.price) subtotal += item.price * n;
  }
  const shipping = subtotal > 0 ? (subtotal >= 1000 ? 0 : 60) : 0;
  const grandTotal = subtotal + shipping;

  if ($('#breakdown-subtotal')) $('#breakdown-subtotal').textContent = subtotal > 0 ? inr(subtotal) : '₹0.00';
  if ($('#breakdown-shipping')) $('#breakdown-shipping').textContent = subtotal === 0 ? '₹0.00' : (shipping === 0 ? 'FREE' : '₹60.00');
  if ($('#basket-total-amount')) $('#basket-total-amount').textContent = subtotal > 0 ? inr(grandTotal) : '₹0.00';

  if ($('#modal-subtotal')) $('#modal-subtotal').textContent = inr(subtotal);
  if ($('#modal-shipping')) $('#modal-shipping').textContent = shipping === 0 ? 'FREE' : '₹60.00';
  if ($('#modal-grand-total')) $('#modal-grand-total').textContent = inr(grandTotal);

  if (!entries.length) {
    const p = document.createElement('p');
    p.className = 'basket-empty';
    p.style.cssText = 'padding:32px 0;text-align:center;color:#D9CDB6;font-size:0.95rem';
    p.textContent = 'Your basket is waiting for a favourite.';
    const a = document.createElement('a');
    a.href = 'shop.html';
    a.className = 'btn s';
    a.style.cssText = 'display:inline-flex;margin:12px auto 0;justify-content:center';
    a.textContent = 'Explore the coffees →';
    host.append(p, a);
    return;
  }

  for (const [id, n] of entries) {
    const p = resolveProduct(id);
    const row = document.createElement('div');
    row.className = 'basket-item';
    row.style.cssText = 'display:flex;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.08)';

    const img = document.createElement('img');
    img.src = p.image || 'media/estate/estate-cherries-hands-1-1280.webp';
    img.alt = '';
    img.style.cssText = 'width:56px;height:56px;object-fit:cover;border-radius:4px;background:#20140c;flex-shrink:0';

    const copy = document.createElement('div');
    copy.style.cssText = 'flex:1;min-width:0';

    const h = document.createElement('h3');
    h.textContent = p.name;
    h.style.cssText = 'font-size:0.95rem;margin:0 0 2px;color:#fff;font-family:var(--disp)';

    const note = document.createElement('p');
    note.textContent = `${p.pack} · ${inr(p.price)}`;
    note.style.cssText = 'font-size:0.8rem;color:var(--honey-lt);margin:0';

    const controls = document.createElement('div');
    controls.className = 'quantity-controls';
    controls.style.cssText = 'display:flex;align-items:center;gap:6px;margin-top:6px';

    for (const [sym, label, delta] of [['−', 'Decrease ' + p.name, -1], ['+', 'Increase ' + p.name, 1]]) {
      const b = document.createElement('button');
      b.textContent = sym;
      b.setAttribute('aria-label', label);
      b.style.cssText = 'background:rgba(255,255,255,0.1);color:#fff;border:none;width:24px;height:24px;border-radius:2px;cursor:pointer;font-weight:600';
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
        amount.style.cssText = 'color:#fff;font-size:0.85rem;min-width:18px;text-align:center';
        controls.append(amount);
      }
    }

    const remove = document.createElement('button');
    remove.textContent = '×';
    remove.setAttribute('aria-label', 'Remove ' + p.name);
    remove.style.cssText = 'background:none;border:none;color:rgba(255,255,255,0.4);font-size:1.2rem;cursor:pointer;padding:4px 8px';
    remove.addEventListener('click', () => {
      delete basket[id];
      persist();
      renderBasket();
    });

    copy.append(h, note, controls);
    row.append(img, copy, remove);
    host.append(row);
  }
}

function toast(msg) {
  const el = $('.basket-toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
  setTimeout(() => el.classList.remove('visible'), 2800);
}

// ── Online Checkout Modal & Razorpay ──
const chkModal = $('#checkout-modal');
function openChkModal() {
  if (!Object.keys(basket).length) return;
  close();
  if (chkModal) {
    chkModal.showModal();
    document.body.style.overflow = 'hidden';
    const firstInput = $('#chk-name');
    firstInput?.focus();
  }
}
function closeChkModal() {
  if (chkModal) {
    chkModal.close();
    document.body.style.overflow = '';
  }
}

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
    openChkModal();
  });
}

$('#online-checkout-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.reportValidity()) return;

  const btn = $('#modal-pay-btn');
  const feedback = $('#checkout-feedback');
  if (btn) btn.disabled = true;
  if (feedback) {
    feedback.style.color = '#d5bb91';
    feedback.textContent = 'Initializing secure payment gateway…';
  }

  const items = Object.entries(basket).map(([id, qty]) => {
    const p = resolveProduct(id);
    return { id, name: p.name, pack: p.pack, qty, price: p.price };
  });

  const subtotal = items.reduce((acc, i) => acc + (i.price * i.qty), 0);
  const shipping = subtotal >= 1000 ? 0 : 60;
  const grandTotal = subtotal + shipping;

  const orderPayload = {
    customer: {
      name: $('#chk-name').value.trim(),
      phone: $('#chk-phone').value.trim(),
      email: $('#chk-email').value.trim()
    },
    shippingAddress: `${$('#chk-address').value.trim()}, ${$('#chk-city').value.trim()}, ${$('#chk-state').value.trim()} - ${$('#chk-pincode').value.trim()}`,
    items,
    subtotal,
    shipping,
    grandTotal
  };

  try {
    let orderRes = null;
    try {
      const r = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      if (r.ok) orderRes = await r.json();
    } catch {}

    const orderId = orderRes?.orderId || ('PLF-' + Date.now().toString().slice(-6));
    const rzpOrderId = orderRes?.rzpOrderId || ('order_demo_' + Math.random().toString(36).substring(2, 9));

    const options = {
      key: orderRes?.key || 'rzp_test_PulpoffeDemoKey',
      amount: Math.round(grandTotal * 100),
      currency: 'INR',
      name: 'Pulpoffe Coffee',
      description: `Artisanal Coffee Order #${orderId}`,
      image: 'assets/pulpoffe-mark-light.svg',
      order_id: rzpOrderId,
      prefill: {
        name: orderPayload.customer.name,
        email: orderPayload.customer.email,
        contact: orderPayload.customer.phone
      },
      theme: { color: '#c9a56b' },
      handler: async function (response) {
        if (feedback) {
          feedback.style.color = '#7fb069';
          feedback.textContent = 'Payment verified! Packing your Kodagu coffee…';
        }

        try {
          const orders = JSON.parse(localStorage.getItem('pulpoffe_orders_v1') || '[]');
          orders.unshift({
            id: orderId,
            date: new Date().toISOString(),
            ...orderPayload,
            paymentId: response.razorpay_payment_id || 'PAY_' + Date.now()
          });
          localStorage.setItem('pulpoffe_orders_v1', JSON.stringify(orders));
        } catch {}

        basket = {};
        persist();
        renderBasket();

        setTimeout(() => {
          closeChkModal();
          alert(`Thank you for your order, ${orderPayload.customer.name}!\n\nOrder Ref: #${orderId}\nPayment ID: ${response.razorpay_payment_id || 'Verified'}\n\nWe will roast and dispatch your artisanal coffee from Kodagu directly to your doorstep.`);
        }, 800);
      },
      modal: {
        ondismiss: function () {
          if (btn) btn.disabled = false;
          if (feedback) feedback.textContent = 'Payment cancelled. Your basket is saved.';
        }
      }
    };

    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        if (btn) btn.disabled = false;
        if (feedback) {
          feedback.style.color = '#e57373';
          feedback.textContent = resp.error?.description || 'Payment was unsuccessful. Please retry.';
        }
      });
      rzp.open();
    } else {
      setTimeout(() => {
        options.handler({ razorpay_payment_id: 'DEMO_PAY_' + Date.now() });
      }, 1000);
    }
  } catch (err) {
    if (btn) btn.disabled = false;
    if (feedback) {
      feedback.style.color = '#e57373';
      feedback.textContent = err.message || 'Error processing order.';
    }
  }
});

// Download Brief Button
$('#save-basket')?.addEventListener('click', () => {
  const entries = Object.entries(basket);
  if (!entries.length) return;
  const lines = ['PULPOFFE ARTISANAL COFFEES — SELECTION BRIEF', 'Origin: Kodagu, Karnataka', 'Generated: ' + new Date().toLocaleString('en-IN'), '', 'SELECTED COFFEES:'];
  let total = 0;
  for (const [id, n] of entries) {
    const p = resolveProduct(id);
    lines.push(`• ${p.name} [${p.pack}] × ${n} = ${inr((p.price || 0) * n)}`);
    total += (p.price || 0) * n;
  }
  lines.push('', `Estimated Subtotal: ${inr(total)} (Incl. 5% GST)`);
  lines.push('Packaging & Cold Seal: Included', 'Delivery: Direct from Kodagu estate', '', 'To place a commercial or wholesale order, contact: hello@pulpoffe.com');
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `pulpoffe-selection-${Date.now().toString().slice(-4)}.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
});

// ── Sensory & Cupping Details Dialog ──
function openCuppingDialog(p, currentSize = '100g') {
  const dlg = $('#cupping-dialog');
  if (!dlg) return;

  if ($('#cupping-title')) $('#cupping-title').textContent = p.name;
  if ($('#cupping-range')) $('#cupping-range').textContent = p.range;
  if ($('#cupping-origin')) $('#cupping-origin').textContent = p.origin;
  if ($('#cupping-img')) $('#cupping-img').src = p.image;
  if ($('#cupping-desc')) $('#cupping-desc').textContent = p.description;

  // Flavor pills
  const tagsHost = $('#cupping-tags');
  if (tagsHost) {
    tagsHost.replaceChildren();
    (p.flavorNotes || []).forEach(f => {
      const tag = document.createElement('span');
      tag.className = 'flavor-tag';
      tag.textContent = f;
      tagsHost.append(tag);
    });
  }

  // Sensory meters
  if ($('#meter-acidity')) $('#meter-acidity').style.width = (p.acidity || 50) + '%';
  if ($('#meter-body')) $('#meter-body').style.width = (p.body || 50) + '%';
  if ($('#meter-aroma')) $('#meter-aroma').style.width = (p.aroma || 50) + '%';
  if ($('#meter-sweetness')) $('#meter-sweetness').style.width = (p.sweetness || 50) + '%';
  if ($('#val-acidity')) $('#val-acidity').textContent = (p.acidity || 50) + '/100';
  if ($('#val-body')) $('#val-body').textContent = (p.body || 50) + '/100';
  if ($('#val-aroma')) $('#val-aroma').textContent = (p.aroma || 50) + '/100';
  if ($('#val-sweetness')) $('#val-sweetness').textContent = (p.sweetness || 50) + '/100';

  // Brew specs
  if ($('#cup-temp')) $('#cup-temp').textContent = p.waterTemp || '90°C';
  if ($('#cup-ratio')) $('#cup-ratio').textContent = p.ratio || '1.5 tsp / 150ml';
  if ($('#cup-steep')) $('#cup-steep').textContent = p.steepTime || 'Instant dissolution';
  if ($('#cup-pairing')) $('#cup-pairing').textContent = p.servingSuggestion || 'Serve with warm milk or over ice.';

  // Pack selector inside modal
  let selectedModalSize = currentSize;
  const updateModalPrice = () => {
    const price = p.prices?.[selectedModalSize] ?? p.price;
    if ($('#cupping-price')) $('#cupping-price').textContent = inr(price);
    if ($('#cupping-pack-size')) $('#cupping-pack-size').textContent = selectedModalSize;
  };

  const packRow = $('#cupping-pack-row');
  if (packRow) {
    packRow.replaceChildren();
    for (const size of ['100g', '200g', '250g', '500g']) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pack-btn' + (size === selectedModalSize ? ' active' : '');
      btn.textContent = size;
      btn.addEventListener('click', () => {
        selectedModalSize = size;
        packRow.querySelectorAll('.pack-btn').forEach(b => b.classList.toggle('active', b === btn));
        updateModalPrice();
      });
      packRow.append(btn);
    }
  }

  updateModalPrice();

  const addBtn = $('#cupping-add-btn');
  if (addBtn) {
    addBtn.onclick = () => {
      const variant = resolveProduct(`${p.id}__${selectedModalSize}`);
      addToBasket(variant);
      dlg.close();
    };
  }

  dlg.showModal();
}

$('#close-cupping-modal')?.addEventListener('click', () => {
  $('#cupping-dialog')?.close();
});
$('#cupping-dialog')?.addEventListener('click', e => {
  const dlg = $('#cupping-dialog');
  if (e.target === dlg) dlg.close();
});

// ── Shop Grid Rendering ──
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

    const selected = list.filter(p => {
      const matchesGroup = (group === 'all' || p.group === group);
      const searchTarget = `${p.name} ${p.range} ${p.note} ${p.description} ${(p.flavorNotes || []).join(' ')}`.toLowerCase();
      const matchesSearch = searchTarget.includes(term);
      return matchesGroup && matchesSearch;
    });

    const grid = $('#product-grid');
    grid.replaceChildren();

    for (const p of selected) {
      const card = document.createElement('article');
      card.className = 'product-card';

      let activeSize = '100g';
      const getActivePrice = () => p.prices?.[activeSize] ?? p.price;

      // Image header
      const imgWrap = document.createElement('div');
      imgWrap.style.cssText = 'position:relative;background:#18100a;aspect-ratio:4/3;overflow:hidden;cursor:pointer';
      
      const img = document.createElement('img');
      img.src = p.image || 'media/products/gold-choco-orange.webp';
      img.alt = `${p.name} packaging`;
      img.loading = 'lazy';
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;transition:transform 0.4s ease';
      imgWrap.append(img);

      imgWrap.addEventListener('click', () => openCuppingDialog(p, activeSize));

      // Featured or Processing badge
      const badge = document.createElement('span');
      badge.style.cssText = 'position:absolute;top:10px;left:10px;background:rgba(22,14,10,0.85);color:var(--honey-lt);font-size:0.75rem;padding:3px 8px;border-radius:3px;backdrop-filter:blur(4px);border:1px solid rgba(201,165,107,0.3);font-family:var(--disp);letter-spacing:0.5px';
      badge.textContent = p.processing || p.tier;
      imgWrap.append(badge);

      const copy = document.createElement('div');
      copy.style.cssText = 'padding:18px;display:flex;flex-direction:column;flex:1';

      // Category / Tier
      const category = document.createElement('p');
      category.className = 'product-category';
      category.textContent = p.range;

      // Name
      const h = document.createElement('h2');
      h.textContent = p.name;

      // Flavor pills
      const flavorPills = document.createElement('div');
      flavorPills.className = 'flavor-tags';
      flavorPills.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px';
      (p.flavorNotes || []).slice(0, 3).forEach(note => {
        const pill = document.createElement('span');
        pill.className = 'flavor-tag';
        pill.textContent = note;
        flavorPills.append(pill);
      });

      // Description
      const note = document.createElement('p');
      note.className = 'product-note';
      note.textContent = p.description || p.note;

      // Pack size selection row
      const packRow = document.createElement('div');
      packRow.className = 'pack-selector-row';
      packRow.setAttribute('role', 'group');
      packRow.setAttribute('aria-label', 'Select pack size for ' + p.name);

      const priceVal = document.createElement('strong');
      priceVal.className = 'product-price';
      priceVal.textContent = inr(getActivePrice());

      for (const size of ['100g', '200g', '250g', '500g']) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pack-btn' + (size === activeSize ? ' active' : '');
        b.textContent = size;
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          activeSize = size;
          packRow.querySelectorAll('.pack-btn').forEach(btn => btn.classList.toggle('active', btn === b));
          priceVal.textContent = inr(getActivePrice());
        });
        packRow.append(b);
      }

      // Price + Tax note
      const priceRow = document.createElement('div');
      priceRow.style.cssText = 'display:flex;align-items:baseline;justify-content:space-between;margin:10px 0 14px';
      
      const taxTag = document.createElement('span');
      taxTag.style.cssText = 'font-size:0.75rem;color:var(--muted)';
      taxTag.textContent = '5% GST incl.';
      priceRow.append(priceVal, taxTag);

      // Add to Basket button
      const addBtn = document.createElement('button');
      addBtn.className = 'add-basket';
      addBtn.textContent = 'Add to basket +';
      addBtn.setAttribute('aria-label', `Add ${p.name} (${activeSize}) to basket`);
      addBtn.addEventListener('click', () => {
        const variant = resolveProduct(`${p.id}__${activeSize}`);
        addToBasket(variant);
      });

      // Sensory profile link
      const sensoryLink = document.createElement('button');
      sensoryLink.type = 'button';
      sensoryLink.className = 'cupping-link-btn';
      sensoryLink.textContent = 'Cupping notes & brew tips ↗';
      sensoryLink.style.cssText = 'background:none;border:none;color:var(--accent);font:500 0.85rem var(--body);padding:8px 0 0;cursor:pointer;text-align:center;text-decoration:underline';
      sensoryLink.addEventListener('click', () => openCuppingDialog(p, activeSize));

      copy.append(category, h, flavorPills, note, packRow, priceRow, addBtn, sensoryLink);
      card.append(imgWrap, copy);
      grid.append(card);
    }

    if ($('#product-count')) $('#product-count').textContent = `${selected.length} handcrafted coffee${selected.length === 1 ? '' : 's'} available`;
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
  render();
}

if ($('#year') && !$('#year').textContent) $('#year').textContent = new Date().getFullYear();

// Menu toggle
const menu = $('#menu-toggle');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  if ($('#mobile-menu')) $('#mobile-menu').hidden = open;
});
})();
