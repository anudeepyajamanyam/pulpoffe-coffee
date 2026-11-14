const fs = require('fs');
const path = require('path');

// 1. Patch dist/shop.html
const shopHtmlPath = path.resolve(__dirname, '../dist/shop.html');
let shopHtml = fs.readFileSync(shopHtmlPath, 'utf8');

const oldDialogRegex = /<!-- Sensory & Cupping Details Dialog -->\s*<dialog id="cupping-dialog"[\s\S]*?<\/dialog>/i;

const newDialogHtml = `<!-- Sensory & Cupping Details Dialog (Warm Luxury Palette) -->
  <dialog id="cupping-dialog" aria-labelledby="cupping-title">
    <div style="position:relative;display:grid;grid-template-columns:1fr 1.25fr;max-height:85vh;overflow-y:auto;background:#FAF7F2;color:var(--ink)">
      <button id="close-cupping-modal" aria-label="Close details" style="position:absolute;top:14px;right:14px;background:rgba(0,0,0,0.06);border:1px solid var(--line);color:var(--ink);width:32px;height:32px;cursor:pointer;border-radius:50%;z-index:2;display:flex;align-items:center;justify-content:center;font-size:1.2rem">&times;</button>
      <div style="background:#F4EFEA;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:32px;border-right:1px solid var(--line)">
        <img id="cupping-img" src="media/products/gold-choco-orange.webp" alt="Coffee packshot" style="width:100%;max-width:280px;aspect-ratio:1/1;object-fit:contain;background:#FFFFFF;border:1px solid var(--line);padding:14px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.06)">
        <span id="cupping-range" class="eye" style="margin-top:20px;color:var(--muted);font-size:0.75rem;letter-spacing:1px;font-weight:600"></span>
        <p id="cupping-origin" style="font-size:0.85rem;color:var(--ink);margin:4px 0 0;font-weight:500"></p>
      </div>
      <div style="padding:32px 28px;display:flex;flex-direction:column;gap:18px;background:#FAF7F2">
        <div>
          <h2 id="cupping-title" style="font-size:1.75rem;margin:0 0 8px;color:var(--ink);font-family:var(--disp)"></h2>
          <div id="cupping-tags" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px"></div>
          <p id="cupping-desc" style="color:var(--ink);opacity:0.88;font-size:0.95rem;line-height:1.6;margin:0"></p>
        </div>

        <div style="border-top:1px solid var(--line);padding-top:14px">
          <span style="font-size:0.75rem;letter-spacing:1px;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:10px;font-family:var(--disp);font-weight:600">Cupping &amp; Sensory Metrics</span>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px 18px">
            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--ink);font-weight:500">
                <span>Acidity</span><span id="val-acidity"></span>
              </div>
              <div class="meter-track" style="background:var(--alt)"><div id="meter-acidity" class="meter-fill" style="background:linear-gradient(90deg, #A87D43, #D4AF37)"></div></div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--ink);font-weight:500">
                <span>Body &amp; Mouthfeel</span><span id="val-body"></span>
              </div>
              <div class="meter-track" style="background:var(--alt)"><div id="meter-body" class="meter-fill" style="background:linear-gradient(90deg, #A87D43, #D4AF37)"></div></div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--ink);font-weight:500">
                <span>Aroma Intensity</span><span id="val-aroma"></span>
              </div>
              <div class="meter-track" style="background:var(--alt)"><div id="meter-aroma" class="meter-fill" style="background:linear-gradient(90deg, #A87D43, #D4AF37)"></div></div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:0.8rem;color:var(--ink);font-weight:500">
                <span>Sweetness</span><span id="val-sweetness"></span>
              </div>
              <div class="meter-track" style="background:var(--alt)"><div id="meter-sweetness" class="meter-fill" style="background:linear-gradient(90deg, #A87D43, #D4AF37)"></div></div>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid var(--line);padding-top:14px">
          <span style="font-size:0.75rem;letter-spacing:1px;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:10px;font-family:var(--disp);font-weight:600">Recommended Brewing Ritual</span>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.85rem">
            <div style="background:#FFFFFF;border:1px solid var(--line);padding:10px;border-radius:6px">
              <strong style="color:var(--muted);display:block;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px">WATER TEMP</strong>
              <span id="cup-temp" style="color:var(--ink);font-weight:600"></span>
            </div>
            <div style="background:#FFFFFF;border:1px solid var(--line);padding:10px;border-radius:6px">
              <strong style="color:var(--muted);display:block;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px">COFFEE RATIO</strong>
              <span id="cup-ratio" style="color:var(--ink);font-weight:600"></span>
            </div>
            <div style="grid-column:1/-1;background:#FFFFFF;border:1px solid var(--line);padding:10px;border-radius:6px">
              <strong style="color:var(--muted);display:block;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px">SERVING PAIRING</strong>
              <span id="cup-pairing" style="color:var(--ink)"></span>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid var(--line);padding-top:16px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div>
            <span style="font-size:0.8rem;color:var(--muted);display:block;font-weight:600">Select pack size:</span>
            <div id="cupping-pack-row" class="pack-selector-row" style="margin-top:6px;margin-bottom:0"></div>
          </div>
          <div style="text-align:right">
            <div style="font-size:1.45rem;font-weight:700;color:var(--ink);font-family:var(--disp)">
              <span id="cupping-price"></span>
            </div>
            <span style="font-size:0.75rem;color:var(--muted)">5% GST included (<span id="cupping-pack-size">100g</span>)</span>
          </div>
        </div>

        <div style="display:flex;gap:10px;margin-top:6px">
          <button id="cupping-add-btn" class="btn p" style="flex:1;justify-content:center">Add to basket +</button>
          <a id="cupping-full-page-btn" href="product.html" class="btn s" style="justify-content:center;text-decoration:none;font-size:0.85rem;white-space:nowrap">Full Product Page →</a>
        </div>
      </div>
    </div>
  </dialog>`;

if (oldDialogRegex.test(shopHtml)) {
  shopHtml = shopHtml.replace(oldDialogRegex, newDialogHtml);
  fs.writeFileSync(shopHtmlPath, shopHtml, 'utf8');
  console.log('Updated dist/shop.html cupping dialog with warm luxury cream palette.');
} else {
  console.log('cupping dialog pattern not found in dist/shop.html');
}

// 2. Patch dist/shop.js
const shopJsPath = path.resolve(__dirname, '../dist/shop.js');
let shopJs = fs.readFileSync(shopJsPath, 'utf8');

// Update openCuppingDialog to also update #cupping-full-page-btn href
if (shopJs.includes('function openCuppingDialog(')) {
  shopJs = shopJs.replace(
    'function openCuppingDialog(p, currentSize = \'100g\') {',
    `function openCuppingDialog(p, currentSize = '100g') {
    const fullPageBtn = $('#cupping-full-page-btn');
    if (fullPageBtn) fullPageBtn.href = \`product.html?id=\${p.id}&size=\${currentSize}\`;`
  );
}

// Update shop grid rendering with persistent quantity controller & product links
const oldGridSectionStart = '// ── Shop Grid Rendering ──';
const oldGridIdx = shopJs.indexOf(oldGridSectionStart);
const oldGridEndIdx = shopJs.indexOf('if ($(\'#year\')', oldGridIdx);

if (oldGridIdx !== -1 && oldGridEndIdx !== -1) {
  const newGridCode = `// ── Shop Grid Rendering ──
let cardUpdaters = [];
function updateAllCards() {
  cardUpdaters.forEach(fn => { try { fn(); } catch {} });
}

if ($('#product-grid')) {
  let group = new URLSearchParams(location.search).get('collection') || 'all';
  if (!Object.hasOwn(groups, group)) group = 'all';
  let term = '';

  function render() {
    cardUpdaters = [];
    document.querySelectorAll('[data-shop-filter]').forEach(b => {
      const on = b.dataset.shopFilter === group;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', String(on));
    });

    const selected = list.filter(p => {
      const matchesGroup = (group === 'all' || p.group === group);
      const searchTarget = \`\${p.name} \${p.range} \${p.note} \${p.description} \${(p.flavorNotes || []).join(' ')}\`.toLowerCase();
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

      // Image header (clickable -> product.html)
      const imgWrap = document.createElement('div');
      imgWrap.className = 'product-card-img-wrap';
      imgWrap.style.cursor = 'pointer';
      
      const img = document.createElement('img');
      img.src = p.image || 'media/products/gold-choco-orange.webp';
      img.alt = \`\${p.name} packaging\`;
      img.loading = 'lazy';
      imgWrap.append(img);

      imgWrap.addEventListener('click', () => {
        window.location.href = \`product.html?id=\${p.id}&size=\${activeSize}\`;
      });

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

      // Name (clickable -> product.html)
      const h = document.createElement('h2');
      h.textContent = p.name;
      h.style.cursor = 'pointer';
      h.title = \`View details for \${p.name}\`;
      h.addEventListener('click', () => {
        window.location.href = \`product.html?id=\${p.id}&size=\${activeSize}\`;
      });

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

      // Action container for persistent quantity controller
      const actionWrap = document.createElement('div');
      actionWrap.className = 'card-action-wrap';

      function updateCardAction() {
        actionWrap.replaceChildren();
        const variantId = \`\${p.id}__\${activeSize}\`;
        const count = basket[variantId] || basket[p.id] || 0;

        if (count > 0) {
          const ctrl = document.createElement('div');
          ctrl.className = 'card-qty-controller';

          const minusBtn = document.createElement('button');
          minusBtn.type = 'button';
          minusBtn.className = 'qty-btn';
          minusBtn.textContent = '−';
          minusBtn.setAttribute('aria-label', \`Decrease \${p.name} quantity\`);
          minusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const actualId = basket[variantId] ? variantId : p.id;
            if (basket[actualId] > 1) {
              basket[actualId]--;
            } else {
              delete basket[actualId];
            }
            persist();
            renderBasket();
            updateAllCards();
          });

          const qtyText = document.createElement('span');
          qtyText.className = 'qty-display';
          qtyText.innerHTML = \`✓ <strong>\${count}</strong> in basket\`;

          const plusBtn = document.createElement('button');
          plusBtn.type = 'button';
          plusBtn.className = 'qty-btn';
          plusBtn.textContent = '+';
          plusBtn.setAttribute('aria-label', \`Increase \${p.name} quantity\`);
          plusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const actualId = basket[variantId] ? variantId : (basket[p.id] ? p.id : variantId);
            basket[actualId] = (basket[actualId] || 0) + 1;
            persist();
            renderBasket();
            updateAllCards();
          });

          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'qty-remove-btn';
          removeBtn.textContent = 'Remove ✕';
          removeBtn.setAttribute('aria-label', \`Remove \${p.name} from basket\`);
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            delete basket[variantId];
            delete basket[p.id];
            persist();
            renderBasket();
            updateAllCards();
          });

          ctrl.append(minusBtn, qtyText, plusBtn, removeBtn);
          actionWrap.append(ctrl);
        } else {
          const addBtn = document.createElement('button');
          addBtn.type = 'button';
          addBtn.className = 'add-basket';
          addBtn.textContent = 'Add to basket +';
          addBtn.setAttribute('aria-label', \`Add \${p.name} (\${activeSize}) to basket\`);
          addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const variant = resolveProduct(\`\${p.id}__\${activeSize}\`);
            addToBasket(variant);
            updateAllCards();
          });
          actionWrap.append(addBtn);
        }
      }

      cardUpdaters.push(updateCardAction);

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
          updateCardAction();
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

      updateCardAction();

      // Dedicated Product Page link
      const sensoryLink = document.createElement('button');
      sensoryLink.type = 'button';
      sensoryLink.className = 'cupping-link-btn';
      sensoryLink.textContent = 'View product details & cupping notes →';
      sensoryLink.style.cssText = 'background:none;border:none;color:var(--accent);font:500 0.85rem var(--body);padding:8px 0 0;cursor:pointer;text-align:center;text-decoration:underline';
      sensoryLink.addEventListener('click', () => {
        window.location.href = \`product.html?id=\${p.id}&size=\${activeSize}\`;
      });

      copy.append(category, h, flavorPills, note, packRow, priceRow, actionWrap, sensoryLink);
      card.append(imgWrap, copy);
      grid.append(card);
    }

    if ($('#product-count')) $('#product-count').textContent = \`\${selected.length} handcrafted coffee\${selected.length === 1 ? '' : 's'} available\`;
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

`;

  shopJs = shopJs.slice(0, oldGridIdx) + newGridCode + shopJs.slice(oldGridEndIdx);
  fs.writeFileSync(shopJsPath, shopJs, 'utf8');
  console.log('Updated dist/shop.js with persistent quantity controllers and product page navigation.');
} else {
  console.log('Could not find grid section in dist/shop.js');
}
