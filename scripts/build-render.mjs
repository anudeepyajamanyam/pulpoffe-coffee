import { cpSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const destination = 'render-public';
mkdirSync(destination, {recursive:true});
// Authenticated pages stay on the origin that owns the ChatGPT session.
const hostedPages = new Set(['account.html','admin.html','contact.html','shop.html']);
for (const entry of readdirSync('dist',{withFileTypes:true})) {
  if (entry.name === 'server' || entry.name.startsWith('.') || hostedPages.has(entry.name)) continue;
  cpSync(join('dist',entry.name),join(destination,entry.name),{recursive:true});
}
