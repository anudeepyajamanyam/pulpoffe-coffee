const fs = require('fs');
const files = [
  'dist/brand/pulpoffe-gold.svg',
  'dist/brand/pulpoffe-dark.svg',
  'dist/brand/pulpoffe-full-gold.svg',
  'dist/brand/pulpoffe-full-dark.svg',
  'dist/assets/pulpoffe-mark-light.svg'
];
files.forEach(p => {
  if (fs.existsSync(p)) {
    let s = fs.readFileSync(p, 'utf8');
    s = s.split('fill="#e4c99e"').join('fill="#3D2B1F"');
    fs.writeFileSync(p, s, 'utf8');
    console.log('Fixed fill in', p);
  }
});
