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

// Client-Side Simulated Storage for Static Deployments (Render / Static Sites)
const LOCAL_USERS_KEY = 'pulpoffe_local_users_v1';
const getLocalUsers = () => {
  try {
    const u = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || '{}');
    if (!u['customer@pulpoffe.com']) {
      u['customer@pulpoffe.com'] = {
        id: 'user_customer_test',
        name: 'Aarav Sharma',
        email: 'customer@pulpoffe.com',
        password: 'Password123!',
        role: 'customer'
      };
    }
    if (!u['admin@pulpoffe.com']) {
      u['admin@pulpoffe.com'] = {
        id: 'user_admin_test',
        name: 'Pulpoffe Admin',
        email: 'admin@pulpoffe.com',
        password: 'AdminPassword123!',
        role: 'admin'
      };
    }
    return u;
  } catch { return {}; }
};
const saveLocalUsers = (users) => {
  try { localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users)); } catch {}
};

const LOCAL_ENQUIRIES_KEY = 'pulpoffe_local_enquiries_v1';
const getLocalEnquiries = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ENQUIRIES_KEY) || '[]');
  } catch { return []; }
};
const saveLocalEnquiry = (enq) => {
  try {
    const list = getLocalEnquiries();
    list.unshift(enq);
    localStorage.setItem(LOCAL_ENQUIRIES_KEY, JSON.stringify(list));
  } catch {}
};

async function api(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { 'Authorization': 'Bearer ' + token } : {}),
    ...options.headers
  };

  let r = null;
  let text = '';
  let isJson = false;
  let parsed = null;

  try {
    r = await fetch(path, { credentials: 'same-origin', ...options, headers });
    text = await r.text();
    if (text && (text.trim().startsWith('{') || text.trim().startsWith('['))) {
      try {
        parsed = JSON.parse(text);
        isJson = true;
      } catch {}
    }
  } catch (err) {
    // Network failure / offline
  }

  // 1. If server returned valid JSON API response and was HTTP OK
  if (r && r.ok && isJson && parsed !== null) {
    // If backend returns an authenticated state false but we have local session:
    if (path === '/api/me' && !parsed.authenticated) {
      try {
        const uStr = localStorage.getItem('pulpoffe_user');
        if (uStr) return { authenticated: true, user: JSON.parse(uStr) };
      } catch {}
    }
    return parsed;
  }

  // 2. If server returned an intentional JSON API error (e.g. 401 Unauthorized or 409 Conflict)
  if (r && !r.ok && isJson && parsed && (parsed.error || parsed.message)) {
    const err = new Error(parsed.error || parsed.message);
    err.status = r.status;
    throw err;
  }

  // 3. Fallback for Static Sites (e.g. Render static site mode, 404s, empty 200s, or offline)
  const payload = options.body ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body) : {};

  if (path === '/api/auth/login') {
    const users = getLocalUsers();
    const email = (payload.email || '').toLowerCase().trim();
    const user = users[email];
    const pass = (payload.password || '').trim();
    const isMatch = user && (user.password === payload.password || user.password === pass);
    if (!user || !isMatch) {
      const err = new Error('Incorrect email or password. Please verify your credentials.');
      err.status = 401;
      throw err;
    }
    const fakeToken = 'plf_token_' + btoa(JSON.stringify({ sub: user.id, email: user.email, name: user.name, role: user.role, exp: Date.now() + 86400000 }));
    try { localStorage.setItem('pulpoffe_user', JSON.stringify(user)); } catch {}
    return { token: fakeToken, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  if (path === '/api/auth/register') {
    const users = getLocalUsers();
    const email = (payload.email || '').toLowerCase().trim();
    if (users[email]) {
      const err = new Error('An account with this email already exists. Please sign in instead.');
      err.status = 409;
      throw err;
    }
    const newUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      name: (payload.name || '').trim() || email.split('@')[0],
      email: email,
      password: payload.password,
      role: email.includes('admin') ? 'admin' : 'customer'
    };
    users[email] = newUser;
    saveLocalUsers(users);
    const fakeToken = 'plf_token_' + btoa(JSON.stringify({ sub: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role, exp: Date.now() + 86400000 }));
    try { localStorage.setItem('pulpoffe_user', JSON.stringify(newUser)); } catch {}
    return { token: fakeToken, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } };
  }

  if (path === '/api/auth/logout') {
    try { localStorage.removeItem('pulpoffe_user'); } catch {}
    return { ok: true };
  }

  if (path === '/api/me') {
    if (!token) return { authenticated: false, user: null };
    try {
      const userStr = localStorage.getItem('pulpoffe_user');
      if (userStr) return { authenticated: true, user: JSON.parse(userStr) };
    } catch {}
    return { authenticated: false, user: null };
  }

  if (path === '/api/enquiries') {
    if (options.method === 'POST') {
      const enq = {
        id: 'enq_' + Math.random().toString(36).substring(2, 9),
        ...payload,
        status: 'new',
        createdAt: new Date().toISOString()
      };
      saveLocalEnquiry(enq);
      return enq;
    }
    const all = getLocalEnquiries();
    let currentEmail = '';
    try {
      const uStr = localStorage.getItem('pulpoffe_user');
      if (uStr) currentEmail = JSON.parse(uStr).email || '';
    } catch {}
    const userEnquiries = currentEmail ? all.filter(e => (e.email || '').toLowerCase() === currentEmail.toLowerCase()) : all;
    return { enquiries: userEnquiries };
  }

  if (path === '/api/admin/enquiries') {
    return { enquiries: getLocalEnquiries() };
  }

  if (path.startsWith('/api/admin/enquiries/')) {
    const id = path.split('/').pop();
    const all = getLocalEnquiries();
    const target = all.find(e => e.id === id);
    if (target && payload.status) {
      target.status = payload.status;
      localStorage.setItem(LOCAL_ENQUIRIES_KEY, JSON.stringify(all));
    }
    return { ok: true };
  }

  if (path === '/api/admin/contact-settings' || path === '/api/contact-settings') {
    if (options.method === 'PATCH') {
      try { localStorage.setItem('pulpoffe_contact_settings_v1', JSON.stringify(payload)); } catch {}
      return payload;
    }
    try {
      const saved = JSON.parse(localStorage.getItem('pulpoffe_contact_settings_v1') || 'null');
      if (saved) return saved;
    } catch {}
    return { email: 'hello@pulpoffe.com', phone: '+91 98765 43210', address: 'Kodagu, Karnataka, India', published: true };
  }

  // Generic fallback response
  return { ok: true };
}

const identity = (async () => {
  const t = getToken();
  if (!t) return { authenticated: false, user: null };
  try { return await api('/api/me'); } catch { return { authenticated: false, user: null }; }
})();

function text(el, value) { if (el) el.textContent = value ?? ''; return el; }
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
  const status = node('span', 'request-status ' + (request.status || 'new'), request.status || 'new');
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
    node('p', 'request-message', request.message || ''),
    node('p', 'request-meta', date(request.createdAt) + ' · Reference ' + (request.id || '').slice(0, 8))
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
    select.value = request.status || 'new';
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

function orderCard(order) {
  const card = node('article', 'request-card');
  const top = node('div', 'request-top');
  const heading = node('div');
  heading.append(
    node('p', 'eyebrow', 'ONLINE ORDER · ' + (order.id || 'PLF-ORD')),
    node('h3', '', '₹' + (order.total || 0).toFixed(2))
  );
  const status = node('span', 'request-status', 'Dispatched from Kodagu');
  status.style.background = '#263720';
  status.style.color = '#a3c28b';
  top.append(heading, status);
  card.append(top);

  const itemsText = (order.items || []).map(i => `${i.qty} × ${i.name}`).join(' · ');
  card.append(
    node('p', 'request-person', itemsText || 'Pulpoffe artisanal coffee selection'),
    node('p', 'request-contact', 'Destination: ' + (order.shippingAddress || 'India')),
    node('p', 'request-meta', date(order.createdAt || Date.now()) + ' · Payment Ref: ' + (order.ref || 'DEMO_PAID'))
  );
  return card;
}

// ── Contact Page Logic ──
if (isContact) {
  const form = $('#enquiry-form');
  const params = new URLSearchParams(location.search);
  let user = null;

  function setType(type) {
    if (!form) return;
    form.elements.type.value = type;
    document.querySelectorAll('[data-enquiry-type]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.enquiryType === type)));
    const b2b = type === 'b2b';
    form.elements.company.required = b2b;
    const companyLabel = $('#company-label');
    if (companyLabel && companyLabel.firstChild) {
      companyLabel.firstChild.textContent = b2b ? 'Business / company name' : 'Business / company name (optional)';
    }
    const volumeLabel = $('#volume-label');
    if (volumeLabel) volumeLabel.hidden = !b2b;
    const heading = $('#enquiry-heading');
    if (heading) heading.textContent = b2b ? 'Let’s talk coffee.' : 'What’s on your mind?';
    const desc = $('#enquiry-description');
    if (desc) desc.textContent = b2b ? 'Tell us about your business and the coffee you’re looking for.' : 'Questions about our coffee, your preferences, or a partnership? Start here.';
  }

  setType(params.get('type') === 'contact' ? 'contact' : 'b2b');
  document.querySelectorAll('[data-enquiry-type]').forEach(b => b.addEventListener('click', () => setType(b.dataset.enquiryType)));

  try {
    const saved = JSON.parse(sessionStorage.getItem('pulpoffe-enquiry-draft') || 'null');
    if (saved && form) {
      for (const key of ['name', 'email', 'company', 'phone', 'interest', 'volume', 'message']) {
        if (typeof saved[key] === 'string' && form.elements[key]) form.elements[key].value = saved[key];
      }
      if (saved.type === 'contact') setType('contact');
    }
    if (params.get('from') === 'basket' && form) {
      const selection = sessionStorage.getItem('pulpoffe-enquiry-selection');
      if (selection) {
        form.elements.message.value = 'I’d like to enquire about these coffees:\n\n' + selection + '\n\nPlease confirm pack sizes, prices and delivery options.';
        form.elements.interest.value = 'Multiple collections';
      }
    }
  } catch {}

  function saveDraft() {
    if (!form) return;
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
    if (!note || !form) return;
    note.replaceChildren();
    if (user) {
      note.append(node('span', '', 'Signed in as ' + user.email));
      if (!form.elements.name.value) form.elements.name.value = user.name || '';
      if (!form.elements.email.value) form.elements.email.value = user.email;
      form.querySelector('[type=submit]').innerHTML = 'Send enquiry <span>→</span>';
    } else {
      note.append(node('span', '', 'Sign in to track your enquiry: '));
      const a = node('a', 'underlined', 'Sign in or create an account →');
      a.href = 'account.html?return_to=' + encodeURIComponent('contact.html?type=' + (form.elements.type?.value || 'b2b'));
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

  form?.addEventListener('submit', async e => {
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
        node('span', '', ' Reference: ' + (result.id || '').slice(0, 8) + '. ')
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
    const authCard = $('#account-auth');
    const content = $('#account-content');
    const page = $('.account-page');
    const heading = $('.portal-heading');

    if (authCard) authCard.hidden = true;
    if (content) content.hidden = false;
    if (page) page.classList.add('logged-in');
    if (heading) heading.style.display = 'none';

    text($('#account-name'), user.name || user.email.split('@')[0]);
    text($('#account-email'), user.email);
    if ($('#admin-entry')) $('#admin-entry').hidden = user.role !== 'admin';

    // Render Enquiries
    const host = $('#customer-requests');
    if (host) {
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

    // Render Recent Orders
    const ordersHost = $('#customer-orders');
    if (ordersHost) {
      try {
        const allOrders = JSON.parse(localStorage.getItem('pulpoffe_orders_v1') || '[]');
        const userOrders = allOrders.filter(o => !o.customer?.email || o.customer.email.toLowerCase() === user.email.toLowerCase());
        ordersHost.replaceChildren();
        if (!userOrders.length) {
          ordersHost.append(node('p', 'empty-state', 'No orders placed yet. Add your favourite coffees from the shop to order online.'));
        } else {
          userOrders.forEach(o => ordersHost.append(orderCard(o)));
        }
      } catch {
        ordersHost.replaceChildren(node('p', 'empty-state', 'No orders placed yet.'));
      }
    }
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
        if (submitBtn) {
          const span = submitBtn.querySelector('span');
          if (span) span.textContent = 'Create Account';
          else submitBtn.textContent = 'Create Account →';
        }
      } else {
        if (nameField) nameField.style.display = 'none';
        if (authTitle) authTitle.textContent = 'Sign in to Pulpoffe';
        if (authDesc) authDesc.textContent = 'Access your coffee enquiries and blend preferences.';
        if (submitBtn) {
          const span = submitBtn.querySelector('span');
          if (span) span.textContent = 'Sign In';
          else submitBtn.textContent = 'Sign In →';
        }
      }
      if (authFeedback) authFeedback.textContent = '';
    });
  });

  const demoFillBtn = $('#demo-fill-btn');
  if (demoFillBtn) {
    demoFillBtn.addEventListener('click', () => {
      const form = $('#auth-form');
      if (form) {
        if (form.elements.email) form.elements.email.value = 'customer@pulpoffe.com';
        if (form.elements.password) form.elements.password.value = 'Password123!';
        if (authFeedback) {
          authFeedback.style.color = 'var(--honey)';
          authFeedback.textContent = 'Demo credentials filled. Ready to sign in!';
        }
      }
    });
  }

  const authForm = $('#auth-form');
  if (authForm) {
    authForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (authFeedback) {
        authFeedback.style.color = '#d4b389';
        authFeedback.textContent = authMode === 'register' ? 'Creating account…' : 'Signing in…';
      }
      if (submitBtn) submitBtn.disabled = true;

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
        if (authFeedback) {
          authFeedback.style.color = '#7fb069';
          authFeedback.textContent = 'Signed in successfully! Loading your atelier account…';
        }
        setTimeout(() => {
          if (res.user) renderDashboard(res.user);
          const params = new URLSearchParams(location.search);
          const returnTo = params.get('return_to');
          if (returnTo) location.href = decodeURIComponent(returnTo);
        }, 300);
      } catch (err) {
        if (authFeedback) {
          authFeedback.style.color = '#e57373';
          authFeedback.textContent = err.message || 'Unable to sign in. Please check your credentials.';
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Sign out button
  const signoutBtn = $('#signout-btn');
  if (signoutBtn) {
    signoutBtn.addEventListener('click', async () => {
      try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
      setToken('');
      try { localStorage.removeItem('pulpoffe_user'); } catch {}
      location.reload();
    });
  }

  identity.then(state => {
    if (state.user) {
      renderDashboard(state.user);
    } else {
      if ($('#account-auth')) $('#account-auth').hidden = false;
      if ($('#account-content')) $('#account-content').hidden = true;
      if ($('.account-page')) $('.account-page').classList.remove('logged-in');
      if ($('.portal-heading')) $('.portal-heading').style.display = '';
    }
  });
}

// ── Admin Workspace Logic ──
if (isAdmin) {
  let requests = [];

  function render() {
    const filter = $('#request-filter');
    const selected = filter ? filter.value : 'all';
    const list = requests.filter(r => selected === 'all' || r.status === selected);
    const host = $('#admin-requests');
    if (!host) return;
    host.replaceChildren();
    if ($('#inbox-count')) $('#inbox-count').textContent = list.length + ' request' + (list.length === 1 ? '' : 's');
    if (!list.length) host.append(node('p', 'empty-state', 'No enquiries in this view.'));
    else list.forEach(r => host.append(requestCard(r, true)));
  }

  async function refresh() {
    const host = $('#admin-requests') || $('#admin-inbox-list');
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
    if ($('#admin-auth')) $('#admin-auth').hidden = true;
    if ($('#admin-content')) $('#admin-content').hidden = false;
    if ($('#admin-dashboard')) $('#admin-dashboard').hidden = false;
    if ($('#admin-signout-btn')) $('#admin-signout-btn').hidden = false;
    if ($('#admin-user')) $('#admin-user').textContent = 'Signed in as ' + user.email;
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
  const adminFeedback = $('#admin-auth-feedback') || $('#admin-error');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (adminFeedback) adminFeedback.textContent = 'Signing in…';
      const btn = adminLoginForm.querySelector('[type=submit]');
      if (btn) btn.disabled = true;

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
        if (btn) btn.disabled = false;
      }
    });
  }

  const adminSignoutBtn = $('#admin-signout-btn');
  if (adminSignoutBtn) {
    adminSignoutBtn.addEventListener('click', async () => {
      try { await api('/api/auth/logout', { method: 'POST' }); } catch {}
      setToken('');
      try { localStorage.removeItem('pulpoffe_user'); } catch {}
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
    if (button) button.disabled = true;
    if ($('#settings-status')) $('#settings-status').textContent = 'Saving…';
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
      if ($('#settings-status')) {
        $('#settings-status').textContent = form.elements.published.checked ? 'Saved. These contact details are now published.' : 'Saved as unpublished contact details.';
      }
    } catch (err) {
      if ($('#settings-status')) $('#settings-status').textContent = err.message;
    } finally {
      if (button) button.disabled = false;
    }
  });

  identity.then(state => {
    if (state.user && state.user.role === 'admin') {
      initAdminWorkspace(state.user);
    } else {
      if ($('#admin-auth')) $('#admin-auth').hidden = false;
      if ($('#admin-content')) $('#admin-content').hidden = true;
    }
  });
}
})();
