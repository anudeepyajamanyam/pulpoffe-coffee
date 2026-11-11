import { readFileSync, writeFileSync } from 'node:fs';

const htmlFiles = [
  'dist/account.html',
  'dist/admin.html',
  'dist/contact.html',
  'dist/index.html',
  'dist/shop.html'
];

for (const file of htmlFiles) {
  let content = readFileSync(file, 'utf8');

  // Strip BOM if present
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }

  // 1. Add skip link if missing
  if (!content.includes('class="skip-link"')) {
    content = content.replace(/(<body[^>]*>)/i, '$1\n<a class="skip-link" href="#main-content">Skip to main content</a>');
  }

  // 2. Ensure main has id="main-content"
  if (content.includes('<main') && !content.includes('id="main-content"')) {
    content = content.replace(/<main\b(?![^>]*\bid=)/i, '<main id="main-content"');
  }

  // 3. Fix encoding artifacts
  content = content.replace(/â€”/g, '—');
  content = content.replace(/â€™/g, '’');
  content = content.replace(/â†—/g, '↗');
  content = content.replace(/â˜°/g, '☰');
  content = content.replace(/â†’/g, '→');
  content = content.replace(/â†“/g, '↓');
  content = content.replace(/â†‘/g, '↑');
  content = content.replace(/âœ§/g, '✧');
  content = content.replace(/â™§/g, '♧');
  content = content.replace(/â—ˆ/g, '◈');
  content = content.replace(/â…¡/g, '⏸');
  content = content.replace(/Â©/g, '©');
  content = content.replace(/Â·/g, '·');

  // 4. Fix specific broken button / link text
  content = content.replace(/<button class="basket-close" aria-label="Close shopping basket">\?<\/button>/g,
    '<button class="basket-close" aria-label="Close shopping basket">&times;</button>');
  content = content.replace(/<a href="account\.html">Sign in \/ Register \?<\/a>/g,
    '<a href="account.html">Sign in / Register &rarr;</a>');

  // 5. Elevate inline font sizes and button heights
  content = content.replace(/font-size:\s*([4-8](\.[0-9]+)?)px/g, 'font-size:12px');
  content = content.replace(/font-size:\s*9(\.[0-9]+)?px/g, 'font-size:12px');
  content = content.replace(/font-size:\s*10(\.[0-9]+)?px/g, 'font-size:14px');
  content = content.replace(/font-size:\s*11(\.[0-9]+)?px/g, 'font-size:14px');
  content = content.replace(/height:\s*(30|38|44)px/g, 'min-height:48px;height:auto');

  writeFileSync(file, content, 'utf8');
  console.log(`Refined ${file}`);
}
