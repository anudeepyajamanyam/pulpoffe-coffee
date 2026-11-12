const fs = require('fs');

let html = fs.readFileSync('dist/index.html', 'utf8');

const newTilesMarkup = `<div class="g4">
          <a class="tile t1" href="shop.html?collection=gold">
            <span class="tile-watermark">I</span>
            <div class="tile-top">
              <span class="tile-badge">Collection I</span>
              <span class="tile-count">8 Coffees</span>
            </div>
            <div class="tile-content">
              <h3>Gold Range</h3>
              <div class="tile-tags">
                <span>Choco Orange</span><span>Vanilla</span><span>Hazelnut</span>
              </div>
              <p class="tile-desc">Artisanal infusions crafted with high-altitude Kodagu granular instant coffee.</p>
              <span class="tile-link">Explore flavours →</span>
            </div>
          </a>

          <a class="tile t2" href="shop.html?collection=silver">
            <span class="tile-watermark">II</span>
            <div class="tile-top">
              <span class="tile-badge">Collection II</span>
              <span class="tile-count">5 Blends</span>
            </div>
            <div class="tile-content">
              <h3>Silver Range</h3>
              <div class="tile-tags">
                <span>Prime 70/30</span><span>Imperial 60/40</span><span>Pure</span>
              </div>
              <p class="tile-desc">Highland Arabica &amp; Robusta blends, pure or traditionally paired with chicory.</p>
              <span class="tile-link">Explore blends →</span>
            </div>
          </a>

          <a class="tile t3" href="shop.html?collection=diamond">
            <span class="tile-watermark">III</span>
            <div class="tile-top">
              <span class="tile-badge">Collection III</span>
              <span class="tile-count">2 Reserves</span>
            </div>
            <div class="tile-content">
              <h3>Diamond Range</h3>
              <div class="tile-tags">
                <span>Freeze-Dried Pure</span><span>Spiced Reserve</span>
              </div>
              <p class="tile-desc">Single-estate reserve crystals, slow freeze-dried to capture origin aromatics.</p>
              <span class="tile-link">Explore reserve →</span>
            </div>
          </a>

          <a class="tile t4" href="contact.html?type=b2b">
            <span class="tile-watermark">B2B</span>
            <div class="tile-top">
              <span class="tile-badge">Enterprise</span>
              <span class="tile-count">Custom Supply</span>
            </div>
            <div class="tile-content">
              <h3>For Business</h3>
              <div class="tile-tags">
                <span>Cafés</span><span>Hotels</span><span>White-Label</span>
              </div>
              <p class="tile-desc">Bulk roast contracts, custom blends, and direct estate supply for hospitality.</p>
              <span class="tile-link">Request B2B quote →</span>
            </div>
          </a>
        </div>`;

const regex = /<div class="g4">[\s\S]*?<\/div>/;
html = html.replace(regex, newTilesMarkup);
fs.writeFileSync('dist/index.html', html, 'utf8');

// Update CSS in v2-tokens.css
let css = fs.readFileSync('dist/brand/v2-tokens.css', 'utf8');

const updatedTileCSS = `
/* ══════════════════════════════════════════════════════════════════
   LUXURY ARCHITECTURAL COLLECTION TILES (CLEAN, ZERO PNG/PHOTO CLUTTER)
   ══════════════════════════════════════════════════════════════════ */
.g4 {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 20px !important;
}

.tile {
  position: relative !important;
  min-height: 320px !important;
  border-radius: 12px !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  text-decoration: none !important;
  color: #FFFFFF !important;
  padding: 24px 22px !important;
  box-shadow: 0 10px 24px rgba(61,43,31,0.12) !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s ease, border-color 0.35s ease !important;
}

.tile:hover {
  transform: translateY(-6px) !important;
  box-shadow: 0 18px 36px rgba(0,0,0,0.35) !important;
  border-color: rgba(201,165,107,0.4) !important;
}

.tile-watermark {
  position: absolute !important;
  right: 12px !important;
  top: -10px !important;
  font-family: var(--disp) !important;
  font-size: 6.5rem !important;
  font-weight: 800 !important;
  line-height: 1 !important;
  color: rgba(255,255,255,0.05) !important;
  pointer-events: none !important;
  user-select: none !important;
  transition: transform 0.4s ease, color 0.4s ease !important;
}

.tile:hover .tile-watermark {
  transform: scale(1.08) translateY(-4px) !important;
  color: rgba(201,165,107,0.12) !important;
}

.t1 {
  background: linear-gradient(160deg, #5A3822 0%, #351F12 50%, #201107 100%) !important;
}
.t2 {
  background: linear-gradient(160deg, #4A4A48 0%, #2E2823 50%, #1A1715 100%) !important;
}
.t3 {
  background: linear-gradient(160deg, #1B4515 0%, #0E2C0C 50%, #051A04 100%) !important;
}
.t4 {
  background: linear-gradient(160deg, #3D2B1F 0%, #281910 50%, #160D07 100%) !important;
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
  letter-spacing: 0.14em !important;
  text-transform: uppercase !important;
  color: var(--honey-lt) !important;
  font-weight: 600 !important;
}

.tile-count {
  font-size: 0.75rem !important;
  color: #D9CEBE !important;
  background: rgba(255,255,255,0.1) !important;
  padding: 3px 8px !important;
  border-radius: 4px !important;
  border: 1px solid rgba(255,255,255,0.15) !important;
}

.tile-content {
  position: relative !important;
  z-index: 2 !important;
}

.tile h3 {
  font-family: var(--disp) !important;
  font-size: 1.55rem !important;
  font-weight: 700 !important;
  margin: 0 0 10px !important;
  color: #FFFFFF !important;
}

.tile-tags {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 6px !important;
  margin-bottom: 12px !important;
}

.tile-tags span {
  font-size: 0.72rem !important;
  background: rgba(255,255,255,0.08) !important;
  color: #E6D8C5 !important;
  padding: 2px 7px !important;
  border-radius: 4px !important;
  border: 1px solid rgba(255,255,255,0.12) !important;
}

.tile-desc {
  font-size: 0.85rem !important;
  line-height: 1.5 !important;
  color: #D5C8B8 !important;
  margin: 0 0 18px !important;
}

.tile-link {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-size: 0.92rem !important;
  font-weight: 600 !important;
  color: var(--honey-lt) !important;
  transition: transform 0.25s ease, color 0.25s ease !important;
}

.tile:hover .tile-link {
  transform: translateX(5px) !important;
  color: #FFFFFF !important;
}

@media (max-width: 900px) {
  .g4 {
    grid-template-columns: 1fr 1fr !important;
  }
}
@media (max-width: 540px) {
  .g4 {
    grid-template-columns: 1fr !important;
  }
}
`;

css += '\n' + updatedTileCSS;
fs.writeFileSync('dist/brand/v2-tokens.css', css, 'utf8');
console.log('Successfully updated dist/index.html and dist/brand/v2-tokens.css with luxury architectural gradient tiles!');
