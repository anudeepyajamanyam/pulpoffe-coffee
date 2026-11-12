const fs = require('fs');

// 1. Refine order-confirmation.html styles
let receiptHtml = fs.readFileSync('dist/order-confirmation.html', 'utf8');

receiptHtml = receiptHtml.replace(
  '.success-content h1 {\n      font-family: var(--disp);\n      font-size: clamp(1.75rem, 3.2vw, 2.3rem);\n      margin: 0 0 6px;\n      color: #FFFFFF;\n    }',
  `.success-content h1 {
      font-family: var(--disp) !important;
      font-size: clamp(1.75rem, 3.2vw, 2.3rem) !important;
      margin: 0 0 6px !important;
      color: #FFFFFF !important;
      text-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
    }`
);

receiptHtml = receiptHtml.replace(
  '.receipt-actions {',
  `.receipt-actions .btn.p {
      background: var(--honey) !important;
      color: var(--ink) !important;
      border: none !important;
      font-weight: 600 !important;
      box-shadow: 0 4px 12px rgba(61,43,31,0.15) !important;
    }
    .receipt-actions .btn.s {
      background: #FFFFFF !important;
      color: var(--ink) !important;
      border: 1.5px solid var(--ink) !important;
      font-weight: 600 !important;
    }
    .receipt-actions {`
);

fs.writeFileSync('dist/order-confirmation.html', receiptHtml, 'utf8');

// 2. Refine .tile-packshot in v2-tokens.css
let css = fs.readFileSync('dist/brand/v2-tokens.css', 'utf8');
css = css.replace(
  `/* Homepage tile packshot styling */
.tile-packshot {
  position: absolute !important;
  right: 14px !important;
  top: 14px !important;
  width: 90px !important;
  height: 125px !important;
  object-fit: contain !important;
  filter: drop-shadow(0 14px 24px rgba(0,0,0,0.55)) !important;
  transition: transform 0.35s ease !important;
  pointer-events: none !important;
}`,
  `/* Homepage tile packshot styling */
.tile-packshot {
  position: absolute !important;
  right: 12px !important;
  top: 12px !important;
  width: 125px !important;
  height: 145px !important;
  object-fit: contain !important;
  filter: drop-shadow(0 16px 26px rgba(0,0,0,0.6)) !important;
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) !important;
  pointer-events: none !important;
}
.tile:hover .tile-packshot {
  transform: translateY(-8px) scale(1.08) rotate(-1deg) !important;
}`
);

fs.writeFileSync('dist/brand/v2-tokens.css', css, 'utf8');
console.log('Successfully polished receipt page and tile packshot styling!');
