const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const files = ['index.html', 'shop.html', 'cart.html', 'contact.html', 'account.html', 'admin.html', 'order-confirmation.html'];

const userButtonHtml = `        <!-- User Account / Login Button (Levista style) -->
        <div class="user-menu-wrap">
          <button id="header-user-btn" class="user-btn" aria-label="Account login" title="Sign In / Account">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span id="header-user-badge" class="user-name-tag">Sign In</span>
          </button>
          <div id="header-user-dropdown" class="user-dropdown-popover" hidden>
            <div id="user-popover-content"></div>
          </div>
        </div>`;

for (const file of files) {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('id="header-user-btn"')) {
    // Look for <div style="display:flex;align-items:center;gap:12px">
    const target = /<div style="display:flex;align-items:center;gap:12px">/i;
    if (target.test(content)) {
      content = content.replace(target, `<div style="display:flex;align-items:center;gap:12px">\n${userButtonHtml}`);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Added user button to ${file}`);
    } else {
      console.log(`Could not find header action wrapper in ${file}`);
    }
  } else {
    console.log(`User button already present in ${file}`);
  }
}
