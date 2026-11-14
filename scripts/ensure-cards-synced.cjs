const fs = require('fs');
const path = require('path');

const shopJsPath = path.resolve(__dirname, '../dist/shop.js');
let s = fs.readFileSync(shopJsPath, 'utf8');

const target = 'function renderBasket() {';
if (s.includes(target) && !s.includes('if (typeof updateAllCards === \'function\') updateAllCards();')) {
  s = s.replace(target, `function renderBasket() {\n  if (typeof updateAllCards === 'function') updateAllCards();`);
  fs.writeFileSync(shopJsPath, s, 'utf8');
  console.log('Added updateAllCards() call to renderBasket() in dist/shop.js');
} else {
  console.log('updateAllCards already in renderBasket or not found');
}
