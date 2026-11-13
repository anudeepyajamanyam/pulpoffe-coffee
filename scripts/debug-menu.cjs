const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const index = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

console.log('index.html has menu-toggle:', index.includes('id="menu-toggle"'));
console.log('index.html has mobile-menu:', index.includes('id="mobile-menu"'));

const app = fs.readFileSync(path.join(distDir, 'app.js'), 'utf8');
const mobileMenuRefs = app.match(/#mobile-menu[^\n]*/g) || [];
console.log('app.js mobile-menu refs:', mobileMenuRefs);

// The issue: app.js has BOTH menu-toggle + mobile-menu handling
// and feedback.js ALSO has mobile nav handling
// They may conflict - app.js tries to reference #mobile-menu as hidden=open
// but menu button opens it as !isExpanded

const fbs = fs.readFileSync(path.join(distDir, 'feedback.js'), 'utf8');
console.log('feedback.js has menu-toggle:', fbs.includes('menu-toggle'));
console.log('feedback.js has mobile-menu:', fbs.includes('mobile-menu'));
