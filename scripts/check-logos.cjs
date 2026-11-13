const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

for (const f of files) {
  const content = fs.readFileSync(path.join(distDir, f), 'utf8');
  const match = content.match(/<a class=["']logo["'][\s\S]*?<\/a>/i);
  console.log('=== ' + f + ' ===');
  if (match) {
    console.log(match[0].replace(/\s+/g, ' ').trim());
  } else {
    console.log('NO MATCH');
  }
}
