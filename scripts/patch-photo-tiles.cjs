const fs = require('fs');

// 1. Update index.html to remove img tags from the tiles
let html = fs.readFileSync('dist/index.html', 'utf8');

const oldTilesSection = `<div class="g4">
          <a class="tile t1" href="shop.html?collection=gold">
            <img class="tile-packshot" src="media/products/gold-choco-orange.webp" alt="Gold Range pouch" loading="lazy">
            <small>8 Flavoured Coffees</small>
            <h3>Gold Range</h3>
            <span>Explore flavours →</span>
          </a>
          <a class="tile t2" href="shop.html?collection=silver">
            <img class="tile-packshot" src="media/products/silver-agglo-pure.webp" alt="Silver Range pouch" loading="lazy">
            <small>5 Filter &amp; Pure Blends</small>
            <h3>Silver Range</h3>
            <span>Explore blends →</span>
          </a>
          <a class="tile t3" href="shop.html?collection=diamond">
            <img class="tile-packshot" src="media/products/diamond-freeze_dried.webp" alt="Diamond Range jar" loading="lazy">
            <small>2 Single-Estate Coffees</small>
            <h3>Diamond Range</h3>
            <span>Explore reserve →</span>
          </a>
          <a class="tile t4" href="contact.html?type=b2b">
            <img class="tile-packshot" src="media/products/b2b-bulk-suite.webp" alt="Pulpoffe commercial bulk and wholesale coffee range" loading="lazy">
            <small>Commercial &amp; Bulk</small>
            <h3>For Business</h3>
            <span>Custom quote →</span>
          </a>
        </div>`;

const newTilesSection = `<div class="g4">
          <a class="tile t1" href="shop.html?collection=gold">
            <div class="tile-bg"></div>
            <div class="tile-content">
              <span class="tile-tag">Artisanal Flavours</span>
              <small>8 Handcrafted Flavours</small>
              <h3>Gold Range</h3>
              <p class="tile-desc">Rich cocoa, vanilla, hazelnut &amp; citrus fruit infusions.</p>
              <span class="tile-link">Explore flavours →</span>
            </div>
          </a>
          <a class="tile t2" href="shop.html?collection=silver">
            <div class="tile-bg"></div>
            <div class="tile-content">
              <span class="tile-tag">Filter &amp; Pure</span>
              <small>5 Traditional Blends</small>
              <h3>Silver Range</h3>
              <p class="tile-desc">Highland Arabica &amp; Robusta, pure or chicory blended.</p>
              <span class="tile-link">Explore blends →</span>
            </div>
          </a>
          <a class="tile t3" href="shop.html?collection=diamond">
            <div class="tile-bg"></div>
            <div class="tile-content">
              <span class="tile-tag">Single Estate Reserve</span>
              <small>2 Reserve Coffees</small>
              <h3>Diamond Range</h3>
              <p class="tile-desc">100% high-altitude freeze-dried &amp; spiced estate reserve.</p>
              <span class="tile-link">Explore reserve →</span>
            </div>
          </a>
          <a class="tile t4" href="contact.html?type=b2b">
            <div class="tile-bg"></div>
            <div class="tile-content">
              <span class="tile-tag">Wholesale &amp; Bulk</span>
              <small>Cafés, Retail &amp; Export</small>
              <h3>For Business</h3>
              <p class="tile-desc">Direct estate supply, custom roast profiles &amp; private blend.</p>
              <span class="tile-link">Request a quote →</span>
            </div>
          </a>
        </div>`;

if (html.includes(oldTilesSection)) {
  html = html.replace(oldTilesSection, newTilesSection);
  fs.writeFileSync('dist/index.html', html, 'utf8');
  console.log('Replaced oldTilesSection in dist/index.html');
} else {
  // Regex replacement
  const regex = /<div class="g4">[\s\S]*?<\/div>\s*<p style="margin-top:28px">/m;
  if (regex.test(html)) {
    html = html.replace(regex, newTilesSection + '\n<p style="margin-top:28px">');
    fs.writeFileSync('dist/index.html', html, 'utf8');
    console.log('Regex replaced tiles section in dist/index.html');
  } else {
    // try matching just g4
    const regex2 = /<div class="g4">[\s\S]*?<\/div>/;
    html = html.replace(regex2, newTilesSection);
    fs.writeFileSync('dist/index.html', html, 'utf8');
    console.log('Regex2 replaced tiles section in dist/index.html');
  }
}

// 2. Update CSS for .tile, .t1, .t2, .t3, .t4 and .tile-bg
let css = fs.readFileSync('dist/brand/v2-tokens.css', 'utf8');

const newTileStyles = `
/* ══════════════════════════════════════════════════════════════════
   IMMERSIVE PHOTOGRAPHIC COLLECTION TILES (ZERO PNG CUTOUTS)
   ══════════════════════════════════════════════════════════════════ */
.g4 {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 20px !important;
}

.tile {
  position: relative !important;
  min-height: 340px !important;
  border-radius: 14px !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-end !important;
  text-decoration: none !important;
  color: #FFFFFF !important;
  box-shadow: 0 10px 24px rgba(61,43,31,0.12) !important;
  border: 1px solid rgba(255,255,255,0.1) !important;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease !important;
}

.tile:hover {
  transform: translateY(-6px) !important;
  box-shadow: 0 18px 36px rgba(0,0,0,0.3) !important;
}

.tile-bg {
  position: absolute !important;
  inset: 0 !important;
  z-index: 0 !important;
  background-size: cover !important;
  background-position: center !important;
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
}

.tile:hover .tile-bg {
  transform: scale(1.08) !important;
}

/* Scrim overlay */
.tile:before {
  content: "" !important;
  position: absolute !important;
  inset: 0 !important;
  z-index: 1 !important;
  pointer-events: none !important;
  background: linear-gradient(180deg, rgba(16,10,6,0.1) 0%, rgba(16,10,6,0.65) 45%, rgba(16,10,6,0.94) 100%) !important;
}

.t1 .tile-bg {
  background-image: url('../media/products/hero-poster-user.webp') !important;
}
.t1:before {
  background: linear-gradient(180deg, rgba(61,43,31,0.15) 0%, rgba(45,26,14,0.7) 48%, rgba(26,13,5,0.96) 100%) !important;
}

.t2 .tile-bg {
  background-image: url('../media/estate/estate-cherries-hands-1-1280.webp') !important;
}
.t2:before {
  background: linear-gradient(180deg, rgba(74,48,28,0.15) 0%, rgba(48,28,12,0.7) 48%, rgba(28,14,5,0.96) 100%) !important;
}

.t3 .tile-bg {
  background-image: url('../media/estate/estate-canopy-1-1280.webp') !important;
}
.t3:before {
  background: linear-gradient(180deg, rgba(5,53,2,0.15) 0%, rgba(4,38,1,0.7) 48%, rgba(2,20,1,0.96) 100%) !important;
}

.t4 .tile-bg {
  background-image: url('../media/estate/estate-hero-landscape-1280.webp') !important;
}
.t4:before {
  background: linear-gradient(180deg, rgba(40,25,15,0.15) 0%, rgba(28,16,8,0.7) 48%, rgba(16,8,4,0.96) 100%) !important;
}

.tile-content {
  position: relative !important;
  z-index: 2 !important;
  padding: 24px 20px !important;
}

.tile-tag {
  display: inline-block !important;
  background: rgba(255,255,255,0.18) !important;
  backdrop-filter: blur(6px) !important;
  -webkit-backdrop-filter: blur(6px) !important;
  border: 1px solid rgba(255,255,255,0.25) !important;
  color: var(--honey-lt) !important;
  font-size: 0.68rem !important;
  letter-spacing: 0.1em !important;
  text-transform: uppercase !important;
  font-weight: 700 !important;
  padding: 3px 8px !important;
  border-radius: 4px !important;
  margin-bottom: 10px !important;
}

.tile small {
  display: block !important;
  font-size: 0.8rem !important;
  color: #E8DCC8 !important;
  margin-bottom: 2px !important;
}

.tile h3 {
  font-family: var(--disp) !important;
  font-size: 1.45rem !important;
  font-weight: 700 !important;
  margin: 2px 0 6px !important;
  color: #FFFFFF !important;
  text-shadow: 0 2px 8px rgba(0,0,0,0.6) !important;
}

.tile-desc {
  font-size: 0.82rem !important;
  line-height: 1.45 !important;
  color: #D8CCC0 !important;
  margin: 0 0 14px !important;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6) !important;
}

.tile-link {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  font-size: 0.88rem !important;
  font-weight: 600 !important;
  color: var(--honey-lt) !important;
  transition: transform 0.25s ease !important;
}

.tile:hover .tile-link {
  transform: translateX(4px) !important;
  color: #FFFFFF !important;
}
`;

css += '\n' + newTileStyles;
fs.writeFileSync('dist/brand/v2-tokens.css', css, 'utf8');
console.log('Successfully updated CSS with immersive photographic collection tiles!');
