import { cpSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const destination = 'render-public';
mkdirSync(destination, {recursive:true});

for (const entry of readdirSync('dist',{withFileTypes:true})) {
  if (entry.name === 'server' || entry.name.startsWith('.')) continue;
  cpSync(join('dist',entry.name),join(destination,entry.name),{recursive:true});
}
console.log('Copied all public static assets to render-public/');
