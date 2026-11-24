/* All the movement on the site. Smooth scroll (Lenis) drives ScrollTrigger; every effect is set up once, on the
   markup React has rendered. Shared effects run on every page; the rest only where their page is. */
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import type { Page } from './components/Shared';
import { FILM, GALLERY } from './content';

gsap.registerPlugin(ScrollTrigger, Flip);

const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => root.querySelector(s) as T;
const $$ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => [...root.querySelectorAll<T>(s)];

/* Wrap every character of an element in a mask, keeping <em> and <br>. Words never break in the middle. */
function splitChars(el: HTMLElement) {
  const walk = (node: Node, into: Node) => {
    for (const n of [...node.childNodes]) {
      if (n.nodeType === Node.TEXT_NODE) {
        for (const part of (n.textContent ?? '').split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) { into.appendChild(document.createTextNode(' ')); continue; }
          const word = Object.assign(document.createElement('span'), { style: 'display:inline-block;white-space:nowrap' });
          for (const c of part) {
            const mask = Object.assign(document.createElement('span'), { className: 'ch-mask' });
            mask.appendChild(Object.assign(document.createElement('span'), { className: 'ch', textContent: c }));
            word.appendChild(mask);
          }
          into.appendChild(word);
        }
      } else if (n instanceof HTMLElement && n.tagName === 'BR') into.appendChild(document.createElement('br'));
      else if (n instanceof HTMLElement) { const copy = document.createElement(n.tagName.toLowerCase()); walk(n, copy); into.appendChild(copy); }
    }
  };
  const frag = document.createDocumentFragment();
  walk(el, frag);
  el.replaceChildren(frag);
  return $$('.ch', el);
}
function splitWords(el: HTMLElement) {
  const out: Node[] = [];
  for (const n of [...el.childNodes]) {
    const italic = n instanceof HTMLElement && n.tagName === 'EM';
    for (const w of (n.textContent ?? '').split(/\s+/).filter(Boolean)) {
      out.push(Object.assign(document.createElement(italic ? 'em' : 'span'), { className: 'w', textContent: w }), document.createTextNode(' '));
    }
  }
  el.replaceChildren(...out);
  return $$('.w', el);
}

export function start(page: Page) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.body.classList.add('is-loading');
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const arrivingAt = location.hash;   // a section asked for from another page (./#film): gone to once the page is shown
  scrollTo(0, 0);

  /* ---- Smooth scroll, anchors, a nav that steps aside while reading down ---- */
  const lenis = reduced ? null : new Lenis({ lerp: 0.08 });
  Object.assign(window, { __lenis: lenis });
  let velocity = 0;
  const nav = $('#nav');
  const solidFrom = page === 'home' ? innerHeight * 2.6 : innerHeight * 0.6;
  const onScroll = (y: number, dir: number) => {
    nav.classList.toggle('is-hidden', dir === 1 && y > innerHeight * 0.5);
    nav.classList.toggle('is-solid', y > solidFrom);
  };
  if (lenis) {
    lenis.stop();
    lenis.on('scroll', (l: Lenis) => { ScrollTrigger.update(); velocity = l.velocity; onScroll(l.scroll, l.direction); });
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else addEventListener('scroll', () => onScroll(scrollY, 0), { passive: true });
  const scrollToTarget = (target: HTMLElement | 0, immediate = false) => {
    if (lenis) lenis.scrollTo(target, immediate ? { immediate: true } : { duration: 2, easing: (x) => 1 - Math.pow(1 - x, 4) });
    else if (target === 0) scrollTo(0, 0); else target.scrollIntoView();
  };
  for (const a of $$<HTMLAnchorElement>('a[href^="#"]')) a.addEventListener('click', (e) => {
    const id = a.getAttribute('href')!;
    const target = id === '#top' ? 0 : $<HTMLElement>(id);
    if (target === null) return;
    e.preventDefault();
    scrollToTarget(target);
  });

  /* ---- Page changes: the blush shutters close over the page, the next page opens from under them ---- */
  const shutters = $$('#shutters span');
  for (const a of $$<HTMLAnchorElement>('a[data-page-link]')) a.addEventListener('click', (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;   // a new tab, as the visitor asked
    e.preventDefault();
    const go = () => { location.href = a.href; };
    if (reduced) { go(); return; }
    lenis?.stop();
    gsap.fromTo(shutters, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut', stagger: 0.05, onComplete: go });
  });
  addEventListener('pageshow', (e) => { if (e.persisted) { gsap.set(shutters, { yPercent: -100 }); lenis?.start(); } });   // back from the next page (bfcache)

  /* ---- Cursor ---- */
  if (fine) {
    document.documentElement.classList.add('has-cursor');
    const c = $('#cursor'), label = $('#cursorLabel');
    const qx = gsap.quickTo(c, 'x', { duration: 0.4, ease: 'power3' }), qy = gsap.quickTo(c, 'y', { duration: 0.4, ease: 'power3' });
    addEventListener('pointermove', (e) => { qx(e.clientX); qy(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', (e) => {
      const t = e.target as Element;
      const text = (t.closest?.('[data-cursor]') as HTMLElement | null)?.dataset.cursor ?? '';
      c.classList.toggle('is-label', !!text);
      c.classList.toggle('is-hidden', !!t.closest?.('[data-cursor-hide]'));
      c.classList.toggle('is-ink', !!t.closest?.('.drawer__panel, .trail, .footer'));   // on blush surfaces the cursor turns wine
      if (text) label.textContent = text;
    });
  }

  /* ---- Things that close with Escape ---- */
  const closers: (() => void)[] = [];
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closers.forEach((f) => f()); });

  /* ---- Enquiry drawer ---- */
  const drawer = $('#drawer'), panel = $('.drawer__panel', drawer), veil = $('.drawer__veil', drawer);
  const openDrawer = () => {
    drawer.hidden = false; lenis?.stop();
    gsap.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.6 });
    gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 1, ease: 'expo.out' });
    gsap.fromTo($$('.drawer__panel > *, .form > *', drawer), { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.035, delay: 0.15 });
    setTimeout(() => $<HTMLInputElement>('input[name="names"]', drawer).focus(), 400);
  };
  const closeDrawer = () => {
    if (drawer.hidden) return;
    gsap.to(veil, { opacity: 0, duration: 0.5 });
    gsap.to(panel, { xPercent: 100, duration: 0.7, ease: 'expo.in', onComplete: () => { drawer.hidden = true; } });
    lenis?.start();
  };
  for (const b of $$('[data-open-drawer]')) b.addEventListener('click', openDrawer);
  for (const b of $$('[data-close-drawer]')) b.addEventListener('click', closeDrawer);
  closers.push(closeDrawer);
  const form = $<HTMLFormElement>('#enquireForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form), v = (k: string) => String(d.get(k) ?? '').trim();
    const body = [`Names: ${v('names')}`, `Email: ${v('email')}`, `Date: ${v('date')}`, `Guests: ${v('guests')}`, `Venue: ${v('venue')}`, `Collection: ${v('collection')}`, '', v('message')].join('\n');
    location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(`Malta wedding — ${v('names')}`)}&body=${encodeURIComponent(body)}`;
    $('#formDone').hidden = false;
  });

  /* ---- Words and characters ---- */
  const splits = $$('[data-split]').map((el) => ({ el, chars: splitChars(el) }));
  const blurs = $$('[data-blur]').map((el) => ({ el, words: splitWords(el) }));

  /* ---- Marquees: always drifting, quicker and leaning with the speed of the scroll ---- */
  const marquees = $$('[data-marquee]').map((m) => ({ track: $('.marquee__track', m), set: $('.marquee__set', m), dir: Number(m.dataset.marquee), x: 0, skew: m.classList.contains('marquee--small') || m.classList.contains('gstrip') ? 0 : 1 }));
  gsap.ticker.add((_, delta) => {
    const boost = Math.min(Math.abs(velocity) * 0.06, 6);
    for (const m of marquees) {
      const w = m.set.offsetWidth || 1;
      m.x -= m.dir * (0.6 + boost) * delta * 0.06;
      if (m.x <= -w) m.x += w; if (m.x > 0) m.x -= w;
      gsap.set(m.track, { x: m.x, skewX: reduced ? 0 : gsap.utils.clamp(-10, 10, -velocity * 0.25) * m.skew });
    }
  });

  /* ---- Magnetic button ---- */
  for (const m of $$('[data-magnet]')) {
    const mx = gsap.quickTo(m, 'x', { duration: 0.6, ease: 'power3' }), my = gsap.quickTo(m, 'y', { duration: 0.6, ease: 'power3' });
    m.parentElement!.addEventListener('pointermove', (e) => {
      const r = m.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const near = Math.hypot(dx, dy) < r.width * 1.1;
      mx(near ? dx * 0.35 : 0); my(near ? dy * 0.35 : 0);
    });
    m.parentElement!.addEventListener('pointerleave', () => { mx(0); my(0); });
  }

  /* ---- The page itself ---- */
  const intro = page === 'home' ? home() : gallery();

  if (!reduced) {
    /* Headings: characters rise, each a little after the one before */
    for (const { el, chars } of splits) {
      if (el.closest('.ghero')) continue;   // the gallery's heading rises with the page's opening, below
      gsap.fromTo(chars, { yPercent: 150, rotate: 7 }, { yPercent: 0, rotate: 0, duration: 1.3, ease: 'expo.out', stagger: 0.018, scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    }
    /* The manifesto comes into focus, word by word */
    for (const { el, words } of blurs) {
      gsap.fromTo(words, { filter: 'blur(14px)', opacity: 0.08, y: 14 }, { filter: 'blur(0px)', opacity: 1, y: 0, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 52%', scrub: true } });
    }
    /* The footer: its columns rise as it arrives, the huge name slides up */
    gsap.from('.footer__grid > *', { y: 50, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: '.footer', start: 'top 85%', once: true } });
  }

  /* ---- Opening: on the first visit the counter, otherwise just the shutters lifting ---- */
  const firstVisit = page === 'home' && !sessionStorage.getItem('et-seen');
  sessionStorage.setItem('et-seen', '1');
  const done = () => {
    $('#loader')?.remove();
    document.body.classList.remove('is-loading');
    lenis?.start(); ScrollTrigger.sort(); ScrollTrigger.refresh();
    if (arrivingAt) { const t = $<HTMLElement>(arrivingAt); if (t) requestAnimationFrame(() => scrollToTarget(t, true)); }
  };
  if (reduced) { gsap.set(shutters, { yPercent: -100 }); $('#loader')?.remove(); intro.after(); done(); return; }
  if (firstVisit) {
    const count = { v: 0 }, counter = $('#loaderCount');
    const counting = gsap.to(count, { v: 86, duration: 2, ease: 'power2.inOut', onUpdate: () => { counter.textContent = String(Math.round(count.v)); } });
    Promise.all([intro.ready, document.fonts?.ready, counting.then()]).then(() => gsap.to(count, {
      v: 100, duration: 0.5, ease: 'power2.out', onUpdate: () => { counter.textContent = String(Math.round(count.v)); },
      onComplete: () => {
        gsap.timeline({ onComplete: done })
          .to('.loader > *', { yPercent: -60, opacity: 0, duration: 0.6, ease: 'power3.in', stagger: 0.04 }, 0)
          .to(shutters, { yPercent: -100, duration: 1.1, ease: 'expo.inOut', stagger: 0.07 }, 0.35)
          .add(intro.after, 0.6)
          .from('.nav > *', { y: -20, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, 1.2);
      },
    }));
  } else {
    $('#loader')?.remove();
    Promise.race([Promise.all([document.fonts?.ready]), new Promise((r) => setTimeout(r, 1200))]).then(() => {
      gsap.timeline({ onComplete: done })
        .to(shutters, { yPercent: -100, duration: 1, ease: 'expo.inOut', stagger: 0.06 }, 0.1)
        .add(intro.after, 0.4)
        .from('.nav > *', { y: -20, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.06 }, 0.8);
    });
  }

  /* ================= Home ================= */
  function home() {
    /* The film with sound */
    const player = $('#player'), pv = $<HTMLVideoElement>('#playerVideo');
    const openPlayer = () => { player.hidden = false; lenis?.stop(); gsap.fromTo(player, { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(75% at 50% 50%)', duration: 1.1, ease: 'expo.inOut' }); pv.currentTime = 0; void pv.play().catch(() => {}); $('#playerClose').focus(); };
    const closePlayer = () => { if (player.hidden) return; pv.pause(); gsap.to(player, { clipPath: 'circle(0% at 50% 50%)', duration: 0.8, ease: 'expo.inOut', onComplete: () => { player.hidden = true; } }); lenis?.start(); };
    for (const b of $$('[data-play]')) b.addEventListener('click', openPlayer);
    $('#playerClose').addEventListener('click', closePlayer);
    closers.push(closePlayer);

    /* Collections: an accordion; on a computer the photograph of the one under the pointer follows it */
    const cols = $$('.col');
    cols.forEach((col, i) => {
      if (i === 0) col.classList.add('is-open');
      $('.col__row', col).addEventListener('click', () => {
        const open = !col.classList.contains('is-open');
        cols.forEach((c) => c.classList.toggle('is-open', c === col && open));
        setTimeout(() => ScrollTrigger.refresh(), 750);
      });
    });
    if (fine) {
      const float = $('#colFloat'), fimg = $<HTMLImageElement>('img', float);
      const fx = gsap.quickTo(float, 'x', { duration: 0.8, ease: 'power3' }), fy = gsap.quickTo(float, 'y', { duration: 0.8, ease: 'power3' });
      const list = $('.collections__list');
      list.addEventListener('pointermove', (e) => {
        fx(e.clientX); fy(e.clientY);
        const col = (e.target as Element).closest<HTMLElement>('.col');
        if (!col) return;
        if (!fimg.src.endsWith(col.dataset.img!)) fimg.src = col.dataset.img!;
        float.classList.add('is-on');
      });
      list.addEventListener('pointerleave', () => float.classList.remove('is-on'));
      addEventListener('scroll', () => float.classList.remove('is-on'), { passive: true });
    }

    /* The hero film starts past its opening fade */
    const hv = $<HTMLVideoElement>('#heroVideo');
    const seek = () => { if (hv.currentTime < FILM.loopFrom) hv.currentTime = FILM.loopFrom; };
    if (hv.readyState >= 1) seek(); else hv.addEventListener('loadedmetadata', seek, { once: true });

    /* The letters, drawn on a canvas and redrawn at every step of the zoom, so they stay sharp however close the
       camera comes: wine everywhere, MALTA cut out of it, the zoom centred on the stem of the T. */
    const cv = $<HTMLCanvasElement>('#heroMask'), ctx = cv.getContext('2d')!;
    const mask = { s: 1 };
    const geo = { fs: 300, x0: 0, base: 0, tx: 0, ty: 0 };
    const FONT = (fs: number) => `900 ${fs}px "Bodoni Moda Variable", "Bodoni 72", Didot, serif`;
    const drawMask = () => {
      const dpr = cv.width / innerWidth, s = mask.s;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#2a0b10';
      ctx.fillRect(0, 0, innerWidth, innerHeight);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.translate(geo.tx, geo.ty); ctx.scale(s, s); ctx.translate(-geo.tx, -geo.ty);
      ctx.font = FONT(geo.fs); ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
      ctx.fillText('MALTA', geo.x0, geo.base);
      // a fine blush outline, so the hairlines of the Bodoni (too thin to show the film through) still read; it fades as the camera dives
      const a = 0.6 * Math.max(0, 1 - (s - 1) / 3);
      if (a > 0.01) {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = `rgba(241, 214, 203, ${a})`;
        ctx.lineWidth = 1.1 / s;
        ctx.strokeText('MALTA', geo.x0, geo.base);
      }
    };
    const layoutMask = () => {
      const W = innerWidth, H = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.font = FONT(100);
      const w100 = ctx.measureText('MALTA').width;
      geo.fs = Math.min((W * (W > 900 ? 0.86 : 0.92)) / w100 * 100, H * 0.62);
      ctx.font = FONT(geo.fs);
      const total = ctx.measureText('MALTA').width, cap = geo.fs * 0.7;
      geo.x0 = W / 2 - total / 2; geo.base = H / 2 + cap / 2;
      geo.tx = geo.x0 + ctx.measureText('MAL').width + ctx.measureText('T').width / 2;   // the stem of the T
      geo.ty = geo.base - cap * 0.42;
      drawMask();
    };
    layoutMask();
    document.fonts?.ready.then(layoutMask);
    addEventListener('resize', layoutMask);

    const ready = new Promise<void>((done) => { if (hv.readyState >= 3) done(); else { hv.addEventListener('canplay', () => done(), { once: true }); setTimeout(done, 6000); } });
    const after = () => {
      void hv.play().catch(() => {});
      if (reduced) return;
      gsap.fromTo(mask, { s: 1.35 }, { s: 1, duration: 1.8, ease: 'expo.out', onUpdate: drawMask });
      gsap.from('#heroUi > *', { y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.5 });
    };
    if (reduced) return { ready, after };

    /* Hero: fall through the letters into the film */
    gsap.set('#heroAfter', { autoAlpha: 0 });
    gsap.set('.hero__title .line > *', { yPercent: 140 });
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } })
      .to('#heroUi', { opacity: 0, y: -30, duration: 0.12 }, 0)
      .fromTo(mask, { s: 1 }, { s: 70, ease: 'power3.in', duration: 0.6, onUpdate: drawMask }, 0.02)
      .to(cv, { opacity: 0, duration: 0.05 }, 0.6)
      .to('.hero__video', { scale: 1, duration: 0.6, ease: 'none' }, 0.02)
      .to('.hero__dim', { opacity: 1, duration: 0.1 }, 0.6)
      .to('#heroAfter', { autoAlpha: 1, duration: 0.02 }, 0.66)
      .to('.hero__title .line > *', { yPercent: 0, duration: 0.18, stagger: 0.05, ease: 'power3.out' }, 0.68)
      .fromTo('.hero__after .play', { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.15, ease: 'back.out(1.6)' }, 0.8)
      .to({}, { duration: 0.1 });

    gsap.from('.manifesto__stats > p', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.manifesto__stats', start: 'top 88%', once: true } });

    /* The reel: the card opens to fill the screen, the two words part around it */
    const reelCard = $('#reelCard'), rv = $<HTMLVideoElement>('#reelVideo');
    gsap.timeline({ scrollTrigger: { trigger: '.reel', start: 'top top', end: 'bottom bottom', scrub: 1, invalidateOnRefresh: true } })
      .fromTo(reelCard, { width: () => reelCard.offsetWidth, height: () => reelCard.offsetWidth * 9 / 16, borderRadius: 24 }, { width: () => innerWidth, height: () => innerHeight, borderRadius: 0, ease: 'power2.inOut' }, 0)
      .to('#reelL', { xPercent: -140, opacity: 0, ease: 'power2.in' }, 0)
      .to('#reelR', { xPercent: 140, opacity: 0, ease: 'power2.in' }, 0);
    ScrollTrigger.create({
      trigger: '.reel', start: 'top bottom', end: 'bottom top',
      onToggle: (s) => { if (s.isActive) { if (rv.currentTime < 60) rv.currentTime = 60; void rv.play().catch(() => {}); } else rv.pause(); },
    });

    /* Love stories: each card is pushed back into the stack by the next */
    const stories = $$('.story');
    stories.forEach((s, i) => {
      const next = stories[i + 1];
      if (!next) return;
      gsap.to($('.story__inner', s), { scale: 0.9, filter: 'brightness(0.5)', ease: 'none', scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 15%', scrub: true } });
    });
    for (const s of stories) gsap.fromTo($('.story__media img', s), { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: s, start: 'top bottom', end: 'top 20%', scrub: true } });

    /* Image trail: photographs dropped where the pointer has been */
    const trail = $('#trail'), trailImgs = $$<HTMLImageElement>('#trailImgs img');
    let ti = 0, z = 1, last = { x: -999, y: -999 };
    const drop = (x: number, y: number) => {
      const img = trailImgs[ti++ % trailImgs.length];
      const w = img.offsetWidth || 180, h = img.offsetHeight || 240;
      gsap.killTweensOf(img);
      gsap.set(img, { x: x - w / 2, y: y - h / 2, zIndex: z++, opacity: 1, scale: 0.4, rotate: gsap.utils.random(-14, 14) });
      gsap.timeline()
        .to(img, { scale: 1, rotate: gsap.utils.random(-6, 6), duration: 0.6, ease: 'expo.out' })
        .to(img, { opacity: 0, scale: 0.85, y: '+=80', duration: 0.9, ease: 'power2.in' }, 0.7);
    };
    trail.addEventListener('pointermove', (e) => {
      const r = trail.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (Math.hypot(x - last.x, y - last.y) > 90) { drop(x, y); last = { x, y }; }
    });
    if (!fine) {   // on a touch screen the photographs drift by themselves while the section is on screen
      let timer = 0, a = 0;
      ScrollTrigger.create({
        trigger: trail, start: 'top 70%', end: 'bottom 30%',
        onToggle: (s) => {
          clearInterval(timer);
          if (s.isActive) timer = window.setInterval(() => { a += 0.55; drop(trail.offsetWidth * (0.5 + 0.34 * Math.sin(a)), trail.offsetHeight * (0.5 + 0.3 * Math.sin(a * 1.7))); }, 420);
        },
      });
    }

    /* Zoom gallery: the middle photograph fills the screen as the others fly outwards */
    const scales = [4, 5, 6, 5, 6, 8, 9];
    const zt = gsap.timeline({ scrollTrigger: { trigger: '.zoom', start: 'top top', end: 'bottom bottom', scrub: 1 } });
    $$('.zoom__el').forEach((el, i) => zt.to(el, { scale: scales[i], ease: 'none' }, 0));

    /* Gallery teaser: the fanned photographs open out as they arrive */
    gsap.from('.teaser__row', { y: 80, scale: 0.9, opacity: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.teaser__row', start: 'top 85%', once: true } });   // (the fan itself is CSS, so it can spread on hover)

    return { ready, after };
  }

  /* ================= Gallery ================= */
  function gallery() {
    /* Filters that rearrange the wall */
    const grid = $('#galleryGrid'), items = $$('.gallery__item', grid), chips = $$('[data-filter]');
    chips.forEach((chip) => chip.addEventListener('click', () => {
      const f = chip.dataset.filter!;
      chips.forEach((c) => { c.classList.toggle('is-on', c === chip); c.setAttribute('aria-selected', String(c === chip)); });
      const state = Flip.getState(items);
      items.forEach((it) => it.classList.toggle('is-out', f !== 'All' && it.dataset.cat !== f));
      Flip.from(state, {
        duration: reduced ? 0 : 0.8, ease: 'expo.inOut', absolute: true, stagger: 0.015,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out', delay: 0.2 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.4 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    }));

    /* A viewer that steps through what the filter shows */
    const viewer = $('#viewer'), vImg = $<HTMLImageElement>('#viewerImg');
    let vList: number[] = [], vAt = 0;
    const showPhoto = (k: number, dir = 0) => {
      vAt = (k + vList.length) % vList.length;
      const p = GALLERY[vList[vAt]];
      gsap.killTweensOf(vImg);
      gsap.fromTo(vImg, { opacity: 0, x: dir * 60, scale: 0.98 }, { opacity: 1, x: 0, scale: 1, duration: 0.7, ease: 'expo.out' });
      vImg.src = p.src; vImg.alt = p.alt;
      $('#viewerCat').textContent = p.cat; $('#viewerAlt').textContent = p.alt;
      $('#viewerCount').textContent = `${String(vAt + 1).padStart(2, '0')} / ${String(vList.length).padStart(2, '0')}`;
    };
    const openViewer = (i: number) => {
      vList = items.map((it, k) => (it.classList.contains('is-out') ? -1 : k)).filter((k) => k >= 0);
      viewer.hidden = false; lenis?.stop();
      gsap.fromTo(viewer, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      showPhoto(Math.max(0, vList.indexOf(i)));
      $('#viewerClose').focus();
    };
    const closeViewer = () => { if (viewer.hidden) return; gsap.to(viewer, { opacity: 0, duration: 0.4, onComplete: () => { viewer.hidden = true; } }); lenis?.start(); };
    for (const b of $$('[data-gallery]')) b.addEventListener('click', () => openViewer(Number(b.dataset.gallery)));
    $('#viewerClose').addEventListener('click', closeViewer);
    $('#viewerPrev').addEventListener('click', () => showPhoto(vAt - 1, -1));
    $('#viewerNext').addEventListener('click', () => showPhoto(vAt + 1, 1));
    viewer.addEventListener('click', (e) => { if (e.target === viewer || e.target === $('.viewer__fig')) closeViewer(); });
    let touchX = 0;
    viewer.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    viewer.addEventListener('touchend', (e) => { const dx = e.changedTouches[0].clientX - touchX; if (Math.abs(dx) > 50) showPhoto(vAt + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); });
    addEventListener('keydown', (e) => {
      if (viewer.hidden) return;
      if (e.key === 'ArrowRight') showPhoto(vAt + 1, 1);
      if (e.key === 'ArrowLeft') showPhoto(vAt - 1, -1);
    });
    closers.push(closeViewer);

    if (!reduced) {
      /* Photographs rise into place in small groups as they come into view */
      gsap.set('.gallery__item', { y: 70, opacity: 0 });
      ScrollTrigger.batch('.gallery__item', { start: 'top 92%', once: true, onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 1.1, ease: 'expo.out', stagger: 0.08 }) });
      /* The strip of photographs leans away as the page scrolls */
      gsap.fromTo('.gstrip', { rotate: -2 }, { rotate: 2, ease: 'none', scrollTrigger: { trigger: '.gstrip', start: 'top bottom', end: 'bottom top', scrub: true } });
    }
    const after = () => {
      if (reduced) return;
      const chars = $$('.ghero .ch');
      gsap.fromTo(chars, { yPercent: 150, rotate: 7 }, { yPercent: 0, rotate: 0, duration: 1.4, ease: 'expo.out', stagger: 0.03 });
      gsap.from('.ghero .eyebrow, .ghero__intro, .ghero__down', { y: 30, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: 0.3 });
    };
    return { ready: Promise.resolve(), after };
  }
}
