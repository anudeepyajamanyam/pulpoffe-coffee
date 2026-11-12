const fs = require('fs');
['dist/index.html', 'dist/shop.html'].forEach(p => {
  let h = fs.readFileSync(p, 'utf8');
  h = h.split('brand/pulpoffe-gold.svg').join('brand/pulpoffe-dark.svg');
  fs.writeFileSync(p, h, 'utf8');
  console.log('Updated logo src in', p);
});

// clean up any .tmp.webp
const pdir = 'dist/media/products';
fs.readdirSync(pdir).forEach(f => {
  if (f.endsWith('.tmp.webp')) {
    try { fs.unlinkSync(pdir + '/' + f); } catch {}
  }
});
console.log('Cleaned up tmp webp files');
