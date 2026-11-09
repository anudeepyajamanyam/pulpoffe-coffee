(()=>{
const $=s=>document.querySelector(s);
const status=$('#desk-status'),productForm=$('#product-editor'),copyForm=$('#copy-editor');
const names={overview:'overview',products:'products',content:'content-editor',settings:'settings',people:'people',inbox:'inbox'};
let products=[],editing=null,image="";
const modal=$("#product-modal");
const closeEditor=()=>modal.close();
async function api(path,method='GET',value){
  const res=await fetch('/api/'+path,{method,headers:value?{'Content-Type':'application/json'}:{},body:value?JSON.stringify(value):undefined});
  const data=await res.json();if(!res.ok)throw Error(data.error||'Request failed.');return data;
}
function element(tag,text,className){const n=document.createElement(tag);n.textContent=text;if(className)n.className=className;return n;}
function button(label,action){const n=element('button',label);n.type='button';n.onclick=action;return n;}
function openProduct(p){
  editing=p?.id||null;productForm.reset();image=p?.image||'';previewImage();$('#product-feedback').textContent='';
  for(const key of ['name','group','note','pack','price'])productForm.elements[key].value=p?.[key]??(key==='group'?'instant':'');
  $('#editor-title').textContent=p?'Edit product':'New product';modal.showModal();
  productForm.elements.name.required=true;productForm.elements.name.focus();
}
async function refreshProducts(){
  products=(await api('products')).products;
  const list=$('#stock-list');list.replaceChildren();
  for(const p of products){
    const row=element('article','','desk-row'),copy=element('div',''),actions=element('div','');
    copy.append(element('strong',p.name),element('small',[p.group,p.pack,p.price==null?'Price on enquiry':'₹'+p.price].filter(Boolean).join(' · ')));
    actions.append(button('Edit',()=>openProduct(p)),button('Remove',async()=>{
      if(!confirm('Remove '+p.name+' from the catalogue?'))return;
      try{await api('admin/products/'+p.id,'DELETE');if(editing===p.id)closeEditor();await refreshProducts();status.textContent='Product removed.';}catch(e){status.textContent=e.message;}
    })); row.append(copy,actions);list.append(row);
  }
}
async function show(view){
  const id=names[view];if(!id)return;
  for(const name of Object.values(names))$('#admin-'+name).hidden=name!==id;
  document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
  status.textContent='';
  try{
    if(view==='products')await refreshProducts();
    if(view==='inbox')$('#refresh-inbox').click();
    if(view==='content'){const copy=await api('site-content');for(const [key,value] of Object.entries(copy))copyForm.elements[key].value=value;}
    if(view==='people'){
      const {people}=await api('admin/people'),list=$('#people-list');list.replaceChildren();
      for(const p of people){const row=element('article','','desk-row'),who=element('div',''),dates=element('div','');
        who.append(element('strong',p.name),element('small',p.email));dates.append(element('small','First visit · '+new Date(p.first_seen).toLocaleString()),element('small','Latest visit · '+new Date(p.last_seen).toLocaleString()));row.append(who,dates);list.append(row);}
      if(!people.length)list.textContent='No signed-in visits recorded yet.';
    }
    if(view==='overview'){
      const [catalogue,inbox,accounts]=await Promise.all([api('products'),api('admin/enquiries'),api('admin/people')]);
      const cards=$('#overview-cards');cards.replaceChildren();
      for(const [section,label,count] of [['products','Products',catalogue.products.length],['inbox','New enquiries',inbox.enquiries.filter(r=>r.status==='new').length],['people','Signed-in accounts',accounts.people.length]]){
        const b=button('',()=>show(section));b.className='desk-stat';b.append(element('strong',count),element('span',label));cards.append(b);}
    }
  }catch(e){status.textContent=e.message;}
}
for(const b of document.querySelectorAll('[data-view]'))b.onclick=()=>show(b.dataset.view);
function previewImage(){const preview=$('#product-preview');preview.src=image||'assets/instant.webp';$('#remove-image').disabled=!image;}
$('#close-product').onclick=closeEditor;
$('#remove-image').onclick=()=>{image='';previewImage();};
$('#product-image').onchange=async e=>{
 const file=e.target.files[0];if(!file)return;const priorImage=image;
 const feedback=$('#image-feedback');feedback.textContent='Preparing image…';
 try{
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>12000000)throw Error('Choose a JPEG, PNG or WebP under 12 MB.');
  const bitmap=await createImageBitmap(file),canvas=document.createElement('canvas'),scale=Math.min(1,640/Math.max(bitmap.width,bitmap.height));
  canvas.width=Math.round(bitmap.width*scale);canvas.height=Math.round(bitmap.height*scale);
  const ctx=canvas.getContext('2d');ctx.fillStyle='#f5efe4';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
  image=canvas.toDataURL('image/jpeg',.72);if(image.length>160000)image=canvas.toDataURL('image/jpeg',.4);
  if(image.length>160000)throw Error('Choose a simpler or smaller product image.');
  previewImage();feedback.textContent='Image ready. Save the product to publish.';
 }catch(err){image=priorImage;feedback.textContent=err.message;}
};
$('#add-product').onclick=()=>openProduct(null);
$('#cancel-product').onclick=()=>{closeEditor();};
productForm.onsubmit=async e=>{
  e.preventDefault();const data=Object.fromEntries(new FormData(productForm));data.price=data.price===''?null:Number(data.price);data.image=image;
  const submit=e.submitter;submit.disabled=true;submit.classList.add('is-busy');
  try{await api('admin/products'+(editing?'/'+editing:''),editing?'PUT':'POST',data);closeEditor();await refreshProducts();status.textContent='Catalogue updated.';}
  catch(err){status.textContent=err.message;$('#product-feedback').textContent=err.message;}finally{submit.disabled=false;submit.classList.remove("is-busy");}
};
copyForm.onsubmit=async e=>{e.preventDefault();const submit=e.submitter;submit.disabled=true;
  try{await api('admin/site-content','PUT',Object.fromEntries(new FormData(copyForm)));status.textContent='Website changes published.';}
  catch(err){status.textContent=err.message;}finally{submit.disabled=false;submit.classList.remove("is-busy");}
};
const dashboard=$('#admin-content');
const observer=new MutationObserver(()=>{if(!dashboard.hidden){observer.disconnect();show('overview');}});
observer.observe(dashboard,{attributes:true,attributeFilter:['hidden']});
})();
