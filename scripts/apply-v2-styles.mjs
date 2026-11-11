/**
 * apply-v2-styles.mjs
 * 
 * Applies v2 brand-book presentation changes to all HTML dist files:
 * 1. Adds brand/v2-tokens.css link (last, highest priority)
 * 2. Removes "My account" from header nav on all pages (0A)
 * 3. Removes "Contact us" nav-cta from header on all pages (0A)
 * 4. Removes "Create your blend" from mobile menu (0A)
 * 5. Removes "Create your blend" from footer (0A)
 * 6. Fixes glyph encoding issues in basket buttons (? → proper chars)
 * 7. Updates theme-color meta to chalk
 * 8. Updates hero H1 and CTAs on homepage
 * 9. Updates trust strip to remove "A blend of your own" third item
 * 10. Adds "Instant coffee, three ways" static section before blend
 * 11. Updates craft section: removes #blend CTA, adds shop link
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dir, '..', 'dist');

// Files to process
const htmlFiles = ['index.html', 'shop.html', 'contact.html', 'account.html', 'admin.html'];

// The CSS link tag to inject (before </head>)
const v2CssLink = '<link rel="stylesheet" href="brand/v2-tokens.css">';
// For pages not in root that might need path adjustment (all are in dist/ root)
const v2CssLinkShop = '<link rel="stylesheet" href="brand/v2-tokens.css">';

// Font swap: Poppins only (remove Cormorant, keep Poppins, add fetchpriority)
const newFontLink = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">`;
const oldFontLinkPattern = /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"><link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin><link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Cormorant\+Garamond[^"]+Poppins[^"]+display=swap" rel="stylesheet">/g;

// Hero image: add fetchpriority to hero portrait
const heroImgOld = `src="media/estate/hero-portrait-1280.webp"
           srcset="media/estate/hero-portrait-640.webp 640w, media/estate/hero-portrait-1280.webp 1280w"`;
const heroImgNew = `src="media/estate/hero-portrait-1280.webp"
           srcset="media/estate/hero-portrait-640.webp 640w, media/estate/hero-portrait-1280.webp 1280w"
           fetchpriority="high"`;

function processFile(filename) {
  const filePath = join(distDir, filename);
  let html = readFileSync(filePath, 'utf-8');
  const original = html;

  // 1. Update font link (remove Cormorant Garamond)
  html = html.replace(
    /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"><link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin><link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Cormorant\+Garamond[^"]*Poppins[^"]*display=swap" rel="stylesheet">/g,
    newFontLink
  );

  // 2. Add v2-tokens.css before </head>
  if (!html.includes('brand/v2-tokens.css')) {
    html = html.replace('</head>', `${v2CssLink}</head>`);
  }

  // 3. Remove "My account" link from header nav (0A approved)
  // Pattern: <a href="account.html">My account</a> (index.html uses relative)
  html = html.replace(/<a href="account\.html">My account<\/a>/g, '');

  // 4. Remove "Contact us" nav-cta from header (0A approved)
  // Pattern: <a class="nav-cta" href="contact.html">Contact us <span>↗</span></a>
  html = html.replace(/<a class="nav-cta" href="contact\.html">Contact us\s*<span>[^<]*<\/span><\/a>/g, '');

  // 5. Remove "Create your blend" from mobile menu (0A approved)
  // Pattern: <a href="#blend">Create your blend</a> or <a href="index.html#blend">Create your blend</a>
  html = html.replace(/<a href="(?:index\.html)?#blend">Create your blend<\/a>/g, '');

  // 6. Remove "Create your blend" from footer EXPLORE list (0A approved)
  html = html.replace(/<a href="(?:index\.html)?#blend">Create your blend<\/a>/g, '');

  // 7. Fix basket button glyphs: ? → proper UTF-8 chars
  // "??" → lock/payment icon (keep as text, fix encoding)
  html = html.replace(/<span>\?\?<\/span>/g, '<span aria-hidden="true">→</span>');
  html = html.replace(/<span>\?<\/span>/g, '<span aria-hidden="true">→</span>');

  // 8. Fix ?0.00 in basket price displays (the ? is a broken ₹ sign)
  // These are static fallbacks; JS will overwrite them with real values
  html = html.replace(/>\?0\.00</g, '>₹0.00<');
  html = html.replace(/>\?60\.00</g, '>₹60.00<');

  // 9. Fix close button in checkout modal: ? → ×
  html = html.replace(
    /id="close-checkout-modal"[^>]*>\?</g,
    (m) => m.replace(/>\?</, '>×<')
  );

  // 10. Update theme-color to chalk
  html = html.replace(
    /content="#1a100c"/g,
    'content="#F5F5F5"'
  );

  // 11. Homepage only: update hero H1 to brand tagline
  if (filename === 'index.html') {
    // Update H1 to brand tagline
    html = html.replace(
      '<h1>Rooted in earth.<br>Crafted for<br><em>your cup.</em></h1>',
      '<h1>Purely grown.<br><em>Honestly brewed.</em></h1>'
    );

    // Update hero eyebrow
    html = html.replace(
      '<span>ESTATE COFFEE · KODAGU, KARNATAKA</span>',
      '<span>Estate Coffee · Kodagu, Karnataka</span>'
    );

    // Update hero primary CTA: href="#coffees" → href="shop.html"
    html = html.replace(
      '<a class="button gold" href="#coffees">Explore our coffees <span>→</span></a>',
      '<a class="button gold" href="shop.html">Shop coffee <span>→</span></a>'
    );

    // Update hero secondary CTA text
    html = html.replace(
      '<a class="button outline" href="#story">Our estate story <span>↓</span></a>',
      '<a class="button outline" href="#story">See the estate story <span>↓</span></a>'
    );

    // Update hero description
    html = html.replace(
      'From the shade-canopied hills of Western Ghats to your everyday ritual. Discover pure single-origin roasted, fermented, and flavoured artisanal coffees.',
      'Single-origin instant coffee from high-altitude estates in Kodagu, traced from estate to cup.'
    );

    // Fix trust strip: replace "A blend of your own" item with "Direct from farmers"
    html = html.replace(
      '<div><span class="line-icon">◈</span><p><strong>A blend of your own</strong><span>Custom blends and flavours</span></p></div>',
      '<div><span class="line-icon">◈</span><p><strong>Direct from farmers</strong><span>Traceable, estate-sourced</span></p></div>'
    );

    // Remove "Find your balance" CTA from craft section (0A: no dead anchors)
    html = html.replace(
      '<a href="#blend" class="button outline">Find your balance <span>↗</span></a>',
      '<a href="shop.html" class="button outline">Explore our coffees <span>→</span></a>'
    );

    // Remove "Create your blend" from dialog CTA (0A: no dead anchors → repoint to shop)
    html = html.replace(
      '<a class="button gold" href="#blend" id="dialog-blend">Create your blend <span>↗</span></a>',
      '<a class="button gold" href="shop.html" id="dialog-blend" style="display:none;">View our coffees <span>→</span></a>'
    );

    // Add "Instant coffee, three ways" section before blend section
    // Find the blend section start and insert before it
    const threeWaysSection = `
<section class="three-ways section" aria-labelledby="three-ways-heading" style="background:var(--brand-chalk,#F5F5F5);padding:var(--section-pad,5rem) var(--gutter,6.5%)">
  <div style="max-width:var(--max-w,1180px);margin:0 auto">
    <div class="reveal" style="text-align:center;margin-bottom:3rem">
      <p class="eyebrow">THE PULPOFFE RANGE</p>
      <h2 id="three-ways-heading">Instant coffee,<br><em>three ways.</em></h2>
      <p style="max-width:520px;margin:0 auto;color:var(--text-secondary,#5E5E5E)">Every method, crafted with single-origin Kodagu beans. Choose what suits your morning.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
      <div class="reveal" style="background:var(--cream-alt,#ECE4D4);padding:2rem;border-radius:4px;border:1px solid rgba(61,43,31,0.1)">
        <div style="font-size:2rem;margin-bottom:1rem" aria-hidden="true">❄</div>
        <h3 style="color:var(--brand-brown,#3D2B1F);margin-bottom:0.5rem">Freeze-dried</h3>
        <p style="color:var(--text-secondary,#5E5E5E);font-size:0.9375rem">Pure, clean, instant dissolve. Preserves the natural character of the bean for a bright, full-flavoured cup.</p>
      </div>
      <div class="reveal" style="background:var(--cream-alt,#ECE4D4);padding:2rem;border-radius:4px;border:1px solid rgba(61,43,31,0.1)">
        <div style="font-size:2rem;margin-bottom:1rem" aria-hidden="true">☁</div>
        <h3 style="color:var(--brand-brown,#3D2B1F);margin-bottom:0.5rem">Spray-dried</h3>
        <p style="color:var(--text-secondary,#5E5E5E);font-size:0.9375rem">Smooth, fine-grain, everyday. A consistently approachable cup that works from first sip to last.</p>
      </div>
      <div class="reveal" style="background:var(--cream-alt,#ECE4D4);padding:2rem;border-radius:4px;border:1px solid rgba(61,43,31,0.1)">
        <div style="font-size:2rem;margin-bottom:1rem" aria-hidden="true">◎</div>
        <h3 style="color:var(--brand-brown,#3D2B1F);margin-bottom:0.5rem">Agglomerated</h3>
        <p style="color:var(--text-secondary,#5E5E5E);font-size:0.9375rem">Granular, robust, café-style filter. A satisfying, textured cup that dissolves cleanly with water or milk.</p>
      </div>
    </div>
    <div style="text-align:center;margin-top:2.5rem">
      <a class="button gold" href="shop.html">Explore the full range <span>→</span></a>
    </div>
  </div>
</section>`;

    // Insert before the blend section
    html = html.replace(
      '<section class="blend section" id="blend">',
      threeWaysSection + '\n<section class="blend section" id="blend">'
    );

    // Guard app.js blend listeners: add null-check script after app.js
    // The existing app.js listens on #blend-form without null guard
    // We add a small inline guard that runs BEFORE the blend event fires
    // by inserting a no-op form submit interceptor since the section is hidden
    // (The section is hidden via CSS, so JS events won't fire anyway, but for safety:)
    // Actually, we just ensure the CSS hides it and display:none prevents interactions
    // No JS changes needed - the hidden section means no user can trigger it
  }

  // Write back
  if (html !== original) {
    writeFileSync(filePath, html, 'utf-8');
    console.log(`✓ Updated: ${filename}`);
  } else {
    console.log(`- Unchanged: ${filename}`);
  }
}

// Process all files
htmlFiles.forEach(processFile);
console.log('\nDone! All HTML files processed.');
