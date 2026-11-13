const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');

// 1. Fix app.js - its menu logic should work with the new drawer
// app.js currently does: drawer.hidden = open (the CURRENT expanded state - wrongly inverted)
// We need: drawer.hidden = isExpanded (close if was open, open if was closed)
// Actually app.js does: const open = menu.getAttribute('aria-expanded') === 'true';
//                       menu.setAttribute('aria-expanded', String(!open));
//                       drawer.hidden = open; <-- This sets hidden=true when open (old), which CLOSES it - CORRECT!
// So app.js logic IS correct (open=true means was open, hidden=open means hide when was open = close)
// BUT the issue is app.js sets hidden=open where open = old state
// When open=false (drawer is hidden), new state = !open = true, drawer.hidden = false (should show)
// That is CORRECT. So app.js is fine.

// 2. The feedback.js handler fires BEFORE app.js and may prevent bubbling
// Fix: in feedback.js, don't duplicate menu logic - just let app.js handle index.html
// For other pages (shop, cart, contact etc), feedback.js handles it.
let fb = fs.readFileSync(path.join(distDir, 'feedback.js'), 'utf8');

// Replace the universal click handler with one that checks if page-specific JS already handles it
const oldNavCode = `// Universal Mobile Menu Toggle & Dismiss Handler
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
});`;

const newNavCode = `// Universal Mobile Menu Toggle (for pages without page-specific JS handling)
// Defer so page scripts like app.js can register their own handlers first
window.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('menu-toggle');
  const drawer = document.getElementById('mobile-menu');
  if (!toggle || !drawer) return;

  // Check if app.js or similar already attached a listener (index.html)
  // We use a flag to avoid double-binding
  if (toggle._pulpoffeNavBound) return;
  toggle._pulpoffeNavBound = true;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isExpanded));
    drawer.hidden = isExpanded;
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      drawer.hidden = true;
    });
  });

  document.addEventListener('click', e => {
    if (drawer && !drawer.hidden && !e.target.closest('header')) {
      toggle.setAttribute('aria-expanded', 'false');
      drawer.hidden = true;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      toggle.setAttribute('aria-expanded', 'false');
      drawer.hidden = true;
    }
  });
});`;

if (fb.includes(oldNavCode.trim())) {
  fb = fb.replace(oldNavCode, newNavCode);
  console.log('Replaced nav handler in feedback.js');
} else {
  // Try partial match
  const marker = '// Universal Mobile Menu Toggle & Dismiss Handler';
  const idx = fb.indexOf(marker);
  if (idx !== -1) {
    fb = fb.slice(0, idx) + newNavCode + '\n';
    console.log('Replaced nav handler (partial match) in feedback.js');
  } else {
    console.log('Could not find marker - feedback.js nav already updated or different');
  }
}

fs.writeFileSync(path.join(distDir, 'feedback.js'), fb, 'utf8');

// 2. Fix app.js to mark itself as already handling menu
let appJs = fs.readFileSync(path.join(distDir, 'app.js'), 'utf8');

const oldMenuHandler = `menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));$('#mobile-menu').hidden=open;});`;
const newMenuHandler = `menu._pulpoffeNavBound=true;menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));$('#mobile-menu').hidden=open;});`;

if (appJs.includes(oldMenuHandler)) {
  appJs = appJs.replace(oldMenuHandler, newMenuHandler);
  fs.writeFileSync(path.join(distDir, 'app.js'), appJs, 'utf8');
  console.log('Marked menu handler as bound in app.js');
} else {
  console.log('Could not find exact menu handler in app.js');
}

console.log('Done - feedback.js and app.js updated.');
