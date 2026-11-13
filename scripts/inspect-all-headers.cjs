const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const files = fs.readdirSync(distDir).filter(f => f.endsWith('.html'));

for (const f of files) {
  const content = fs.readFileSync(path.join(distDir, f), 'utf8');
  const m = content.match(/<header[\s\S]*?<\/header>/i);
  console.log('=== ' + f + ' ===');
  if (m) console.log(m[0]);
  else console.log('NO HEADER');
}
