const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');

// 1. Fix shop.js - mark menu as bound to prevent feedback.js double-binding
let shopJs = fs.readFileSync(path.join(distDir, 'shop.js'), 'utf8');

const oldMenuShop = `// Menu toggle
const menu = $('#menu-toggle');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  if ($('#mobile-menu')) $('#mobile-menu').hidden = open;
});`;

const newMenuShop = `// Menu toggle
const menu = $('#menu-toggle');
if (menu) {
  menu._pulpoffeNavBound = true;
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    const drawer = document.getElementById('mobile-menu');
    if (drawer) drawer.hidden = open;
  });
  // Close drawer when clicking nav links
  document.querySelectorAll('#mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      menu.setAttribute('aria-expanded', 'false');
      const drawer = document.getElementById('mobile-menu');
      if (drawer) drawer.hidden = true;
    });
  });
  // Close drawer when clicking outside header
  document.addEventListener('click', e => {
    const drawer = document.getElementById('mobile-menu');
    if (drawer && !drawer.hidden && !e.target.closest('header')) {
      menu.setAttribute('aria-expanded', 'false');
      drawer.hidden = true;
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      menu.setAttribute('aria-expanded', 'false');
      const drawer = document.getElementById('mobile-menu');
      if (drawer) drawer.hidden = true;
    }
  });
}`;

if (shopJs.includes(oldMenuShop)) {
  shopJs = shopJs.replace(oldMenuShop, newMenuShop);
  fs.writeFileSync(path.join(distDir, 'shop.js'), shopJs, 'utf8');
  console.log('Updated shop.js menu toggle with bound flag.');
} else {
  console.log('Could not find exact menu block in shop.js - patching by line');
  // Fallback: search and replace just the menu block
  shopJs = shopJs.replace(
    /\/\/ Menu toggle\nconst menu = \$\('#menu-toggle'\);\nmenu\?\.addEventListener\('click', \(\) => \{\n  const open = menu\.getAttribute\('aria-expanded'\) === 'true';\n  menu\.setAttribute\('aria-expanded', String\(!open\)\);\n  if \(\$\('#mobile-menu'\)\) \$\('#mobile-menu'\)\.hidden = open;\n\}\);/,
    newMenuShop
  );
  fs.writeFileSync(path.join(distDir, 'shop.js'), shopJs, 'utf8');
  console.log('Updated shop.js with regex replacement.');
}

console.log('Done. Rebuild needed.');
