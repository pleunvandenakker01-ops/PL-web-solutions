/* ============================================
   Ristorante Bella Vista — JavaScript
   ============================================ */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}

// Close menu on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});

// ---- Menu tabs ----
const tabBtns     = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.menu-tab-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;

    tabBtns.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    btn.classList.add('active');
    const el = document.getElementById(`tab-${target}`);
    if (el) {
      el.classList.add('active');
      // Animate cards in
      el.querySelectorAll('.menu-card, .wine-item').forEach((card, i) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 60);
      });
    }
  });
});

// ---- Set minimum date for reservation form ----
const datumInput = document.getElementById('datum');
if (datumInput) {
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  datumInput.min = `${yyyy}-${mm}-${dd}`;
}

// ---- Contact / Reservation form ----
const form    = document.getElementById('reservationForm');
const success = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn  = form.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    span.textContent = 'Bezig met verzenden...';
    btn.disabled = true;

    // Simulate async send (replace with real fetch/API call)
    setTimeout(() => {
      form.style.display = 'none';
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  });
}

// ---- Scroll fade-in animations ----
function revealOnScroll() {
  document.querySelectorAll('.fade-up').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add('visible');
    }
  });
}

// Add fade-up class to key elements
document.addEventListener('DOMContentLoaded', () => {
  const targets = [
    '.menu-card',
    '.hours-card',
    '.contact-item',
    '.about-highlights .highlight',
    '.wine-category',
  ];
  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => el.classList.add('fade-up'));
  });

  revealOnScroll();
});

window.addEventListener('scroll', revealOnScroll, { passive: true });

// ---- Active nav link highlight on scroll ----
const sections = document.querySelectorAll('section[id], div[id="reserveren"]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--gold-light)';
    }
  });
}, { passive: true });

// ---- Smooth anchor scroll for older browsers ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ============================================
   GSAP ANIMATIONS — Bella Vista
   ============================================ */
(function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* 1 ── Hero parallax ── */
  gsap.to('.hero-bg', {
    y: '25%',
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  /* HERO ── letter entrance · shimmer · fade-ins ── */
  (function heroEntranceAnimations() {
    const h1 = document.querySelector('.hero-content h1');
    if (!h1) return;

    // ── Split text into individual char spans ───────────────────
    function splitChars(container, label) {
      container.setAttribute('aria-label', label);
      container.innerHTML = '';
      return [...label].map(ch => {
        const s = document.createElement('span');
        s.className = 'bv-char';
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        container.appendChild(s);
        return s;
      });
    }

    // Wrap "Ristorante" (text node) in a span so we can split it
    const firstTextNode = h1.firstChild;
    const ristoWrap = document.createElement('span');
    ristoWrap.className = 'bv-risto';
    h1.insertBefore(ristoWrap, firstTextNode);
    ristoWrap.appendChild(firstTextNode);
    const ristoChars = splitChars(ristoWrap, 'Ristorante');

    // Split <em>Bella Vista</em>
    const em = h1.querySelector('em');
    const bellaChars = splitChars(em, 'Bella Vista');

    // ── Initial hidden state (via GSAP — no CSS override needed) ─
    gsap.set([...ristoChars, ...bellaChars], { autoAlpha: 0, y: 22 });
    gsap.set(['.hero-tagline', '.hero-sub', '.hero-buttons', '.hero-scroll'], {
      autoAlpha: 0, y: 28,
    });

    // ── Timeline ──────────────────────────────────────────────────
    const tl = gsap.timeline({ delay: 0.2 });

    // "Welkom bij" tagline
    tl.to('.hero-tagline', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' });

    // "Ristorante" — letter by letter
    tl.to(ristoChars, {
      autoAlpha: 1, y: 0,
      stagger: 0.045,
      duration: 0.6,
      ease: 'power3.out',
    }, '+=0.05');

    // "Bella Vista" — letter by letter (overlaps slightly)
    tl.to(bellaChars, {
      autoAlpha: 1, y: 0,
      stagger: 0.055,
      duration: 0.65,
      ease: 'power3.out',
    }, '-=0.18');

    // Subtitle
    tl.to('.hero-sub', { autoAlpha: 1, y: 0, duration: 0.85, ease: 'power3.out' }, '+=0.18');

    // Buttons (container fades in as one)
    tl.to('.hero-buttons', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '+=0.1');

    // Scroll indicator
    tl.to('.hero-scroll', { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '+=0.2');

    // Activate golden shimmer after entrance completes
    tl.call(() => {
      // overflow:hidden needed so the ::after pseudo sweeps inside bounds
      em.style.position = 'relative';
      em.style.overflow = 'hidden';
      em.classList.add('bv-shimmer-active');
    }, [], '+=0.3');
  })();

  /* 2 ── Menu card photo zoom-in on hover (enhanced via GSAP on mouseenter/leave) ── */
  document.querySelectorAll('.menu-card-img').forEach(wrap => {
    const img = wrap.querySelector('img');
    if (!img) return;
    wrap.addEventListener('mouseenter', () => {
      gsap.to(img, { scale: 1.12, duration: 0.55, ease: 'power2.out' });
    });
    wrap.addEventListener('mouseleave', () => {
      gsap.to(img, { scale: 1, duration: 0.55, ease: 'power2.out' });
    });
  });

  /* 3 ── Counting numbers: 25+, 100%, 4.9 ── */
  document.querySelectorAll('.highlight-number').forEach(el => {
    const raw    = el.textContent.trim();
    const num    = parseFloat(raw);
    const suffix = raw.replace(/[\d.]/g, '');
    const dec    = raw.includes('.') ? 1 : 0;
    const obj    = { v: 0 };

    gsap.to(obj, {
      v: num,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      onUpdate() { el.textContent = obj.v.toFixed(dec) + suffix; },
      onComplete() { el.textContent = raw; },
    });
  });

  /* 4 ── Smooth scroll-triggered fade-in on sections ── */
  const fadeSels = [
    '.section-header',
    '.about-text',
    '.about-image',
    '.wine-banner',
    '.menu-note',
    '.reviews-summary',
    '.reviews-cta',
    '.contact-header',
    '.contact-info',
    '.contact-form-wrap',
    '.site-copyright',
  ];
  fadeSels.forEach(sel => {
    gsap.utils.toArray(sel).forEach(el => {
      gsap.from(el, {
        opacity: 0,
        y: 52,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          once: true,
        },
      });
    });
  });

  /* 6 ── Reviews auto-scrolling carousel ── */
  (function initRevCarousel() {
    const grid = document.querySelector('.reviews-grid');
    if (!grid) return;

    const cards = Array.from(grid.children);

    // Build wrapper + scrolling track
    const outer = document.createElement('div');
    outer.className = 'rev-carousel-outer';
    const track = document.createElement('div');
    track.className = 'rev-carousel-track';
    outer.appendChild(track);
    grid.parentNode.insertBefore(outer, grid);

    // Move cards into track (drop featured span styling)
    cards.forEach(c => {
      c.classList.remove('featured');
      track.appendChild(c);
    });
    grid.remove();

    // Clone set for seamless infinite loop
    cards.forEach(c => {
      const clone = c.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });

    // Measure after layout paint, then run ticker
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        let totalW = 0;
        const GAP  = 24; // matches CSS gap: 1.5rem ≈ 24px
        cards.forEach(c => { totalW += c.offsetWidth + GAP; });

        let x      = 0;
        let paused = false;

        gsap.ticker.add(() => {
          if (paused) return;
          x -= 0.65;
          if (x <= -totalW) x += totalW;
          gsap.set(track, { x });
        });

        outer.addEventListener('mouseenter', () => { paused = true; });
        outer.addEventListener('mouseleave', () => { paused = false; });

        // Touch pause
        outer.addEventListener('touchstart', () => { paused = true; }, { passive: true });
        outer.addEventListener('touchend',   () => {
          setTimeout(() => { paused = false; }, 1200);
        }, { passive: true });
      });
    });
  })();

  /* 7 ── Photo gallery drag/swipe ── */
  (function initPhotoDrag() {
    const strip = document.querySelector('.photo-strip');
    if (!strip) return;

    let isDown    = false;
    let startX    = 0;
    let scrollLeft = 0;

    strip.addEventListener('mousedown', e => {
      isDown = true;
      strip.classList.add('is-dragging');
      startX     = e.pageX - strip.offsetLeft;
      scrollLeft = strip.scrollLeft;
      e.preventDefault();
    });

    document.addEventListener('mouseup', () => {
      isDown = false;
      strip.classList.remove('is-dragging');
    });

    strip.addEventListener('mousemove', e => {
      if (!isDown) return;
      const x  = e.pageX - strip.offsetLeft;
      strip.scrollLeft = scrollLeft - (x - startX) * 1.5;
    });

    // Touch support
    strip.addEventListener('touchstart', e => {
      startX     = e.touches[0].pageX - strip.offsetLeft;
      scrollLeft = strip.scrollLeft;
    }, { passive: true });

    strip.addEventListener('touchmove', e => {
      const x  = e.touches[0].pageX - strip.offsetLeft;
      strip.scrollLeft = scrollLeft - (x - startX) * 1.5;
    }, { passive: true });
  })();

})();
