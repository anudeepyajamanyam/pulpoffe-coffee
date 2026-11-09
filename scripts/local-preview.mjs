// Local development only. Production identity is supplied by Sites dispatch.
import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
export class PreviewD1 {
  constructor(database) { this.database=database; }
  prepare(sql) {
    const statement=this.database.prepare(sql); let args=[];
    const query={
      bind(...values){ args=values; return query; },
      async first(){ return statement.get(...args)||null; },
      async all(){ return {results:statement.all(...args)}; },
      async run(){ const r=statement.run(...args); return {success:true,meta:{changes:Number(r.changes)}}; },
    };
    return query;
  }
}
if(process.argv[1]&&pathToFileURL(resolve(process.argv[1])).href===import.meta.url){
  const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
  const dbDir=resolve(root,'../../work/pulpoffe-preview');mkdirSync(dbDir,{recursive:true});
  const db=new DatabaseSync(join(dbDir,'enquiries.sqlite'));
  // The preview applies source schema only to an empty, local QA database.
  if(!db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='enquiries'").get())db.exec(readFileSync(join(root,'drizzle/0000_enquiries.sql'),'utf8'));
  if(!db.prepare("SELECT name FROM sqlite_master WHERE name='products'").get()) db.exec(readFileSync(join(root,'drizzle/0001_store.sql'),'utf8'));
  if(!db.prepare("PRAGMA table_info(products)").all().some(c=>c.name==='image'))db.exec(readFileSync(join(root,'drizzle/0002_images.sql'),'utf8'));
  const {default:worker}=await import(pathToFileURL(join(root,'dist/server/index.js')).href+'?v='+Date.now());
  const fixture=process.argv.includes('--test-user');
  const env={DB:new PreviewD1(db),ADMIN_EMAILS:process.env.ADMIN_EMAILS||''};
  const server=createServer(async(req,res)=>{
    try{
      const origin='http://127.0.0.1:4173';
      const headers=new Headers();for(const [name,value] of Object.entries(req.headers)){if(value&&!name.startsWith('oai-authenticated-'))headers.set(name,Array.isArray(value)?value.join(','):value);}
      if(fixture){headers.set('oai-authenticated-user-id','local-preview-user');headers.set('oai-authenticated-user-email','local-customer@example.test');headers.set('oai-authenticated-user-full-name','Local%20preview%20customer');headers.set('oai-authenticated-user-full-name-encoding','percent-encoded-utf-8');}
      let data; if(!['GET','HEAD'].includes(req.method)){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>180000){res.writeHead(413);res.end('Request too large');return;}chunks.push(chunk);}data=Buffer.concat(chunks);}
      const request=new Request(origin+(req.url||'/'),{method:req.method,headers,...(data?{body:data}:{} )});
      const response=await worker.fetch(request,env,{});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));
    }catch{res.writeHead(500);res.end('Local preview failed.');}
  });
  server.listen(4173,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:4173/ (${fixture?'explicit local QA identity':'anonymous; no login simulation'})`));
}
