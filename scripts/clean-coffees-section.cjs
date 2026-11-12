const fs = require('fs');
let html = fs.readFileSync('dist/index.html', 'utf8');

const startMarker = '<section id="coffees">';
const endMarker = '<!-- ESTATE TO CUP (Authentic Kodagu Rainforest Canopy) -->';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

const cleanCoffeesSection = `<section id="coffees">
      <div class="w">
        <div class="hd">
          <span class="eye">Our coffees</span>
          <h2>Three ranges. Fourteen handcrafted coffees.</h2>
          <p>Single-origin Kodagu estate coffees across Gold, Silver, and Diamond ranges.</p>
        </div>
        <div class="g4">
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
        </div>
        <p style="margin-top:28px">
          <a class="link" href="shop.html">See all coffees &amp; prices →</a>
        </p>
      </div>
    </section>

    `;

if (startIdx !== -1 && endIdx !== -1) {
  html = html.substring(0, startIdx) + cleanCoffeesSection + html.substring(endIdx);
  fs.writeFileSync('dist/index.html', html, 'utf8');
  console.log('Cleaned up index.html coffees section perfectly!');
} else {
  console.error('Markers not found!');
}
