const fs = require('fs');
const path = require('path');

const cssFile = path.resolve(__dirname, '../dist/brand/v2-tokens.css');
let css = fs.readFileSync(cssFile, 'utf8');

// Replace the mobile drawer definitions so it is strictly hidden on desktop
const oldBlock = `.mobile-nav-drawer {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1C130E;
  border-bottom: 2px solid var(--honey);
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  z-index: 999;
  padding: 16px 20px 22px;
  animation: mobileNavSlideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
.mobile-nav-drawer:not([hidden]) {
  display: block !important;
}`;

const newBlock = `.mobile-nav-drawer {
  display: none !important;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #1C130E;
  border-bottom: 2px solid var(--honey);
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  z-index: 999;
  padding: 16px 20px 22px;
  animation: mobileNavSlideDown 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

@media (max-width: 900px) {
  .mobile-menu-toggle {
    display: inline-flex !important;
  }
  .mobile-nav-drawer:not([hidden]) {
    display: block !important;
  }
}`;

// Also remove duplicate @media (max-width: 900px) { .mobile-menu-toggle { display: inline-flex !important; } }
css = css.replace(oldBlock, newBlock);
css = css.replace(/@media \(max-width: 900px\) \{\s*\.mobile-menu-toggle \{\s*display: inline-flex !important;\s*\}\s*\}/g, '');

fs.writeFileSync(cssFile, css, 'utf8');
console.log('Fixed mobile drawer scoping in v2-tokens.css');
