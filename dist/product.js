(() => {
  const $ = s => document.querySelector(s);
  const inr = v => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(v);
  const storageKey = 'pulpoffe-basket-v1';
  let basket = {};

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      for (const [id, count] of Object.entries(saved)) {
        const n = Number(count);
        if (Number.isInteger(n) && n > 0) basket[id] = Math.min(n, 99);
      }
    }
  } catch {}

  function persist() {
    try { localStorage.setItem(storageKey, JSON.stringify(basket)); } catch {}
    document.querySelectorAll('.basket-count').forEach(n => {
      n.textContent = Object.values(basket).reduce((a, b) => a + b, 0);
    });
  }
  persist();

  // Find product from catalog
  const catalog = window.OFFICIAL_PRODUCTS || [];
  const params = new URLSearchParams(location.search);
  let productId = params.get('id') || (location.hash ? location.hash.replace('#product=', '').replace('#', '') : null) || 'gold-caramel';
  let activeSize = params.get('size') || '100g';

  let product = catalog.find(p => p.id === productId);
  if (!product) {
    product = catalog[0] || {
      id: 'gold-caramel',
      name: 'Caramel',
      range: 'Gold Range · Granular',
      price: 283,
      prices: { '100g': 283, '200g': 566, '250g': 708, '500g': 1415 },
      flavorNotes: ['Caramel', 'Brown Sugar', 'Toasted Nuts', 'Cream'],
      description: 'Silky caramel sweetness with a buttery toasted finish that lingers long. Pure artisanal comfort.',
      origin: 'Kodagu, Karnataka',
      image: 'media/products/gold-caramel.webp'
    };
  }

  // Populate Page Headings & Metadata
  document.title = `${product.name} (${product.range}) — Pulpoffe Coffee`;
  $('#page-title').textContent = `${product.name} — Pulpoffe Kodagu Coffee`;
  $('#crumb-range').textContent = product.range.split('·')[0].trim();
  $('#crumb-name').textContent = product.name;

  // Populate Gallery
  $('#p-badge').textContent = product.range;
  $('#p-image').src = product.image || 'media/products/gold-caramel.webp';
  $('#p-image').alt = `${product.name} Single-Origin Kodagu Coffee Packaging`;
  $('#p-origin').textContent = product.origin || 'Kodagu, Karnataka';
  $('#p-rating').textContent = `★ ${product.rating || '4.8'} / 5.0`;

  // Populate Info
  $('#p-collection-tag').textContent = product.range;
  $('#p-title').textContent = product.name;
  $('#p-desc').textContent = product.description || product.note || '';

  // Flavor pills
  const flavorHost = $('#p-flavor-tags');
  flavorHost.replaceChildren();
  (product.flavorNotes || []).forEach(f => {
    const tag = document.createElement('span');
    tag.className = 'flavor-tag';
    tag.style.cssText = 'background:var(--alt);color:var(--ink);border:1px solid var(--line);font-size:0.8rem;padding:4px 10px;border-radius:14px;font-weight:500';
    tag.textContent = f;
    flavorHost.append(tag);
  });

  // Sensory Meters
  const setMeter = (id, valId, val) => {
    const v = val || 50;
    const bar = $(`#meter-${id}`);
    const lbl = $(`#val-${valId}`);
    if (bar) bar.style.width = `${v}%`;
    if (lbl) lbl.textContent = `${v}/100`;
  };
  setMeter('acidity', 'acidity', product.acidity);
  setMeter('body', 'body', product.body);
  setMeter('aroma', 'aroma', product.aroma);
  setMeter('sweetness', 'sweetness', product.sweetness);

  // Brewing Ritual
  if ($('#p-temp')) $('#p-temp').textContent = product.waterTemp || '90°C';
  if ($('#p-ratio')) $('#p-ratio').textContent = product.ratio || '1.5 tsp / 150ml';
  if ($('#p-pairing')) $('#p-pairing').textContent = product.servingSuggestion || 'Best paired with warm oat milk or served black over ice.';

  // Pack selector & Price
  const packRow = $('#p-pack-row');
  packRow.replaceChildren();

  const getActivePrice = () => product.prices?.[activeSize] ?? product.price ?? 283;

  function updatePriceDisplay() {
    $('#p-price').textContent = inr(getActivePrice());
    $('#p-pack-label').textContent = activeSize;
    updateActionUI();
  }

  for (const size of ['100g', '200g', '250g', '500g']) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pack-btn' + (size === activeSize ? ' active' : '');
    b.textContent = size;
    b.addEventListener('click', () => {
      activeSize = size;
      packRow.querySelectorAll('.pack-btn').forEach(btn => btn.classList.toggle('active', btn === b));
      updatePriceDisplay();
    });
    packRow.append(b);
  }

  // Persistent Quantity Controller UI
  const actionContainer = $('#p-action-container');

  function updateActionUI() {
    actionContainer.replaceChildren();
    const variantId = `${product.id}__${activeSize}`;
    const count = basket[variantId] || basket[product.id] || 0;

    if (count > 0) {
      const ctrl = document.createElement('div');
      ctrl.className = 'card-qty-controller';

      const minusBtn = document.createElement('button');
      minusBtn.type = 'button';
      minusBtn.className = 'qty-btn';
      minusBtn.textContent = '−';
      minusBtn.setAttribute('aria-label', `Decrease ${product.name} quantity`);
      minusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const actualId = basket[variantId] ? variantId : product.id;
        if (basket[actualId] > 1) {
          basket[actualId]--;
        } else {
          delete basket[actualId];
        }
        persist();
        renderBasket();
        updateActionUI();
      });

      const qtyDisplay = document.createElement('span');
      qtyDisplay.className = 'qty-display';
      qtyDisplay.innerHTML = `✓ <strong>${count}</strong> in basket (${activeSize})`;

      const plusBtn = document.createElement('button');
      plusBtn.type = 'button';
      plusBtn.className = 'qty-btn';
      plusBtn.textContent = '+';
      plusBtn.setAttribute('aria-label', `Increase ${product.name} quantity`);
      plusBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const actualId = basket[variantId] ? variantId : (basket[product.id] ? product.id : variantId);
        basket[actualId] = (basket[actualId] || 0) + 1;
        persist();
        renderBasket();
        updateActionUI();
      });

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'qty-remove-btn';
      removeBtn.textContent = 'Remove ✕';
      removeBtn.setAttribute('aria-label', `Remove ${product.name} from basket`);
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        delete basket[variantId];
        delete basket[product.id];
        persist();
        renderBasket();
        updateActionUI();
      });

      ctrl.append(minusBtn, qtyDisplay, plusBtn, removeBtn);
      actionContainer.append(ctrl);
    } else {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'add-basket';
      addBtn.style.cssText = 'width:100%;justify-content:center;font-size:0.95rem;padding:12px';
      addBtn.textContent = 'Add to basket +';
      addBtn.setAttribute('aria-label', `Add ${product.name} (${activeSize}) to basket`);
      addBtn.addEventListener('click', () => {
        const variantId = `${product.id}__${activeSize}`;
        basket[variantId] = (basket[variantId] || 0) + 1;
        persist();
        toast({ name: `${product.name} (${activeSize})` });
        renderBasket();
        updateActionUI();
      });
      actionContainer.append(addBtn);
    }
  }

  updatePriceDisplay();

  // Buy Now (Instant Checkout)
  $('#p-buy-now-btn')?.addEventListener('click', () => {
    const variantId = `${product.id}__${activeSize}`;
    if (!basket[variantId]) {
      basket[variantId] = 1;
      persist();
    }
    window.location.href = 'checkout.html';
  });

  // Related products
  const relatedGrid = $('#related-grid');
  if (relatedGrid) {
    const others = catalog.filter(p => p.id !== product.id).slice(0, 4);
    for (const rel of others) {
      const card = document.createElement('article');
      card.className = 'product-card';

      let relSize = '100g';
      const getRelPrice = () => rel.prices?.[relSize] ?? rel.price;

      const imgWrap = document.createElement('div');
      imgWrap.className = 'product-card-img-wrap';
      imgWrap.style.cursor = 'pointer';
      
      const img = document.createElement('img');
      img.src = rel.image || 'media/products/gold-caramel.webp';
      img.alt = `${rel.name} packaging`;
      img.loading = 'lazy';
      imgWrap.append(img);

      imgWrap.addEventListener('click', () => {
        window.location.href = `product.html?id=${rel.id}&size=${relSize}`;
      });

      const copy = document.createElement('div');
      copy.style.cssText = 'padding:16px;display:flex;flex-direction:column;flex:1';

      const cat = document.createElement('p');
      cat.className = 'product-category';
      cat.textContent = rel.range;

      const h = document.createElement('h3');
      h.style.cssText = 'margin:0 0 8px;font-size:1.15rem;font-family:var(--disp);cursor:pointer';
      h.textContent = rel.name;
      h.addEventListener('click', () => {
        window.location.href = `product.html?id=${rel.id}&size=${relSize}`;
      });

      const priceVal = document.createElement('strong');
      priceVal.className = 'product-price';
      priceVal.textContent = inr(getRelPrice());

      // Pack row
      const relPackRow = document.createElement('div');
      relPackRow.className = 'pack-selector-row';
      relPackRow.style.margin = '8px 0';
      for (const sz of ['100g', '200g', '250g', '500g']) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pack-btn' + (sz === relSize ? ' active' : '');
        btn.textContent = sz;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          relSize = sz;
          relPackRow.querySelectorAll('.pack-btn').forEach(b => b.classList.toggle('active', b === btn));
          priceVal.textContent = inr(getRelPrice());
          updateRelAction();
        });
        relPackRow.append(btn);
      }

      const relPriceRow = document.createElement('div');
      relPriceRow.style.cssText = 'display:flex;align-items:baseline;justify-content:space-between;margin:4px 0 10px';
      const taxSpan = document.createElement('span');
      taxSpan.style.cssText = 'font-size:0.75rem;color:var(--muted)';
      taxSpan.textContent = '5% GST incl.';
      relPriceRow.append(priceVal, taxSpan);

      const relAction = document.createElement('div');
      relAction.className = 'card-action-wrap';

      function updateRelAction() {
        relAction.replaceChildren();
        const vId = `${rel.id}__${relSize}`;
        const cnt = basket[vId] || basket[rel.id] || 0;

        if (cnt > 0) {
          const ctrl = document.createElement('div');
          ctrl.className = 'card-qty-controller';

          const minus = document.createElement('button');
          minus.type = 'button';
          minus.className = 'qty-btn';
          minus.textContent = '−';
          minus.addEventListener('click', (e) => {
            e.stopPropagation();
            const aId = basket[vId] ? vId : rel.id;
            if (basket[aId] > 1) basket[aId]--; else delete basket[aId];
            persist();
            renderBasket();
            updateRelAction();
          });

          const qty = document.createElement('span');
          qty.className = 'qty-display';
          qty.innerHTML = `✓ <strong>${cnt}</strong>`;

          const plus = document.createElement('button');
          plus.type = 'button';
          plus.className = 'qty-btn';
          plus.textContent = '+';
          plus.addEventListener('click', (e) => {
            e.stopPropagation();
            const aId = basket[vId] ? vId : (basket[rel.id] ? rel.id : vId);
            basket[aId] = (basket[aId] || 0) + 1;
            persist();
            renderBasket();
            updateRelAction();
          });

          const rem = document.createElement('button');
          rem.type = 'button';
          rem.className = 'qty-remove-btn';
          rem.textContent = '✕';
          rem.addEventListener('click', (e) => {
            e.stopPropagation();
            delete basket[vId];
            delete basket[rel.id];
            persist();
            renderBasket();
            updateRelAction();
          });

          ctrl.append(minus, qty, plus, rem);
          relAction.append(ctrl);
        } else {
          const add = document.createElement('button');
          add.type = 'button';
          add.className = 'add-basket';
          add.textContent = 'Add to basket +';
          add.addEventListener('click', (e) => {
            e.stopPropagation();
            const vId = `${rel.id}__${relSize}`;
            basket[vId] = (basket[vId] || 0) + 1;
            persist();
            toast({ name: `${rel.name} (${relSize})` });
            renderBasket();
            updateRelAction();
          });
          relAction.append(add);
        }
      }

      updateRelAction();

      copy.append(cat, h, relPackRow, relPriceRow, relAction);
      card.append(imgWrap, copy);
      relatedGrid.append(card);
    }
  }

  // Toast helper
  function toast(item) {
    const t = $('.basket-toast');
    if (!t) return;
    t.textContent = `✓ Added ${item.name || 'coffee'} to basket`;
    t.classList.add('visible');
    setTimeout(() => t.classList.remove('visible'), 2400);
  }

  // Basket Drawer Handling
  const dialog = $('#basket-dialog');
  document.querySelectorAll('.basket-open').forEach(b => b.addEventListener('click', () => {
    renderBasket();
    if (dialog) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    }
  }));

  function closeBasket() {
    if (dialog) {
      dialog.close();
      document.body.style.overflow = '';
    }
  }
  $('.basket-close')?.addEventListener('click', closeBasket);
  dialog?.addEventListener('cancel', () => { document.body.style.overflow = ''; });
  dialog?.addEventListener('click', e => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeBasket();
    }
  });

  function resolveItem(id) {
    if (id.includes('__')) {
      const [baseId, size] = id.split('__');
      const base = catalog.find(p => p.id === baseId);
      if (base) {
        return {
          ...base,
          id: id,
          selectedSize: size,
          name: `${base.name} (${size})`,
          pack: `${size} pack`,
          price: base.prices?.[size] ?? base.price
        };
      }
    }
    return catalog.find(p => p.id === id) || { name: id, group: 'gold', price: 0, pack: '100g' };
  }

  function renderBasket() {
    const host = $('#basket-items');
    if (!host) return;
    host.replaceChildren();
    const entries = Object.entries(basket);
    const emptyState = $('#basket-empty-state');
    if (emptyState) emptyState.hidden = entries.length > 0;
    if ($('#save-basket')) $('#save-basket').style.opacity = entries.length ? '1' : '0.5';

    let subtotal = 0;
    for (const [id, count] of entries) {
      const item = resolveItem(id);
      if (item && item.price) subtotal += item.price * count;

      const li = document.createElement('li');
      li.className = 'basket-item';
      li.innerHTML = `
        <div style="flex:1">
          <div style="font-weight:600;font-size:0.95rem;color:var(--ink)">${item.name}</div>
          <div style="font-size:0.8rem;color:var(--muted)">${inr(item.price)} each</div>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <button class="b-minus" style="width:26px;height:26px;border:1px solid var(--line);background:var(--bg);border-radius:4px;cursor:pointer">−</button>
          <span style="font-size:0.9rem;font-weight:600;min-width:20px;text-align:center">${count}</span>
          <button class="b-plus" style="width:26px;height:26px;border:1px solid var(--line);background:var(--bg);border-radius:4px;cursor:pointer">+</button>
          <button class="b-remove" style="background:none;border:none;color:var(--muted);cursor:pointer;margin-left:6px;font-size:0.9rem" title="Remove">✕</button>
        </div>
      `;

      li.querySelector('.b-minus').addEventListener('click', () => {
        if (basket[id] > 1) basket[id]--; else delete basket[id];
        persist();
        renderBasket();
        updateActionUI();
      });
      li.querySelector('.b-plus').addEventListener('click', () => {
        basket[id]++;
        persist();
        renderBasket();
        updateActionUI();
      });
      li.querySelector('.b-remove').addEventListener('click', () => {
        delete basket[id];
        persist();
        renderBasket();
        updateActionUI();
      });

      host.append(li);
    }

    const shipping = subtotal > 0 ? (subtotal >= 1000 ? 0 : 60) : 0;
    const grandTotal = subtotal + shipping;

    if ($('#breakdown-subtotal')) $('#breakdown-subtotal').textContent = inr(subtotal);
    if ($('#breakdown-shipping')) $('#breakdown-shipping').textContent = subtotal === 0 ? '₹0.00' : (shipping === 0 ? 'FREE' : '₹60.00');
    if ($('#basket-total-amount')) $('#basket-total-amount').textContent = inr(grandTotal);

    const banner = $('#delivery-progress-text');
    if (banner) {
      if (subtotal === 0) banner.textContent = 'Free express delivery on orders ₹1,000+';
      else if (subtotal < 1000) banner.textContent = `Add ${inr(1000 - subtotal)} more for FREE Delivery`;
      else banner.textContent = '✨ You\'ve unlocked FREE Express Delivery!';
    }
  }

  renderBasket();

  // Mobile menu toggle
  const menuToggle = $('#menu-toggle');
  if (menuToggle) {
    menuToggle._pulpoffeNavBound = true;
    menuToggle.addEventListener('click', () => {
      const open = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!open));
      const drawer = $('#mobile-menu');
      if (drawer) drawer.hidden = open;
    });
  }
})();
