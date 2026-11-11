/**
 * align-homepage-prototype.mjs
 * 
 * Reorganizes the homepage sections and copy in dist/index.html to match
 * the exact flow and wording from "Pulpoffe – Homepage prototype v2.md":
 * 
 * 1. Announcement bar: "Rooted in Kodagu. Crafted for the moments that matter."
 * 2. Header: Logo, [Our story] [Our coffees] [The craft] [For business], Basket 0
 * 3. Hero:
 *    - Eyebrow: "Estate coffee · Kodagu, Karnataka"
 *    - H1: "Purely grown. <em>Honestly brewed.</em>"
 *    - Copy: "Single-origin instant coffee from high-altitude estates in Kodagu, traced from estate to cup."
 *    - CTAs: [Shop coffee →] (#coffees), [See the estate story] (#story)
 *    - Proof metrics:
 *      * 1,000 m | Elevation
 *      * Shade-grown | Under a forest canopy
 *      * Hand-sorted | Cherry by cherry
 * 4. Trust Strip (Principles):
 *    - Single origin | One region, one story: Kodagu
 *    - Estate-to-cup traceability | Know where every cup began
 *    - Direct from farmers | Ethical, fair relationships
 * 5. Section: Our story (#story)
 *    - Visual: Real cheries in hand (estate-cherries-hands-1-1280.webp)
 *    - Eyebrow: "Our story"
 *    - H2: "Every cherry, known by touch."
 *    - Copy: "Each cherry is picked and sorted by the people who know the estate best. No shortcuts, no machines in the picking stage, just patient hands and a shaded canopy."
 *    - CTA: [Read the full story →] (or Shop link)
 * 6. Section: The craft (#craft) -> "Instant coffee, three ways."
 *    - Eyebrow: "The craft"
 *    - H2: "Instant coffee, three ways."
 *    - Subtitle: "Same estate beans, different drying methods. Choose the one that suits your cup."
 *    - 01: Freeze-dried ("Slow, gentle drying that keeps delicate aroma. Our purest instant.")
 *    - 02: Spray-dried ("A fine, fast-dissolving powder for an easy everyday cup.")
 *    - 03: Agglomerated ("Even granules that dissolve smoothly, pure or blended with chicory.")
 * 7. Section: Our coffees (#coffees)
 *    - Eyebrow: "Our coffees"
 *    - H2: "Four collections. One estate."
 *    - Subtitle: "24 coffees across instant, flavoured, fermented and roasted."
 *    - 4 Collection cards (Instant: 7 coffees, Flavoured: 9 coffees, Fermented: 4 coffees, Roasted: 4 coffees)
 *    - CTA: [See all coffees →]
 * 8. Section: Estate to cup (Process band)
 *    - Eyebrow: "Estate to cup"
 *    - H2: "From a Kodagu canopy to your cup."
 *    - Subtitle: "Five careful steps, each one traceable."
 *    - Video texture background
 *    - Steps:
 *      * Grow: Shade-grown at altitude
 *      * Pick: Ripe cherries by hand
 *      * Sort: Every lot checked
 *      * Process: Dried with care
 *      * Pack: Sealed for freshness
 * 9. Section: People · Place (#people)
 *    - Eyebrow: "People · Place"
 *    - H2: "A shared rhythm."
 *    - Copy: "Behind every jar is a community of pickers, sorters and farmers. We work with them directly, so the care in the cup is the care in the estate."
 *    - Image: Sunlit shade trees over coffee plants on a Kodagu estate (estate-canopy-1-1280.webp)
 *    - CTA: [Meet the estate →] (#story)
 * 10. Section: For business (#business)
 *     - Eyebrow: "For business"
 *     - H2: "Sourcing for a café, retailer or brand?"
 *     - Copy: "Tell us what you need and we’ll build a pricing enquiry around it."
 *     - CTA: [Request a B2B quote →] (contact.html?type=b2b)
 * 11. Footer:
 *     - Logo + "Purely grown. Honestly brewed. / Kodagu, Karnataka, India"
 *     - Explore: Our story, Our coffees, Shop coffee, For business, Contact us, My account, Admin
 *     - © 2026 Pulpoffe. All rights reserved.
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const indexPath = join(__dir, '..', 'dist', 'index.html');
let html = readFileSync(indexPath, 'utf-8');

// 1. Update hero metrics text to match prototype
const oldHeroMetrics = `<div class="hero-metrics">
      <div class="metric-item">
        <strong>1,100m</strong>
        <span>Estate Elevation</span>
      </div>
      <div class="metric-divider"></div>
      <div class="metric-item">
        <strong>Shade-Grown</strong>
        <span>Silver Oak Canopy</span>
      </div>
      <div class="metric-divider"></div>
      <div class="metric-item">
        <strong>Hand-Sorted</strong>
        <span>Ripe Cherries Only</span>
      </div>
    </div>`;

const newHeroMetrics = `<div class="hero-metrics">
      <div class="metric-item">
        <strong>1,000 m</strong>
        <span>Elevation</span>
      </div>
      <div class="metric-divider"></div>
      <div class="metric-item">
        <strong>Shade-grown</strong>
        <span>Under a forest canopy</span>
      </div>
      <div class="metric-divider"></div>
      <div class="metric-item">
        <strong>Hand-sorted</strong>
        <span>Cherry by cherry</span>
      </div>
    </div>`;

html = html.replace(oldHeroMetrics, newHeroMetrics);

// 2. Update principles / trust strip (3 items) to match prototype exactly
const oldPrinciples = `<section class="principles" aria-label="The Pulpoffe approach"><div><span class="line-icon">✧</span><p><strong>Rooted in origin</strong><span>From the estates of Kodagu</span></p></div><div><span class="line-icon">♧</span><p><strong>Craft in every cup</strong><span>Thoughtful coffee, many expressions</span></p></div><div><span class="line-icon">◈</span><p><strong>Direct from farmers</strong><span>Traceable, estate-sourced</span></p></div></section>`;

const newPrinciples = `<section class="principles" aria-label="The Pulpoffe approach">
  <div>
    <span class="line-icon">✧</span>
    <p><strong>Single origin</strong><span>One region, one story: Kodagu</span></p>
  </div>
  <div>
    <span class="line-icon">♧</span>
    <p><strong>Estate-to-cup traceability</strong><span>Know where every cup began</span></p>
  </div>
  <div>
    <span class="line-icon">◈</span>
    <p><strong>Direct from farmers</strong><span>Ethical, fair relationships</span></p>
  </div>
</section>`;

html = html.replace(oldPrinciples, newPrinciples);

// 3. Update Story section copy & layout to match prototype:
// "Every cherry, known by touch."
// "Each cherry is picked and sorted by the people who know the estate best. No shortcuts, no machines in the picking stage, just patient hands and a shaded canopy."
// Image: cherries in hand
const storyPattern = /<section class="story-real section" id="story"[\s\S]*?<\/section>/;
const newStorySection = `<section class="story-real section" id="story" aria-label="The Pulpoffe story">
  <div class="story-panels">
    <div class="story-panel">
      <div class="story-media-card ken-burns">
        <img src="media/estate/estate-cherries-hands-1-1280.webp"
             srcset="media/estate/estate-cherries-hands-1-640.webp 640w, media/estate/estate-cherries-hands-1-1280.webp 1280w"
             sizes="(max-width:767px) 100vw, 50vw"
             alt="A hand holding freshly picked red coffee cherries"
             width="960" height="1280"
             loading="lazy"
             class="estate-media">
      </div>
      <div class="story-copy-col reveal">
        <p class="eyebrow">OUR STORY</p>
        <h2>Every cherry,<br><em>known by touch.</em></h2>
        <p>Each cherry is picked and sorted by the people who know the estate best. No shortcuts, no machines in the picking stage, just patient hands and a shaded canopy.</p>
        <a class="underlined" href="shop.html">Explore our coffees <span>→</span></a>
      </div>
    </div>
  </div>
</section>`;

html = html.replace(storyPattern, newStorySection);

// 4. Update Craft Section to be the "Instant coffee, three ways" exactly as in prototype:
// The craft
// ## Instant coffee, three ways.
// Same estate beans, different drying methods. Choose the one that suits your cup.
// 01 Freeze-dried | 02 Spray-dried | 03 Agglomerated
const craftSectionHtml = `<section class="craft section" id="craft" aria-labelledby="craft-heading" style="background:var(--brand-chalk,#F5F5F5);padding:var(--section-pad,5rem) var(--gutter,6.5%)">
  <div style="max-width:var(--max-w,1180px);margin:0 auto">
    <div class="reveal" style="text-align:center;margin-bottom:3.5rem">
      <p class="eyebrow">THE CRAFT</p>
      <h2 id="craft-heading">Instant coffee,<br><em>three ways.</em></h2>
      <p style="max-width:560px;margin:0 auto;color:var(--text-secondary,#5E5E5E)">Same estate beans, different drying methods. Choose the one that suits your cup.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
      <div class="reveal" style="background:#FFFFFF;padding:2.25rem;border-radius:4px;border:1px solid rgba(61,43,31,0.1);box-shadow:0 4px 16px rgba(61,43,31,0.04)">
        <span style="font-size:0.875rem;font-weight:700;color:var(--honey-dark,#8A6A36);letter-spacing:0.1em;display:block;margin-bottom:0.75rem">01</span>
        <h3 style="color:var(--brand-brown,#3D2B1F);margin-bottom:0.75rem;font-size:1.375rem">Freeze-dried</h3>
        <p style="color:var(--text-secondary,#5E5E5E);font-size:0.9375rem;line-height:1.65;margin:0">Slow, gentle drying that keeps delicate aroma. Our purest instant.</p>
      </div>
      <div class="reveal" style="background:#FFFFFF;padding:2.25rem;border-radius:4px;border:1px solid rgba(61,43,31,0.1);box-shadow:0 4px 16px rgba(61,43,31,0.04)">
        <span style="font-size:0.875rem;font-weight:700;color:var(--honey-dark,#8A6A36);letter-spacing:0.1em;display:block;margin-bottom:0.75rem">02</span>
        <h3 style="color:var(--brand-brown,#3D2B1F);margin-bottom:0.75rem;font-size:1.375rem">Spray-dried</h3>
        <p style="color:var(--text-secondary,#5E5E5E);font-size:0.9375rem;line-height:1.65;margin:0">A fine, fast-dissolving powder for an easy everyday cup.</p>
      </div>
      <div class="reveal" style="background:#FFFFFF;padding:2.25rem;border-radius:4px;border:1px solid rgba(61,43,31,0.1);box-shadow:0 4px 16px rgba(61,43,31,0.04)">
        <span style="font-size:0.875rem;font-weight:700;color:var(--honey-dark,#8A6A36);letter-spacing:0.1em;display:block;margin-bottom:0.75rem">03</span>
        <h3 style="color:var(--brand-brown,#3D2B1F);margin-bottom:0.75rem;font-size:1.375rem">Agglomerated</h3>
        <p style="color:var(--text-secondary,#5E5E5E);font-size:0.9375rem;line-height:1.65;margin:0">Even granules that dissolve smoothly, pure or blended with chicory.</p>
      </div>
    </div>
  </div>
</section>`;

// Replace old craft section
const oldCraftPattern = /<section class="craft section" id="craft"[\s\S]*?<\/section>/;
html = html.replace(oldCraftPattern, craftSectionHtml);

// Remove the separate three-ways section if it was added earlier
html = html.replace(/<section class="three-ways section"[\s\S]*?<\/section>/, '');

// 5. Update Coffees Section heading:
// Eyebrow: OUR COFFEES
// H2: Four collections. One estate.
// Subtitle: 24 coffees across instant, flavoured, fermented and roasted.
html = html.replace(
  '<h2>Four collections.<br><em>Endless little moments.</em></h2><p>Find your everyday favourite. Or discover something unexpected.</p>',
  '<h2>Four collections.<br><em>One estate.</em></h2><p>24 coffees across instant, flavoured, fermented and roasted.</p>'
);

// Update coffee card tags/subtitles to match prototype item counts:
// Instant: 7 coffees | Flavoured: 9 coffees | Fermented: 4 coffees | Roasted: 4 coffees
html = html.replace(
  '<span class="card-tag">THE EVERYDAY RITUAL</span>',
  '<span class="card-tag">7 COFFEES · INSTANT</span>'
);
html = html.replace(
  '<span class="card-tag">A LITTLE UNEXPECTED</span>',
  '<span class="card-tag">9 COFFEES · FLAVOURED</span>'
);
html = html.replace(
  '<span class="card-tag">FOR THE CURIOUS CUP</span>',
  '<span class="card-tag">4 COFFEES · FERMENTED</span>'
);
html = html.replace(
  '<span class="card-tag">SLOW DOWN &amp; SAVOUR</span>',
  '<span class="card-tag">4 COFFEES · ROASTED</span>'
);

// 6. Add "Estate to cup" 5-step process band (Grow, Pick, Sort, Process, Pack)
// From a Kodagu canopy to your cup.
// Five careful steps, each one traceable.
const estateToCupSection = `
<section class="estate-to-cup section" id="estate-to-cup" style="background:var(--brand-green,#053502);color:var(--brand-chalk,#F5F5F5);padding:var(--section-pad,5rem) var(--gutter,6.5%);position:relative;overflow:hidden">
  <!-- Muted looping video background texture -->
  <video autoplay muted loop playsinline poster="media/estate/estate-canopy-1-1280.webp" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.18;filter:grayscale(0.5);pointer-events:none;z-index:0">
    <source src="media/videos/estate-beans-texture.mp4" type="video/mp4">
  </video>
  <div style="position:relative;z-index:1;max-width:var(--max-w,1180px);margin:0 auto">
    <div class="reveal" style="text-align:center;margin-bottom:3.5rem">
      <p class="eyebrow" style="color:var(--honey-light,#C9A56B)">ESTATE TO CUP</p>
      <h2 style="color:var(--brand-chalk,#F5F5F5);margin-bottom:0.75rem">From a Kodagu canopy<br><em>to your cup.</em></h2>
      <p style="color:rgba(245,245,245,0.8);max-width:500px;margin:0 auto">Five careful steps, each one traceable.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:18px">
      <div class="reveal" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:1.75rem 1.25rem;border-radius:4px;text-align:center">
        <strong style="display:block;font-size:1.125rem;color:var(--honey-light,#C9A56B);margin-bottom:0.5rem">Grow</strong>
        <span style="font-size:0.875rem;color:rgba(245,245,245,0.75);line-height:1.5;display:block">Shade-grown at altitude</span>
      </div>
      <div class="reveal" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:1.75rem 1.25rem;border-radius:4px;text-align:center">
        <strong style="display:block;font-size:1.125rem;color:var(--honey-light,#C9A56B);margin-bottom:0.5rem">Pick</strong>
        <span style="font-size:0.875rem;color:rgba(245,245,245,0.75);line-height:1.5;display:block">Ripe cherries by hand</span>
      </div>
      <div class="reveal" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:1.75rem 1.25rem;border-radius:4px;text-align:center">
        <strong style="display:block;font-size:1.125rem;color:var(--honey-light,#C9A56B);margin-bottom:0.5rem">Sort</strong>
        <span style="font-size:0.875rem;color:rgba(245,245,245,0.75);line-height:1.5;display:block">Every lot checked</span>
      </div>
      <div class="reveal" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:1.75rem 1.25rem;border-radius:4px;text-align:center">
        <strong style="display:block;font-size:1.125rem;color:var(--honey-light,#C9A56B);margin-bottom:0.5rem">Process</strong>
        <span style="font-size:0.875rem;color:rgba(245,245,245,0.75);line-height:1.5;display:block">Dried with care</span>
      </div>
      <div class="reveal" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);padding:1.75rem 1.25rem;border-radius:4px;text-align:center">
        <strong style="display:block;font-size:1.125rem;color:var(--honey-light,#C9A56B);margin-bottom:0.5rem">Pack</strong>
        <span style="font-size:0.875rem;color:rgba(245,245,245,0.75);line-height:1.5;display:block">Sealed for freshness</span>
      </div>
    </div>
  </div>
</section>`;

// Replace or insert estate-to-cup section right before People & Place
const oldGalleryPattern = /<section class="estate-gallery section"[\s\S]*?<\/section>/;
const newPeoplePlaceSection = `
${estateToCupSection}
<section class="estate-gallery section" id="people" style="background:var(--brand-chalk,#F5F5F5);padding:var(--section-pad,5rem) var(--gutter,6.5%)">
  <div style="max-width:var(--max-w,1180px);margin:0 auto;display:grid;grid-template-columns:1fr 1.1fr;gap:clamp(2rem,6%,4.5rem);align-items:center">
    <div class="reveal">
      <p class="eyebrow">PEOPLE · PLACE</p>
      <h2>A shared<br><em>rhythm.</em></h2>
      <p style="color:var(--text-secondary,#5E5E5E);font-size:1rem;line-height:1.65;margin-bottom:1.5rem">Behind every jar is a community of pickers, sorters and farmers. We work with them directly, so the care in the cup is the care in the estate.</p>
      <a class="underlined" href="shop.html">Meet the estate <span>→</span></a>
    </div>
    <div class="reveal" style="border-radius:4px;overflow:hidden;aspect-ratio:4/3">
      <img src="media/estate/estate-canopy-1-1280.webp"
           alt="Sunlit shade trees over coffee plants on a Kodagu estate"
           loading="lazy"
           style="width:100%;height:100%;object-fit:cover;display:block">
    </div>
  </div>
</section>`;

html = html.replace(oldGalleryPattern, newPeoplePlaceSection);

// 7. Update B2B section copy to match prototype exactly:
// Eyebrow: FOR BUSINESS
// H2: Sourcing for a café, retailer or brand?
// Copy: Tell us what you need and we’ll build a pricing enquiry around it.
// CTA: Request a B2B quote →
const b2bPattern = /<section class="business-invite section reveal">[\s\S]*?<\/section>/;
const newB2bSection = `<section class="business-invite section reveal" id="business" style="background:var(--brand-brown,#3D2B1F);color:var(--brand-chalk,#F5F5F5);padding:var(--section-pad,5rem) var(--gutter,6.5%)">
  <div style="max-width:var(--max-w,1180px);margin:0 auto;display:grid;grid-template-columns:1.2fr 0.8fr;gap:clamp(2rem,6%,4rem);align-items:center">
    <div>
      <p class="eyebrow" style="color:var(--honey-light,#C9A56B)">FOR BUSINESS</p>
      <h2 style="color:var(--brand-chalk,#F5F5F5);margin-bottom:0.75rem">Sourcing for a café,<br><em>retailer or brand?</em></h2>
      <p style="color:rgba(245,245,245,0.8);font-size:1rem;line-height:1.65;margin:0">Tell us what you need and we’ll build a pricing enquiry around it.</p>
    </div>
    <div style="text-align:right">
      <a class="button gold" href="contact.html?type=b2b" style="display:inline-flex">Request a B2B quote <span>→</span></a>
    </div>
  </div>
</section>`;

html = html.replace(b2bPattern, newB2bSection);

// 8. Update Closing CTA section or remove to keep prototype purity
// In prototype, there is no generic closing banner before footer
// Keep clean closing
html = html.replace(/<section class="closing">[\s\S]*?<\/section>/, '');

// 9. Update Footer brand text & address:
// Purely grown. Honestly brewed. / Kodagu, Karnataka, India
html = html.replace(
  '<p>Rooted in Kodagu.<br>Crafted for your everyday.</p>',
  '<p>Purely grown. Honestly brewed.<br>Kodagu, Karnataka, India</p>'
);

// Save updated index.html
writeFileSync(indexPath, html, 'utf-8');
console.log('✓ index.html successfully aligned to Pulpoffe Homepage prototype v2!');
