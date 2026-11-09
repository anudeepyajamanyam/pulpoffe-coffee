const SET = { count:36, neckX:.5, neckY:.5, width:.046, travel:.37, pin:350 };
const stage=document.querySelector('.film-stage');
const find=selector=>stage.querySelector(selector);
const phases=[...stage.querySelectorAll('.film-phase')];
const art=find('.stage-art'), stack=find('.stage-stack'), base=find('.stage-base'), next=find('.stage-next');
const canvas=find('.stage-stream'), ctx=canvas.getContext('2d');
const logo=find('.stage-logo'), outline=find('.stage-outline'), caption=find('figcaption');
const mobile=matchMedia('(max-width:767px)'), reduced=matchMedia('(prefers-reduced-motion:reduce)');
const clamp=value=>Math.min(1,Math.max(0,value));
const path=(type,i)=>'hero/'+type+'/'+(type==='beans'?'bean_':'stage_')+String(i+1).padStart(2,'0')+(type==='beans'?'.png':'.webp');
let sprites=[], stages=[], trigger, lenis, progress=1, staticView=true;
const clock=time=>lenis?.raf(time*1000);
function load(type,i) {
  const image=new Image();
  image.onload=()=>{if(type==='stages' && i===0) art.style.setProperty('--art-ratio',image.naturalWidth/image.naturalHeight); draw(progress);};
  image.src=path(type,i);
  return image;
}
function prepare() {
  if(stages.length)return;
  stages=Array.from({length:5},(_,i)=>load('stages',i));
  sprites=Array.from({length:6},(_,i)=>load('beans',i));
}
function drawStream(p,u) {
  if(!ctx)return;
  const w=canvas.width,h=canvas.height;
  ctx.clearRect(0,0,w,h);
  if(staticView || u<=0 || u>=1)return;
  const density=Math.sin(Math.PI*u)**.5;
  for(let i=0;i<SET.count;i++) {
    const sprite=sprites[i%6];
    if(!sprite?.naturalWidth)continue;
    const seed=i*.61803399;
    const fall=(seed+u*3.8+u*u*4)%1;
    const x=SET.neckX+Math.sin(i*13.7+fall*4)*SET.width*(.16+fall*.84);
    const y=SET.neckY+fall**1.7*(SET.travel-.25*u);
    const size=w*(.024+.012*(seed%1));
    ctx.save();
    ctx.globalAlpha=clamp(density*2-i/SET.count)*clamp(fall*15)*clamp((1-fall)*12);
    ctx.translate(x*w,y*h);ctx.rotate(seed*7+fall*(i%2?4:-5));
    if(i%8===0)ctx.filter='blur(1px)';
    ctx.drawImage(sprite,-size/2,-size/2,size,size);
    ctx.restore();
  }
  ctx.fillStyle='rgba(229,198,140,.32)';
  for(let i=0;i<16;i++) {
    const x=(i*.618+Math.sin(i+p*5)*.018)%1,y=(i*.387+1-p*.13)%1;
    ctx.beginPath();ctx.arc(x*w,y*h,Math.max(1,w*.0016),0,Math.PI*2);ctx.fill();
  }
}
function setImage(el,i) {
  const src=path('stages',i);
  if(el.getAttribute('src')!==src)el.src=src;
}
function draw(p) {
  progress=p;
  const phase=p<.14?0:p<.45?1:p<.8?2:3;
  phases.forEach((el,i)=>{
    el.hidden=i!==phase; el.inert=el.hidden; el.setAttribute('aria-hidden',String(el.hidden));
    const starts=[0,.14,.45,.8],ends=[.14,.45,.8,1];
    el.style.opacity=String(Math.max(.04,Math.min(i===0?1:clamp((p-starts[i])/.015),i===3?1:clamp((ends[i]-p)/.015))));
  });
  const u=clamp((p-.10)/.84), step=u*4, lower=Math.floor(step), blend=step-lower;
  setImage(base,lower);next.hidden=blend===0;
  if(blend>0) {
    setImage(next,lower+1);
    const edge=blend*170-35;
    next.style.maskImage='linear-gradient(to bottom,black '+(edge-35)+'%,transparent '+(edge+35)+'%)';
  }
  const reveal=staticView?1:clamp((p-.06)/.055);
  stack.style.opacity=reveal;logo.style.opacity=1-reveal;
  outline.style.opacity=(1-reveal)*clamp(p/.013);
  outline.style.strokeDashoffset=1-clamp(p/.075);
  caption.style.opacity=String(Math.max(1-reveal,clamp((p-.8)/.06)));
  art.style.transform='translateY('+((staticView?0:p-.5)*2.5)+'%)';
  const sweep=clamp((p-.2)/.2);
  const light=find('.stage-sweep');
  light.style.opacity=Math.sin(sweep*Math.PI);
  light.style.backgroundPosition=(100-200*sweep)+'% center';light.style.backgroundSize='220% 100%';
  drawStream(p,u);
}
function configure() {
  trigger?.kill();lenis?.destroy();lenis=null;
  staticView=mobile.matches || reduced.matches || navigator.connection?.saveData ||
    (navigator.hardwareConcurrency>0 && navigator.hardwareConcurrency<=4) ||
    !document.documentElement.classList.contains('motion-enabled') || !window.ScrollTrigger || !window.gsap;
  stage.classList.toggle('is-static',Boolean(staticView)); stage.classList.toggle('film-scrubbing',!staticView);
  if(staticView){draw(1);return;}
  prepare();
  stage.style.setProperty('--film-pin',SET.pin+'vh');
  gsap.registerPlugin(ScrollTrigger);
  if(window.Lenis){lenis=new Lenis({anchors:true});lenis.on('scroll',ScrollTrigger.update);}
  trigger=ScrollTrigger.create({trigger:stage,start:'top top',end:'bottom bottom',onRefresh:self=>draw(self.progress),onUpdate:self=>draw(self.progress)});
  ScrollTrigger.refresh();draw(trigger.progress);
}
base.addEventListener('load',()=>art.style.setProperty('--art-ratio',base.naturalWidth/base.naturalHeight));
new ResizeObserver(()=>{
  const ratio=Math.min(devicePixelRatio,2);
  canvas.width=Math.max(1,Math.round(canvas.clientWidth*ratio));
  canvas.height=Math.max(1,Math.round(canvas.clientHeight*ratio));draw(progress);
}).observe(art);
find('.film-skip').addEventListener('click',event=>{
  event.preventDefault();const end=document.querySelector('#film-end');
  if(lenis)lenis.scrollTo(end,{immediate:true});else end.scrollIntoView({behavior:'instant'});
  end.focus({preventScroll:true});
});
new MutationObserver(configure).observe(document.querySelector('#motion-control'),{attributes:true,attributeFilter:['aria-pressed']});
mobile.addEventListener('change',configure);reduced.addEventListener('change',configure);
window.gsap?.ticker.add(clock);
configure();
if(!staticView)fetch(logo.src).then(r=>r.text()).then(text=>{
  const svg=new DOMParser().parseFromString(text,'image/svg+xml').documentElement;
  if(svg.localName!=='svg')return;
  svg.removeAttribute('fill');
  svg.querySelectorAll('path').forEach(path=>{path.setAttribute('pathLength','1');path.style.strokeDasharray='1';});
  outline.replaceChildren(document.importNode(svg,true));
}).catch(()=>{});
