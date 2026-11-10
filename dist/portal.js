(()=>{
const $ = s => document.querySelector(s);
const isContact = !!$('#enquiry-form');
const isAccount = !!$('#account-auth');
const isAdmin = !!$('#admin-auth');

const TOKEN_KEY = 'pulpoffe_token';
const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
};
const setToken = (t) => {
  try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch {}
};

async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };
  const r = await fetch(path, { credentials: 'same-origin', ...options, headers });
  let body;
  try { body = await r.json(); } catch { throw new Error('The service is temporarily unavailable. Please try again shortly.'); }
  if (!r.ok) {
    const err = new Error(body.error || body.message || 'Your request could not be completed.');
    err.status = r.status;
    throw err;
  }
  return body;
}

const identity = (async () => { const t = getToken(); if (!t) return { authenticated: false, user: null }; try { return await api('/api/me'); } catch { return { authenticated: false, user: null }; } })();

function text(el, value) { el.textContent = value ?? ''; return el; }
function node(tag, className, value) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (value !== undefined) el.textContent = value;
  return el;
}
function date(value) {
  try { return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
  catch { return value; }
}

function requestCard(request, admin = false) {
  const card = node('article', 'request-card');
  const top = node('div', 'request-top');
  const heading = node('div');
  heading.append(
    node('p', 'eyebrow', request.type === 'b2b' ? 'BUSINESS ENQUIRY' : 'GENERAL ENQUIRY'),
    node('h3', '', request.interest || 'Coffee enquiry')
  );
  const status = node('span', 'request-status ' + request.status, request.status);
  top.append(heading, status);
  card.append(top);

  if (admin) {
    card.append(
      node('p', 'request-person', `${request.name}${request.company ? ' · ' + request.company : ''}`),
      node('p', 'request-contact', `${request.email}${request.phone ? ' · ' + request.phone : ''}`)
    );
  }
  if (request.volume) card.append(node('p', 'request-volume', 'Requirement: ' + request.volume));
  card.append(
    node('p', 'request-message', request.message),
    node('p', 'request-meta', date(request.createdAt) + ' · Reference ' + request.id.slice(0, 8))
  );

  if (admin) {
    const label = node('label', 'status-editor', 'Update status');
    const select = document.createElement('select');
    select.setAttribute('aria-label', 'Status for ' + request.name);
    for (const val of ['new', 'contacted', 'quoted', 'closed']) {
      const opt = node('option', '', val[0].toUpperCase() + val.slice(1));
      opt.value = val;
      select.append(opt);
    }
    select.value = request.status;
    const result = node('span', 'status-result');
    select.addEventListener('change', async () => {
      const previous = request.status;
      select.disabled = true;
      result.textContent = 'Saving…';
      try {
        await api('/api/admin/enquiries/' + encodeURIComponent(request.id), {
          method: 'PATCH',
          body: JSON.stringify({ status: select.value })
        });
        request.status = select.value;
        status.className = 'request-status ' + request.status;
        status.textContent = request.status;
        result.textContent = 'Saved';
      } catch (e) {
        select.value = previous;
        result.textContent = e.message;
      } finally {
        select.disabled = false;
      }
    });
    label.append(select, result);
    card.append(label);
  }
  return card;
}

// ── Contact Page Logic ──
if (isContact) {
  const form = $('#enquiry-form');
  const params = new URLSearchParams(location.search);
  let user = null;

  function setType(type) {
    form.elements.type.value = type;
    document.querySelectorAll('[data-enquiry-type]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.enquiryType === type)));
    const b2b = type === 'b2b';
    form.elements.company.required = b2b;
    $('#company-label').firstChild.textContent = b2b ? 'Business / company name' : 'Business / company name (optional)';
    $('#volume-label').hidden = !b2b;
    $('#enquiry-heading').textContent = b2b ? 'Let’s talk coffee.' : 'What’s on your mind?';
    $('#enquiry-description').textContent = b2b ? 'Tell us about your business and the coffee you’re looking for.' : 'Questions about our coffee, your preferences, or a partnership? Start here.';
  }

  setType(params.get('type') === 'contact' ? 'contact' : 'b2b');
  document.querySelectorAll('[data-enquiry-type]').forEach(b => b.addEventListener('click', () => setType(b.dataset.enquiryType)));

  try {
    const saved = JSON.parse(sessionStorage.getItem('pulpoffe-enquiry-draft') || 'null');
    if (saved) {
      for (const key of ['name', 'email', 'company', 'phone', 'interest', 'volume', 'message']) {
        if (typeof saved[key] === 'string' && form.elements[key]) form.elements[key].value = saved[key];
      }
      if (saved.type === 'contact') setType('contact');
    }
    if (params.get('from') === 'basket') {
      const selection = sessionStorage.getItem('pulpoffe-enquiry-selection');
      if (selection) {
        form.elements.message.value = 'I’d like to enquire about these coffees:\n\n' + selection + '\n\nPlease confirm pack sizes, prices and delivery options.';
        form.elements.interest.value = 'Multiple collections';
      }
    }
  } catch {}

  function saveDraft() {
    try {
      const d = {};
      for (const key of ['type', 'name', 'email', 'company', 'phone', 'interest', 'volume', 'message']) {
        d[key] = form.elements[key]?.value || '';
      }
      sessionStorage.setItem('pulpoffe-enquiry-draft', JSON.stringify(d));
    } catch {}
  }

  identity.then(state => {
    user = state.user;
    const note = $('#form-auth-note');
    if (!note) return;
    note.replaceChildren();
    if (user) {
      note.append(node('span', '', 'Signed in as ' + user.email));
      if (!form.elements.name.value) form.elements.name.value = user.name || '';
      if (!form.elements.email.value) form.elements.email.value = user.email;
      form.querySelector('[type=submit]').innerHTML = 'Send enquiry <span>→</span>';
    } else {
      note.append(node('span', '', 'Sign in to track your enquiry: '));
      const a = node('a', 'underlined', 'Sign in or create an account →');
      a.href = 'account.html?return_to=' + encodeURIComponent('contact.html?type=' + form.elements.type.value);
      a.addEventListener('click', saveDraft);
      note.append(a);
      form.querySelector('[type=submit]').innerHTML = 'Send enquiry <span>→</span>';
    }
  });

  function payload() {
    return {
      type: form.elements.type.value,
      name: form.elements.name.value,
      email: form.elements.email.value,
      company: form.elements.company.value,
      phone: form.elements.phone.value,
      interest: form.elements.interest.value,
      volume: form.elements.volume.value,
      message: form.elements.message.value,
      website: form.elements.website?.value || '',
      consent: form.elements.consent.checked
    };
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const button = form.querySelector('[type=submit]');
    const status = $('#enquiry-status');
    button.disabled = true;
    status.textContent = 'Sending your enquiry…';
    try {
      const result = await api('/api/enquiries', { method: 'POST', body: JSON.stringify(payload()) });
      status.replaceChildren(
        node('strong', '', 'Your enquiry has been received.'),
        node('span', '', ' Reference: ' + result.id.slice(0, 8) + '. ')
      );
      const link = node('a', 'underlined', 'Track it in My account →');
      link.href = 'account.html';
      status.append(link);
      try {
        sessionStorage.removeItem('pulpoffe-enquiry-draft');
        sessionStorage.removeItem('pulpoffe-enquiry-selection');
      } catch {}
      form.reset();
      form.elements.type.value = 'b2b';
      setType('b2b');
      if (user) {
        form.elements.name.value = user.name || '';
        form.elements.email.value = user.email;
      }
    } catch (err) {
      status.textContent = err.message;
      if (err.status === 401) {
        saveDraft();
        const reLink = node('a', 'underlined', 'Please sign in to complete your enquiry →');
        reLink.href = 'account.html?return_to=contact.html';
        status.replaceChildren(reLink);
      }
    } finally {
      button.disabled = false;
    }
  });

  api('/api/contact-settings').then(data => {
    if (!data.published) return;
    const details = $('#contact-details');
    if (!details) return;
    details.replaceChildren(node('h2', '', 'Let’s keep in touch.'));
    if (data.email) {
      const a = node('a', '', data.email);
      a.href = 'mailto:' + data.email;
      details.append(a);
    }
    if (data.phone) {
      const a = node('a', '', data.phone);
      a.href = 'tel:' + data.phone.replace(/[^+\d]/g, '');
      details.append(a);
    }
    if (data.address) details.append(node('p', '', data.address));
  }).catch(() => {});
}

// ── Customer Account Page Logic ──
if (isAccount) {
  function renderDashboard(user) {
    $('#account-auth').hidden = true;
    $('#account-content').hidden = false;
    text($('#account-name'), user.name || 'Welcome back.');
    text($('#account-email'), user.email);
    if ($('#admin-entry')) $('#admin-entry').hidden = user.role !== 'admin';

    const host = $('#customer-requests');
    if (!host) return;
    host.textContent = 'Loading your enquiries…';
    api('/api/enquiries').then(data => {
      host.replaceChildren();
      if (!data.enquiries?.length) {
        host.append(node('p', 'empty-state', 'Your next coffee conversation starts here. You haven’t sent an enquiry yet.'));
      } else {
        data.enquiries.forEach(r => host.append(requestCard(r)));
      }
    }).catch(e => {
      host.textContent = e.message;
    });
  }

  // Setup login / register tabs
  let authMode = 'login';
  const nameField = $('#auth-name-field');
  const authTitle = $('#auth-title');
  const authDesc = $('#auth-desc');
  const submitBtn = $('#auth-submit');
  const authFeedback = $('#auth-feedback');

  document.querySelectorAll('.auth-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      authMode = btn.dataset.authMode;
      document.querySelectorAll('.auth-tab-btn').forEach(b => {
        const active = b === btn;
        b.setAttribute('aria-pressed', String(active));
        if (active) {
          b.classList.remove('outline');
          b.classList.add('gold');
        } else {
          b.classList.remove('gold');
          b.classList.add('outline');
        }
      });
      if (authMode === 'register') {
        if (nameField) nameField.style.display = 'flex';
        if (authTitle) authTitle.textContent = 'Create an account';
        if (authDesc) authDesc.textContent = 'Sign up to submit enquiries and view your blend history.';
        if (submitBtn) submitBtn.querySelector('span').textContent = 'Create Account';
      } else {
        if (nameField) nameField.style.display = 'none';
        if (authTitle) authTitle.textContent = 'Sign in to Pulpoffe';
        if (authDesc) authDesc.textContent = 'Access your coffee enquiries and blend preferences.';
        if (submitBtn) submitBtn.querySelector('span').textContent = 'Sign In';
      }
      if (authFeedback) authFeedback.textContent = '';
    });
  });

  const authForm = $('#auth-form');
  if (authForm) {
    authForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (authFeedback) authFeedback.textContent = 'Processing…';
      submitBtn.disabled = true;

      const email = authForm.elements.email.value.trim();
      const password = authForm.elements.password.value;
      const name = authForm.elements.name ? authForm.elements.name.value.trim() : '';

      try {
        let res;
        if (authMode === 'register') {
          res = await api('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password })
          });
        } else {
          res = await api('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
          });
        }
        if (res.token) setToken(res.token);
        if (res.user) renderDashboard(res.user);

        // Check return_to param
        const params = new URLSearchParams(location.search);
        const returnTo = params.get('return_to');
        if (returnTo) location.href = decodeURIComponent(returnTo);
      } catch (err) {
        if (authFeedback) authFeedback.textContent = err.message;
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  // Sign out button
  const signoutBtn = $('#signout-btn');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
      try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
      setToken('');
      location.reload();
    });
  }

  identity.then(state => {
    if (state.user) {
      renderDashboard(state.user);
    } else {
      $('#account-auth').hidden = false;
      $('#account-content').hidden = true;
    }
  });
}

// ── Admin Workspace Logic ──
if (isAdmin) {
  let requests = [];

  function render() {
    const selected = $('#request-filter').value;
    const list = requests.filter(r => selected === 'all' || r.status === selected);
    const host = $('#admin-requests');
    if (!host) return;
    host.replaceChildren();
    $('#inbox-count').textContent = list.length + ' request' + (list.length === 1 ? '' : 's');
    if (!list.length) host.append(node('p', 'empty-state', 'No enquiries in this view.'));
    else list.forEach(r => host.append(requestCard(r, true)));
  }

  async function refresh() {
    const host = $('#admin-requests');
    if (!host) return;
    host.textContent = 'Loading enquiries…';
    try {
      const data = await api('/api/admin/enquiries');
      requests = data.enquiries || [];
      render();
    } catch (e) {
      host.textContent = e.message;
    }
  }

  async function initAdminWorkspace(user) {
    $('#admin-auth').hidden = true;
    $('#admin-content').hidden = false;
    $('#admin-user').textContent = 'Signed in as ' + user.email;
    await refresh();
    try {
      const settings = await api('/api/admin/contact-settings');
      const form = $('#contact-settings-form');
      if (form) {
        for (const name of ['email', 'phone', 'address']) form.elements[name].value = settings[name] || '';
        form.elements.published.checked = !!settings.published;
      }
    } catch (e) {
      if ($('#settings-status')) $('#settings-status').textContent = e.message;
    }
  }

  const adminLoginForm = $('#admin-login-form');
  const adminFeedback = $('#admin-auth-feedback');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (adminFeedback) adminFeedback.textContent = 'Signing in…';
      const btn = adminLoginForm.querySelector('[type=submit]');
      btn.disabled = true;

      const email = adminLoginForm.elements.email.value.trim();
      const password = adminLoginForm.elements.password.value;

      try {
        const res = await api('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        if (res.user.role !== 'admin') {
          throw new Error('This account is not authorized as an administrator. Please sign in with an admin email.');
        }
        if (res.token) setToken(res.token);
        await initAdminWorkspace(res.user);
      } catch (err) {
        if (adminFeedback) adminFeedback.textContent = err.message;
      } finally {
        btn.disabled = false;
      }
    });
  }

  const adminSignoutBtn = $('#admin-signout-btn');
  if (adminSignoutBtn) {
    adminSignoutBtn.addEventListener('click', async () => {
      try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
      setToken('');
      location.reload();
    });
  }

  $('#request-filter')?.addEventListener('change', render);
  $('#refresh-inbox')?.addEventListener('click', refresh);

  document.querySelectorAll('[data-admin-tab]').forEach(b => b.addEventListener('click', () => {
    const isSettings = b.dataset.adminTab === 'settings';
    if ($('#admin-settings')) $('#admin-settings').hidden = !isSettings;
    if ($('#admin-inbox')) $('#admin-inbox').hidden = isSettings;
    document.querySelectorAll('[data-admin-tab]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  }));

  $('#contact-settings-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const button = form.querySelector('[type=submit]');
    button.disabled = true;
    $('#settings-status').textContent = 'Saving…';
    try {
      await api('/api/admin/contact-settings', {
        method: 'PATCH',
        body: JSON.stringify({
          email: form.elements.email.value,
          phone: form.elements.phone.value,
          address: form.elements.address.value,
          published: form.elements.published.checked
        })
      });
      $('#settings-status').textContent = form.elements.published.checked ? 'Saved. These contact details are now published.' : 'Saved as unpublished contact details.';
    } catch (err) {
      $('#settings-status').textContent = err.message;
    } finally {
      button.disabled = false;
    }
  });

  identity.then(state => {
    if (state.user && state.user.role === 'admin') {
      initAdminWorkspace(state.user);
    } else {
      $('#admin-auth').hidden = false;
      $('#admin-content').hidden = true;
    }
  });
}
})();

