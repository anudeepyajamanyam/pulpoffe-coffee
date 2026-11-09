const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};
const STATUS_VALUES = new Set(['new', 'contacted', 'quoted', 'closed']);
const MAX_BODY_BYTES = 16384;
const DEFAULT_CONTACT = { email:'', phone:'', address:'Kodagu, Karnataka, India', published:false };
const CUSTOMER_FIELDS = 'id, type, name, email, company, phone, interest, volume, message, status, created_at AS createdAt, updated_at AS updatedAt';
const ADMIN_FIELDS = `${CUSTOMER_FIELDS}, user_id AS userId, account_email AS accountEmail`;

function json(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...SECURITY_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders
    }
  });
}

// Native Web Crypto PBKDF2 Password Hashing (Zero external dependencies)
async function hashPassword(password, salt = crypto.randomUUID()) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: enc.encode(salt),
    iterations: 50000,
    hash: 'SHA-256'
  }, key, 256);
  const hashHex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${salt}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt] = stored.split(':');
  const computed = await hashPassword(password, salt);
  return computed === stored;
}

async function userFor(request, env) {
  if (!env.DB?.prepare) return null;
  let token = null;
  const authHeader = request.headers.get('Authorization') || '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else {
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(/(?:^|;\s*)pulpoffe_token=([^;]+)/);
    if (match) token = decodeURIComponent(match[1]);
  }
  if (!token) return null;

  try {
    const now = new Date().toISOString();
    const row = await env.DB.prepare(
      `SELECT u.id, u.name, u.email, u.role FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ? AND s.expires_at > ?`
    ).bind(token, now).first();

    if (!row) return null;

    const admins = String(env.ADMIN_EMAILS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
    const role = admins.includes(row.email.toLowerCase()) ? 'admin' : (row.role || 'customer');
    return { id: row.id, name: row.name, email: row.email, role, token };
  } catch {
    return null;
  }
}

function sameOrigin(request) {
  const origin = request.headers.get('Origin');
  const source = request.headers.get('Sec-Fetch-Site');
  return !origin || origin === new URL(request.url).origin || source === 'same-origin';
}

async function readBody(request, limit = MAX_BODY_BYTES) {
  if (!/^application\/json(?:\s*;|$)/i.test(request.headers.get('Content-Type') || '')) {
    return { error: json({ error: 'Send this request as JSON.' }, 415) };
  }
  const declaredLength = Number(request.headers.get('Content-Length'));
  if (declaredLength > limit) return { error: json({ error: 'Your message is too long.' }, 413) };
  const reader = request.body?.getReader();
  if (!reader) return { error: json({ error: 'Please complete the required fields.' }, 400) };
  let bytes = 0, parts = [];
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) { await reader.cancel(); return { error: json({ error: 'Your message is too long.' }, 413) }; }
      parts.push(value);
    }
    const joined = new Uint8Array(bytes); let offset = 0;
    for (const part of parts) { joined.set(part, offset); offset += part.length; }
    const value = JSON.parse(new TextDecoder().decode(joined));
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Invalid body');
    return { value };
  } catch { return { error: json({ error: 'Please send a valid enquiry.' }, 400) }; }
}

function validateEnquiry(value) {
  const text = key => typeof value[key] === 'string' ? value[key].trim() : '';
  const item = Object.fromEntries(['name','email','company','phone','interest','volume','message'].map(k => [k, text(k)]));
  item.type = text('type').toLowerCase();
  if (text('website')) return { error: 'Please leave the website field empty.' };
  if (!['b2b','contact'].includes(item.type)) return { error: 'Choose an enquiry type.' };
  if (item.name.length < 2 || item.name.length > 100) return { error: 'Enter your name using 2–100 characters.' };
  if (item.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) return { error: 'Enter a valid email address.' };
  if (item.type === 'b2b' && item.company.length < 2) return { error: 'Enter your company name.' };
  if (item.company.length > 160 || item.interest.length > 300 || item.volume.length > 100) return { error: 'Please shorten your company or product details.' };
  if (item.phone && !/^[+()\d\s.\-]{7,30}$/.test(item.phone)) return { error: 'Enter a valid phone number, or leave it empty.' };
  if (item.message.length < 10 || item.message.length > 3000) return { error: 'Enter a message using 10–3,000 characters.' };
  if (value.consent !== true) return { error: 'Please agree to being contacted about this enquiry.' };
  return { item };
}

const groups = ['instant','flavoured','fermented','roasted'];
const siteDefaults = {
  headline:'Rooted in earth.\nCrafted for\nyour cup.',
  intro:'Good coffee begins long before the first sip. Discover a world of flavour, from our roots to your ritual.',
  storyTitle:'Every great cup has deep roots.',
  story:'Ours begin in Kodagu, Karnataka. A place where coffee is part of the landscape, the livelihood, and the everyday.',
  instagram:'', facebook:'', linkedin:'', youtube:''
};

async function management(request, env, path, user) {
  const db = env.DB;
  if (!db?.prepare) return json({error:'The store is temporarily unavailable.'},503);
  if (path.startsWith('/api/admin/')) {
    if (!user) return json({error:'Sign in to continue.'},401);
    if (user.role !== 'admin') return json({error:'Administrator access required.'},403);
  }
  if (request.method === 'GET') {
    if (path === '/api/products') {
      const rows = await db.prepare('SELECT id, category AS "group", name, note, pack, price, image FROM products ORDER BY rowid').all();
      return json({products:rows.results});
    }
    if (path === '/api/site-content') {
      const row = await db.prepare("SELECT value FROM site_settings WHERE key='content'").first();
      return json({...siteDefaults,...(row ? JSON.parse(row.value) : {})});
    }
    if (path === '/api/admin/people') {
      const rows = await db.prepare('SELECT name,email,first_seen,last_seen FROM portal_accounts ORDER BY last_seen DESC').all();
      return json({people:rows.results});
    }
  }
  if (!path.startsWith('/api/admin/')) return json({error:'Unsupported action.'},405);
  if (!sameOrigin(request)) return json({error:'Reload the page and try again.'},403);
  const productPath = /^\/api\/admin\/products(?:\/([\w-]+))?$/.exec(path);
  const id = productPath?.[1];
  if (id && request.method === 'DELETE') {
    const result = await db.prepare('DELETE FROM products WHERE id=?').bind(id).run();
    return result.meta.changes ? json({removed:true}) : json({error:'Product no longer exists.'},404);
  }
  const payload = await readBody(request,180000);
  if (payload.error) return payload.error;
  const value = payload.value;
  if (productPath && ((!id && request.method === 'POST') || (id && request.method === 'PUT'))) {
    const {group,name,note,pack,price} = value;
    if (!groups.includes(group) || typeof name !== 'string' || !name.trim() || name.length>140 ||
        typeof note !== 'string' || note.length>600 || typeof pack !== 'string' || pack.length>80 ||
        (price !== null && (!Number.isFinite(price) || price <= 0 || price>10000000 || Math.abs(price*100-Math.round(price*100))>.00001)))
      return json({error:'Check the product name, collection, pack and INR price.'},400);
    let image=value.image;
    if(image===undefined && id){image=(await db.prepare('SELECT image FROM products WHERE id=?').bind(id).first())?.image||'';}
    image=image||'';
    if(typeof image!=='string'||image.length>160000||(image&&!/^data:image\/(jpeg|webp);base64,[A-Za-z0-9+/]+=*$/.test(image))) return json({error:'Choose a JPEG or WebP product image.'},400);
    if(image){const bytes=atob(image.split(',')[1]);if(!(bytes.startsWith('\xff\xd8\xff')||(bytes.startsWith('RIFF')&&bytes.slice(8,12)==='WEBP')))return json({error:'Invalid image file.'},400);}
    const fields=[group,name.trim(),note.trim(),pack.trim(),price,image];
    if (id) {
      const result=await db.prepare('UPDATE products SET category=?,name=?,note=?,pack=?,price=?,image=? WHERE id=?').bind(...fields,id).run();
      return result.meta.changes ? json({id}) : json({error:'Product no longer exists.'},404);
    }
    const newId=crypto.randomUUID();
    await db.prepare('INSERT INTO products(category,name,note,pack,price,image,id) VALUES(?,?,?,?,?,?,?)').bind(...fields,newId).run();
    return json({id:newId},201);
  }
  if (path==='/api/admin/site-content' && request.method==='PUT') {
    const copy={};
    for (const key of Object.keys(siteDefaults)) {
      const field=value[key];
      if(typeof field!=='string'||field.length>1200) return json({error:'Check the website content fields.'},400);
      copy[key]=field.trim();
      if(siteDefaults[key] && !copy[key]) return json({error:'Homepage text is required.'},400);
      if(!siteDefaults[key] && copy[key]) {
        try { if(new URL(copy[key]).protocol!=='https:') throw Error(); }
        catch { return json({error:'Use a complete HTTPS address for social profiles.'},400); }
      }
    }
    await db.prepare("INSERT INTO site_settings(key,value,updated_at) VALUES('content',?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at").bind(JSON.stringify(copy),new Date().toISOString()).run();
    return json(copy);
  }
  return json({error:'Unsupported action.'},405);
}

async function api(request, env, path) {
  const user = await userFor(request, env);

  // ── Authentication Endpoints ──
  if (path === '/api/auth/register' && request.method === 'POST') {
    if (!env.DB?.prepare) return json({ error: 'Database service unavailable.' }, 503);
    const payload = await readBody(request);
    if (payload.error) return payload.error;
    const { name, email, password } = payload.value || {};

    if (typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return json({ error: 'Please enter a name between 2 and 100 characters.' }, 400);
    }
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return json({ error: 'Please enter a valid email address.' }, 400);
    }
    if (typeof password !== 'string' || password.length < 6 || password.length > 100) {
      return json({ error: 'Password must be at least 6 characters long.' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(cleanEmail).first();
    if (existing) {
      return json({ error: 'An account with this email address already exists. Please sign in.' }, 409);
    }

    const admins = String(env.ADMIN_EMAILS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
    const role = admins.includes(cleanEmail) ? 'admin' : 'customer';
    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();
    const now = new Date().toISOString();

    await env.DB.prepare(
      'INSERT INTO users (id, name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(userId, name.trim(), cleanEmail, passwordHash, role, now).run();

    // Create session (valid for 30 days)
    const token = crypto.randomUUID() + '-' + crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
    await env.DB.prepare(
      'INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
    ).bind(token, userId, expiresAt, now).run();

    // Update portal_accounts registry
    await env.DB.prepare(
      'INSERT INTO portal_accounts(id,name,email,first_seen,last_seen) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,email=excluded.email,last_seen=excluded.last_seen'
    ).bind(userId, name.trim(), cleanEmail, now, now).run();

    const cookieHeader = `pulpoffe_token=${encodeURIComponent(token)}; Path=/; Max-Age=2592000; SameSite=Lax; HttpOnly`;
    return json({
      token,
      user: { id: userId, name: name.trim(), email: cleanEmail, role }
    }, 201, { 'Set-Cookie': cookieHeader });
  }

  if (path === '/api/auth/login' && request.method === 'POST') {
    if (!env.DB?.prepare) return json({ error: 'Database service unavailable.' }, 503);
    const payload = await readBody(request);
    if (payload.error) return payload.error;
    const { email, password } = payload.value || {};

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return json({ error: 'Please enter your email and password.' }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const row = await env.DB.prepare('SELECT id, name, email, password_hash, role FROM users WHERE email = ?').bind(cleanEmail).first();
    if (!row || !(await verifyPassword(password, row.password_hash))) {
      return json({ error: 'Invalid email or password.' }, 401);
    }

    const admins = String(env.ADMIN_EMAILS || '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
    const role = admins.includes(cleanEmail) ? 'admin' : (row.role || 'customer');
    const token = crypto.randomUUID() + '-' + crypto.randomUUID();
    const now = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();

    await env.DB.prepare(
      'INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)'
    ).bind(token, row.id, expiresAt, now).run();

    await env.DB.prepare(
      'INSERT INTO portal_accounts(id,name,email,first_seen,last_seen) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,email=excluded.email,last_seen=excluded.last_seen'
    ).bind(row.id, row.name, cleanEmail, now, now).run();

    const cookieHeader = `pulpoffe_token=${encodeURIComponent(token)}; Path=/; Max-Age=2592000; SameSite=Lax; HttpOnly`;
    return json({
      token,
      user: { id: row.id, name: row.name, email: cleanEmail, role }
    }, 200, { 'Set-Cookie': cookieHeader });
  }

  if (path === '/api/auth/logout' && request.method === 'POST') {
    if (user?.token && env.DB?.prepare) {
      await env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(user.token).run();
    }
    const cookieHeader = 'pulpoffe_token=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly';
    return json({ success: true }, 200, { 'Set-Cookie': cookieHeader });
  }

  if (path === '/api/me' && request.method === 'GET') {
    if (user && env.DB?.prepare) {
      const now = new Date().toISOString();
      await env.DB.prepare('INSERT INTO portal_accounts(id,name,email,first_seen,last_seen) VALUES(?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET name=excluded.name,email=excluded.email,last_seen=excluded.last_seen').bind(user.id, user.name, user.email, now, now).run();
    }
    return json({ authenticated: !!user, user });
  }

  if (['/api/products','/api/site-content','/api/admin/people','/api/admin/site-content'].includes(path) || /^\/api\/admin\/products(?:\/|$)/.test(path)) {
    return management(request, env, path, user);
  }

  if (path === '/api/contact-settings' && request.method === 'GET') {
    if (!env.DB?.prepare) return json(DEFAULT_CONTACT);
    const row = await env.DB.prepare('SELECT value FROM site_settings WHERE key = ?').bind('contact').first();
    const contact = row ? JSON.parse(row.value) : DEFAULT_CONTACT;
    return json(contact.published ? contact : DEFAULT_CONTACT);
  }

  if (path === '/api/admin/contact-settings') {
    if (!user) return json({ error:'Sign in to continue.' }, 401);
    if (user.role !== 'admin') return json({ error:'Administrator access is required.' }, 403);
    if (!env.DB?.prepare) return json({ error:'Contact settings are temporarily unavailable.' }, 503);
    if (request.method === 'GET') {
      const row = await env.DB.prepare('SELECT value FROM site_settings WHERE key = ?').bind('contact').first();
      return json(row ? JSON.parse(row.value) : DEFAULT_CONTACT);
    }
    if (request.method !== 'PATCH') return json({ error:'This action is not supported.' }, 405);
    if (!sameOrigin(request)) return json({ error:'This request could not be verified. Reload the page and try again.' }, 403);
    const payload = await readBody(request); if (payload.error) return payload.error;
    const value = payload.value;
    const contact = { email:typeof value.email==='string'?value.email.trim():'', phone:typeof value.phone==='string'?value.phone.trim():'', address:typeof value.address==='string'?value.address.trim():'', published:value.published===true };
    if (contact.email && (contact.email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))) return json({error:'Enter a valid business email address.'},400);
    if (contact.phone && !/^[+()\d\s.\-]{7,40}$/.test(contact.phone)) return json({error:'Enter a valid business phone number.'},400);
    if (contact.address.length>500) return json({error:'Keep the business address within 500 characters.'},400);
    const domain = contact.email.split('@')[1]?.toLowerCase()||'';
    const reserved = /\.(example|invalid|test|localhost)$/.test(domain)||['example.com','example.org','example.net'].some(x=>domain===x||domain.endsWith('.'+x));
    const digits = contact.phone.replace(/\D/g,'');
    if (contact.published && (!contact.email&&!contact.phone || reserved || (contact.phone && (/^0+$/.test(digits)||/^910+$/.test(digits))))) {
      return json({error:'Replace sample contact details with your business contact information before publishing.'},400);
    }
    await env.DB.prepare('INSERT INTO site_settings (key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at').bind('contact',JSON.stringify(contact),new Date().toISOString()).run();
    return json(contact);
  }

  const adminRoute = path === '/api/admin/enquiries' || path.startsWith('/api/admin/enquiries/');
  const enquiryRoute = path === '/api/enquiries';
  if (!adminRoute && !enquiryRoute) return json({ error: 'Not found.' }, 404);
  if (!user) return json({ error: 'Sign in to continue.' }, 401);
  if (adminRoute && user.role !== 'admin') return json({ error: 'Administrator access is required.' }, 403);
  if (!env.DB?.prepare) return json({ error: 'Enquiries are temporarily unavailable. Please try again shortly.' }, 503);

  if (request.method === 'GET') {
    if (path !== '/api/enquiries' && path !== '/api/admin/enquiries') return json({ error: 'Not found.' }, 404);
    const query = adminRoute
      ? env.DB.prepare(`SELECT ${ADMIN_FIELDS} FROM enquiries ORDER BY created_at DESC, id DESC`)
      : env.DB.prepare(`SELECT ${CUSTOMER_FIELDS} FROM enquiries WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT 100`).bind(user.id);
    const result = await query.all();
    return json({ enquiries: result.results || [] });
  }

  if (!sameOrigin(request)) return json({ error: 'This request could not be verified. Reload the page and try again.' }, 403);

  if (path === '/api/enquiries' && request.method === 'POST') {
    const payload = await readBody(request); if (payload.error) return payload.error;
    const validation = validateEnquiry(payload.value); if (validation.error) return json({ error: validation.error }, 400);
    const since = new Date(Date.now() - 3600000).toISOString();
    const count = await env.DB.prepare('SELECT COUNT(*) AS count FROM enquiries WHERE user_id = ? AND created_at > ?').bind(user.id, since).first();
    if (Number(count?.count) >= 20) return json({ error: 'You have sent several enquiries recently. Please try again later.' }, 429);
    const item = validation.item, id = crypto.randomUUID(), now = new Date().toISOString();
    await env.DB.prepare('INSERT INTO enquiries (id,user_id,account_email,type,name,email,company,phone,interest,volume,message,consent,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
      .bind(id, user.id, user.email, item.type, item.name, item.email, item.company, item.phone, item.interest, item.volume, item.message, 1, 'new', now, now).run();
    return json({ id, status: 'new', createdAt: now }, 201);
  }

  if (adminRoute && request.method === 'PATCH') {
    const id = path.slice('/api/admin/enquiries/'.length);
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return json({ error: 'Not found.' }, 404);
    const payload = await readBody(request); if (payload.error) return payload.error;
    if (!STATUS_VALUES.has(payload.value.status)) return json({ error: 'Choose a valid enquiry status.' }, 400);
    const existing = await env.DB.prepare('SELECT id FROM enquiries WHERE id = ?').bind(id).first();
    if (!existing) return json({ error: 'Not found.' }, 404);
    const now = new Date().toISOString();
    await env.DB.prepare('UPDATE enquiries SET status = ?, updated_at = ? WHERE id = ?').bind(payload.value.status, now, id).run();
    return json({ id, status: payload.value.status, updatedAt: now });
  }

  return json({ error: 'This action is not supported.' }, 405);
}

function staticResponse(request, path) {
  let key = path === '/' ? '/index.html' : path;
  if (!key.includes('.') && !key.endsWith('/')) key += '.html';
  const asset = typeof STATIC_ASSETS !== 'undefined' ? STATIC_ASSETS[key] : null;
  if (!asset) return new Response('Page not found.', { status: 404, headers: SECURITY_HEADERS });
  if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed.', { status: 405, headers: SECURITY_HEADERS });
  const binary = atob(asset.body), bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Response(request.method === 'HEAD' ? null : bytes, {
    headers: {
      ...SECURITY_HEADERS,
      'Content-Type': asset.type,
      'Cache-Control': key.startsWith('/assets/') ? 'public, max-age=3600' : 'no-cache'
    }
  });
}

export default {
  async fetch(request, env = {}) {
    try {
      const path = new URL(request.url).pathname;
      if (path.startsWith('/api/')) return await api(request, env, path);
      return staticResponse(request, path);
    } catch {
      return json({ error: 'We could not complete that request. Please try again.' }, 500);
    }
  }
};
