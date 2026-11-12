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
})();