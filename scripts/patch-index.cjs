const fs = require('fs');
let html = fs.readFileSync('dist/index.html', 'utf8');

// 1. Proof points in hero
html = html.replace(
  '<div><b>Hand-sorted</b><span>Cherry by cherry</span></div>',
  '<div><b>Hand-harvested</b><span>Ripe cherries at peak sweetness</span></div>'
);

// 2. Story section headline and body copy
const oldStory = `        <div>
          <span class="eye">Our story · Kodagu, Karnataka</span>
          <h2>Every cherry, known by touch.</h2>
          <p>Pulpoffe was born from a single conviction: that instant coffee could be extraordinary. In 2019, a group of coffee enthusiasts asked why everyday convenience required sacrificing single-estate character.</p>
          <p style="margin-top:12px;color:var(--muted)">We traveled into the misty Western Ghats of Kodagu, building direct partnerships with multi-generational growers. Every cherry is hand-harvested under native rainforest shade canopy, zero shortcuts, and micro-batch dried at origin.</p>`;

const newStory = `        <div>
          <span class="eye">Our story · Kodagu, Karnataka</span>
          <h2>From Ripe Ruby Cherry to Honest Cup.</h2>
          <p>Coffee is a fruit before it is a brew. On our high-altitude Kodagu estates, harvesters walk shade-dappled rows selecting only deep-red, fully ripe coffee cherries at peak natural sugar concentration — never stripped green by mechanical harvesters.</p>
          <p style="margin-top:12px;color:var(--muted)">Within hours of picking, the cherries are depulped at the estate, washed in mountain spring water, and dried with care. We then craft single-origin spray-dried, granular, and freeze-dried coffees that protect the authentic floral, chocolate, and citrus terroir of the Western Ghats.</p>`;

html = html.replace(oldStory, newStory);

// 3. Process section: remove repetitive bean video and refine step labels
const oldProcess = `    <!-- ESTATE TO CUP (Band with video texture) -->
    <section class="band" id="process">
      <video autoplay muted loop playsinline poster="media/estate/estate-canopy-1-1280.webp" aria-hidden="true">
        <source src="media/videos/hero-video.mp4" type="video/mp4">
        <source src="media/videos/estate-beans-texture.mp4" type="video/mp4">
      </video>
      <div class="w">
        <span class="eye">Estate to cup</span>
        <h2>From a Kodagu canopy to your cup.</h2>
        <p>Five careful steps, each one traceable.</p>
        <div class="steps">
          <div><b>Grow</b>Shade-grown at altitude</div>
          <div><b>Pick</b>Ripe cherries by hand</div>
          <div><b>Sort</b>Every lot checked</div>
          <div><b>Process</b>Dried with care</div>
          <div><b>Pack</b>Sealed for freshness</div>
        </div>
      </div>
    </section>`;

const newProcess = `    <!-- ESTATE TO CUP (Authentic Kodagu Rainforest Canopy) -->
    <section class="band" id="process">
      <div class="w">
        <span class="eye">Estate to cup · 1,000m Elevation</span>
        <h2>From a Kodagu canopy to your cup.</h2>
        <p>Five careful artisanal steps, every batch traceable from estate to cup.</p>
        <div class="steps">
          <div><b>Grow</b>Shade-grown under native canopy</div>
          <div><b>Pick</b>Ripe ruby cherries by hand</div>
          <div><b>Sort</b>Density &amp; ripeness inspected</div>
          <div><b>Craft</b>Mountain-water depulped &amp; dried</div>
          <div><b>Pack</b>Aroma-lock foil sealed at origin</div>
        </div>
      </div>
    </section>`;

html = html.replace(oldProcess, newProcess);

// 4. Logo sizing in header
html = html.replace(
  'style="height:34px;width:auto;display:inline-block"',
  'style="height:38px;width:auto;display:inline-block"'
);

// 5. For Business card image on homepage
html = html.replace(
  'style="object-fit:cover;border-radius:6px"',
  'style="object-fit:cover;border-radius:10px;box-shadow:0 8px 20px rgba(0,0,0,0.4)"'
);

fs.writeFileSync('dist/index.html', html, 'utf8');
console.log('Successfully updated dist/index.html!');
