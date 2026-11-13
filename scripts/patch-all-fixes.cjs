const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

console.log('1. Patching dist/brand/v2-tokens.css...');
let css = fs.readFileSync(path.join(distDir, 'brand/v2-tokens.css'), 'utf8');

// Replace nav { display: none !important; } in 900px media query
css = css.replace(/@media\(max-width:900px\)\{\s*nav\s*\{\s*display:\s*none\s*!important;\s*\}/g,
  '@media(max-width:900px){\n  header > .w > nav { display: none !important; }');

// Add mobile menu CSS & enhanced green button styles
const additions = `
/* ─── Mobile Navigation Drawer & Hamburger Toggle ─── */
header {
  position: sticky !important;
  top: 0 !important;
  z-index: 1000 !important;
  background: var(--bg) !important;
}

.mobile-menu-toggle {
  display: none !important;
  align-items: center !important;
  justify-content: center !important;
  width: 42px !important;
  height: 42px !important;
  background: transparent !important;
  border: 1px solid var(--line) !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  padding: 0 !important;
  color: var(--ink) !important;
  transition: all 0.2s ease !important;
}
.mobile-menu-toggle:hover, .mobile-menu-toggle:focus-visible {
  border-color: var(--honey) !important;
  background: rgba(200, 157, 102, 0.1) !important;
}

.hamburger-icon {
  width: 20px;
  height: 14px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.hamburger-icon span {
  display: block;
  width: 100%;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.mobile-menu-toggle[aria-expanded="true"] .hamburger-icon span:nth-child(1) {
  transform: translateY(6px) rotate(45deg);
}
.mobile-menu-toggle[aria-expanded="true"] .hamburger-icon span:nth-child(2) {
  opacity: 0;
}
.mobile-menu-toggle[aria-expanded="true"] .hamburger-icon span:nth-child(3) {
  transform: translateY(-6px) rotate(-45deg);
}

.mobile-nav-drawer {
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
}
@keyframes mobileNavSlideDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.mobile-nav-inner {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.mobile-nav-link {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 13px 16px !important;
  color: #FFFFFF !important;
  font-family: var(--disp) !important;
  font-size: 1.15rem !important;
  letter-spacing: 0.04em !important;
  text-decoration: none !important;
  border-radius: 6px !important;
  transition: all 0.15s ease !important;
}
.mobile-nav-link:hover, .mobile-nav-link.on {
  background: rgba(200, 157, 102, 0.15) !important;
  color: var(--honey-lt) !important;
}
.mobile-nav-link::after {
  content: '→';
  font-size: 1.1rem;
  opacity: 0.6;
  transition: transform 0.15s ease;
}
.mobile-nav-link:hover::after {
  opacity: 1;
  transform: translateX(4px);
}
.mobile-nav-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.12);
  margin: 12px 0 10px;
}
.mobile-nav-subrow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.mobile-nav-sublink {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 10px 12px !important;
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.12) !important;
  border-radius: 4px !important;
  color: var(--honey-lt) !important;
  font-size: 0.84rem !important;
  text-decoration: none !important;
  font-weight: 500 !important;
  text-align: center !important;
}
.mobile-nav-sublink:hover {
  background: rgba(200, 157, 102, 0.2) !important;
  border-color: var(--honey) !important;
}

@media (max-width: 900px) {
  .mobile-menu-toggle {
    display: inline-flex !important;
  }
}

/* ─── Vivid Green Tactile Confirmation on Adding to Basket ─── */
.add-basket.added,
.btn.added,
.btn-added,
button.added,
#cupping-add-btn.added {
  background: #2E7D32 !important;
  background-color: #2E7D32 !important;
  color: #FFFFFF !important;
  border-color: #2E7D32 !important;
  box-shadow: 0 4px 14px rgba(46, 125, 50, 0.5) !important;
  transform: scale(0.97) !important;
}

/* Floating Basket Toast with rich emerald/forest backdrop */
.basket-toast {
  background: #103318 !important;
  border: 1px solid #4CAF50 !important;
  color: #FFFFFF !important;
  box-shadow: 0 16px 40px rgba(0,0,0,0.6), 0 0 16px rgba(76, 175, 80, 0.25) !important;
}
`;

if (!css.includes('.mobile-menu-toggle')) {
  css += '\n' + additions;
  fs.writeFileSync(path.join(distDir, 'brand/v2-tokens.css'), css, 'utf8');
  console.log('dist/brand/v2-tokens.css updated.');
} else {
  console.log('.mobile-menu-toggle already present in v2-tokens.css.');
}
