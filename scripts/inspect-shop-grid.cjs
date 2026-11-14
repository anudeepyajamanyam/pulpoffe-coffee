const fs = require('fs');
const path = require('path');

const shopJs = fs.readFileSync(path.resolve(__dirname, '../dist/shop.js'), 'utf8');
const start = shopJs.indexOf('// ── Shop Grid Rendering ──');
const end = shopJs.indexOf('if ($(\'#year\')', start);
console.log(shopJs.slice(start + 2800, end));
