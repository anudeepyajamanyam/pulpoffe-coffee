const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const fbFile = path.join(root, 'dist/feedback.js');
let fb = fs.readFileSync(fbFile, 'utf8');

const navCode = `
// Universal Mobile Menu Toggle & Dismiss Handler
document.addEventListener('click', e => {
  const toggle = e.target.closest('#menu-toggle');
  if (toggle) {
    e.preventDefault();
    const drawer = document.getElementById('mobile-menu');
    if (drawer) {
      const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isExpanded));
      drawer.hidden = isExpanded;
    }
    return;
  }
  if (e.target.closest('#mobile-menu a')) {
    const toggleBtn = document.getElementById('menu-toggle');
    const drawer = document.getElementById('mobile-menu');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    if (drawer) drawer.hidden = true;
    return;
  }
  const drawer = document.getElementById('mobile-menu');
  if (drawer && !drawer.hidden && !e.target.closest('header')) {
    const toggleBtn = document.getElementById('menu-toggle');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    drawer.hidden = true;
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const toggleBtn = document.getElementById('menu-toggle');
    const drawer = document.getElementById('mobile-menu');
    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    if (drawer) drawer.hidden = true;
  }
});
`;

if (!fb.includes('Universal Mobile Menu Toggle')) {
  fb = fb.replace(/\}\)\(\);?\s*$/, navCode + '\n})();\n');
  fs.writeFileSync(fbFile, fb, 'utf8');
  console.log('Added mobile navigation logic to dist/feedback.js');
}

// Also ensure order-confirmation.html includes feedback.js
const confFile = path.join(root, 'dist/order-confirmation.html');
let conf = fs.readFileSync(confFile, 'utf8');
if (!conf.includes('feedback.js')) {
  conf = conf.replace('</body>', '<script src="feedback.js"></script>\n</body>');
  fs.writeFileSync(confFile, conf, 'utf8');
  console.log('Linked feedback.js in order-confirmation.html');
}
