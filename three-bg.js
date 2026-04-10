/**
 * three-bg.js — PL Web Solutions
 * ─────────────────────────────────────────────────────────────
 * Herbruikbare interactieve 3D particle achtergrond via Three.js.
 * Reageert op muisbewegingen (desktop) en gyroscoop (mobiel).
 *
 * VEREISTEN (in HTML voor dit script laden):
 *   <script src="https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.min.js"></script>
 *   <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
 *
 * GEBRUIK — minimaal:
 *   const bg = new ThreeBG('#hero');
 *
 * GEBRUIK — volledig geconfigureerd:
 *   const bg = new ThreeBG('#hero', {
 *     count:        6000,
 *     color:        0xC9A84C,
 *     secondColor:  0xffffff,
 *     size:         0.012,
 *     depth:        4,
 *     speed:        0.0004,
 *     mouseStrength: 0.6,
 *     wave:         true,
 *     waveStrength: 0.3,
 *     connections:  true,
 *     connectDist:  0.5,
 *     connectOpacity: 0.08,
 *     fog:          true,
 *     onReady:      () => console.log('klaar'),
 *   });
 *
 * METHODEN:
 *   bg.pause()       — stop de animatieloop
 *   bg.resume()      — herstart de animatieloop
 *   bg.setColor(hex) — verander de hoofdkleur live (bv. 0xff0000)
 *   bg.destroy()     — verwijder canvas + eventlisteners volledig
 * ─────────────────────────────────────────────────────────────
 */

class ThreeBG {
  /**
   * @param {string|HTMLElement} container  - CSS selector of DOM element
   * @param {object}             opts       - Configuratie (zie boven)
   */
  constructor(container, opts = {}) {
    this._el = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    if (!this._el) {
      console.warn('[ThreeBG] Container niet gevonden:', container);
      return;
    }

    // ── Defaults samenvoegen met gebruikersopties ──────────
    this._cfg = Object.assign({
      count:          5000,       // Aantal particles
      color:          0xC9A84C,   // Primaire kleur (goud)
      secondColor:    0xffffff,   // Secundaire kleur (wit)
      colorMix:       0.15,       // 0–1: fractie secondColor particles
      size:           0.010,      // Particle grootte
      depth:          4,          // Z-diepte van het veld
      speed:          0.0003,     // Rotatiesnelheid passief
      mouseStrength:  0.55,       // Hoe sterk muis de camera beïnvloedt
      gyroStrength:   0.4,        // Hoe sterk gyroscoop reageert (mobiel)
      wave:           true,       // Vloeiende golfbeweging door het veld
      waveSpeed:      0.6,        // Golfsnelheid
      waveStrength:   0.25,       // Golfamplitude
      connections:    true,       // Lijnen tussen nabije particles
      connectDist:    0.45,       // Max afstand voor verbindingen
      connectOpacity: 0.07,       // Lijnopaciteit
      fog:            true,       // WebGL fog voor dieptegefoel
      fogNear:        2,
      fogFar:         8,
      zIndex:         0,          // CSS z-index van canvas
      onReady:        null,       // Callback als alles klaar is
    }, opts);

    this._mouse   = { x: 0, y: 0, tx: 0, ty: 0 };
    this._paused  = false;
    this._clock   = null;
    this._raf     = null;

    this._init();
  }

  // ── Setup ──────────────────────────────────────────────────

  _init() {
    this._setupContainer();
    this._setupRenderer();
    this._setupScene();
    this._setupCamera();
    this._setupParticles();
    if (this._cfg.connections) this._setupLines();
    this._setupEvents();
    this._clock = { start: performance.now() };
    this._animate();
    if (typeof this._cfg.onReady === 'function') this._cfg.onReady();
  }

  _setupContainer() {
    const style = getComputedStyle(this._el);
    if (style.position === 'static') this._el.style.position = 'relative';
  }

  _setupRenderer() {
    this._renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha:     true,
    });
    this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._renderer.setClearColor(0x000000, 0);

    const canvas = this._renderer.domElement;
    canvas.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: ${this._cfg.zIndex};
      pointer-events: none;
    `;
    this._el.appendChild(canvas);
    this._canvas = canvas;
    this._resize();
  }

  _setupScene() {
    this._scene = new THREE.Scene();
    if (this._cfg.fog) {
      this._scene.fog = new THREE.Fog(
        0x000000,
        this._cfg.fogNear,
        this._cfg.fogFar
      );
    }
  }

  _setupCamera() {
    const { width, height } = this._size();
    this._camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    this._camera.position.set(0, 0, 3);
  }

  // ── Particles ─────────────────────────────────────────────

  _setupParticles() {
    const cfg   = this._cfg;
    const count = cfg.count;

    const positions = new Float32Array(count * 3);
    const colors    = new Float32Array(count * 3);
    const sizes     = new Float32Array(count);
    const phases    = new Float32Array(count); // golffase per particle

    const cPrimary = new THREE.Color(cfg.color);
    const cSecond  = new THREE.Color(cfg.secondColor);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Verspreid in een ellipsoid volume
      const r     = Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);

      positions[i3]     = r * 3.5 * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * 2.0 * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = (Math.random() - 0.5) * cfg.depth;

      // Kleur: mix van primair en secundair
      const col = Math.random() < cfg.colorMix ? cSecond : cPrimary;
      // Lichte variatie in helderheid per particle
      const bright = 0.5 + Math.random() * 0.5;
      colors[i3]     = col.r * bright;
      colors[i3 + 1] = col.g * bright;
      colors[i3 + 2] = col.b * bright;

      sizes[i]  = cfg.size * (0.4 + Math.random() * 1.4);
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position',  new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color',     new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aSize',     new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase',    new THREE.BufferAttribute(phases, 1));

    // Bewaar originele Y-posities voor golfanimatie
    this._origY = new Float32Array(positions.filter((_, i) => i % 3 === 1));

    const mat = new THREE.ShaderMaterial({
      vertexColors:  true,
      transparent:   true,
      depthWrite:    false,
      blending:      THREE.AdditiveBlending,

      uniforms: {
        uTime:         { value: 0 },
        uWave:         { value: cfg.wave ? 1.0 : 0.0 },
        uWaveStrength: { value: cfg.waveStrength },
        uWaveSpeed:    { value: cfg.waveSpeed },
      },

      vertexShader: /* glsl */`
        attribute float aSize;
        attribute float aPhase;
        varying vec3  vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uWave;
        uniform float uWaveStrength;
        uniform float uWaveSpeed;

        void main() {
          vColor = color;

          // Golfbeweging in Y
          vec3 pos = position;
          float wave = uWave * uWaveStrength
            * sin(uTime * uWaveSpeed + aPhase + pos.x * 1.2);
          pos.y += wave;

          vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
          gl_Position   = projectionMatrix * mvPos;

          // Grootte afnemen met afstand (perspectief)
          gl_PointSize  = aSize * (380.0 / -mvPos.z);

          // Fade op afstand
          float dist = length(mvPos.xyz);
          vAlpha = clamp(1.0 - dist * 0.18, 0.1, 1.0);
        }
      `,

      fragmentShader: /* glsl */`
        varying vec3  vColor;
        varying float vAlpha;

        void main() {
          // Zachte cirkel per particle
          vec2  uv   = gl_PointCoord - 0.5;
          float dist = length(uv);
          if (dist > 0.5) discard;

          // Radiale glow: helder in midden, transparant naar buiten
          float alpha = vAlpha * (1.0 - smoothstep(0.0, 0.5, dist));
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
    });

    this._particles    = new THREE.Points(geo, mat);
    this._particlesMat = mat;
    this._particlesGeo = geo;
    this._scene.add(this._particles);
  }

  // ── Verbindingslijnen ──────────────────────────────────────

  _setupLines() {
    // Gebruik een aparte decimated set voor performance
    const cfg      = this._cfg;
    const srcPos   = this._particlesGeo.attributes.position.array;
    const sample   = Math.min(cfg.count, 800); // max 800 punten voor lijnen
    const step      = Math.floor(cfg.count / sample);

    const maxLines  = sample * 4;
    const linePos   = new Float32Array(maxLines * 6);
    const lineAlpha = new Float32Array(maxLines * 2);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos,  3).setUsage(THREE.DynamicDrawUsage));
    lineGeo.setAttribute('alpha',    new THREE.BufferAttribute(lineAlpha, 1).setUsage(THREE.DynamicDrawUsage));
    lineGeo.setDrawRange(0, 0);

    const lineMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
      uniforms: {
        uColor:   { value: new THREE.Color(cfg.color) },
        uOpacity: { value: cfg.connectOpacity },
      },
      vertexShader: /* glsl */`
        attribute float alpha;
        varying   float vAlpha;
        void main() {
          vAlpha      = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */`
        uniform vec3  uColor;
        uniform float uOpacity;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(uColor, vAlpha * uOpacity);
        }
      `,
    });

    this._lines     = new THREE.LineSegments(lineGeo, lineMat);
    this._linesGeo  = lineGeo;
    this._linesMat  = lineMat;
    this._lineSrc   = { srcPos, sample, step };
    this._scene.add(this._lines);
  }

  _updateLines() {
    const { srcPos, sample, step } = this._lineSrc;
    const maxDist = this._cfg.connectDist;
    const posArr  = this._linesGeo.attributes.position.array;
    const alpArr  = this._linesGeo.attributes.alpha.array;
    let   ptr     = 0;

    for (let a = 0; a < sample; a++) {
      const ia = a * step * 3;
      const ax = srcPos[ia], ay = srcPos[ia + 1], az = srcPos[ia + 2];

      for (let b = a + 1; b < sample; b++) {
        const ib  = b * step * 3;
        const dx  = ax - srcPos[ib];
        const dy  = ay - srcPos[ib + 1];
        const dz  = az - srcPos[ib + 2];
        const d2  = dx*dx + dy*dy + dz*dz;

        if (d2 < maxDist * maxDist && ptr < posArr.length / 6 - 1) {
          const alpha = 1 - Math.sqrt(d2) / maxDist;
          const base  = ptr * 6;
          posArr[base]     = ax;    posArr[base + 1] = ay;    posArr[base + 2] = az;
          posArr[base + 3] = srcPos[ib]; posArr[base + 4] = srcPos[ib + 1]; posArr[base + 5] = srcPos[ib + 2];
          alpArr[ptr * 2]     = alpha;
          alpArr[ptr * 2 + 1] = alpha;
          ptr++;
        }
      }
    }

    this._linesGeo.setDrawRange(0, ptr * 2);
    this._linesGeo.attributes.position.needsUpdate = true;
    this._linesGeo.attributes.alpha.needsUpdate    = true;
  }

  // ── Events ────────────────────────────────────────────────

  _setupEvents() {
    this._onMouseMove  = this._handleMouse.bind(this);
    this._onTouch      = this._handleTouch.bind(this);
    this._onDeviceOri  = this._handleGyro.bind(this);
    this._onResize     = this._resize.bind(this);
    this._onVisibility = this._handleVisibility.bind(this);

    window.addEventListener('mousemove',         this._onMouseMove,  { passive: true });
    window.addEventListener('touchmove',         this._onTouch,      { passive: true });
    window.addEventListener('deviceorientation', this._onDeviceOri,  { passive: true });
    window.addEventListener('resize',            this._onResize);
    document.addEventListener('visibilitychange',this._onVisibility);
  }

  _handleMouse(e) {
    const rect = this._el.getBoundingClientRect();
    // Normaliseer naar -1 … +1 relatief aan container
    this._mouse.tx = ((e.clientX - rect.left)  / rect.width  - 0.5) * 2;
    this._mouse.ty = -((e.clientY - rect.top)  / rect.height - 0.5) * 2;
  }

  _handleTouch(e) {
    if (!e.touches.length) return;
    const rect = this._el.getBoundingClientRect();
    this._mouse.tx = ((e.touches[0].clientX - rect.left) / rect.width  - 0.5) * 2;
    this._mouse.ty = -((e.touches[0].clientY - rect.top) / rect.height - 0.5) * 2;
  }

  _handleGyro(e) {
    if (e.beta === null) return;
    const g = this._cfg.gyroStrength;
    this._mouse.tx = (e.gamma / 45)  * g;
    this._mouse.ty = (e.beta  / 90 - 0.5) * g;
  }

  _handleVisibility() {
    document.hidden ? this.pause() : this.resume();
  }

  _resize() {
    const w = this._el.offsetWidth;
    const h = this._el.offsetHeight;
    if (!w || !h) return;
    this._renderer.setSize(w, h);
    if (this._camera) {
      this._camera.aspect = w / h;
      this._camera.updateProjectionMatrix();
    }
  }

  _size() {
    return { width: this._el.offsetWidth, height: this._el.offsetHeight };
  }

  // ── Animatieloop ──────────────────────────────────────────

  _animate() {
    if (this._paused) return;

    this._raf = requestAnimationFrame(this._animate.bind(this));

    const t = (performance.now() - this._clock.start) * 0.001;

    // Shader tijduniform updaten (golf)
    this._particlesMat.uniforms.uTime.value = t;

    // Muispositie smooth interpoleren
    this._mouse.x += (this._mouse.tx - this._mouse.x) * 0.04;
    this._mouse.y += (this._mouse.ty - this._mouse.y) * 0.04;

    const ms = this._cfg.mouseStrength;

    // Camera beweegt licht mee met muis (niet de particles zelf)
    this._camera.position.x += (this._mouse.x * ms * 0.5 - this._camera.position.x) * 0.06;
    this._camera.position.y += (this._mouse.y * ms * 0.3 - this._camera.position.y) * 0.06;
    this._camera.lookAt(0, 0, 0);

    // Passieve langzame rotatie van het gehele particle-veld
    this._particles.rotation.y += this._cfg.speed;
    this._particles.rotation.x  = this._mouse.y * 0.08;
    this._particles.rotation.z  = this._mouse.x * 0.04;

    // Verbindingslijnen updaten (elke 3 frames voor performance)
    if (this._cfg.connections && Math.round(t * 60) % 3 === 0) {
      this._updateLines();
    }

    this._renderer.render(this._scene, this._camera);
  }

  // ── Publieke API ──────────────────────────────────────────

  /** Stop de animatieloop */
  pause() {
    this._paused = true;
    cancelAnimationFrame(this._raf);
  }

  /** Herstart de animatieloop */
  resume() {
    if (!this._paused) return;
    this._paused = false;
    this._animate();
  }

  /**
   * Verander de particle kleur live
   * @param {number} hex - bv. 0xff0000
   */
  setColor(hex) {
    this._cfg.color = hex;
    const col = new THREE.Color(hex);
    const colArr = this._particlesGeo.attributes.color.array;
    const cSecond = new THREE.Color(this._cfg.secondColor);
    for (let i = 0; i < colArr.length; i += 3) {
      const isSecond = colArr[i] === cSecond.r;
      const src = isSecond ? cSecond : col;
      const bright = 0.5 + Math.random() * 0.5;
      colArr[i]     = src.r * bright;
      colArr[i + 1] = src.g * bright;
      colArr[i + 2] = src.b * bright;
    }
    this._particlesGeo.attributes.color.needsUpdate = true;
    if (this._cfg.connections) {
      this._linesMat.uniforms.uColor.value.set(hex);
    }
  }

  /** Verwijder alles en ruim geheugen op */
  destroy() {
    this.pause();
    window.removeEventListener('mousemove',          this._onMouseMove);
    window.removeEventListener('touchmove',          this._onTouch);
    window.removeEventListener('deviceorientation',  this._onDeviceOri);
    window.removeEventListener('resize',             this._onResize);
    document.removeEventListener('visibilitychange', this._onVisibility);

    this._particlesGeo.dispose();
    this._particlesMat.dispose();
    if (this._cfg.connections) {
      this._linesGeo.dispose();
      this._linesMat.dispose();
    }
    this._renderer.dispose();
    this._canvas.remove();
  }
}


/* ─────────────────────────────────────────────────────────────
   PRESET FABRIEK — kant-en-klare stijlen
   ─────────────────────────────────────────────────────────────
   Gebruik:
     const bg = ThreeBGPresets.gold('#hero');
     const bg = ThreeBGPresets.midnight('#hero');
     const bg = ThreeBGPresets.sparse('#hero');
     const bg = ThreeBGPresets.dense('#hero');
   ───────────────────────────────────────────────────────────── */
const ThreeBGPresets = {

  /** Goud — PL Web Solutions huisstijl */
  gold(container, overrides = {}) {
    return new ThreeBG(container, Object.assign({
      count:          6000,
      color:          0xC9A84C,
      secondColor:    0xF0C060,
      colorMix:       0.3,
      size:           0.010,
      depth:          4,
      speed:          0.0003,
      mouseStrength:  0.55,
      wave:           true,
      connections:    true,
      connectDist:    0.45,
      connectOpacity: 0.07,
    }, overrides));
  },

  /** Donkerblauw nacht-preset */
  midnight(container, overrides = {}) {
    return new ThreeBG(container, Object.assign({
      count:          5000,
      color:          0x3366ff,
      secondColor:    0x00ccff,
      colorMix:       0.25,
      size:           0.009,
      depth:          5,
      speed:          0.0002,
      mouseStrength:  0.5,
      wave:           true,
      connections:    true,
      connectOpacity: 0.06,
    }, overrides));
  },

  /** Sober — weinig particles, sterke glow */
  sparse(container, overrides = {}) {
    return new ThreeBG(container, Object.assign({
      count:          1500,
      color:          0xC9A84C,
      secondColor:    0xffffff,
      colorMix:       0.1,
      size:           0.018,
      depth:          3,
      speed:          0.0002,
      mouseStrength:  0.7,
      wave:           false,
      connections:    false,
    }, overrides));
  },

  /** Dicht — maximale particle dichtheid */
  dense(container, overrides = {}) {
    return new ThreeBG(container, Object.assign({
      count:          10000,
      color:          0xC9A84C,
      secondColor:    0xff9900,
      colorMix:       0.2,
      size:           0.007,
      depth:          6,
      speed:          0.0004,
      mouseStrength:  0.4,
      wave:           true,
      waveStrength:   0.4,
      connections:    false,
    }, overrides));
  },
};
