const fs = require('fs');
const content = fs.readFileSync('c:/Users/anude.LAPTOP-1NVIEN2E/Downloads/Pulpoffe – Homepage prototype v2.html', 'utf8');
const h2s = [...content.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/g)].map(m => m[0]);
console.log('Headings in prototype v2:', h2s);
