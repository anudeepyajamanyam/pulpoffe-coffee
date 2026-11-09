import { readFileSync, readdirSync, statSync, mkdirSync, writeFileSync, cpSync, existsSync } from 'node:fs';
import { resolve, join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = join(root, 'dist');
for(const directory of ['brand','hero']){
 const source=join(root,'public',directory);
 if(existsSync(source))cpSync(source,join(dist,directory),{recursive:true,filter:p=>!p.endsWith('.mp4')&&!p.includes('.frames-')});
}
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.woff2':'font/woff2', '.ico':'image/x-icon', '.pdf':'application/pdf' };
const assets = {};
function collect(dir) {
  for (const entry of readdirSync(dir, { withFileTypes:true })) {
    const p=join(dir,entry.name), rel=relative(dist,p).replaceAll('\\','/');
    if (rel === 'server' || rel.startsWith('server/') || rel === '.openai' || rel.startsWith('.openai/') || entry.isSymbolicLink()) continue;
    if (entry.isDirectory()) collect(p);
    else if(entry.isFile()) assets['/'+rel]={type:types[extname(p).toLowerCase()]||'application/octet-stream',body:readFileSync(p).toString('base64')};
  }
}
collect(dist);
const handler=readFileSync(join(root,'worker/index.mjs'),'utf8');
mkdirSync(join(dist,'server'),{recursive:true});
writeFileSync(join(dist,'server/index.js'),'const STATIC_ASSETS = '+JSON.stringify(assets)+';\n'+handler);
console.log(`Built Worker ESM with ${Object.keys(assets).length} embedded static assets (${statSync(join(dist,'server/index.js')).size} bytes).`);
