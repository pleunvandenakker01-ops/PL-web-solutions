"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import Link from "next/link";

// ── Timing constanten ─────────────────────────────────────────────
const T = {
  photo:    0.0,
  badge:    0.3,
  word1:    0.6,
  word2:    0.9,
  subtitle: 1.2,
  buttons:  1.5,
  scroll:   1.8,
};

// ── Letter animatie ───────────────────────────────────────────────
const letterVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

function AnimatedWord({
  text,
  startDelay,
  glow = false,
}: {
  text: string;
  startDelay: number;
  glow?: boolean;
}) {
  return (
    <span className="inline-flex" style={{ overflow: "visible" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          custom={startDelay + i * 0.04}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          className={char === " " ? "inline-block w-[0.28em]" : `inline-block${glow ? " letter-glow" : ""}`}
          style={{ willChange: "transform, opacity" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

// ── Magnetic button ───────────────────────────────────────────────
function MagneticButton({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    if (Math.hypot(e.clientX - cx, e.clientY - cy) < 80) {
      x.set((e.clientX - cx) * 0.4);
      y.set((e.clientY - cy) * 0.4);
    }
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="inline-flex">
      <motion.div style={{ x: springX, y: springY }}>
        <Link href={href} className={className} data-hover>
          {children}
        </Link>
      </motion.div>
    </div>
  );
}

// ── Rotating badge ────────────────────────────────────────────────
function RotatingBadge() {
  const text = "OFFICIEEL GEDIPLOMEERD · BA-VERZEKERD · ";
  return (
    <div className="relative w-28 h-28 lg:w-32 lg:h-32">
      <div className="absolute inset-0 rounded-full border border-accent/20 animate-pulse-slow" />
      <svg viewBox="0 0 120 120" className="w-full h-full animate-spin-badge" aria-hidden>
        <defs>
          <path id="bc" d="M 60,60 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
        </defs>
        <text className="fill-muted" fontSize="9.5" letterSpacing="1.8" fontFamily="var(--font-inter)">
          <textPath href="#bc" startOffset="0%">{text}{text}</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-accent" />
      </div>
    </div>
  );
}

// ── Main Hero ─────────────────────────────────────────────────────
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 700], [0, 120]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingBottom: 120 }}
    >
      {/* ── Achtergrond met parallax ── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 scale-110 pointer-events-none"
      >
        {/* Video: cinematisch reveal */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1.0, opacity: 1 }}
          transition={{ duration: 2.0, delay: T.photo, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
            }}
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </motion.div>

        {/* Gradient overlay 135deg */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(8,12,20,0.88) 0%, rgba(8,12,20,0.45) 55%, rgba(27,58,107,0.25) 100%)",
          }}
        />

        {/* Extra bodem-verduistering voor leesbaarheid */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 30%, rgba(8,12,20,0.65) 100%)",
          }}
        />
      </motion.div>

      {/* ── Badge rechts boven ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: T.badge + 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-28 right-6 lg:top-32 lg:right-12 z-20"
      >
        <RotatingBadge />
      </motion.div>

      {/* ── Content ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-36 w-full">

        {/* Badge label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: T.badge, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-2.5 border border-primary/35 bg-primary/12 text-accent px-5 py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase rounded-sm backdrop-blur-sm">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            Schildersbedrijf · Sinds 2018
          </span>
        </motion.div>

        {/* Headline */}
        <h1
          className="font-display font-bold leading-[0.92] tracking-[-0.02em] mb-8 select-none"
          style={{ overflow: "visible" }}
        >
          {/* "Vakmanschap" — per letter met hover glow */}
          <div
            className="text-foreground mb-2"
            style={{ fontSize: "clamp(52px, 7.5vw, 96px)", overflow: "visible" }}
          >
            <AnimatedWord text="Vakmanschap" startDelay={T.word1} glow />
          </div>

          {/* "dat je ziet." — shimmer sweep als geheel woord */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: T.word2, ease: [0.22, 1, 0.36, 1] }}
            className="shimmer-accent"
            style={{ fontSize: "clamp(52px, 7.5vw, 96px)", overflow: "visible", lineHeight: 1.15, paddingBottom: "0.1em" }}
          >
            dat je ziet.
          </motion.div>
        </h1>

        {/* Subtekst */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: T.subtitle, ease: [0.22, 1, 0.36, 1] }}
          style={{ color: "#ffffff", fontWeight: 300, fontSize: "1.1rem", lineHeight: 1.85, letterSpacing: "0.02em", maxWidth: 460, textShadow: "0 1px 12px rgba(0,0,0,0.4)" }}
          className="mb-14"
        >
          Gediplomeerd schilder met 8 jaar vakervaring in binnenschilderwerk,
          buitenschilderwerk en houtrotreparaties. Elk project netjes, duurzaam en op maat afgewerkt.
        </motion.p>

        {/* Magnetic buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: T.buttons,
          }}
          className="flex flex-wrap gap-4"
        >
          <MagneticButton
            href="/contact"
            className="group inline-flex items-center gap-3 bg-primary hover:bg-accent text-foreground px-8 py-4 text-sm font-semibold tracking-wide rounded-sm transition-all duration-500 shadow-glow-sm hover:shadow-glow-md"
          >
            Vraag een offerte aan
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MagneticButton>

          <MagneticButton
            href="/portfolio"
            className="group inline-flex items-center gap-3 border border-border hover:border-accent/50 text-muted hover:text-foreground px-8 py-4 text-sm font-semibold tracking-wide rounded-sm transition-all duration-500 backdrop-blur-sm"
          >
            Bekijk het werk
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </MagneticButton>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: T.scroll, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span className="text-muted/60 text-[9px] tracking-[0.3em] uppercase font-medium">
          Scroll
        </span>
        <div className="relative w-px h-12 overflow-hidden bg-border/40">
          <motion.div
            className="absolute top-0 left-0 w-full bg-accent"
            animate={{ y: ["0%", "100%"] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.3 }}
            style={{ height: "40%" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
