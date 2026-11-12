const fs = require('fs');
const files = ['dist/shop.html', 'dist/contact.html', 'dist/account.html', 'dist/admin.html'];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/style="height:34px;width:auto;display:inline-block"/g, 'style="height:38px;width:auto;display:inline-block"');
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated logo size in', f);
  }
});
