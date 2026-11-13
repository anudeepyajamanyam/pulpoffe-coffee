const fs = require('fs');
const path = require('path');

const cartHtml = fs.readFileSync(path.resolve(__dirname, '../dist/cart.html'), 'utf8');
const m = cartHtml.match(/<dialog id="checkout-modal"[\s\S]*?<\/dialog>/);
if (m) {
  console.log(m[0]);
} else {
  console.log('NO checkout-modal in cart.html');
}
