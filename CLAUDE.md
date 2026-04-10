# PL Web Solutions — Design & Code Richtlijnen

## Merk & Kleurenpalet

- **Primaire kleuren:** Zwart (`#000000` / `#0a0a0a`) en Goud (`#C9A84C` / `#F0C060`)
- **Achtergronden:** Altijd donker (zwart of diepdonker grijs)
- **Accenten:** Subtiele lichtgradienten over donkere achtergronden (bv. radial gradient van goud met lage opacity)
- **Typografie:** Cinematisch, groot, in HOOFDLETTERS voor headings

---

## Scroll-animaties (GSAP + ScrollTrigger)

- Gebruik **altijd GSAP** voor animaties — geen CSS-only of andere JS-bibliotheken
- Koppel animaties aan scrollen via **ScrollTrigger**
- Standaard tekst-animaties bij scrollen:
  - **Fade-in + slide-up** voor paragrafen, labels en body-tekst
  - **Staggered fade-in** voor lijsten en grid-items
- Voorbeeld basispatroon:

```js
gsap.from(".hero-title", {
  scrollTrigger: { trigger: ".hero-title", start: "top 80%" },
  y: 60,
  opacity: 0,
  duration: 1,
  ease: "power3.out"
});
```

---

## Hero Secties

- Altijd **fullscreen** (`height: 100vh`)
- Verplicht **parallax-effect** op achtergrondbeelden via GSAP ScrollTrigger:

```js
gsap.to(".hero-bg", {
  scrollTrigger: { trigger: ".hero", scrub: true },
  y: "30%",
  ease: "none"
});
```

- Grote cinematische titel in HOOFDLETTERS, gecentreerd of links uitgelijnd
- Subtiele lichtgradient over de hero overlay (bv. goud radiaal, 10–20% opacity)

---

## Typografie

- Headings: **cinematisch groot**, altijd HOOFDLETTERS, serif of bold sans-serif
- Body: licht grijs op donkere achtergrond (bv. `#cccccc`)
- Letter-spacing op headings: ruim (`letter-spacing: 0.05em` of meer)
- Gebruik `clamp()` voor responsive font-groottes

---

## Beeldanimaties

- Beelden **bewegen bij scrollen** (parallax) via GSAP ScrollTrigger met `scrub: true`
- Beelden verschijnen met een **clip-path reveal** of scale-from-center animatie:

```js
gsap.from(".image-block", {
  scrollTrigger: { trigger: ".image-block", start: "top 85%" },
  clipPath: "inset(100% 0 0 0)",
  duration: 1.2,
  ease: "power4.out"
});
```

---

## Sliders

- Gebruik **Swiper.js** voor alle sliders/carousels
- Horizontale richting standaard
- Voeg altijd toe: navigatiepijlen, pagination dots, en `loop: true`
- Voorbeeld initialisatie:

```js
new Swiper(".swiper", {
  direction: "horizontal",
  loop: true,
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  pagination: { el: ".swiper-pagination", clickable: true },
  slidesPerView: 1,
  breakpoints: {
    768: { slidesPerView: 2 },
    1200: { slidesPerView: 3 }
  }
});
```

---

## Mobiel-vriendelijkheid

- **Mobile-first** CSS aanpak
- Alle GSAP-animaties testen op touch-apparaten (ScrollTrigger werkt op mobile)
- Swiper touch/swipe standaard ingeschakeld
- Typografie via `clamp()` zodat headings nooit te groot worden op klein scherm
- Geen horizontale scroll op mobile (overflow-x hidden op body)
- Parallax-effecten op mobile verminderen of uitschakelen als ze de performance schaden:

```js
const isMobile = window.innerWidth < 768;
if (!isMobile) {
  // parallax animaties
}
```

---

## Vaste Bibliotheken

| Bibliotheek    | Gebruik                          | CDN / Versie                                           |
|----------------|----------------------------------|--------------------------------------------------------|
| GSAP           | Alle animaties                   | `gsap@3.12.5`                                          |
| ScrollTrigger  | Scroll-gestuurde animaties       | GSAP plugin — altijd registreren                       |
| MotionPath     | Animaties langs SVG-pad          | GSAP plugin                                            |
| TextPlugin     | Typewriter tekst-animaties       | GSAP plugin                                            |
| Three.js       | 3D particle achtergrond          | `three@0.165.0`                                        |
| Swiper.js      | Sliders en carousels             | `swiper@11`                                            |
| Lottie Web     | JSON-animaties (AE / Rive)       | `lottie-web@5.12.2`                                    |

Kopieer de volledige CDN-blokken altijd uit `libs.html` — dat bestand is de enige bron van waarheid voor versies en volgorde.

---

## Standaard Projectstructuur

Elk nieuw project begint met deze drie bestanden:

```
project/
├── index.html       ← bevat <head> blok uit libs.html
├── three-bg.js      ← kopieer uit /pl-web-solutions/three-bg.js
└── script.js        ← projectspecifiek, importeert helpers uit libs.html
```

---

## Verplichte Standaard Per Nieuw Project

### 1. CDN-imports (in `<head>` en onderaan `<body>`)

Altijd het volledige blok uit `libs.html` gebruiken — niet los losse scripts toevoegen.

```html
<!-- HEAD -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

<!-- BODY (vóór eigen script) -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/MotionPathPlugin.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/TextPlugin.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie.min.js"></script>
<script src="three-bg.js"></script>
```

### 2. GSAP plugin-registratie (bovenaan elk script)

```js
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin);
```

### 3. Three.js particle achtergrond in de hero

Elke hero-sectie krijgt automatisch een `ThreeBG` particle achtergrond.
Gebruik de goud-preset tenzij het project een ander kleurenschema vraagt:

```js
// Standaard — goud (PL Web Solutions huisstijl)
const heroBG = ThreeBGPresets.gold('#hero');

// Alternatief per project
const heroBG = new ThreeBG('#hero', {
  count:         6000,
  color:         0xC9A84C,   // pas aan naar projectkleur
  mouseStrength: 0.55,
  connections:   true,
});
```

Regels:
- De hero container moet `position: relative` hebben
- `three-bg.js` moet geladen zijn vóór het aanroepen van `ThreeBG`
- Op mobiel schaalt de particle-count automatisch terug (zie `three-bg.js`)
- Roep `heroBG.destroy()` aan als de pagina of sectie verwijderd wordt

### 4. GSAP ScrollTrigger animaties (verplicht op alle secties)

Gebruik de utility-functies uit `libs.html` — schrijf geen ScrollTrigger-code
van nul als een helper al bestaat:

```js
// Fade-up op elke sectie-heading
fadeUp('.section-title');
fadeUp('.section-body', { stagger: 0.15, delay: 0.1 });

// Clip-path reveal op afbeeldingen
revealClip('.project-image');

// Parallax op achtergrondlagen (auto-skip op mobile)
parallax('.hero-bg', { yPercent: 25 });

// Typewriter voor taglines
typewrite('.hero-tagline', 'Jouw tekst hier.');
```

Regels:
- **Elke sectie** krijgt minimaal `fadeUp()` op de heading en body-tekst
- **Elke afbeelding** of visueel blok krijgt `revealClip()`
- **Hero achtergrond** krijgt `parallax()` als er geen `ThreeBG` actief is
- Gebruik `prefersReducedMotion` check (ingebouwd in helpers) — geen aparte check nodig
- Parallax altijd met `skipMobile: true` (is de default)

### 5. Swiper.js voor alle sliders

```js
new Swiper('.swiper', {
  loop:      true,
  grabCursor: true,
  navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
  pagination: { el: '.swiper-pagination', clickable: true },
  breakpoints: {
    640:  { slidesPerView: 1.3 },
    900:  { slidesPerView: 2.2 },
    1200: { slidesPerView: 3   },
  },
});
```

---

## Checklist Nieuw Project

Doorloop deze lijst bij elk nieuw project voordat je code schrijft:

- [ ] `libs.html` CDN-blokken gekopieerd naar `<head>` en `<body>`
- [ ] `three-bg.js` staat in de projectmap
- [ ] `gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin)` staat bovenaan het script
- [ ] Hero heeft `ThreeBGPresets.gold('#hero')` of aangepaste `ThreeBG` instantie
- [ ] Elke sectie-heading heeft `fadeUp()`
- [ ] Elke afbeelding heeft `revealClip()`
- [ ] Sliders gebruiken Swiper.js
- [ ] Geen horizontale overflow op mobiel (`overflow-x: hidden` op `body`)
- [ ] Typografie via `clamp()` voor responsive groottes
- [ ] Kleuren: zwart + goud tenzij klant een ander palet vraagt

---

## Samenvatting Stijlregels

1. Donkere achtergrond, goud als accent
2. Fullscreen hero met Three.js particle achtergrond (`ThreeBGPresets.gold`)
3. Tekst animeert via `fadeUp()` helper (GSAP + ScrollTrigger)
4. Afbeeldingen via `revealClip()` helper
5. Achtergrondlagen via `parallax()` helper
6. Cinematische HOOFDLETTERS typografie met `clamp()`
7. Horizontale Swiper.js sliders
8. Altijd mobielvriendelijk — parallax en particles schalen terug op mobiel
