import { readFileSync, writeFileSync } from 'node:fs';

// 1. Fix style.css: change basket-count font-size from 11px to 12px
let style = readFileSync('dist/style.css', 'utf8');
style = style.replace(/\.basket-count\s*\{\s*font-size:\s*11px\s*!important;/, '.basket-count {\n  font-size: 12px !important;');
writeFileSync('dist/style.css', style, 'utf8');
console.log('Fixed dist/style.css');

// 2. Fix catalogue.css
let cat = readFileSync('dist/catalogue.css', 'utf8');
// Replace small font sizes and button heights in catalogue.css
cat = cat.replace(/\.shop-intro \.eyebrow\s*\{\s*font-size:\s*8px\s*!important;\s*letter-spacing:\s*2\.2px\s*!important;/g,
  '.shop-intro .eyebrow {\n  font-size: 12px !important;\n  letter-spacing: 0.16em !important;');
cat = cat.replace(/\.shop-intro\s*>\s*p:not\(\.eyebrow\)\s*\{\s*max-width:\s*520px\s*!important;\s*font-size:\s*11px\s*!important;\s*line-height:\s*1\.7\s*!important;/g,
  '.shop-intro > p:not(.eyebrow) {\n  max-width: 580px !important;\n  font-size: 17px !important;\n  line-height: 1.65 !important;');
cat = cat.replace(/\.shop-intro \.underlined\s*\{\s*font-size:\s*9px\s*!important;/g,
  '.shop-intro .underlined {\n  font-size: 14px !important;');
cat = cat.replace(/\.product-category\s*\{\s*font-size:\s*7px\s*!important;/g,
  '.product-category {\n  font-size: 12px !important;');
cat = cat.replace(/\.product-note\s*\{\s*font-size:\s*8px\s*!important;\s*line-height:\s*1\.6\s*!important;/g,
  '.product-note {\n  font-size: 14px !important;\n  line-height: 1.6 !important;');
cat = cat.replace(/\.product-price\s*\{\s*font-size:\s*11px\s*!important;/g,
  '.product-price {\n  font-size: 16px !important;');
cat = cat.replace(/\.product-card \.add-basket\s*\{\s*background:\s*rgba\(176,141,87,0\.08\)\s*!important;\s*border:\s*1px solid var\(--gold\)\s*!important;\s*color:\s*var\(--gold\)\s*!important;\s*font-size:\s*8\.5px\s*!important;\s*font-weight:\s*500\s*!important;\s*letter-spacing:\s*0\.5px\s*!important;\s*padding:\s*8px 10px\s*!important;/g,
  '.product-card .add-basket {\n  background: rgba(176,141,87,0.08) !important;\n  border: 1px solid var(--gold) !important;\n  color: var(--gold) !important;\n  font-size: 14px !important;\n  font-weight: 500 !important;\n  letter-spacing: 0.08em !important;\n  min-height: 48px !important;\n  padding: 12px 18px !important;');
cat = cat.replace(/\.basket-actions-grid button,\s*\.basket-actions-grid a\s*\{\s*width:\s*100%\s*!important;\s*justify-content:\s*center\s*!important;\s*padding:\s*12px 16px\s*!important;\s*font-size:\s*9\.5px\s*!important;/g,
  '.basket-actions-grid button,\n.basket-actions-grid a {\n  width: 100% !important;\n  justify-content: center !important;\n  padding: 14px 18px !important;\n  min-height: 48px !important;\n  font-size: 14px !important;');
cat = cat.replace(/\.cart-user-badge\s*\{([^}]*?)font-size:\s*8\.5px;/g,
  '.cart-user-badge {$1font-size: 13px;');
cat = cat.replace(/\.basket-breakdown\s*\{([^}]*?)font-size:\s*10px;/g,
  '.basket-breakdown {$1font-size: 14px;');
cat = cat.replace(/\.breakdown-row\.total-row\s*\{([^}]*?)font-size:\s*11\.5px;/g,
  '.breakdown-row.total-row {$1font-size: 16px;');
cat = cat.replace(/\.basket-actions-grid button,\s*\.basket-actions-grid a\s*\{\s*padding:\s*10px 14px\s*!important;\s*font-size:\s*9px\s*!important;\s*height:\s*38px\s*!important;/g,
  '.basket-actions-grid button,\n.basket-actions-grid a {\n  padding: 14px 18px !important;\n  font-size: 14px !important;\n  min-height: 48px !important;\n  height: auto !important;');
writeFileSync('dist/catalogue.css', cat, 'utf8');
console.log('Fixed dist/catalogue.css');

// 3. Fix hero-real.css
let hero = readFileSync('dist/hero-real.css', 'utf8');
hero = hero.replace(/\.hero-eyebrow\s*\{([^}]*?)font-size:\s*8\.5px;/g, '.hero-eyebrow {$1font-size: 12px; letter-spacing: 0.16em;');
hero = hero.replace(/\.hero-actions \.button\.outline\s*\{([^}]*?)font-size:\s*10px;/g, '.hero-actions .button.outline {$1font-size: 14px; min-height: 48px;');
hero = hero.replace(/\.metric-item span\s*\{([^}]*?)font-size:\s*8px;/g, '.metric-item span {$1font-size: 12px; letter-spacing: 0.12em;');
hero = hero.replace(/\.hero-location-chip\s*\{([^}]*?)font-size:\s*8\.5px;/g, '.hero-location-chip {$1font-size: 12px;');
hero = hero.replace(/\.hero-peek-card\s*\{([^}]*?)font-size:\s*7px;/g, '.hero-peek-card {$1font-size: 12px;');
hero = hero.replace(/\.film-skip\s*\{([^}]*?)font-size:\s*9px;/g, '.film-skip {$1font-size: 12px;');
hero = hero.replace(/\.story-copy-col \.eyebrow\s*\{([^}]*?)font-size:\s*8px;/g, '.story-copy-col .eyebrow {$1font-size: 12px; letter-spacing: 0.16em;');
hero = hero.replace(/\.story-copy-col p\s*\{([^}]*?)font-size:\s*11px;/g, '.story-copy-col p {$1font-size: 17px; line-height: 1.65;');
hero = hero.replace(/\.story-impact-line\s*\{([^}]*?)font-size:\s*9px;/g, '.story-impact-line {$1font-size: 12px; letter-spacing: 0.16em;');
hero = hero.replace(/\.story-placeholder \.ph-label\s*\{([^}]*?)font-size:\s*9px;/g, '.story-placeholder .ph-label {$1font-size: 12px;');
hero = hero.replace(/\.story-placeholder \.ph-note\s*\{([^}]*?)font-size:\s*8px;/g, '.story-placeholder .ph-note {$1font-size: 12px;');
hero = hero.replace(/\.hero-real-copy \.hero-description\s*\{([^}]*?)font-size:\s*11px;/g, '.hero-real-copy .hero-description {$1font-size: 15px;');
hero = hero.replace(/\.metric-item strong\s*\{\s*font-size:\s*14px;\s*\}\s*\.metric-item span\s*\{\s*font-size:\s*7px;\s*\}/g,
  '.metric-item strong { font-size: 15px; } .metric-item span { font-size: 12px; }');
writeFileSync('dist/hero-real.css', hero, 'utf8');
console.log('Fixed dist/hero-real.css');

// 4. Fix portal.css
let portal = readFileSync('dist/portal.css', 'utf8');
portal = portal.replace(/\.auth-tab-btn\s*\{([^}]*?)padding:\s*10px 20px\s*!important;\s*font-size:\s*10px\s*!important;/g,
  '.auth-tab-btn {$1padding: 12px 22px !important;\n  min-height: 48px !important;\n  font-size: 14px !important;');
portal = portal.replace(/#auth-submit,\s*#admin-login-form button\[type="submit"\]\s*\{([^}]*?)padding:\s*12px 24px\s*!important;/g,
  '#auth-submit,\n#admin-login-form button[type="submit"] {$1padding: 14px 28px !important;\n  min-height: 48px !important;\n  font-size: 14px !important;');
writeFileSync('dist/portal.css', portal, 'utf8');
console.log('Fixed dist/portal.css');

// 5. Fix experience.css
let exp = readFileSync('dist/experience.css', 'utf8');
exp = exp.replace(/\.hero-timeline b\{font-size:7px/g, '.hero-timeline b{font-size:12px');
exp = exp.replace(/\.hero-timeline>span\{font-size:7px/g, '.hero-timeline>span{font-size:12px');
exp = exp.replace(/\.hero-timeline b\{font-size:6px\}/g, '.hero-timeline b{font-size:12px}');
writeFileSync('dist/experience.css', exp, 'utf8');
console.log('Fixed dist/experience.css');

// 6. Fix hero-film.css
let film = readFileSync('dist/hero-film.css', 'utf8');
film = film.replace(/\.stage-visual figcaption small\{font-size:10px;/g, '.stage-visual figcaption small{font-size:12px;');
writeFileSync('dist/hero-film.css', film, 'utf8');
console.log('Fixed dist/hero-film.css');
