(() => {
  const hero = document.querySelector('.hero');
  const original = hero?.querySelector('.hero-image');
  if (!hero || !original || hero.closest('.hero-stage')) return;

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 640px)');
  const clamp = n => Math.max(0, Math.min(1, n));
  const segment = (p, start, end) => clamp((p - start) / (end - start));
  const smooth = n => n * n * (3 - 2 * n);

  const stage = document.createElement('div');
  stage.className = 'hero-stage';
  hero.before(stage);
  stage.append(hero);

  // These two image layers use the existing artwork. CSS masks separate the
  // still cup from the upper splash, so there is no video or image sequence.
  const cinema = document.createElement('div');
  cinema.className = 'hero-cinema';
  cinema.setAttribute('aria-hidden', 'true');
  const cup = document.createElement('img');
  cup.src = original.currentSrc || original.src;
  cup.alt = '';
  cup.className = 'hero-cup-photo';
  cup.decoding = 'async';
  const splash = cup.cloneNode();
  splash.className = 'hero-splash-photo';
  const beanLayer = document.createElement('div');
  beanLayer.className = 'hero-falling-beans';
  const ripple = document.createElement('span');
  ripple.className = 'hero-coffee-ripple';
  cinema.append(beanLayer, cup, splash, ripple);
  const shade = hero.querySelector('.hero-shade');
  if (shade) shade.before(cinema); else hero.prepend(cinema);

  const beans = Array.from({ length: 18 }, (_, i) => {
    const bean = document.createElement('span');
    bean.className = 'hero-falling-bean';
    bean.style.setProperty('--bean-size', `${13 + i % 4 * 3}px`);
    bean.style.setProperty('--bean-light', String(.78 + i % 4 * .11));
    beanLayer.append(bean);
    return { bean, i, rotation: i * 47 - 80, offset: ((i * 17) % 53 - 26) / 100 };
  });

  const timeline = document.createElement('div');
  timeline.className = 'hero-timeline';
  timeline.setAttribute('aria-label', 'Coffee story: the cup, beans fall, coffee rises, enjoy the moment');
  const steps = ['The cup', 'The beans', 'The splash', 'Your moment'];
  const labels = steps.map((title, i) => {
    const label = document.createElement('span');
    const number = document.createElement('b');
    number.textContent = String(i + 1).padStart(2, '0');
    const text = document.createElement('span');
    text.textContent = title;
    label.append(number, text);
    timeline.append(label);
    return label;
  });
  hero.append(timeline);
  const hint = hero.querySelector('.scroll-link');
  if (hint) {
    const arrow = document.createElement('span');
    arrow.textContent = '↓';
    hint.replaceChildren(arrow, document.createTextNode(' SCROLL TO BREW THE MOMENT'));
  }

  let pending = false;
  let previous = -1;
  let target = 0;
  let rendered = 0;
  let lastTime = 0;
  let paused = false;

  function measure() {
    const rect = stage.getBoundingClientRect();
    const travel = Math.max(200, rect.height - hero.getBoundingClientRect().height);
    target = clamp(-rect.top / travel);
  }

  function draw(p) {
    if (Math.abs(p - previous) < .0001) return;
    previous = p;
    const m = mobile.matches;
    const cx = m ? 61 : 74;
    const arrive = smooth(segment(p, 0, .11));
    const splashRise = smooth(segment(p, .38, .57));
    const splashFall = smooth(segment(p, .65, .84));
    const finish = smooth(segment(p, .85, 1));
    const cupDrop = finish * (m ? 145 : 220);
    hero.dataset.brewPhase = p < .14 ? 'cup' : p < .42 ? 'beans' : p < .85 ? 'splash' : 'moment';
    hero.style.setProperty('--brew-progress', p.toFixed(4));
    cinema.style.setProperty('--cup-x', `${cx}%`);
    cup.style.transform = `translate3d(0,${(1 - arrive) * 30 + cupDrop}px,0)`;
    cup.style.opacity = String((.88 + arrive * .12) * (1 - finish * .7));
    // The splash grows out of the rim, then contracts and falls back toward it.
    splash.style.transform = `translate3d(0,${(1 - splashRise) * 115 + splashFall * 105 + cupDrop}px,0) scaleY(${.52 + splashRise * .48 - splashFall * .34})`;
    splash.style.opacity = String(splashRise * (1 - splashFall));
    const rippleAmount = Math.sin(clamp(segment(p, .36, .68)) * Math.PI);
    ripple.style.opacity = String(rippleAmount * .8);
    ripple.style.transform = `translate(-50%,-50%) scale(${.7 + segment(p, .36, .68) * .6},${.7 + segment(p, .36, .68) * .6})`;

    beans.forEach(({ bean, i, offset, rotation }) => {
      const t = segment(p, .105 + i * .009, .31 + i * .009);
      const x = cx + offset * 100 * (1 - t) + Math.sin(t * Math.PI) * (i % 2 ? -4 : 4);
      const y = -18 - i % 3 * 7 + (74 + i % 3 * 7) * t * t;
      const entering = segment(t, 0, .1);
      const leaving = 1 - segment(t, .88, 1);
      bean.style.left = `${x}%`;
      bean.style.top = `${y}%`;
      bean.style.transform = `translate(-50%,-50%) rotate(${rotation + t * (i % 2 ? 320 : -350)}deg) scale(${1 - t * .18})`;
      bean.style.opacity = String(entering * leaving);
    });
    labels.forEach((label, i) => {
      const active = i === (p < .14 ? 0 : p < .42 ? 1 : p < .85 ? 2 : 3);
      label.classList.toggle('active', active);
      if (active) label.setAttribute('aria-current', 'step'); else label.removeAttribute('aria-current');
    });
  }

  function frame(time) {
    pending = false;
    if (paused || document.hidden) return;
    const dt = Math.min(50, time - lastTime || 16);
    lastTime = time;
    const blend = 1 - Math.exp(-dt / 68);
    rendered += (target - rendered) * blend;
    if (Math.abs(target - rendered) < .0004) rendered = target;
    draw(rendered);
    if (rendered !== target) schedule();
  }

  function schedule() {
    if (!pending && !paused) { pending = true; requestAnimationFrame(frame); }
  }
  function updateMotion() {
    paused = reduced.matches || !root.classList.contains('motion-enabled');
    hero.classList.toggle('hero-brew-paused', paused);
    // When motion is paused the original full artwork is the readable fallback.
    // It does not look like an unfinished point in the timeline.
    if (!paused) { measure(); rendered = target; previous = -1; draw(rendered); schedule(); }
  }

  addEventListener('scroll', () => { measure(); schedule(); }, { passive: true });
  addEventListener('resize', () => { previous = -1; measure(); schedule(); }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) { measure(); schedule(); } });
  reduced.addEventListener('change', updateMotion);
  mobile.addEventListener('change', () => { previous = -1; measure(); schedule(); });
  new MutationObserver(updateMotion).observe(root, { attributes: true, attributeFilter: ['class'] });
  root.classList.add('bean-experience-ready');
  measure();
  updateMotion();
})();

// Sticky header on scroll
(function() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function() {
        nav.classList.toggle('scrolled', window.scrollY > 10);
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial
})();
