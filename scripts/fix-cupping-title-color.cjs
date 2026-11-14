const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../dist/brand/v2-tokens.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace #cupping-dialog h2 in Dialog Headings
css = css.replace(
  `/* Dialog Headings */
#checkout-modal h2,
#basket-dialog h2,
#cupping-dialog h2,
#checkout-modal-title {
  font-size: 1.4rem !important;
  color: #FFFFFF !important;
  margin: 0 !important;
  line-height: 1.25 !important;
}`,
  `/* Dialog Headings */
#checkout-modal h2,
#basket-dialog h2,
#checkout-modal-title {
  font-size: 1.4rem !important;
  color: #FFFFFF !important;
  margin: 0 !important;
  line-height: 1.25 !important;
}

#cupping-dialog h2,
#cupping-dialog #cupping-title {
  font-size: 1.75rem !important;
  color: var(--ink) !important;
  margin: 0 0 8px !important;
  line-height: 1.25 !important;
  font-family: var(--disp) !important;
}

#cupping-dialog #cupping-full-page-btn {
  background: var(--bg) !important;
  color: var(--ink) !important;
  border: 1px solid var(--line) !important;
  font-weight: 500 !important;
}
#cupping-dialog #cupping-full-page-btn:hover {
  background: var(--alt) !important;
  color: var(--accent) !important;
}`
);

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Patched cupping title and button styles in v2-tokens.css');
