const fs = require('fs');
const path = require('path');

const shopJsPath = path.resolve(__dirname, '../dist/shop.js');
const s = fs.readFileSync(shopJsPath, 'utf8');

const start = s.indexOf('const OFFICIAL_PRODUCTS = [');
if (start === -1) {
  console.error('Could not find OFFICIAL_PRODUCTS in dist/shop.js');
  process.exit(1);
}
const end = s.indexOf('];', start) + 2;
const catalogCode = s.slice(start, end).replace('const OFFICIAL_PRODUCTS =', 'window.OFFICIAL_PRODUCTS =');

const targetPath = path.resolve(__dirname, '../dist/products-catalog.js');
fs.writeFileSync(targetPath, catalogCode + '\nif (typeof module !== "undefined") { module.exports = window.OFFICIAL_PRODUCTS; }\n', 'utf8');

console.log('Successfully created dist/products-catalog.js. Bytes:', fs.statSync(targetPath).size);
