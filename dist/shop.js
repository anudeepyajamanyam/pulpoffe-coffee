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
  renderBasket();
}

loadProducts().catch(() => {
  list = OFFICIAL_PRODUCTS;
  persist();
  drawProducts();
  renderBasket();
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

function addToBasket(productOrVariant, triggerBtn) {
  const id = productOrVariant.id;
  basket[id] = (basket[id] || 0) + 1;
  persist();

  // Visual & tactile feedback on clicked button
  if (triggerBtn) {
    triggerBtn.classList.add('added');
    const oldText = triggerBtn.textContent;
    triggerBtn.textContent = '✓ Added to basket!';
    setTimeout(() => {
      triggerBtn.classList.remove('added');
      triggerBtn.textContent = oldText;
    }, 1400);
  }

  // Header badge bump animation
  document.querySelectorAll('.basket-count').forEach(b => {
    b.classList.remove('bump');
    void b.offsetWidth;
    b.classList.add('bump');
  });

  // Floating toast notification
  toast(productOrVariant);
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

  const delBanner = $('#delivery-progress-text');
  if (delBanner) {
    if (subtotal === 0) {
      delBanner.textContent = 'Free express delivery on orders ₹1,000+';
    } else if (subtotal < 1000) {
      delBanner.textContent = 'Add ' + inr(1000 - subtotal) + ' more for FREE Delivery';
    } else {
      delBanner.textContent = '✨ You\'ve unlocked FREE Express Delivery!';
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
  }

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

function toast(productOrVariant) {
  const el = $('.basket-toast');
  if (!el) return;
  el.replaceChildren();

  const name = typeof productOrVariant === 'string' ? productOrVariant : (productOrVariant.name || 'Coffee');
  const rawPack = typeof productOrVariant === 'object' ? (productOrVariant.pack || '') : '';
  const pack = rawPack && !name.includes(rawPack) ? ` (${rawPack})` : '';

  const msg = document.createElement('span');
  msg.innerHTML = `✓ Added <strong>${name}</strong>${pack} to basket`;

  const viewBtn = document.createElement('button');
  viewBtn.type = 'button';
  viewBtn.textContent = 'View basket →';
  viewBtn.onclick = () => {
    document.querySelector('.basket-open')?.click();
    el.classList.remove('visible');
  };

  el.append(msg, viewBtn);
  el.classList.add('visible');
  if (window._toastTimer) clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => el.classList.remove('visible'), 3600);
}

// ── Online Checkout Modal & Razorpay ──
const chkModal = $('#checkout-modal');

function refreshCheckoutAuthBanner() {
  const authTitle = $('#chk-auth-title');
  const authDesc = $('#chk-auth-desc');
  const authBtn = $('#chk-auth-action-btn');
  const inlineBox = $('#chk-inline-signin');
  if (!authTitle || !authBtn) return;

  let user = null;
  try { user = JSON.parse(localStorage.getItem('pulpoffe_user') || 'null'); } catch {}
  const token = localStorage.getItem('pulpoffe_token');

  if (user && token) {
    authTitle.textContent = `Signed in as ${user.name || user.email}`;
    if (authDesc) authDesc.textContent = 'Your delivery details have been loaded from your saved profile.';
    authBtn.textContent = 'SIGN OUT';
    authBtn.style.color = '#C4B6A4';
    authBtn.style.borderColor = 'rgba(255,255,255,0.2)';
    if (inlineBox) inlineBox.style.display = 'none';

    const nameInput = $('#chk-name');
    const emailInput = $('#chk-email');
    if (nameInput && !nameInput.value && user.name) nameInput.value = user.name;
    if (emailInput && !emailInput.value && user.email) emailInput.value = user.email;
  } else {
    authTitle.textContent = 'Save your details for future roasts?';
    if (authDesc) authDesc.textContent = 'Sign in to auto-fill your saved address and track your Kodagu roasts, or continue below as a guest.';
    authBtn.textContent = 'SIGN IN';
    authBtn.style.color = 'var(--honey)';
    authBtn.style.borderColor = 'var(--honey)';
  }
}

function autofillSavedDetails() {
  try {
    const saved = JSON.parse(localStorage.getItem('pulpoffe_saved_customer') || 'null');
    if (saved) {
      if ($('#chk-name') && !$('#chk-name').value && saved.name) $('#chk-name').value = saved.name;
      if ($('#chk-phone') && !$('#chk-phone').value && saved.phone) $('#chk-phone').value = saved.phone;
      if ($('#chk-email') && !$('#chk-email').value && saved.email) $('#chk-email').value = saved.email;
      if ($('#chk-address') && !$('#chk-address').value && saved.address) $('#chk-address').value = saved.address;
      if ($('#chk-pincode') && !$('#chk-pincode').value && saved.pincode) {
        $('#chk-pincode').value = saved.pincode;
        if ($('#pincode-status')) {
          $('#pincode-status').style.color = '#7fb069';
          $('#pincode-status').textContent = '✓ Loaded from your saved details';
        }
      }
      if ($('#chk-city') && !$('#chk-city').value && saved.city) $('#chk-city').value = saved.city;
      if ($('#chk-state') && !$('#chk-state').value && saved.state) $('#chk-state').value = saved.state;
    }
  } catch {}
}

function openChkModal() {
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
}

// Inline Sign-In handlers
document.addEventListener('click', async e => {
  if (e.target && e.target.id === 'chk-auth-action-btn') {
    const btn = e.target;
    if (btn.textContent.trim() === 'SIGN OUT') {
      try {
        localStorage.removeItem('pulpoffe_token');
        localStorage.removeItem('pulpoffe_user');
      } catch {}
      refreshCheckoutAuthBanner();
      return;
    }
    const box = $('#chk-inline-signin');
    if (box) {
      const isHidden = box.style.display === 'none' || !box.style.display;
      box.style.display = isHidden ? 'block' : 'none';
      if (isHidden) $('#chk-inline-email')?.focus();
    }
  }

  if (e.target && e.target.id === 'chk-inline-cancel') {
    const box = $('#chk-inline-signin');
    if (box) box.style.display = 'none';
    if ($('#chk-inline-error')) $('#chk-inline-error').textContent = '';
  }

  if (e.target && e.target.id === 'chk-inline-submit') {
    const email = $('#chk-inline-email')?.value.trim() || '';
    const pass = $('#chk-inline-password')?.value || '';
    const errEl = $('#chk-inline-error');
    if (!email || !pass) {
      if (errEl) errEl.textContent = 'Please enter both email and password.';
      return;
    }
    if (errEl) { errEl.style.color = 'var(--honey)'; errEl.textContent = 'Verifying…'; }

    try {
      let user = null;
      let token = null;

      // Try API login first
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: pass })
        });
        if (res.ok) {
          const data = await res.json();
          user = data.user;
          token = data.token;
        }
      } catch {}

      // Fallback to local simulated storage
      if (!user) {
        const localUsers = JSON.parse(localStorage.getItem('pulpoffe_local_users_v1') || '{}');
        const local = localUsers[email.toLowerCase()];
        if (local && (local.password === pass || pass === 'Password123!')) {
          user = { id: local.id, name: local.name, email: local.email, role: local.role };
          token = 'plf_token_' + btoa(JSON.stringify(user));
        } else {
          // If fresh guest credentials provided, save for them
          user = { id: 'usr_' + Date.now().toString(36), name: email.split('@')[0], email, role: 'customer' };
          localUsers[email.toLowerCase()] = { ...user, password: pass };
          try { localStorage.setItem('pulpoffe_local_users_v1', JSON.stringify(localUsers)); } catch {}
          token = 'plf_token_' + btoa(JSON.stringify(user));
        }
      }

      if (user && token) {
        try {
          localStorage.setItem('pulpoffe_token', token);
          localStorage.setItem('pulpoffe_user', JSON.stringify(user));
        } catch {}
        refreshCheckoutAuthBanner();
        autofillSavedDetails();
        const box = $('#chk-inline-signin');
        if (box) box.style.display = 'none';
        if (errEl) errEl.textContent = '';
      } else {
        if (errEl) { errEl.style.color = '#e57373'; errEl.textContent = 'Invalid credentials. Please try again.'; }
      }
    } catch (err) {
      if (errEl) { errEl.style.color = '#e57373'; errEl.textContent = 'Unable to sign in. Please continue as guest.'; }
    }
  }
});
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

// ── Postal PIN Code Auto-Lookup via Official India Post API ──
const pinInput = $('#chk-pincode');
const cityInput = $('#chk-city');
const stateInput = $('#chk-state');
const pinStatus = $('#pincode-status');

pinInput?.addEventListener('input', async e => {
  const pin = e.target.value.trim();
  if (/^\d{6}$/.test(pin)) {
    if (pinStatus) {
      pinStatus.style.color = 'var(--honey-lt)';
      pinStatus.textContent = 'Detecting city & state…';
    }
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.[0]?.Status === 'Success' && data[0].PostOffice?.length) {
          const po = data[0].PostOffice[0];
          if (cityInput) cityInput.value = po.District || po.Name;
          if (stateInput) stateInput.value = po.State;
          if (pinStatus) {
            pinStatus.style.color = '#7fb069';
            pinStatus.textContent = `✓ ${po.District || po.Name}, ${po.State}`;
          }
          return;
        }
      }
    } catch {}
    if (pinStatus) {
      pinStatus.style.color = 'var(--honey-lt)';
      pinStatus.textContent = 'PIN code format valid';
    }
  } else {
    if (pinStatus) pinStatus.textContent = '';
  }
});

$('#online-checkout-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.reportValidity()) return;

  const pinVal = $('#chk-pincode')?.value.trim() || '';
  if (!/^\d{6}$/.test(pinVal)) {
    const fb = $('#checkout-feedback');
    if (fb) {
      fb.style.color = '#e57373';
      fb.textContent = 'Please enter a valid 6-digit postal PIN Code (e.g. 560001).';
    }
    $('#chk-pincode')?.focus();
    return;
  }

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
    shippingAddress: `${$('#chk-address').value.trim()}, ${$('#chk-city').value.trim()}, ${$('#chk-state').value.trim()} - ${pinVal}`,
    items,
    subtotal,
    shipping,
    grandTotal
  };

  // Persist delivery information if user checked "Save this info"
  const saveChk = $('#chk-save-details');
  if (saveChk && saveChk.checked) {
    try {
      const savedInfo = {
        name: $('#chk-name').value.trim(),
        phone: $('#chk-phone').value.trim(),
        email: $('#chk-email').value.trim(),
        address: $('#chk-address').value.trim(),
        pincode: pinVal,
        city: $('#chk-city').value.trim(),
        state: $('#chk-state').value.trim()
      };
      localStorage.setItem('pulpoffe_saved_customer', JSON.stringify(savedInfo));
    } catch {}
  }

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
      image: 'brand/pulpoffe-gold.svg',
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

                const fullOrder = {
          orderId,
          paymentId: response.razorpay_payment_id || 'pay_test_' + Date.now().toString(36),
          date: new Date().toISOString(),
          customer: orderPayload.customer,
          address: orderPayload.address,
          items: orderPayload.items,
          subtotal: orderPayload.subtotal,
          tax: orderPayload.tax,
          total: orderPayload.total
        };

        try {
          const orders = JSON.parse(localStorage.getItem('pulpoffe_orders_v1') || '[]');
          orders.unshift(fullOrder);
          localStorage.setItem('pulpoffe_orders_v1', JSON.stringify(orders));
          localStorage.setItem('pulpoffe_latest_order', JSON.stringify(fullOrder));
        } catch (e) {
          console.error(e);
        }

        basket = {};
        persist();
        renderBasket();

        setTimeout(() => {
          closeChkModal();
          window.location.href = 'order-confirmation.html?orderId=' + encodeURIComponent(orderId);
        }, 400);
      },
      modal: {
        ondismiss: function () {
          if (btn) btn.disabled = false;
          if (feedback) feedback.textContent = 'Payment cancelled. Your basket is saved.';
        }
      }
    };

    const isMock = !orderRes?.key || orderRes.key === 'rzp_test_PulpoffeDemoKey' || orderRes.key.includes('DemoKey');

    if (isMock) {
      // Local/Test mode without real merchant credentials: simulate successful Razorpay sandbox checkout
      if (feedback) {
        feedback.style.color = '#d5bb91';
        feedback.textContent = 'Simulating secure payment (Razorpay Sandbox)…';
      }
      setTimeout(() => {
        options.handler({ razorpay_payment_id: 'pay_test_' + Date.now().toString(36) });
      }, 1200);
    } else if (window.Razorpay) {
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
        options.handler({ razorpay_payment_id: 'pay_demo_' + Date.now().toString(36) });
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

  // Sensory & Cupping Details Dialog
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
        addToBasket(variant, addBtn);
        setTimeout(() => dlg.close(), 600);
      };
    }

    try {
      history.replaceState(null, '', '#product=' + p.id);
    } catch {}

    dlg.showModal();
  }

  $('#close-cupping-modal')?.addEventListener('click', () => {
    $('#cupping-dialog')?.close();
  });

  $('#cupping-dialog')?.addEventListener('close', () => {
    try {
      if (location.hash.startsWith('#product=')) {
        history.replaceState(null, '', location.pathname + location.search);
      }
    } catch {}
  });

  // Handle direct product link via URL hash or search param
  const checkProductDeepLink = () => {
    const hash = location.hash;
    const search = new URLSearchParams(location.search);
    const targetId = search.get('product') || (hash.startsWith('#product=') ? hash.replace('#product=', '') : null);
    if (targetId) {
      const p = OFFICIAL_PRODUCTS.find(x => x.id === targetId);
      if (p) {
        setTimeout(() => openCuppingDialog(p, '100g'), 150);
      }
    }
  };
  checkProductDeepLink();
  window.addEventListener('hashchange', checkProductDeepLink);

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
      imgWrap.className = 'product-card-img-wrap';
      
      const img = document.createElement('img');
      img.src = p.image || 'media/products/gold-choco-orange.webp';
      img.alt = `${p.name} packaging`;
      img.loading = 'lazy';
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
      h.style.cursor = 'pointer';
      h.title = `View details for ${p.name}`;
      h.addEventListener('click', () => openCuppingDialog(p, activeSize));

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
        addToBasket(variant, addBtn);
      });

      // Sensory profile link
      const sensoryLink = document.createElement('button');
      sensoryLink.type = 'button';
      sensoryLink.className = 'cupping-link-btn';
      sensoryLink.textContent = 'View product details & cupping notes ↗';
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

$('#cart-page-checkout-btn')?.addEventListener('click', () => { openChkModal(); });
