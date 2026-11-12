const fs = require('fs');
let svg = fs.readFileSync('dist/brand/pulpoffe-gold.svg', 'utf8');
let darkSvg = svg.replace('fill="#e4c99e"', 'fill="#3D2B1F"');
fs.writeFileSync('dist/brand/pulpoffe-dark.svg', darkSvg, 'utf8');
fs.writeFileSync('dist/brand/pulpoffe-gold.svg', darkSvg, 'utf8');
console.log('Saved pulpoffe-dark.svg and updated pulpoffe-gold.svg with rich coffee brown fill #3D2B1F');
