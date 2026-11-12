const fs = require('fs');
const path = require('path');
const dist = path.join(__dirname, '../dist');
const files = fs.readdirSync(dist).filter(f => f.endsWith('.html'));

for (const file of files) {
  const p = path.join(dist, file);
  let html = fs.readFileSync(p, 'utf8');
  if (html.includes('feedback.js') && !html.includes('feedback.css')) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="feedback.css">\n</head>');
    fs.writeFileSync(p, html, 'utf8');
    console.log('Linked feedback.css in', file);
  }
}
