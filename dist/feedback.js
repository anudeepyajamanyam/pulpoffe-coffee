(()=>{
 const nativeFetch=window.fetch.bind(window);
 const indicator=document.createElement('div');indicator.className='request-loader';indicator.setAttribute('role','status');indicator.setAttribute('aria-live','polite');indicator.innerHTML='<span class="loader-bean" aria-hidden="true"></span><span>Brewing your request…</span>';document.body.append(indicator);
 let pending=0;
 window.fetch=async(...args)=>{
  pending++;indicator.classList.add('active');document.body.setAttribute('aria-busy','true');
  try{return await nativeFetch(...args);}
  finally{if(--pending===0){indicator.classList.remove('active');document.body.removeAttribute('aria-busy');}}
 };
 const observer=new MutationObserver(records=>{for(const record of records){const el=record.target;if(el.matches('button,input[type=submit]')){el.classList.toggle('is-busy',el.disabled);el.setAttribute('aria-busy',String(el.disabled));}}});
 observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['disabled']});
 document.addEventListener('click',e=>{const button=e.target.closest('button');if(!button||button.disabled)return;button.classList.add('button-pressed');setTimeout(()=>button.classList.remove('button-pressed'),180);});
})();

