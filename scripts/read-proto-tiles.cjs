const fs = require('fs');
const content = fs.readFileSync('c:/Users/anude.LAPTOP-1NVIEN2E/Downloads/Pulpoffe – Homepage prototype v2.html', 'utf8');
const idx = content.indexOf('Four collections. One estate.');
console.log(content.substring(idx - 100, idx + 1500));
