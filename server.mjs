import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

class SQLiteD1 {
  constructor(database) { this.database = database; }
  prepare(sql) {
    const statement = this.database.prepare(sql);
    let args = [];
    const query = {
      bind(...values) { args = values; return query; },
      async first() { return statement.get(...args) || null; },
      async all() { return { results: statement.all(...args) }; },
      async run() {
        const r = statement.run(...args);
        return { success: true, meta: { changes: Number(r.changes) } };
      },
    };
    return query;
  }
}

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const dataDir = join(root, '.data');
mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(join(dataDir, 'pulpoffe.sqlite'));

// Run migrations if needed
if (!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='enquiries'").get()) {
  db.exec(readFileSync(join(root, 'drizzle/0000_enquiries.sql'), 'utf8'));
}
if (!db.prepare("SELECT name FROM sqlite_master WHERE name='products'").get()) {
  db.exec(readFileSync(join(root, 'drizzle/0001_store.sql'), 'utf8'));
}
if (!db.prepare("PRAGMA table_info(products)").all().some(c => c.name === 'image')) {
  db.exec(readFileSync(join(root, 'drizzle/0002_images.sql'), 'utf8'));
}
if (!db.prepare("SELECT name FROM sqlite_master WHERE name='users'").get()) {
  db.exec(readFileSync(join(root, 'drizzle/0003_auth.sql'), 'utf8'));
}

// Import worker
const { default: worker } = await import(pathToFileURL(join(root, 'dist/server/index.js')).href);

const env = {
  DB: new SQLiteD1(db),
  ADMIN_EMAILS: process.env.ADMIN_EMAILS || 'admin@pulpoffe.com',
  SIGNING_SECRET: process.env.SIGNING_SECRET || 'pulpoffe-secret-key-32-chars-minimum'
};

const port = process.env.PORT || 3000;
const host = '0.0.0.0';

const server = createServer(async (req, res) => {
  try {
    const origin = `http://${req.headers.host || '127.0.0.1:' + port}`;
    const headers = new Headers();
    for (const [name, value] of Object.entries(req.headers)) {
      if (value) headers.set(name, Array.isArray(value) ? value.join(',') : value);
    }

    let data;
    if (!['GET', 'HEAD'].includes(req.method)) {
      const chunks = [];
      let size = 0;
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 250000) {
          res.writeHead(413, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Payload too large' }));
          return;
        }
        chunks.push(chunk);
      }
      data = Buffer.concat(chunks);
    }

    const request = new Request(origin + (req.url || '/'), {
      method: req.method,
      headers,
      ...(data ? { body: data } : {})
    });

    const response = await worker.fetch(request, env, {});
    const respHeaders = Object.fromEntries(response.headers);
    res.writeHead(response.status, respHeaders);
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (err) {
    console.error('Server error:', err);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Server error' }));
  }
});

server.listen(port, host, () => {
  console.log(`Pulpoffe dynamic server running on http://${host}:${port}`);
});
