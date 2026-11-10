(()=>{
const $=s=>document.querySelector(s);
const groups={instant:'Instant coffee',flavoured:'Flavoured instant',fermented:'Fermented coffee',roasted:'Roasted coffee'};
let list=[];
let drawProducts=()=>{};
const priceText=p=>[p.pack,p.price==null?'Price on enquiry':new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(p.price)].filter(Boolean).join(' · ');
const storageKey='pulpoffe-basket-v1';let basket={};
async function loadProducts(){
let response=await fetch('/api/products').catch(()=>null);if(!response||!response.ok){response=await fetch('/api/products.json').catch(()=>null);}if(!response||!response.ok)throw Error();
list=(await response.json()).products;
try{const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))for(const p of list){const n=Number(saved[p.id]);if(Number.isInteger(n)&&n>0)basket[p.id]=Math.min(n,99);}}catch{}
persist();drawProducts();
}
loadProducts().catch(()=>{const message=$('#product-count')||$('#basket-status');if(message)message.textContent='Could not load the catalogue. Refresh to try again.';});
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(basket));}catch{}document.querySelectorAll('.basket-count').forEach(n=>n.textContent=Object.values(basket).reduce((a,b)=>a+b,0));}
const dialog=$('#basket-dialog');let basketTrigger;
document.querySelectorAll('.basket-open').forEach(b=>b.addEventListener('click',()=>{basketTrigger=b;renderBasket();dialog.showModal();document.body.style.overflow='hidden';}));
function close(){dialog.close();document.body.style.overflow='';basketTrigger?.focus();}
$('.basket-close').addEventListener('click',close);dialog.addEventListener('cancel',()=>{document.body.style.overflow='';});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
function renderBasket(){
  const host=$('#basket-items');
  host.replaceChildren();
  const entries=Object.entries(basket);
  if($('#save-basket')) $('#save-basket').disabled=!entries.length;
  if($('#buy-razorpay-btn')) $('#buy-razorpay-btn').disabled=!entries.length;
  if($('#basket-status')) $('#basket-status').textContent='';

  const token = localStorage.getItem('pulpoffe_token') || localStorage.getItem('pulpoffe-jwt');
  const badge = $('#cart-auth-notice');
  if(badge){
    if(token){
      badge.innerHTML = '<span>Signed in</span><a href="account.html">View order & blend history ?</a>';
    } else {
      badge.innerHTML = '<span>Track orders & blend brief:</span> <a href="account.html">Sign in / Register ?</a>';
    }
  }

  let subtotal = 0;
  for(const [id,n] of entries){
    const item = list.find(x=>x.id===id);
    if(item && item.price) subtotal += item.price * n;
  }
  const shipping = subtotal > 0 ? (subtotal >= 1000 ? 0 : 60) : 0;
  const grandTotal = subtotal + shipping;

  const inr = v => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:2}).format(v);
  if($('#breakdown-subtotal')) $('#breakdown-subtotal').textContent = subtotal > 0 ? inr(subtotal) : '?0.00';
  if($('#breakdown-shipping')) $('#breakdown-shipping').textContent = subtotal === 0 ? '?0.00' : (shipping === 0 ? 'FREE' : '?60.00');
  if($('#basket-total-amount')) $('#basket-total-amount').textContent = subtotal > 0 ? inr(grandTotal) : '?0.00';

  if($('#modal-subtotal')) $('#modal-subtotal').textContent = inr(subtotal);
  if($('#modal-shipping')) $('#modal-shipping').textContent = shipping === 0 ? 'FREE' : '?60.00';
  if($('#modal-grand-total')) $('#modal-grand-total').textContent = inr(grandTotal);

  if(!entries.length){const p=document.createElement('p');p.className='basket-empty';p.textContent='Your basket is waiting for a favourite.';const a=document.createElement('a');a.href='shop.html';a.className='button outline';a.textContent='Explore the coffees ↗';host.append(p,a);return;}
for(const [id,n] of entries){const p=list.find(p=>p.id===id),row=document.createElement('div');row.className='basket-item';const img=document.createElement('img');img.src=p.image||`assets/${p.group}.webp`;img.alt='';const copy=document.createElement('div'),h=document.createElement('h3'),note=document.createElement('p'),controls=document.createElement('div');h.textContent=p.name;note.textContent=priceText(p);controls.className='quantity-controls';for(const [text,label,delta] of [['−','Decrease '+p.name,-1],['+','Increase '+p.name,1]]){const b=document.createElement('button');b.textContent=text;b.setAttribute('aria-label',label);b.disabled=delta===1&&n>=99;b.addEventListener('click',()=>{const next=n+delta;if(next<=0)delete basket[id];else basket[id]=Math.min(99,next);persist();renderBasket();});controls.append(b);if(delta===-1){const amount=document.createElement('span');amount.textContent=n;amount.setAttribute('aria-label','Quantity '+n);controls.append(amount);}}const remove=document.createElement('button');remove.className='remove-item';remove.textContent='Remove';remove.setAttribute('aria-label','Remove '+p.name);remove.addEventListener('click',()=>{delete basket[id];persist();renderBasket();});controls.append(remove);copy.append(h,note,controls);row.append(img,copy);host.append(row);}}
let toastTimer;function addToBasket(p){
  basket[p.id]=Math.min(99,(basket[p.id]||0)+1);
  persist();
  const toast=$('.basket-toast');
  if(toast){
    toast.textContent=p.name+' added to your basket';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>toast.classList.remove('show'),2800);
  }
  renderBasket();
  if(!dialog.open){
    dialog.showModal();
    document.body.style.overflow='hidden';
  }
}
// Full Online Order Steps & Checkout Modal Flow
  const chkModal = $('#checkout-modal');
  const closeChkModal = () => chkModal?.close();
  $('#close-checkout-modal')?.addEventListener('click', closeChkModal);
  chkModal?.addEventListener('click', e => {
    if(e.target === chkModal){
      const r = chkModal.getBoundingClientRect();
      if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeChkModal();
    }
  });

  const buyBtn = $('#buy-razorpay-btn');
  if(buyBtn){
    buyBtn.addEventListener('click', ()=>{
      const entries = Object.entries(basket);
      if(!entries.length) return;

      const token = localStorage.getItem('pulpoffe_token') || localStorage.getItem('pulpoffe-jwt');
      if(!token){
        const proceed = confirm("Track Your Order & Blends:\n\nWould you like to sign in to save this order to your Pulpoffe account history?\n\n� Click OK to sign in / create account first\n� Click Cancel to continue as guest express checkout");
        if(proceed){
          sessionStorage.setItem('pulpoffe-enquiry-selection', entries.map(([id,n])=> n + ' � ' + (list.find(p=>p.id===id)||{}).name).join('\n'));
          location.href = 'account.html';
          return;
        }
      }

      if($('#checkout-user-status')){
        $('#checkout-user-status').textContent = token ? '? Signed In' : 'Guest Express Checkout';
      }
      
      try {
        const savedUser = JSON.parse(localStorage.getItem('pulpoffe_user') || '{}');
        if(savedUser.name && $('#chk-name')) $('#chk-name').value = savedUser.name;
        if(savedUser.email && $('#chk-email')) $('#chk-email').value = savedUser.email;
      } catch{}

      renderBasket();
      dialog.close();
      chkModal?.showModal();
    });
  }

  $('#online-checkout-form')?.addEventListener('submit', e => {
    e.preventDefault();
    const entries = Object.entries(basket);
    if(!entries.length) return;

    let subtotal = 0;
    for(const [id,n] of entries){
      const item = list.find(x=>x.id===id);
      if(item && item.price) subtotal += item.price * n;
    }
    const shipping = subtotal >= 1000 ? 0 : 60;
    const payable = subtotal + shipping;

    const name = $('#chk-name').value.trim();
    const phone = $('#chk-phone').value.trim();
    const email = $('#chk-email').value.trim();
    const address = $('#chk-address').value.trim() + ', ' + $('#chk-city').value.trim() + ', ' + $('#chk-state').value.trim() + ' - ' + $('#chk-pincode').value.trim();

    const itemsDesc = entries.map(([id,n])=>{
      const item = list.find(x=>x.id===id);
      return (item ? item.name : id) + ' � ' + n;
    }).join(', ');

    const feedback = $('#checkout-feedback');
    const payBtn = $('#modal-pay-btn');
    payBtn.disabled = true;
    feedback.textContent = 'Connecting to Razorpay secure gateway�';

    const rzpOptions = {
      key: "rzp_test_placeholderKey",
      amount: Math.round(payable * 100),
      currency: "INR",
      name: "Pulpoffe Coffee Atelier",
      description: "Order: " + itemsDesc.slice(0, 100),
      image: "assets/pulpoffe-mark-light.svg",
      prefill: {
        name: name,
        email: email,
        contact: phone
      },
      notes: {
        shipping_address: address
      },
      theme: {
        color: "#b08d57"
      },
      handler: function(resp){
        chkModal.close();
        basket = {};
        persist();
        renderBasket();
        alert('Order placed successfully!\n\nPayment Reference: ' + (resp.razorpay_payment_id || 'RZP_DEMO_OK') + '\n\nDelivering fresh Kodagu coffee to:\n' + address);
      },
      modal: {
        ondismiss: function(){
          payBtn.disabled = false;
          feedback.textContent = 'Checkout was cancelled.';
        }
      }
    };

    let opened = false;
    if(typeof Razorpay !== 'undefined'){
      try {
        const rzp = new Razorpay(rzpOptions);
        rzp.open();
        opened = true;
      } catch(err) {
        opened = false;
      }
    }

    if(!opened){
      setTimeout(()=>{
        const simSuccess = confirm(
          "PULPOFFE SECURE PAYMENT (DEMO GATEWAY)\n" +
          "----------------------------------------\n" +
          "Customer: " + name + "\n" +
          "Shipping Address: " + address + "\n" +
          "Total Payable: ?" + payable.toFixed(2) + "\n\n" +
          "Razorpay test keys require merchant verification.\n" +
          "Click OK to simulate a successful payment transaction."
        );
        payBtn.disabled = false;
        if(simSuccess){
          chkModal.close();
          const orderRef = 'PLF-' + Math.random().toString(36).substring(2,8).toUpperCase();
          basket = {};
          persist();
          renderBasket();
          alert('Payment Successful!\n\nOrder ID: ' + orderRef + '\n\nThank you, ' + name + '! Your Kodagu coffee order is now being packed.');
        } else {
          feedback.textContent = 'Payment cancelled.';
        }
      }, 400);
    }
  });

  $('#save-basket').addEventListener('click',()=>{if(!Object.keys(basket).length)return;const lines=Object.entries(basket).map(([id,n])=>`${n} × ${list.find(p=>p.id===id).name} — ${priceText(list.find(p=>p.id===id))}`);const text='PULPOFFE — COFFEE ENQUIRY\n\n'+lines.join('\n')+'\n\nPlease confirm available pack sizes, prices, shipping and payment options.\n\nThis is a saved selection, not an order or submitted enquiry. No payment has been taken.\n';const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Pulpoffe-coffee-enquiry.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#basket-status').textContent='Selection downloaded. No enquiry has been sent.';});
document.querySelectorAll('.basket-send').forEach(a=>a.addEventListener('click',()=>{try{const lines=Object.entries(basket).map(([id,n])=>`${n} × ${list.find(p=>p.id===id).name}`);sessionStorage.setItem('pulpoffe-enquiry-selection',lines.join('\n'));}catch{}}));
if($('#product-grid')){let group=new URLSearchParams(location.search).get('collection')||'all';if(!Object.hasOwn(groups,group))group='all';let term='';function render(){document.querySelectorAll('[data-shop-filter]').forEach(b=>{const on=b.dataset.shopFilter===group;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));});const selected=list.filter(p=>(group==='all'||p.group===group)&&`${p.name} ${p.note}`.toLowerCase().includes(term));const grid=$('#product-grid');grid.replaceChildren();for(const [i,p] of selected.entries()){const card=document.createElement('article');card.className='product-card';card.style.setProperty('--i',i%4);const img=document.createElement('img');img.src=p.image||`assets/${p.group}.webp`;img.alt=`Illustrative ${groups[p.group].toLowerCase()} scene`;img.loading='lazy';const copy=document.createElement('div'),category=document.createElement('p'),h=document.createElement('h2'),note=document.createElement('p'),price=document.createElement('p'),button=document.createElement('button');category.className='product-category';category.textContent=groups[p.group];h.textContent=p.name;note.className='product-note';note.textContent=p.note;price.className='product-price';price.textContent=priceText(p);button.className='add-basket';button.textContent='Add to basket +';button.setAttribute('aria-label','Add '+p.name+' to basket');button.addEventListener('click',()=>addToBasket(p));copy.append(category,h,note,price,button);card.append(img,copy);grid.append(card);}$('#product-count').textContent=`${selected.length} coffee${selected.length===1?'':'s'} to explore`;$('#no-products').hidden=!!selected.length;}
document.querySelectorAll('[data-shop-filter]').forEach(b=>b.addEventListener('click',()=>{group=b.dataset.shopFilter;const u=new URL(location.href);if(group==='all')u.searchParams.delete('collection');else u.searchParams.set('collection',group);history.replaceState(null,'',u);render();}));$('#product-search').addEventListener('input',e=>{term=e.target.value.trim().toLowerCase();render();});drawProducts=render;}
if(!$('#year').textContent)$('#year').textContent=new Date().getFullYear();
if(!$('#blend-form')){const menu=$('#menu-toggle');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));$('#mobile-menu').hidden=open;});}
// Scroll-linked movement runs on every section, with repeated reveals on re-entry.
const preference=matchMedia('(prefers-reduced-motion: reduce)');let motionPaused=preference.matches;const control=$('#motion-control');
const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('visible',e.isIntersecting)),{threshold:.09,rootMargin:'0px 0px -20px 0px'});
document.querySelectorAll('.reveal').forEach((el,i)=>{el.style.setProperty('--reveal-delay',`${i%2*100}ms`);observer.observe(el);});
function motionState(){document.documentElement.classList.toggle('motion-enabled',!motionPaused);control.setAttribute('aria-pressed',String(motionPaused));control.innerHTML=motionPaused?'Resume animations <span>▷</span>':'Pause animations <span>Ⅱ</span>';if(motionPaused)document.querySelectorAll('.hero-image,.story-art>img,.craft-image>img,.closing>img,.word-ribbon').forEach(el=>el.style.transform='');updateScroll();}
control.addEventListener('click',()=>{motionPaused=!motionPaused;motionState();});preference.addEventListener('change',e=>{motionPaused=e.matches;motionState();});
let pending=false;function updateScroll(){const y=scrollY;$('.progress').style.width=`${y/Math.max(1,document.documentElement.scrollHeight-innerHeight)*100}%`;if(!motionPaused){for(const selector of ['.hero-image','.story-art>img','.craft-image>img','.closing>img']){const img=$(selector);if(!img)continue;const parent=img.parentElement,r=parent.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){const p=(innerHeight/2-(r.top+r.height/2))/innerHeight;img.style.transform=`translateY(${p*42}px) scale(1.08)`;}}const ribbon=$('.word-ribbon');if(ribbon){const r=ribbon.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)ribbon.style.transform=`translateX(${(innerHeight/2-r.top)*-.12}px)`;}}pending=false;}
addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(updateScroll);}},{passive:true});motionState();
})();

