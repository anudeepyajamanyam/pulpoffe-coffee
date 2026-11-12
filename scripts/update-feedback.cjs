const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const jsPath = path.join(root, 'dist/feedback.js');
const cssPath = path.join(root, 'dist/feedback.css');

const cssContent = `
.request-loader {
  position: fixed !important;
  bottom: 28px !important;
  left: 50% !important;
  transform: translate(-50%, 20px) !important;
  opacity: 0 !important;
  pointer-events: none !important;
  visibility: hidden !important;
  z-index: 10000 !important;
  display: none !important;
  align-items: center !important;
  gap: 12px !important;
  background: #231710f2 !important;
  color: #EBD3AC !important;
  border: 1px solid #A87D43 !important;
  border-radius: 40px !important;
  padding: 12px 22px !important;
  box-shadow: 0 10px 32px rgba(0,0,0,0.55) !important;
  font: 500 13px Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  transition: opacity 0.2s ease, transform 0.2s ease !important;
}
.request-loader.active {
  display: inline-flex !important;
  visibility: visible !important;
  opacity: 1 !important;
  transform: translate(-50%, 0) !important;
}
.loader-bean {
  display: inline-block !important;
  height: 16px !important;
  width: 12px !important;
  border-radius: 50% !important;
  border: 1.5px solid #DFB978 !important;
  background: linear-gradient(100deg, transparent 42%, #DFB978 47%, transparent 54%) !important;
  animation: turn-bean 1.1s infinite ease-in-out !important;
}
.is-busy {
  cursor: wait !important;
  position: relative !important;
}
.is-busy:after {
  content: '' !important;
  display: inline-block !important;
  vertical-align: middle !important;
  width: 11px !important;
  height: 11px !important;
  margin-left: 9px !important;
  border: 1.5px solid currentColor !important;
  border-right-color: transparent !important;
  border-radius: 50% !important;
  animation: turn-bean 0.8s linear infinite !important;
}
.button-pressed {
  transform: scale(0.97) !important;
}
@keyframes turn-bean {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .loader-bean, .is-busy:after { animation: none !important; }
  .request-loader { transition: none !important; }
}
`;

fs.writeFileSync(cssPath, cssContent.trim(), 'utf8');

const jsContent = `(() => {
  if (!document.getElementById('pulpoffe-feedback-style')) {
    const style = document.createElement('style');
    style.id = 'pulpoffe-feedback-style';
    style.textContent = ${JSON.stringify(cssContent.trim())};
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
})();`;

fs.writeFileSync(jsPath, jsContent.trim(), 'utf8');
console.log('Successfully wrote feedback.css and feedback.js');
