const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const files = ['index.html', 'shop.html', 'cart.html', 'contact.html', 'account.html', 'admin.html', 'order-confirmation.html'];

for (const f of files) {
  const c = fs.readFileSync(path.join(distDir, f), 'utf8');
  const scripts = (c.match(/<script[^>]*src=["'][^"']+["'][^>]*><\/script>/gi) || []).map(s => {
    const m = s.match(/src=["']([^"']+)["']/i);
    return m ? m[1] : s;
  });
  console.log(f + ': ' + scripts.join(', '));
}
