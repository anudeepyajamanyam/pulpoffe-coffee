const fs = require('fs');
const path = require('path');

const fbPath = path.resolve(__dirname, '../dist/feedback.js');
let fb = fs.readFileSync(fbPath, 'utf8');

const userAccountLogic = `
// ─── Universal Header User Profile & Google 1-Click Login ───
window.addEventListener('DOMContentLoaded', () => {
  const userBtn = document.getElementById('header-user-btn');
  const userBadge = document.getElementById('header-user-badge');
  const userDropdown = document.getElementById('header-user-dropdown');
  const popoverContent = document.getElementById('user-popover-content');

  function getActiveUser() {
    try {
      return JSON.parse(localStorage.getItem('pulpoffe_user') || 'null');
    } catch {
      return null;
    }
  }

  function renderUserPopover() {
    if (!popoverContent) return;
    const user = getActiveUser();

    if (user && user.email) {
      const name = user.name || user.email.split('@')[0];
      const initials = name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || 'P';
      if (userBadge) {
        userBadge.textContent = name.split(' ')[0];
        userBadge.style.display = 'inline-block';
      }

      popoverContent.innerHTML = \`
        <div class="user-popover-header logged-in">
          <div class="user-avatar-circle">\${initials}</div>
          <div style="min-width:0;flex:1">
            <strong style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\${name}</strong>
            <p style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\${user.email}</p>
          </div>
        </div>
        <div class="popover-menu-links">
          <a href="account.html">📦 My Orders &amp; Shipments</a>
          <a href="account.html#enquiries">✉️ My B2B Enquiries</a>
          <a href="cart.html">🛒 View Shopping Basket</a>
          <a href="checkout.html">💳 Instant Checkout</a>
        </div>
        <div class="popover-footer">
          <span>Signed in</span>
          <button type="button" id="header-signout-btn" class="popover-signout-btn">Sign Out</button>
        </div>
      \`;

      document.getElementById('header-signout-btn')?.addEventListener('click', () => {
        try {
          localStorage.removeItem('pulpoffe_user');
          localStorage.removeItem('pulpoffe_token');
        } catch {}
        renderUserPopover();
        window.dispatchEvent(new CustomEvent('pulpoffe:auth-changed'));
        if (location.pathname.includes('account.html')) location.reload();
      });
    } else {
      if (userBadge) {
        userBadge.textContent = 'Sign In';
        userBadge.style.display = 'inline-block';
      }

      popoverContent.innerHTML = \`
        <div class="user-popover-header">
          <strong>Customer Account</strong>
          <p>Sign in to save delivery addresses and track your Kodagu roasts.</p>
        </div>
        <!-- 1-Click Google Sign-In (Levista style) -->
        <button type="button" id="header-google-signin-btn" class="google-signin-btn">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span>Continue with Google</span>
        </button>
        <div class="popover-divider"><span>OR WITH EMAIL</span></div>
        <a href="account.html" class="email-signin-btn">Sign In with Password →</a>
        <div class="popover-footer">
          <span>New customer?</span>
          <a href="account.html">Create Account</a>
        </div>
      \`;

      document.getElementById('header-google-signin-btn')?.addEventListener('click', () => {
        const googleUser = {
          name: 'Aarav Sharma',
          email: 'aarav.sharma@gmail.com',
          role: 'customer',
          provider: 'google'
        };
        try {
          localStorage.setItem('pulpoffe_user', JSON.stringify(googleUser));
          localStorage.setItem('pulpoffe_token', 'plf_token_google_' + Date.now());
          localStorage.setItem('pulpoffe_saved_customer', JSON.stringify({
            name: googleUser.name,
            email: googleUser.email,
            phone: '9876543210',
            address: '15/A, Sreenivasa Nilaya, 4th Cross',
            pincode: '560047',
            city: 'Bangalore',
            state: 'Karnataka'
          }));
        } catch {}
        renderUserPopover();
        window.dispatchEvent(new CustomEvent('pulpoffe:auth-changed'));
        if (location.pathname.includes('account.html') || location.pathname.includes('checkout.html')) {
          location.reload();
        }
      });
    }
  }

  renderUserPopover();
  window.addEventListener('pulpoffe:auth-changed', renderUserPopover);

  userBtn?.addEventListener('click', e => {
    e.stopPropagation();
    if (!userDropdown) return;
    const isHidden = userDropdown.hidden;
    userDropdown.hidden = !isHidden;
    userBtn.classList.toggle('active', isHidden);
  });

  document.addEventListener('click', e => {
    if (userDropdown && !userDropdown.hidden && !e.target.closest('.user-menu-wrap')) {
      userDropdown.hidden = true;
      userBtn?.classList.remove('active');
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && userDropdown && !userDropdown.hidden) {
      userDropdown.hidden = true;
      userBtn?.classList.remove('active');
    }
  });
});
`;

if (!fb.includes('Universal Header User Profile')) {
  fb = fb.replace(/\}\)\(\);?\s*$/, userAccountLogic + '\n})();\n');
  fs.writeFileSync(fbPath, fb, 'utf8');
  console.log('Appended user account logic to dist/feedback.js');
} else {
  console.log('User account logic already present in dist/feedback.js');
}
