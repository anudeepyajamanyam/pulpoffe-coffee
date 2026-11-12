const fs = require('fs');
let fullSvg = fs.readFileSync('dist/brand/pulpoffe-full-gold.svg', 'utf8');
let fullDarkSvg = fullSvg.replace('fill="#e4c99e"', 'fill="#3D2B1F"');
fs.writeFileSync('dist/brand/pulpoffe-full-dark.svg', fullDarkSvg, 'utf8');
console.log('Saved pulpoffe-full-dark.svg');
