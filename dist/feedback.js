(() => {
  if (!document.getElementById('pulpoffe-feedback-style')) {
    const style = document.createElement('style');
    style.id = 'pulpoffe-feedback-style';
    style.textContent = ".request-loader {\n  position: fixed !important;\n  bottom: 28px !important;\n  left: 50% !important;\n  transform: translate(-50%, 20px) !important;\n  opacity: 0 !important;\n  pointer-events: none !important;\n  visibility: hidden !important;\n  z-index: 10000 !important;\n  display: none !important;\n  align-items: center !important;\n  gap: 12px !important;\n  background: #231710f2 !important;\n  color: #EBD3AC !important;\n  border: 1px solid #A87D43 !important;\n  border-radius: 40px !important;\n  padding: 12px 22px !important;\n  box-shadow: 0 10px 32px rgba(0,0,0,0.55) !important;\n  font: 500 13px Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;\n  transition: opacity 0.2s ease, transform 0.2s ease !important;\n}\n.request-loader.active {\n  display: inline-flex !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  transform: translate(-50%, 0) !important;\n}\n.loader-bean {\n  display: inline-block !important;\n  height: 16px !important;\n  width: 12px !important;\n  border-radius: 50% !important;\n  border: 1.5px solid #DFB978 !important;\n  background: linear-gradient(100deg, transparent 42%, #DFB978 47%, transparent 54%) !important;\n  animation: turn-bean 1.1s infinite ease-in-out !important;\n}\n.is-busy {\n  cursor: wait !important;\n  position: relative !important;\n}\n.is-busy:after {\n  content: '' !important;\n  display: inline-block !important;\n  vertical-align: middle !important;\n  width: 11px !important;\n  height: 11px !important;\n  margin-left: 9px !important;\n  border: 1.5px solid currentColor !important;\n  border-right-color: transparent !important;\n  border-radius: 50% !important;\n  animation: turn-bean 0.8s linear infinite !important;\n}\n.button-pressed {\n  transform: scale(0.97) !important;\n}\n@keyframes turn-bean {\n  to { transform: rotate(360deg); }\n}\n@media (prefers-reduced-motion: reduce) {\n  .loader-bean, .is-busy:after { animation: none !important; }\n  .request-loader { transition: none !important; }\n}";
    document.head.append(style);
  }

  const nativeFetch = window.fetch.bind(window);
  const indicator = document.createElement('div');
  indicator.className = 'request-loader';
  indicator.setAttribute('role', 'status');
  indicator.setAttribute('aria-live', 'polite');
  indicator.style.display = 'none';
  indicator.innerHTML = '<span class="loader-bean" aria-hidden="true"></span><span>Brewing your request...</span>';
  document.body.append(indicator);

  let pending = 0;
  let showTimer = null;
  let safetyTimer = null;

  window.fetch = async (...args) => {
    pending++;
    if (!showTimer && pending === 1) {
      showTimer = setTimeout(() => {
        if (pending > 0) {
          indicator.classList.add('active');
          indicator.style.display = 'inline-flex';
          document.body.setAttribute('aria-busy', 'true');
        }
      }, 200);
    }

    if (!safetyTimer) {
      safetyTimer = setTimeout(() => {
        pending = 0;
        indicator.classList.remove('active');
        indicator.style.display = 'none';
        document.body.removeAttribute('aria-busy');
        safetyTimer = null;
      }, 8000);
    }

    try {
      return await nativeFetch(...args);
    } finally {
      pending = Math.max(0, pending - 1);
      if (pending === 0) {
        if (showTimer) {
          clearTimeout(showTimer);
          showTimer = null;
        }
        if (safetyTimer) {
          clearTimeout(safetyTimer);
          safetyTimer = null;
        }
        indicator.classList.remove('active');
        indicator.style.display = 'none';
        document.body.removeAttribute('aria-busy');
      }
    }
  };

  const observer = new MutationObserver(records => {
    for (const record of records) {
      const el = record.target;
      if (el.matches('button,input[type=submit]')) {
        if (el.id === 'save-basket' || el.closest('.quantity-controls') || el.hasAttribute('data-no-busy')) {
          el.classList.remove('is-busy');
          continue;
        }
        el.classList.toggle('is-busy', el.disabled);
        el.setAttribute('aria-busy', String(el.disabled));
      }
    }
  });
  observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['disabled'] });

  document.addEventListener('click', e => {
    const button = e.target.closest('button');
    if (!button || button.disabled) return;
    button.classList.add('button-pressed');
    setTimeout(() => button.classList.remove('button-pressed'), 180);
  });

// Universal Mobile Menu Toggle (for pages without page-specific JS handling)
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
});


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

      popoverContent.innerHTML = `
        <div class="user-popover-header logged-in">
          <div class="user-avatar-circle">${initials}</div>
          <div style="min-width:0;flex:1">
            <strong style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${name}</strong>
            <p style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${user.email}</p>
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
      `;

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

      popoverContent.innerHTML = `
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
      `;

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

})();
