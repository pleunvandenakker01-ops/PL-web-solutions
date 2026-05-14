/* ─── Plugin registratie ─── */
gsap.registerPlugin(ScrollTrigger);

/* Vervangt GSAP TextPlugin — typt tekst karakter voor karakter */
function typewriterTo(tl, el, text, duration, pos) {
  const proxy = { n: 0 };
  tl.to(proxy, {
    n: text.length, duration, ease: 'none',
    onUpdate()  { el.textContent = text.slice(0, Math.round(proxy.n)); },
    onComplete() { el.textContent = text; },
  }, pos);
}

/* Registreer GSAP-animaties pas als sectie 200px van viewport nadert */
function whenNear(sel, fn) {
  if (!('IntersectionObserver' in window)) { fn(); return; }
  const el = document.querySelector(sel);
  if (!el) { fn(); return; }
  new IntersectionObserver(([entry], obs) => {
    if (!entry.isIntersecting) return;
    obs.disconnect();
    fn();
  }, { rootMargin: '0px 0px 200px 0px' }).observe(el);
}

ScrollTrigger.defaults({ toggleActions: 'play none none none' });

const isMobile = window.innerWidth < 768;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════════════
   PRELOADER ANIMATIE
══════════════════════════════════════════ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.getElementById('pl-bar');
  if (!preloader) return;

  const tl = gsap.timeline({
    onComplete: () => {
      preloader.style.pointerEvents = 'none';
      heroTl.play();
    }
  });

  tl
    .from('.pl-p', { y: 40, opacity: 0, duration: 0.18, ease: 'power3.out' })
    .from('.pl-l', { y: 40, opacity: 0, duration: 0.18, ease: 'power3.out' }, 0.04)
    .to(bar, { width: '160px', duration: 0.15, ease: 'power2.out' }, 0.1)
    .to('.pl-sub', { opacity: 1, duration: 0.1, ease: 'power2.out' }, 0.2)
    .to('#preloader', {
      opacity: 0,
      duration: 0.12,
      delay: 0,
      ease: 'power2.inOut',
      onComplete: () => { preloader.style.display = 'none'; }
    }, 0.28);
})();

/* ─── Helpers uit libs.html ─── */
function fadeUp(targets, opts = {}) {
  if (prefersReducedMotion) return;
  const { trigger = targets, start = 'top 82%', y = 52, duration = 0.9,
          stagger = 0, delay = 0, ease = 'power3.out' } = opts;
  gsap.from(targets, {
    scrollTrigger: { trigger, start },
    y, opacity: 0, duration, stagger, delay, ease,
  });
}

function revealClip(targets, opts = {}) {
  if (prefersReducedMotion) return;
  const { direction = 'bottom', duration = 1.2, start = 'top 85%', stagger = 0 } = opts;
  const clips = {
    bottom: ['inset(100% 0 0 0)', 'inset(0% 0 0 0)'],
    top:    ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
    left:   ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
    right:  ['inset(0 0 0 100%)', 'inset(0 0 0 0%)'],
  };
  gsap.fromTo(targets,
    { clipPath: clips[direction][0] },
    { scrollTrigger: { trigger: targets, start }, clipPath: clips[direction][1],
      duration, stagger, ease: 'power4.out' }
  );
}

function parallax(target, opts = {}) {
  const { trigger = target, yPercent = 30, skipMobile = true } = opts;
  if (skipMobile && isMobile) return;
  gsap.to(target, {
    scrollTrigger: { trigger, scrub: true },
    yPercent, ease: 'none',
  });
}

/* ══════════════════════════════════════════
   WEBGL FLUID SHADER — vloeiende goud/zwart achtergrond
   Raw WebGL — op mobiel uitgeschakeld (CSS gradient fallback)
   Op desktop: gestart via requestIdleCallback na eerste render
══════════════════════════════════════════ */
function initHeroShader() {
  const canvas  = document.getElementById('hero-particles');
  if (!canvas) return;
  const heroEl  = document.getElementById('hero');

  /* WebGL context — alpha:false voor betere compositing */
  const gl = canvas.getContext('webgl',  { antialias: false, alpha: false }) ||
             canvas.getContext('experimental-webgl', { antialias: false, alpha: false });
  if (!gl) return; /* geen WebGL → canvas blijft transparant, dat is prima */

  /* ── Vertex shader — fullscreen quad ── */
  const VS = `
    attribute vec2 aPos;
    void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
  `;

  /* ── Fragment shader — domain-warped fbm in goud/zwart ── */
  const FS = `
    precision highp float;
    uniform float  uTime;
    uniform vec2   uMouse;
    uniform vec2   uRes;

    /* Gradient noise basis */
    vec2 hash2(vec2 p) {
      p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
      return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
    }
    float vnoise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(dot(hash2(i),           f),
                     dot(hash2(i+vec2(1,0)), f-vec2(1,0)), u.x),
                 mix(dot(hash2(i+vec2(0,1)), f-vec2(0,1)),
                     dot(hash2(i+vec2(1,1)), f-vec2(1,1)), u.x), u.y);
    }

    /* Fractal Brownian Motion — 4 octaven voor vloeibaar gevoel */
    float fbm(vec2 p) {
      float s = 0.0, a = 0.5;
      mat2  r = mat2(1.6, 1.2, -1.2, 1.6);
      for (int i = 0; i < 4; i++) { s += a * vnoise(p); p = r * p; a *= 0.5; }
      return s;
    }

    void main() {
      vec2  uv = gl_FragCoord.xy / uRes;
      float t  = uTime * 0.10;

      /* Muisinvloed — trekt golfpatroon naar cursor */
      vec2  m  = uMouse;
      float md = length(uv - m);
      vec2  mw = (uv - m) * 0.28 * smoothstep(0.45, 0.0, md);

      /* Domain warping laag 1 */
      vec2 q = vec2(fbm(uv * 2.2 + t),
                    fbm(uv * 2.2 + vec2(5.2, 1.3) + t));
      q += mw;

      /* Domain warping laag 2 */
      vec2 r2 = vec2(fbm(uv * 1.8 + 3.5 * q + vec2(1.7, 9.2) + t * 0.7),
                     fbm(uv * 1.8 + 3.5 * q + vec2(8.3, 2.8) + t * 0.5));

      float f = fbm(uv * 1.4 + 3.0 * r2 + t * 0.4) * 0.5 + 0.5;

      /* Kleur ramp: zwart → donker amber → goud (#C9A84C) → licht goud (#F0C060) */
      vec3 c = vec3(0.0);
      c = mix(c, vec3(0.10, 0.07, 0.01), smoothstep(0.28, 0.50, f));
      c = mix(c, vec3(0.45, 0.34, 0.07), smoothstep(0.48, 0.68, f));
      c = mix(c, vec3(0.788, 0.659, 0.298), smoothstep(0.64, 0.84, f));
      c = mix(c, vec3(0.941, 0.784, 0.471), smoothstep(0.80, 1.00, f));

      /* Dimmen — hero tekst moet leesbaar blijven */
      c *= 0.50;

      gl_FragColor = vec4(c, 1.0);
    }
  `;

  /* Shader compileerhulper */
  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      console.warn('[HeroShader]', gl.getShaderInfoLog(sh));
      gl.deleteShader(sh); return null;
    }
    return sh;
  }

  const vs = compile(gl.VERTEX_SHADER, VS);
  const fs = compile(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return;

  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[HeroShader] link:', gl.getProgramInfoLog(prog)); return;
  }
  gl.useProgram(prog);

  /* Fullscreen quad als TRIANGLE_STRIP */
  const vbuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  /* Uniform locaties */
  const uTime  = gl.getUniformLocation(prog, 'uTime');
  const uMouse = gl.getUniformLocation(prog, 'uMouse');
  const uRes   = gl.getUniformLocation(prog, 'uRes');

  /* Pixel buffer op halve resolutie — zelfde kwaliteit op mobiel en desktop */
  let W = 0, H = 0;
  function resize() {
    const cw = heroEl.offsetWidth  || window.innerWidth;
    const ch = heroEl.offsetHeight || window.innerHeight;
    W = Math.round(cw * 0.5);
    H = Math.round(ch * 0.5);
    canvas.width  = W; canvas.height = H;
    /* CSS width/height blijven 100%/100% — browser stretcht de buffer */
    gl.viewport(0, 0, W, H);
    gl.uniform2f(uRes, W, H);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* Muispositie genormaliseerd (Y geflipt voor WebGL-coördinatenstelsel) */
  let mx = 0.5, my = 0.5;
  heroEl.addEventListener('mousemove', e => {
    const rect = heroEl.getBoundingClientRect();
    mx = (e.clientX - rect.left) / rect.width;
    my = 1.0 - (e.clientY - rect.top)  / rect.height;
  }, { passive: true });
  heroEl.addEventListener('mouseleave', () => { mx = 0.5; my = 0.5; });

  /* Render loop */
  function tick(ts) {
    requestAnimationFrame(tick);
    gl.uniform1f(uTime,  ts * 0.001);
    gl.uniform2f(uMouse, mx, my);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  requestAnimationFrame(tick);
}

/* Altijd initialiseren — mobiel gebruikt lagere resolutie voor performance */
if (typeof requestIdleCallback === 'function') {
  requestIdleCallback(initHeroShader, { timeout: 2000 });
} else {
  setTimeout(initHeroShader, 200);
}


/* ══════════════════════════════════════════
   HERO ENTRANCE — "WIJ MAKEN DIGITALE
   MEESTERWERKEN" letter voor letter
══════════════════════════════════════════ */

/* Split .word spans in losse .hchar letters */
function splitHeroWord(wordEl) {
  const text = wordEl.textContent;
  const isAccent = wordEl.classList.contains('accent');
  wordEl.innerHTML = '';
  [...text].forEach(ch => {
    const s = document.createElement('span');
    s.className = 'hchar';
    if (isAccent) s.style.color = 'var(--gold)';
    s.textContent = ch === ' ' ? '\u00A0' : ch;
    wordEl.appendChild(s);
  });
}

document.querySelectorAll('.hero-headline .word').forEach(splitHeroWord);
const heroChars = document.querySelectorAll('.hero-headline .hchar');

/* Begin-staat: alles verborgen */
gsap.set(heroChars, { y: 70, opacity: 0, transformOrigin: 'bottom center' });
gsap.set(['.hero-eyebrow', '.hero-sub', '.hero-actions'], { opacity: 0, y: 22 });


/* Entrance timeline — gestart door preloader */
const heroTl = gsap.timeline({ paused: true });

heroTl
  /* 1. Eyebrow label */
  .to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
  /* 2. Titel letters een voor een */
  .to(heroChars, {
    y: 0, opacity: 1,
    duration: 0.5,
    stagger: { amount: 0.8, from: 'start' },
    ease: 'power3.out',
  }, 0.25)
  /* 3. Subtitel */
  .to('.hero-sub', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0.85)
  /* 4. CTA knoppen */
  .to('.hero-actions', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 1.0);

/* ══════════════════════════════════════════
   MORPHING TEKST — hero accent woord
   Dissolve cyclus: Websites → Resultaten → Meesterwerken
   Start 2.5s na einde hero entrance
══════════════════════════════════════════ */
if (!prefersReducedMotion) {
  const _morphWords = ['Websites', 'Resultaten', 'Meesterwerken'];
  let   _morphIdx   = 0;
  const _accentWord = document.querySelector('.hero-headline .word.accent');

  function _doMorph() {
    if (!_accentWord) return;
    const chars = Array.from(_accentWord.querySelectorAll('.hchar'));
    if (!chars.length) return;

    const nextWord = _morphWords[_morphIdx];
    _morphIdx = (_morphIdx + 1) % _morphWords.length;

    /* Fade uit — blur dissolve vanuit midden naar buiten */
    gsap.to(chars, {
      opacity: 0, filter: 'blur(9px)',
      duration: 0.42,
      stagger: { amount: 0.18, from: 'center' },
      ease: 'power2.in',
      onComplete() {
        /* Vervang tekst door volgend woord */
        _accentWord.innerHTML = '';
        const newChars = [];
        [...nextWord].forEach(ch => {
          const s = document.createElement('span');
          s.className   = 'hchar';
          s.style.color = 'var(--gold)';
          s.textContent = ch === ' ' ? '\u00A0' : ch;
          _accentWord.appendChild(s);
          newChars.push(s);
        });

        gsap.set(newChars, { opacity: 0, filter: 'blur(9px)' });

        /* Fade in — blur dissolve vanuit midden naar buiten */
        gsap.to(newChars, {
          opacity: 1, filter: 'blur(0px)',
          duration: 0.55,
          stagger: { amount: 0.22, from: 'center' },
          ease: 'power3.out',
          onComplete() {
            newChars.forEach(c => gsap.set(c, { clearProps: 'filter' }));
            gsap.delayedCall(3.0, _doMorph); /* plan volgende morph */
          },
        });
      },
    });
  }

  /* Koppel aan einde van hero entrance */
  heroTl.eventCallback('onComplete', () => gsap.delayedCall(2.5, _doMorph));
}

/* ══════════════════════════════════════════
   PARALLAX — diepte-effect bij scrollen
══════════════════════════════════════════ */
if (!prefersReducedMotion) {
  /* Particles bewegen langzamer dan de scroll */
  gsap.to('#hero-particles', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.8 },
    y: '25%',
    ease: 'none',
  });
  /* Tekst beweegt iets sneller → diepte-effect */
  gsap.to('.hero-inner', {
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 0.5 },
    y: '15%',
    ease: 'none',
  });
}

/* ══════════════════════════════════════════
   COUNTER ANIMATION — stats bar
══════════════════════════════════════════ */
const counters = document.querySelectorAll('.stat-num[data-target]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = +el.dataset.target;
    const suffix = el.nextElementSibling?.textContent.includes('%') ? '' : '';
    gsap.to({ val: 0 }, {
      val: target,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: function() { el.textContent = Math.round(this.targets()[0].val); },
      onComplete: () => { el.textContent = target; },
    });
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObs.observe(c));

/* ══════════════════════════════════════════
   GSAP LETTER-SPLIT HELPER
══════════════════════════════════════════ */
function splitChars(el) {
  /* Doorloopt tekstnodes recursief en wikkelt elk teken in een .char span */
  const walk = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const txt = node.textContent;
      const frag = document.createDocumentFragment();
      [...txt].forEach(ch => {
        if (ch === ' ' || ch === '\u00A0') {
          const s = document.createElement('span');
          s.className = 'char-space';
          frag.appendChild(s);
        } else {
          const s = document.createElement('span');
          s.className = 'char';
          s.textContent = ch;
          frag.appendChild(s);
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.nodeName !== 'BR') {
      [...node.childNodes].forEach(walk);
    }
  };
  [...el.childNodes].forEach(walk);
  return el.querySelectorAll('.char');
}

/* ══════════════════════════════════════════
   SCROLL ANIMATIONS — lazy via IntersectionObserver
   GSAP ScrollTriggers registreren pas als sectie
   binnen 200px van viewport komt.
══════════════════════════════════════════ */

/* Stats bar (direct onder hero, kleine margin) */
whenNear('#stats-bar', () => {
  gsap.from('.stat-cell', {
    scrollTrigger: { trigger: '#stats-bar', start: 'top 88%' },
    y: 30, opacity: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out',
  });
});

/* Over Ons */
whenNear('#over-ons', () => {
  revealClip('.oo-img-box');
  parallax('.oo-img-inner', { yPercent: 15 });
  fadeUp('.oo-eyebrow');

  (function () {
    const titleEl = document.querySelector('.oo-title');
    if (!titleEl) return;
    const lines = [
      { text: 'Wij Maken',     color: 'var(--white)' },
      { text: 'Digitale',      color: 'var(--white)' },
      { text: 'Meesterwerken', color: 'var(--gold)'  },
    ];
    titleEl.innerHTML = lines.map(l =>
      `<span class="oo-line" style="display:block;overflow:hidden;padding-bottom:.06em;">` +
      `<span class="oo-line-inner" style="display:block;color:${l.color}">${l.text}</span></span>`
    ).join('');
    if (prefersReducedMotion) return;
    gsap.from('.oo-line-inner', {
      scrollTrigger: { trigger: titleEl, start: 'top 84%' },
      y: '110%', opacity: 0, duration: 0.85, stagger: 0.14, ease: 'power4.out',
    });
  })();

  fadeUp('.oo-body',   { stagger: 0.12, delay: 0.15 });
  fadeUp('.oo-cta',    { delay: 0.2 });
  fadeUp('.oo-values > div', { stagger: 0.12, trigger: '.oo-values', delay: 0.1 });
});

/* Diensten */
whenNear('#diensten', () => {
  fadeUp('#diensten .diensten-head', { y: 40, trigger: '#diensten .diensten-head' });
  gsap.from('.pricing-grid .pc', {
    scrollTrigger: { trigger: '.pricing-grid', start: 'top 78%' },
    y: 70, opacity: 0, duration: 0.85, stagger: 0.14, ease: 'power3.out',
  });
  fadeUp('.onderhoud', { y: 40, trigger: '.onderhoud' });
});

/* Chatbot pricing — toggle logica direct, animaties lazy */
(function initChatbotPricing() {
  const toggle     = document.getElementById('cb-billing-toggle');
  const grid       = document.getElementById('cb-grid');
  const labelMonth = document.getElementById('cb-monthly-label');
  const labelYear  = document.getElementById('cb-yearly-label');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const yearly = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', yearly ? 'true' : 'false');
    grid.classList.toggle('yearly-mode', yearly);
    labelMonth.classList.toggle('active', !yearly);
    labelYear.classList.toggle('active', yearly);
  });

  if (!prefersReducedMotion) {
    whenNear('#chatbot-pricing', () => {
      gsap.from('#chatbot-pricing .diensten-head', {
        scrollTrigger: { trigger: '#chatbot-pricing', start: 'top 82%' },
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
      });
      gsap.from('.cb-toggle-wrap', {
        scrollTrigger: { trigger: '#chatbot-pricing', start: 'top 82%' },
        y: 25, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out',
      });
      gsap.from('.cb-card', {
        scrollTrigger: { trigger: '#chatbot-pricing .cb-grid', start: 'top 80%' },
        y: 60, opacity: 0, duration: 0.85, stagger: 0.14, ease: 'power3.out',
      });
      gsap.from('.cb-footnote', {
        scrollTrigger: { trigger: '.cb-footnote', start: 'top 90%' },
        y: 20, opacity: 0, duration: 0.7, ease: 'power3.out',
      });
    });
  }
})();

/* Laptop animatie — werkwijze sectie */
(function initMacAnim() {
  const wrap      = document.getElementById('ww-mac-wrap');
  const lid       = document.getElementById('ww-mac-lid');
  const display   = document.getElementById('ww-mac-display');
  const cards     = Array.from(document.querySelectorAll('.ww-mac-step-card'));
  const termWrap  = document.getElementById('ww-mac-terminal');
  const termLines = Array.from(document.querySelectorAll('#ww-term-body .ww-term-line'));
  if (!wrap || !lid) return;

  /* ── Klok: toon actuele tijd in macOS-stijl ── */
  const clockEl = document.getElementById('ww-mac-time');
  if (clockEl) {
    const updateClock = () => {
      const now = new Date();
      clockEl.textContent =
        now.getHours().toString().padStart(2,'0') + ':' +
        now.getMinutes().toString().padStart(2,'0');
    };
    updateClock();
    setInterval(updateClock, 30000);
  }

  /* ── Prefill data-text content ── */
  cards.forEach(card => {
    const title = card.querySelector('.ww-ms-title');
    const body  = card.querySelector('.ww-ms-body');
    if (title) title.dataset.text = title.dataset.text || title.textContent;
    if (body)  body.dataset.text  = body.dataset.text  || body.textContent;
    if (title) title.textContent = '';
    if (body)  body.textContent  = '';
  });
  termLines.forEach(line => { line.textContent = ''; });

  /* ── Begintoestand ── */
  gsap.set(wrap, { y: 55, opacity: 0 });
  gsap.set(lid,  { rotationX: 88, transformPerspective: 1200 });
  gsap.set(display, { opacity: 0 });

  /* ── Reduced motion: toon alles direct zonder animatie ── */
  if (prefersReducedMotion) {
    gsap.set(wrap, { opacity: 1, y: 0 });
    gsap.set(lid,  { rotationX: -8 });
    gsap.set(display, { opacity: 1 });
    cards.forEach(card => {
      const title = card.querySelector('.ww-ms-title');
      const body  = card.querySelector('.ww-ms-body');
      gsap.set(card, { opacity: 1, y: 0 });
      if (title) title.textContent = title.dataset.text;
      if (body)  body.textContent  = body.dataset.text;
      card.classList.add('card-lit');
    });
    display.classList.add('glow-active');
    if (termWrap) termWrap.classList.add('term-visible');
    termLines.forEach(line => {
      line.textContent = line.dataset.text;
      gsap.set(line, { opacity: 1 });
    });
    return;
  }

  /* ── Hoofd-timeline ── */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#werkwijze',
      start: 'top 62%',
      once: true,
    },
  });

  /* 1. Laptop verschijnt vanuit onderen */
  tl.to(wrap, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });

  /* 2. Scherm klapt open: 88° → -8° */
  tl.to(lid, {
    rotationX: -8,
    duration: 1.2,
    ease: 'power2.inOut',
  }, '+=0.08');

  /* 3. Scherm wordt zichtbaar (lit) */
  tl.to(display, { opacity: 1, duration: 0.55, ease: 'power2.out' }, '-=0.35');

  /* 4. Stappen verschijnen één voor één */
  cards.forEach((card, i) => {
    const titleEl = card.querySelector('.ww-ms-title');
    const bodyEl  = card.querySelector('.ww-ms-body');
    const offset  = i === 0 ? '+=0.1' : '-=0.25';

    /* Kaart flitst op in goud, dan normaal */
    tl.to(card, {
      opacity: 1, y: 0,
      duration: 0.45,
      ease: 'power2.out',
      onStart() {
        /* Goud flash */
        gsap.fromTo(card,
          { filter: 'brightness(2.5) saturate(4)' },
          { filter: 'brightness(1) saturate(1)', duration: 0.65, ease: 'power2.out' }
        );
        card.classList.add('card-lit');
      },
    }, offset);

    if (titleEl && titleEl.dataset.text)
      typewriterTo(tl, titleEl, titleEl.dataset.text, titleEl.dataset.text.length * 0.032, `>-0.1`);

    if (bodyEl && bodyEl.dataset.text)
      typewriterTo(tl, bodyEl, bodyEl.dataset.text, bodyEl.dataset.text.length * 0.012, `>-0.05`);
  });

  /* 5. Activeer scherm-glow pulsering na reveal */
  tl.add(() => display.classList.add('glow-active'), '+=0.2');

  /* 6. Terminal verschijnt en typt regels één voor één */
  tl.add(() => {
    if (termWrap) termWrap.classList.add('term-visible');
  }, '+=0.15');

  termLines.forEach((line, i) => {
    const txt = line.dataset.text || '';
    line.textContent = '';
    tl.to(line, { opacity: 1, duration: 0.15, ease: 'none' }, i === 0 ? '+=0.05' : '-=0.05');
    typewriterTo(tl, line, txt, txt.length * 0.028, '>');
  });
})();

/* Portfolio */
whenNear('#portfolio', () => {
  fadeUp('.pf-head', { y: 35 });
});

/* Reviews */
whenNear('#reviews', () => {
  fadeUp('.rev-head');
});

/* Contact */
whenNear('#contact', () => {
  gsap.from('.ct-info', {
    scrollTrigger: { trigger: '#contact', start: 'top 78%' },
    x: -50, opacity: 0, duration: 1, ease: 'power3.out',
  });
  gsap.from('.ct-form', {
    scrollTrigger: { trigger: '#contact', start: 'top 73%' },
    x: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.08,
  });
});

/* Footer */
whenNear('footer', () => {
  fadeUp('.ft-grid > div', { stagger: 0.12, trigger: 'footer' });
});

/* ══════════════════════════════════════════
   PARALLAX — meerdere snelheden
══════════════════════════════════════════ */
if (!isMobile && !prefersReducedMotion) {
  /* Sectie koppen bewegen trager dan de content */
  gsap.to('.ww-head', {
    scrollTrigger: { trigger: '#werkwijze', scrub: 1.2 },
    y: -40, ease: 'none',
  });
  gsap.to('.rev-head', {
    scrollTrigger: { trigger: '#reviews', scrub: 1 },
    y: -35, ease: 'none',
  });
  gsap.to('.diensten-head', {
    scrollTrigger: { trigger: '#diensten', scrub: 1 },
    y: -30, ease: 'none',
  });

  /* Stats bar - lichte parallax omhoog */
  gsap.to('#stats-bar', {
    scrollTrigger: { trigger: '#stats-bar', scrub: 0.8 },
    y: -20, ease: 'none',
  });

  /* Over Ons monogram watermark — langzame drijfbeweging */
  gsap.to('#over-ons::before', { y: 0 }); /* CSS pseudo helaas niet via GSAP */

  /* Decoratieve goud-glow blobs bewegen bij scrollen */
  gsap.to('#diensten', {
    scrollTrigger: { trigger: '#diensten', scrub: 2 },
    backgroundPositionY: '40px',
    ease: 'none',
  });
}

/* ══════════════════════════════════════════
   3D TILT — portfolio kaarten
══════════════════════════════════════════ */
if (!isMobile) {
  document.querySelectorAll('.pf-slide').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width  - 0.5;
      const cy = (e.clientY - r.top)  / r.height - 0.5;
      gsap.to(card, {
        rotateY:             cx * 18,
        rotateX:            -cy * 12,
        transformPerspective: 900,
        duration:            0.45,
        ease:                'power2.out',
        overwrite:           'auto',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0, rotateX: 0,
        duration: 0.7,
        ease:     'elastic.out(1, 0.55)',
        overwrite: 'auto',
      });
    });
    /* Subtiele goud glinstering op de bovenrand */
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
      card.style.setProperty('--tilt-x', x);
    });
  });
}

/* ══════════════════════════════════════════
   PRICING CARD — mouse glow
══════════════════════════════════════════ */
document.querySelectorAll('.pc').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  });
});

/* ══════════════════════════════════════════
   NAV scroll
══════════════════════════════════════════ */
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => {
  navEl.classList.toggle('solid', window.scrollY > 60);
}, { passive: true });

/* Mobile menu */
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mob-menu');
const mobClose  = document.getElementById('mob-close');
hamburger.addEventListener('click', () => {
  mobMenu.classList.add('open');
  mobMenu.scrollTop = 0;
  hamburger.setAttribute('aria-expanded', 'true');
});
mobClose.addEventListener('click', () => {
  mobMenu.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
});
mobMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ══════════════════════════════════════════
   PORTFOLIO — 3D Boog Carrousel
   Middelste kaart: scale 1.0 · Zijkaarten: scale 0.76
   + rotateY ±44° + z -200px · Auto 5s · GSAP 3D
══════════════════════════════════════════ */
(function initPf3D() {
  const scene = document.getElementById('pf-3d-scene');
  const stage = document.getElementById('pf-3d-stage');
  if (!stage) return;
  const items = Array.from(stage.querySelectorAll('.pf-3d-item'));
  const dots  = Array.from(document.querySelectorAll('.pf-3d-dot'));
  const total = items.length;
  let cur     = 0;
  let autoTimer = null;

  /* ── Responsieve kaartbreedte ── */
  function cardW() {
    return window.innerWidth < 600 ? 280
         : window.innerWidth < 768 ? 300
         : window.innerWidth < 900 ? 380
         : 500;
  }

  /* ── Positie-configuratie per relatieve slot ── */
  function getConf(rel) {
    const gap = Math.round(cardW() * 0.88);
    if (rel === 0)  return { x: 0,    rotationY: 0,   scale: 1.00, opacity: 1.0, zIndex: 10 };
    if (rel === -1) return { x: -gap, rotationY:  44, scale: 0.76, opacity: 1.0, zIndex:  5 };
    if (rel ===  1) return { x:  gap, rotationY: -44, scale: 0.76, opacity: 1.0, zIndex:  5 };
    /* Ver buiten beeld (toekomstige uitbreiding > 3 kaarten) */
    return { x: rel < 0 ? -1200 : 1200, rotationY: rel < 0 ? 70 : -70, scale: 0.4, opacity: 0, zIndex: 1 };
  }

  /* ── Relatieve positie t.o.v. huidige index ── */
  function relPos(i) {
    let d = (i - cur + total) % total;
    if (d > Math.floor(total / 2)) d -= total;
    return d;
  }

  /* ── Plaats alle kaarten (animate=false → direct zetten) ── */
  function place(animate) {
    items.forEach((el, i) => {
      const c = getConf(relPos(i));
      (animate ? gsap.to : gsap.set)(el, {
        x: c.x, rotationY: c.rotationY,
        scale: c.scale, opacity: c.opacity, zIndex: c.zIndex,
        duration: animate ? 0.72 : 0,
        ease: 'power3.out',
        overwrite: true,
      });
    });
    dots.forEach((d, i) => d.classList.toggle('active', i === cur));
  }

  /* ── Iframe-schaling (zit hier zodat initPfIframeScale niet meer nodig is) ── */
  function scaleIframes() {
    requestAnimationFrame(() => {
      document.querySelectorAll('.pf-iframe-outer').forEach(outer => {
        const scaler = outer.querySelector('.pf-iframe-scaler');
        if (!scaler) return;
        const w = outer.offsetWidth;
        const h = outer.offsetHeight;
        if (!w || !h) return;
        scaler.style.transform = `scale(${w / 1440})`;
        scaler.style.height = Math.round(h / (w / 1440)) + 'px';
      });
    });
  }

  /* ── Navigatie ── */
  function loadIframe(idx) {
    const iframe = items[idx] && items[idx].querySelector('iframe[data-src]');
    if (iframe) { iframe.src = iframe.dataset.src; iframe.removeAttribute('data-src'); }
  }
  function goTo(idx) {
    cur = ((idx % total) + total) % total;
    loadIframe(cur);
    place(true);
    scaleIframes();
  }
  function next() { goTo(cur + 1); }
  function prev() { goTo(cur - 1); }

  /* ── Autoplay ── */
  function startAuto() { stopAuto(); autoTimer = setInterval(next, 5000); }
  function stopAuto()  { clearInterval(autoTimer); autoTimer = null; }

  /* ── Klik op zijkaart → navigeer ── */
  items.forEach((el, i) => {
    el.addEventListener('click', () => {
      if (i !== cur) { stopAuto(); goTo(i); startAuto(); }
    });
  });

  /* ── Pijlen ── */
  document.getElementById('pf-nav-prev').addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  document.getElementById('pf-nav-next').addEventListener('click', () => { stopAuto(); next(); startAuto(); });

  /* ── Stipjes ── */
  dots.forEach((dot, i) => dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); }));

  /* ── Hover: pauzeer autoplay ── */
  scene.addEventListener('mouseenter', stopAuto);
  scene.addEventListener('mouseleave', startAuto);

  /* ── Resize: herpositioneer zonder animatie ── */
  window.addEventListener('resize', () => { place(false); scaleIframes(); }, { passive: true });

  /* ── Init ── */
  gsap.set(items, { transformPerspective: 1400 });
  place(false);
  scaleIframes();
  requestAnimationFrame(() => requestAnimationFrame(scaleIframes));

  /* Laad eerste iframe pas wanneer portfolio in beeld komt */
  const pfSection = document.getElementById('portfolio');
  if (pfSection && 'IntersectionObserver' in window) {
    const pfObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { loadIframe(0); pfObserver.disconnect(); }
    }, { rootMargin: '200px' });
    pfObserver.observe(pfSection);
  } else {
    loadIframe(0);
  }

  startAuto();
})();

/* ══════════════════════════════════════════
   REVIEWS — eigen scroll-snap carrousel
   Vervangt Swiper (151KB) — geen afhankelijkheid
══════════════════════════════════════════ */
(function () {
  const track   = document.getElementById('rev-track');
  const dotsEl  = document.getElementById('rev-dots');
  const prevBtn = document.querySelector('.rev-prev');
  const nextBtn = document.querySelector('.rev-next');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.rev-slide'));
  const total  = slides.length;
  let current  = 0;
  let autoTimer;

  /* Dots aanmaken */
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.className = 'rev-dot';
    d.setAttribute('role', 'tab');
    d.setAttribute('aria-label', `Review ${i + 1}`);
    d.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  });
  const dots = Array.from(dotsEl.children);

  function updateUI(idx) {
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === idx);
      d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
    });
    slides.forEach((sl, i) => {
      const card = sl.querySelector('.rev-card');
      if (!card) return;
      card.classList.toggle('is-active', i === idx);
      gsap.to(card, {
        scale:    i === idx ? 1.03 : 0.97,
        opacity:  i === idx ? 1    : 0.65,
        duration: 0.55,
        ease:     'power2.out',
      });
    });
  }

  /* Scrollt alleen de track horizontaal — geen effect op paginascroll */
  function scrollTrackTo(slide) {
    const trackRect   = track.getBoundingClientRect();
    const slideRect   = slide.getBoundingClientRect();
    const paddingLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    track.scrollTo({
      left: track.scrollLeft + slideRect.left - trackRect.left - paddingLeft,
      behavior: 'smooth',
    });
  }

  function goTo(idx) {
    current = ((idx % total) + total) % total;
    scrollTrackTo(slides[current]);
    updateUI(current);
  }

  function resetAutoplay() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => { goTo(current + 1); }, 4800);
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  /* Sync dots bij handmatig scrollen (touch/muis) */
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const trackMid = track.getBoundingClientRect().left + track.clientWidth / 2;
      let closest = 0, minDist = Infinity;
      slides.forEach((sl, i) => {
        const rect = sl.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width / 2 - trackMid);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      if (closest !== current) { current = closest; updateUI(current); }
    }, 80);
  }, { passive: true });

  /* Pauzeer autoplay bij hover */
  track.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track.addEventListener('mouseleave', resetAutoplay);

  /* Init: geen scroll (slide 0 staat al op positie 0), wel UI + timer starten */
  updateUI(0);
  resetAutoplay();
})();

/* ══════════════════════════════════════════
   CONTACT FORM
══════════════════════════════════════════ */
const ctFormEl = document.getElementById('ct-form');
if (ctFormEl) ctFormEl.addEventListener('submit', function (e) {
  e.preventDefault();

  /* ── Validatie ── */
  const naam   = document.getElementById('f-naam');
  const email  = document.getElementById('f-email');
  const errors = [];

  /* Naam: verplicht, min 2 tekens */
  if (!naam.value.trim() || naam.value.trim().length < 2) {
    errors.push('Vul een geldige naam in (minimaal 2 tekens).');
    naam.style.borderColor = 'rgba(220,60,60,.7)';
  } else {
    naam.style.borderColor = '';
  }

  /* E-mail: verplicht + basisformaat */
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRe.test(email.value.trim())) {
    errors.push('Vul een geldig e-mailadres in.');
    email.style.borderColor = 'rgba(220,60,60,.7)';
  } else {
    email.style.borderColor = '';
  }

  /* Honeypot: als ingevuld → bot, stille weigering */
  const hp = document.getElementById('f-honeypot');
  if (hp && hp.value) return;

  if (errors.length) {
    let errDiv = document.getElementById('ct-form-errors');
    if (!errDiv) {
      errDiv = document.createElement('div');
      errDiv.id = 'ct-form-errors';
      errDiv.style.cssText = 'color:#e06060;font-size:.78rem;margin-top:-.4rem;line-height:1.7;';
      document.querySelector('.form-submit').before(errDiv);
    }
    errDiv.textContent = errors.join(' ');
    return;
  }

  /* Verwijder eventuele foutmelding */
  const errDiv = document.getElementById('ct-form-errors');
  if (errDiv) errDiv.remove();

  const btn  = this.querySelector('.btn span');
  const orig = btn.textContent;
  const form = this;
  const payload = {
    naam:     document.getElementById('f-naam').value.trim(),
    email:    document.getElementById('f-email').value.trim(),
    bedrijf:  document.getElementById('f-bedrijf').value.trim(),
    pakket:   document.getElementById('f-pakket').value,
    bericht:  document.getElementById('f-bericht').value.trim(),
    honeypot: document.getElementById('f-honeypot').value,
  };

  btn.textContent = 'Versturen…';
  form.querySelectorAll('input, select, textarea, button').forEach(function(el) { el.disabled = true; });

  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    if (data.success) {
      btn.textContent = 'Verzonden ✓';
      form.querySelectorAll('input, select, textarea').forEach(function(el) { el.value = ''; });
      setTimeout(function() {
        btn.textContent = orig;
        form.querySelectorAll('input, select, textarea, button').forEach(function(el) { el.disabled = false; });
      }, 4000);
    } else {
      throw new Error(data.error || 'Onbekende fout');
    }
  })
  .catch(function(err) {
    var div = document.getElementById('ct-form-errors');
    if (!div) {
      div = document.createElement('div');
      div.id = 'ct-form-errors';
      div.style.cssText = 'color:#e06060;font-size:.78rem;margin-top:-.4rem;line-height:1.7;';
      document.querySelector('.form-submit').before(div);
    }
    div.textContent = err.message || 'Versturen mislukt. Probeer het opnieuw of bel ons direct.';
    btn.textContent = orig;
    form.querySelectorAll('input, select, textarea, button').forEach(function(el) { el.disabled = false; });
  });
});

/* Page visibility — pause Three.js via tab switch handled by rAF natively */

/* ══════════════════════════════════════════
   MAGNETIC BUTTONS — "Start Jouw Project" & "Ons Portfolio"
   Knoppen trekken magnetisch naar de cursor toe
   Elastische terugveeranimatie bij mouseleave
══════════════════════════════════════════ */
(function initMagneticBtns() {
  if (prefersReducedMotion || isMobile) return;

  /* Hero CTA + Over Ons knoppen */
  document.querySelectorAll('.hero-cta, .oo-cta .btn').forEach(btn => {
    const inner = btn.querySelector('span') || btn.firstElementChild;

    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  * 0.5)) * 0.38;
      const dy = (e.clientY - (r.top  + r.height * 0.5)) * 0.38;
      gsap.to(btn,   { x: dx,        y: dy,        duration: 0.25, ease: 'power2.out', overwrite: true });
      if (inner) gsap.to(inner, { x: dx * 0.18, y: dy * 0.18, duration: 0.25, ease: 'power2.out', overwrite: true });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn,   { x: 0, y: 0, duration: 0.72, ease: 'elastic.out(1.1, 0.4)', overwrite: true });
      if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.72, ease: 'elastic.out(1.1, 0.4)', overwrite: true });
    });
  });
})();
