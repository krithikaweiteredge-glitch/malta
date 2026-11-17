/* The Malta Invitation — interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover)').matches;
  const desktop = () => innerWidth > 760;
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce) {
    lenis = new Lenis({ duration: 1.3, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
    window.lenis = lenis;
  }
  const goTo = target => lenis ? lenis.scrollTo(target, { duration: 1.8 }) : $(target).scrollIntoView({ behavior: 'smooth' });

  /* ---------- foil follows the light (pointer) ---------- */
  const root = document.documentElement;
  let mx = innerWidth / 2, my = innerHeight / 2;
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    root.style.setProperty('--fx', (20 + (mx / innerWidth) * 60).toFixed(1) + '%');
  }, { passive: true });
  if (!canHover) addEventListener('scroll', () => root.style.setProperty('--fx', (30 + (scrollY / 8) % 40) + '%'), { passive: true });

  /* =========================================================
     ENVELOPE
     ========================================================= */
  const stage = $('.envelope-stage');
  let opened = false;
  const reveal = () => {
    document.body.classList.remove('is-sealed');
    stage.remove();
    if (lenis) lenis.start();
    ScrollTrigger.refresh();
    if (reduce) return;
    gsap.timeline()
      .from('.card--invite', { y: 90, scale: .92, opacity: 0, duration: 1.6, ease: 'expo.out' })
      .from('.tuck', { y: 140, opacity: 0, rotate: 0, duration: 1.6, stagger: .12, ease: 'expo.out' }, '-=1.3')
      .from('.nav > *', { y: -30, opacity: 0, duration: 1, stagger: .08, ease: 'expo.out' }, '-=1.2');
  };
  const openEnvelope = (fast = false) => {
    if (opened) return; opened = true;
    if (reduce || fast) { gsap.to(stage, { opacity: 0, duration: .5, onComplete: reveal }); return; }
    gsap.timeline({ onComplete: reveal })
      .to('.es__hint, .es__top, .es__skip', { opacity: 0, duration: .4 })
      .to('.seal__mark', { opacity: 0, scale: .6, duration: .3 }, 0)
      .to('.seal__half--l', { x: -70, y: 160, rotate: -50, opacity: 0, duration: 1, ease: 'power2.in' }, .1)
      .to('.seal__half--r', { x: 70, y: 170, rotate: 45, opacity: 0, duration: 1, ease: 'power2.in' }, .1)
      .to('.seal', { pointerEvents: 'none' }, 0)
      .to('.env__flap', { rotateX: 180, duration: 1, ease: 'power3.inOut' }, .35)
      .set('.env__flap', { zIndex: 1 }, .85)
      .to('.env__address', { opacity: 0, duration: .4 }, .4)
      .to('.env__card', { yPercent: -62, duration: 1.2, ease: 'power3.inOut' }, 1.05)
      .to('.envelope', { y: 60, duration: 1.2, ease: 'power3.inOut' }, 1.05)
      .to('.env__card', { scale: 1.6, opacity: 0, duration: 1, ease: 'power2.in' }, 2.3)
      .to('.env__back, .env__pocket, .env__flap', { y: 220, opacity: 0, duration: .9, ease: 'power2.in' }, 2.2)
      .to(stage, { backgroundColor: 'rgba(14,28,23,0)', backgroundImage: 'none', duration: .6 }, 2.8);
  };
  $('.seal').addEventListener('click', () => openEnvelope());
  $('.es__skip').addEventListener('click', () => openEnvelope(true));
  stage.addEventListener('wheel', () => openEnvelope(), { passive: true });
  stage.addEventListener('touchmove', () => openEnvelope(), { passive: true });
  addEventListener('keydown', e => { if (!opened && ['Enter', ' ', 'ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); openEnvelope(); } });
  // gentle idle float of the envelope
  if (!reduce) gsap.to('.envelope', { y: -10, rotate: -.6, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  /* =========================================================
     NAV + CONTENTS
     ========================================================= */
  const nav = $('.nav'), contents = $('#contents'), cBtn = $('.contents-btn');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('is-hidden', y > lastY && y > 300 && !contents.classList.contains('is-open'));
    lastY = y;
  }, { passive: true });
  const setContents = open => { contents.classList.toggle('is-open', open); cBtn.setAttribute('aria-expanded', open); };
  cBtn.addEventListener('click', e => { e.stopPropagation(); setContents(!contents.classList.contains('is-open')); });
  addEventListener('click', e => { if (!e.target.closest('.contents')) setContents(false); });
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href'); if (!$(id)) return;
    e.preventDefault(); setContents(false);
    if (a.dataset.tier) { const r = $(`input[name="tier"][value="${a.dataset.tier}"]`); if (r) r.checked = true; }
    goTo(id);
  }));

  /* =========================================================
     INVITATION — photos tucked behind the card follow the hand
     ========================================================= */
  if (canHover && !reduce) {
    const layers = $$('.invitation [data-depth]').map(el => ({
      x: gsap.quickTo(el, 'x', { duration: 1.2, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
      d: +el.dataset.depth
    }));
    $('.invitation').addEventListener('pointermove', e => {
      const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      layers.forEach(l => { l.x(nx * l.d * 2); l.y(ny * l.d * 2); });
    });
  }

  if (!reduce) {
    /* section heads */
    $$('.sec-head').forEach(h => gsap.from(h.children, { y: 40, opacity: 0, duration: 1.4, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 82%' } }));

    /* ---------- ORDER OF CELEBRATIONS ---------- */
    gsap.to('.programme__thread-fill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.programme', start: 'top 60%', end: 'bottom 70%', scrub: true } });
    $$('.rite').forEach(r => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: r, start: 'top 78%' } });
      tl.from($('.rite__photo', r), { y: 80, rotate: r.classList.contains('rite--flip') ? 9 : -9, opacity: 0, duration: 1.5, ease: 'expo.out' })
        .from($('.rite__text', r).children, { y: 30, opacity: 0, duration: 1.2, stagger: .1, ease: 'expo.out' }, '-=1.2');
    });
    gsap.from('.programme', { y: 120, rotate: 1.5, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.programme', start: 'top 92%' } });

    /* ---------- POSTCARDS ---------- */
    gsap.from('.postcard', { y: 160, rotate: (i) => [-14, 10, -8, 14][i], opacity: 0, duration: 1.5, stagger: .12, ease: 'expo.out', scrollTrigger: { trigger: '.postcards', start: 'top 85%' } });

    /* ---------- FOIL CARDS ---------- */
    gsap.from('.foil-card', { y: 120, opacity: 0, duration: 1.5, stagger: .14, ease: 'expo.out', scrollTrigger: { trigger: '.foils', start: 'top 85%' } });

    /* ---------- RSVP card ---------- */
    gsap.from('.card--rsvp', { y: 140, rotate: -4, opacity: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.rsvp', start: 'top 80%' } });

    /* ---------- prints scatter onto the table ---------- */
    gsap.from('.print', { y: -200, opacity: 0, rotate: () => gsap.utils.random(-30, 30), duration: 1.3, stagger: { each: .07, from: 'random' }, ease: 'expo.out', scrollTrigger: { trigger: '.table', start: 'top 80%' } });
  }

  /* =========================================================
     CANDLELIGHT — reveal Valletta with a moving light
     ========================================================= */
  const candle = $('.candle');
  const setLight = (x, y) => { candle.style.setProperty('--cx', x + 'px'); candle.style.setProperty('--cy', y + 'px'); };
  const lightPos = { x: innerWidth * .62, y: innerHeight * .45 };
  const qx = gsap.quickTo(lightPos, 'x', { duration: .9, ease: 'power3.out', onUpdate: () => setLight(lightPos.x, lightPos.y) });
  const qy = gsap.quickTo(lightPos, 'y', { duration: .9, ease: 'power3.out', onUpdate: () => setLight(lightPos.x, lightPos.y) });
  setLight(lightPos.x, lightPos.y);
  if (canHover) {
    candle.addEventListener('pointermove', e => { const r = candle.getBoundingClientRect(); qx(e.clientX - r.left); qy(e.clientY - r.top); });
  } else if (!reduce) {
    // on touch screens the candle drifts across the city by itself
    const path = [[.25, .35], [.7, .3], [.55, .6], [.3, .55], [.8, .5]];
    let k = 0;
    setInterval(() => { const [px, py] = path[k++ % path.length]; qx(candle.offsetWidth * px); qy(candle.offsetHeight * py); }, 2200);
    candle.addEventListener('touchmove', e => { const r = candle.getBoundingClientRect(), t = e.touches[0]; qx(t.clientX - r.left); qy(t.clientY - r.top); }, { passive: true });
  }
  if (!reduce) {
    const rad = { r: 120 };
    gsap.to(rad, { r: () => Math.max(240, innerWidth * .2), ease: 'none', onUpdate: () => candle.style.setProperty('--rad', rad.r + 'px'),
      scrollTrigger: { trigger: candle, start: 'top 80%', end: 'center center', scrub: true } });
  }

  /* =========================================================
     VENUES — deal a hand of cards
     ========================================================= */
  const hand = $('.hand'), vcards = $$('.vcard');
  const fan = () => vcards.forEach((c, i) => {
    const n = vcards.length, a = (i - (n - 1) / 2) * (desktop() ? 9.5 : 0);
    c.style.setProperty('--a', a + 'deg');
  });
  const deal = () => {
    vcards.forEach((c, i) => { c.style.transitionDelay = (i * 70) + 'ms'; });
    fan();
    setTimeout(() => vcards.forEach(c => c.style.transitionDelay = ''), 1400);
  };
  if (reduce) fan(); else ScrollTrigger.create({ trigger: hand, start: 'top 75%', once: true, onEnter: deal });
  addEventListener('resize', fan);
  hand.addEventListener('pointerenter', () => canHover && hand.classList.add('is-hovering'));
  hand.addEventListener('pointerleave', () => hand.classList.remove('is-hovering'));
  vcards.forEach(c => c.addEventListener('click', () => {
    const was = c.classList.contains('is-flipped');
    vcards.forEach(o => o.classList.remove('is-flipped'));
    if (!was) c.classList.add('is-flipped');
  }));

  /* =========================================================
     FOIL CARDS — tilt & sheen
     ========================================================= */
  if (canHover && !reduce) $$('.foil-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty('--rx', ((.5 - py) * 10).toFixed(2) + 'deg');
      card.style.setProperty('--ry', ((px - .5) * 12).toFixed(2) + 'deg');
      card.style.setProperty('--sx', (px * 100).toFixed(1) + '%');
      card.style.setProperty('--sy', (py * 100).toFixed(1) + '%');
    });
    card.addEventListener('pointerleave', () => { ['--rx', '--ry'].forEach(p => card.style.setProperty(p, '0deg')); card.style.setProperty('--sx', '50%'); });
  });

  /* =========================================================
     PRINTS — pick up, move, open
     ========================================================= */
  const lb = $('.lightbox'), lbImg = $('.lightbox img'), lbCap = $('.lightbox figcaption');
  const openPrint = img => { lbImg.src = img.src; lbImg.alt = img.alt; lbCap.textContent = img.alt; lb.classList.add('is-open'); lb.setAttribute('aria-hidden', 'false'); if (lenis) lenis.stop(); };
  const closePrint = () => { lb.classList.remove('is-open'); lb.setAttribute('aria-hidden', 'true'); if (lenis) lenis.start(); };
  lb.addEventListener('click', closePrint);
  addEventListener('keydown', e => { if (e.key === 'Escape') { closePrint(); setContents(false); } });
  let zTop = 10;
  $$('.print').forEach(p => {
    p.tabIndex = 0; p.setAttribute('role', 'button');
    p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPrint($('img', p)); } });
    let sx, sy, ox = 0, oy = 0, moved = 0, down = false;
    p.addEventListener('pointerdown', e => {
      if (!desktop()) return;
      down = true; moved = 0; sx = e.clientX; sy = e.clientY;
      p.setPointerCapture(e.pointerId); p.style.zIndex = ++zTop; p.classList.add('is-dragging');
    });
    p.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - sx, dy = e.clientY - sy; moved = Math.max(moved, Math.hypot(dx, dy));
      p.style.setProperty('--dx', (ox + dx) + 'px'); p.style.setProperty('--dy', (oy + dy) + 'px');
    });
    p.addEventListener('pointerup', e => {
      if (!down) { openPrint($('img', p)); return; }
      down = false; p.classList.remove('is-dragging');
      ox += e.clientX - sx; oy += e.clientY - sy;
      if (moved < 6) openPrint($('img', p));
    });
  });

  /* =========================================================
     RSVP — seal & send
     ========================================================= */
  const form = $('.rsvp__form'), note = $('.rsvp__note');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    ['name', 'email'].forEach(n => {
      const f = form.elements[n], bad = !f.value.trim() || (n === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.closest('.line').classList.toggle('is-error', bad); if (bad) ok = false;
    });
    if (!ok) { note.textContent = 'Kindly add your names and an email'; return; }
    const tier = form.elements.tier.value;
    gsap.fromTo('.stamp-seal', { opacity: 0, scale: 2.6, rotate: -40 }, { opacity: 1, scale: 1, rotate: -8, duration: .9, ease: 'back.out(2.2)' });
    gsap.fromTo('.card--rsvp', { x: 0 }, { x: 4, duration: .06, repeat: 5, yoyo: true, delay: .55, clearProps: 'x' });
    note.textContent = tier.startsWith('a ') ? 'With thanks. We shall write within a day.' : `With thanks. Your ${tier} celebration begins; we shall write within a day.`;
    form.reset();
  });
})();
