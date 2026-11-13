const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');

// Define standard mobile drawer for index vs other pages
const makeDrawer = (isIndex) => `
    <nav id="mobile-menu" class="mobile-nav-drawer" hidden aria-label="Mobile navigation">
      <div class="mobile-nav-inner">
        <a href="${isIndex ? '#story' : 'index.html#story'}" class="mobile-nav-link">Our story</a>
        <a href="shop.html" class="mobile-nav-link">Our coffees</a>
        <a href="${isIndex ? '#craft' : 'index.html#craft'}" class="mobile-nav-link">The craft</a>
        <a href="contact.html?type=b2b" class="mobile-nav-link">For business</a>
        <div class="mobile-nav-divider"></div>
        <div class="mobile-nav-subrow">
          <a href="cart.html" class="mobile-nav-sublink">🛒 View Cart</a>
          <a href="account.html" class="mobile-nav-sublink">👤 My Account</a>
        </div>
      </div>
    </nav>`;

const makeActions = (basketCountId) => `
      <div style="display:flex;align-items:center;gap:12px">
        <button class="bk basket-open" aria-label="Open shopping basket">
          Basket <b class="basket-count"${basketCountId ? ` id="${basketCountId}"` : ''}>0</b>
        </button>
        <button class="mobile-menu-toggle" id="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span class="hamburger-icon">
            <span></span><span></span><span></span>
          </span>
        </button>
      </div>`;

const files = ['index.html', 'shop.html', 'cart.html', 'contact.html', 'account.html', 'admin.html', 'order-confirmation.html'];

for (const file of files) {
  const filePath = path.join(distDir, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Standardize logo image
  // Replace old SVG logo with official pulpoffe-dark.svg
  const oldSvgRegex = /<a class="logo"[^>]*>[\s\S]*?<svg[\s\S]*?<\/svg>[\s\S]*?<span>PULPOFFE<small>MOMENTS BREWED · IMPACTS GROWN<\/small><\/span>[\s\S]*?<\/a>/gi;
  const standardLogo = `<a class="logo" href="${file === 'index.html' ? '#top' : 'index.html#top'}" aria-label="Pulpoffe home">
        <img src="brand/pulpoffe-dark.svg" alt="Pulpoffe emblem" width="28" height="36" style="height:38px;width:auto;display:inline-block">
        <span>PULPOFFE<small>MOMENTS BREWED · IMPACTS GROWN</small></span>
      </a>`;

  if (oldSvgRegex.test(content)) {
    content = content.replace(oldSvgRegex, standardLogo);
    console.log(`Updated old SVG logo in ${file}`);
  }

  // Also check if admin.html has old logo
  if (file === 'admin.html') {
    content = content.replace(/<a class="logo" href="index\.html#top">[\s\S]*?<svg[\s\S]*?<\/svg>[\s\S]*?<span>PULPOFFE<small>MOMENTS BREWED · IMPACTS GROWN<\/small><\/span>\s*<\/a>/i, standardLogo);
  }

  // 2. Add Hamburger Toggle and Mobile Drawer if not already added
  if (!content.includes('id="menu-toggle"')) {
    // For standard pages with <button class="bk basket-open" ...> Basket <b ...>0</b> </button>
    const basketBtnRegex = /<button class="bk basket-open"[\s\S]*?<\/button>/i;
    if (basketBtnRegex.test(content)) {
      content = content.replace(basketBtnRegex, makeActions());
      console.log(`Added menu-toggle button to ${file}`);
    } else if (file === 'order-confirmation.html') {
      const actRegex = /<div class="h-act">[\s\S]*?<\/div>/i;
      if (actRegex.test(content)) {
        content = content.replace(actRegex, makeActions('header-basket-count'));
        console.log(`Added menu-toggle to order-confirmation.html`);
      }
    } else if (file === 'admin.html') {
      // admin.html has admin-signout-btn
      content = content.replace(/<button id="admin-signout-btn"[\s\S]*?<\/button>/i, `
      <div style="display:flex;align-items:center;gap:12px">
        <button id="admin-signout-btn" class="btn s" style="min-height:36px;padding:0 16px;font-size:0.85rem;color:var(--ink);border-color:var(--line)" hidden>Sign out</button>
        <button class="mobile-menu-toggle" id="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">
          <span class="hamburger-icon">
            <span></span><span></span><span></span>
          </span>
        </button>
      </div>`);
    }
  }

  if (!content.includes('id="mobile-menu"')) {
    // Insert drawer right before </header>
    content = content.replace(/<\/header>/i, makeDrawer(file === 'index.html') + '\n  </header>');
    console.log(`Added mobile-menu drawer to ${file}`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('All headers patched successfully.');
