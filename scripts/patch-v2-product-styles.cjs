const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../dist/brand/v2-tokens.css');
let css = fs.readFileSync(cssPath, 'utf8');

// 1. Replace the harsh pitch-black #cupping-dialog with warm luxury cream styling
const oldCuppingDialog = `/* Sensory Cupping Dialog */
#cupping-dialog {
  border: none !important;
  background: #18100a !important;
  color: #F5F5F5 !important;
  border-radius: 8px !important;
  padding: 0 !important;
  max-width: min(840px, 94vw) !important;
  width: 100% !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.6) !important;
}

#cupping-dialog::backdrop {
  background: rgba(16,10,7,0.78) !important;
  backdrop-filter: blur(6px) !important;
}`;

const newCuppingDialog = `/* Sensory Cupping Dialog (Warm Luxury Artisanal Palette) */
#cupping-dialog {
  border: 1px solid var(--line) !important;
  background: #FAF7F2 !important;
  color: var(--ink) !important;
  border-radius: 14px !important;
  padding: 0 !important;
  max-width: min(860px, 94vw) !important;
  width: 100% !important;
  box-shadow: 0 24px 60px rgba(0,0,0,0.25) !important;
  overflow: hidden !important;
}

#cupping-dialog::backdrop {
  background: rgba(28, 19, 14, 0.6) !important;
  backdrop-filter: blur(8px) !important;
}

#cupping-dialog .cupping-body {
  background: #FAF7F2 !important;
  color: var(--ink) !important;
}

#cupping-dialog h2, #cupping-dialog strong {
  color: var(--ink) !important;
}

#cupping-dialog .cupping-close {
  background: rgba(0,0,0,0.06) !important;
  border: 1px solid var(--line) !important;
  color: var(--ink) !important;
  border-radius: 50% !important;
  width: 34px !important;
  height: 34px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
}
#cupping-dialog .cupping-close:hover {
  background: rgba(0,0,0,0.12) !important;
}

#cupping-dialog .cupping-box {
  background: #FFFFFF !important;
  border: 1px solid var(--line) !important;
  border-radius: 8px !important;
  color: var(--ink) !important;
}`;

if (css.includes(oldCuppingDialog)) {
  css = css.replace(oldCuppingDialog, newCuppingDialog);
  console.log('Replaced harsh cupping dialog CSS with warm luxury palette.');
} else {
  // Regex fallback
  css = css.replace(/#cupping-dialog\s*\{[\s\S]*?background:\s*#18100a[\s\S]*?box-shadow:[^}]+}/i,
    newCuppingDialog);
  console.log('Replaced cupping dialog via regex.');
}

// 2. Add Persistent Card Quantity Controller CSS & Product Page Layout
const extraCss = `
/* ─── Persistent Card Quantity Controller (Add to Basket + Remove) ─── */
.card-action-wrap {
  width: 100% !important;
  margin-top: 4px !important;
}

.card-qty-controller {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  background: #2E7D32 !important;
  border: 1px solid #2E7D32 !important;
  border-radius: 6px !important;
  padding: 4px 8px !important;
  color: #FFFFFF !important;
  width: 100% !important;
  box-shadow: 0 4px 12px rgba(46, 125, 50, 0.25) !important;
  animation: qtyCtrlFadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

@keyframes qtyCtrlFadeIn {
  from { opacity: 0; transform: scale(0.97); }
  to { opacity: 1; transform: scale(1); }
}

.card-qty-controller .qty-btn {
  width: 32px !important;
  height: 32px !important;
  background: rgba(255, 255, 255, 0.2) !important;
  border: none !important;
  border-radius: 4px !important;
  color: #FFFFFF !important;
  font-size: 1.15rem !important;
  font-weight: 700 !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.15s ease !important;
  padding: 0 !important;
}
.card-qty-controller .qty-btn:hover {
  background: rgba(255, 255, 255, 0.38) !important;
  transform: scale(1.06) !important;
}

.card-qty-controller .qty-display {
  font-size: 0.88rem !important;
  font-weight: 600 !important;
  color: #FFFFFF !important;
  padding: 0 6px !important;
  white-space: nowrap !important;
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
}

.card-qty-controller .qty-remove-btn {
  background: none !important;
  border: none !important;
  color: rgba(255, 255, 255, 0.85) !important;
  font-size: 0.78rem !important;
  text-decoration: underline !important;
  cursor: pointer !important;
  padding: 4px 8px !important;
  transition: color 0.15s ease !important;
}
.card-qty-controller .qty-remove-btn:hover {
  color: #FFFFFF !important;
}

/* ─── Dedicated Product View Page Styles (product.html) ─── */
.product-page-body {
  background: var(--bg) !important;
  color: var(--ink) !important;
  min-height: 100vh !important;
}

.product-detail-container {
  max-width: 1140px;
  margin: 36px auto 70px;
  padding: 0 20px;
}

.product-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 48px;
  align-items: start;
}

.product-gallery-sticky {
  position: sticky;
  top: 96px;
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  text-align: center;
}

.product-gallery-img {
  width: 100%;
  max-width: 380px;
  aspect-ratio: 1;
  object-fit: contain;
  margin: 0 auto;
  display: block;
}

.product-info-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sensory-card-group {
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 22px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.02);
}

.sensory-meter-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.sensory-meter-row:last-child {
  margin-bottom: 0;
}

.sensory-bar-bg {
  width: 55%;
  height: 8px;
  background: var(--alt);
  border-radius: 4px;
  overflow: hidden;
}
.sensory-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #A87D43, #D4AF37);
  border-radius: 4px;
}

@media (max-width: 900px) {
  .product-detail-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .product-gallery-sticky {
    position: static;
    padding: 24px;
  }
}
`;

if (!css.includes('.card-qty-controller')) {
  css += '\n' + extraCss;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Appended card quantity controller and product page CSS to v2-tokens.css');
} else {
  console.log('card-qty-controller already present in v2-tokens.css');
}
