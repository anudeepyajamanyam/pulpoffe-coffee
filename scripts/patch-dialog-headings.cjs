const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, '../dist/brand/v2-tokens.css');
let css = fs.readFileSync(p, 'utf8');

const rule = `
/* Dialog Headings */
#checkout-modal h2,
#basket-dialog h2,
#cupping-dialog h2,
#checkout-modal-title {
  font-size: 1.4rem !important;
  color: #FFFFFF !important;
  margin: 0 !important;
  line-height: 1.25 !important;
}
`;

css += rule;
fs.writeFileSync(p, css, 'utf8');
console.log('Appended dialog h2 styling rule to v2-tokens.css');
