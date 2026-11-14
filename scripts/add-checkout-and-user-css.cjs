const fs = require('fs');
const path = require('path');

const cssPath = path.resolve(__dirname, '../dist/brand/v2-tokens.css');
let css = fs.readFileSync(cssPath, 'utf8');

const newStyles = `
/* ─── Header User Account Icon & Dropdown (Levista Style) ─── */
.user-menu-wrap {
  position: relative !important;
  display: inline-flex !important;
  align-items: center !important;
}

.user-btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 7px !important;
  padding: 6px 12px !important;
  background: transparent !important;
  border: 1px solid var(--line) !important;
  border-radius: 20px !important;
  font: 500 0.88rem var(--body) !important;
  color: var(--ink) !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
}
.user-btn:hover, .user-btn.active {
  border-color: var(--honey) !important;
  background: rgba(200, 157, 102, 0.08) !important;
  color: var(--ink) !important;
}
.user-btn svg {
  color: var(--accent) !important;
}
.user-name-tag {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown-popover {
  position: absolute !important;
  top: calc(100% + 10px) !important;
  right: 0 !important;
  width: 290px !important;
  background: #1C130E !important;
  border: 1px solid var(--honey) !important;
  border-radius: 8px !important;
  box-shadow: 0 16px 40px rgba(0,0,0,0.6) !important;
  padding: 18px 20px !important;
  z-index: 10002 !important;
  color: #FFFFFF !important;
  animation: popoverFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) !important;
}
.user-dropdown-popover:not([hidden]) {
  display: block !important;
}
@keyframes popoverFadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.user-popover-header {
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 12px;
  margin-bottom: 14px;
}
.user-popover-header strong {
  display: block;
  font-size: 1rem;
  color: #FFF;
  font-family: var(--disp);
  margin-bottom: 2px;
}
.user-popover-header p {
  margin: 0;
  font-size: 0.78rem;
  color: #C4B6A4;
  line-height: 1.35;
}

.user-popover-header.logged-in {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user-avatar-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--honey);
  color: #1C130E;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.google-signin-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
  width: 100% !important;
  padding: 10px 14px !important;
  background: #FFFFFF !important;
  color: #1f1f1f !important;
  border: 1px solid #dadce0 !important;
  border-radius: 6px !important;
  font: 500 0.88rem Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
  cursor: pointer !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
  transition: all 0.15s ease !important;
}
.google-signin-btn:hover {
  background: #f8f9fa !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.18) !important;
}

.popover-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 12px 0;
  color: rgba(255,255,255,0.4);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
}
.popover-divider::before, .popover-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255,255,255,0.12);
}
.popover-divider span {
  padding: 0 8px;
}

.email-signin-btn {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
  padding: 9px 12px !important;
  background: rgba(200, 157, 102, 0.12) !important;
  border: 1px solid var(--honey) !important;
  border-radius: 6px !important;
  color: var(--honey-lt) !important;
  font-size: 0.84rem !important;
  font-weight: 500 !important;
  text-decoration: none !important;
  text-align: center !important;
  transition: all 0.15s ease !important;
}
.email-signin-btn:hover {
  background: rgba(200, 157, 102, 0.22) !important;
  color: #FFF !important;
}

.popover-footer {
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
  font-size: 0.78rem;
  color: #C4B6A4;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.popover-footer a {
  color: var(--honey-lt);
  text-decoration: underline;
  font-weight: 500;
}

.popover-menu-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.popover-menu-links a {
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  padding: 8px 10px !important;
  border-radius: 4px !important;
  color: #F5EBE1 !important;
  font-size: 0.85rem !important;
  text-decoration: none !important;
  transition: background 0.15s ease !important;
}
.popover-menu-links a:hover {
  background: rgba(255,255,255,0.08) !important;
  color: var(--honey-lt) !important;
}

.popover-signout-btn {
  background: none;
  border: none;
  color: #e57373;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0;
  text-decoration: underline;
}

/* ─── Dedicated Multi-Step Checkout Page ─── */
.checkout-page {
  background: var(--bg);
  min-height: 100vh;
}
.checkout-container {
  max-width: 1140px;
  margin: 36px auto 70px;
  padding: 0 20px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
  align-items: start;
}

.checkout-step-card {
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 28px 32px;
  margin-bottom: 24px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.03);
}

.checkout-step-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 14px;
}
.checkout-step-num {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ink);
  color: #FFFFFF;
  font-family: var(--disp);
  font-weight: 700;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.checkout-step-title {
  margin: 0;
  font-size: 1.25rem;
  color: var(--ink);
  font-family: var(--disp);
}

.checkout-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.checkout-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.checkout-form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--ink);
}
.checkout-form-group input,
.checkout-form-group select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid var(--line);
  border-radius: 6px;
  background: #FFFFFF;
  color: var(--ink);
  font: inherit;
  font-size: 0.92rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.checkout-form-group input:focus,
.checkout-form-group select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(200, 157, 102, 0.15);
}

.checkout-summary-sticky {
  background: #FFFFFF;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  position: sticky;
  top: 96px;
}

@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .checkout-step-card {
    padding: 22px 20px;
  }
  .checkout-form-grid {
    grid-template-columns: 1fr;
  }
}
`;

if (!css.includes('.user-menu-wrap')) {
  css += '\n' + newStyles;
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('Appended user-menu and checkout styles to v2-tokens.css');
} else {
  console.log('User menu styles already present in v2-tokens.css');
}
