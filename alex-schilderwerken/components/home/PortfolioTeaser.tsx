"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import AnimatedSection from "@/components/ui/AnimatedSection";

const easeInQuad = (t: number) => t * t;
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

type TeaserProject = {
  id: number;
  label: string;
  category: string;
  description: string;
  before: string;
  after: string;
};

const projects: TeaserProject[] = [
  {
    id: 1,
    label: "Pand",
    category: "Buiten",
    description: "Buitenschilderwerk gevel",
    before: "/alex-schilderwerken/Huis 1 before.jpeg",
    after: "/alex-schilderwerken/Huis 1 after.jpeg",
  },
  {
    id: 2,
    label: "Trap",
    category: "Binnen",
    description: "Binnenschilderwerk trap",
    before: "/alex-schilderwerken/Trap before.jpeg",
    after: "/alex-schilderwerken/Trap after.jpeg",
  },
  {
    id: 3,
    label: "Raam",
    category: "Houtrot",
    description: "Houtrotreparatie kozijn",
    before: "/alex-schilderwerken/Houtrot raam before.jpeg",
    after: "/alex-schilderwerken/Houtrot raam after.jpeg",
  },
];

function AnimatedCompareCard({
  before,
  after,
  label,
  altText,
  objectFit = "cover",
  objectPosition = "center",
}: {
  before: string;
  after: string;
  label: string;
  altText?: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const afterLayerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const hasPlayed = useRef(false);

  const runAnimation = useCallback(() => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;

    const DELAY = 250;
    const PHASE1 = 550;
    const PHASE2 = 2400;

    const startTime = performance.now();

    const tick = (now: number) => {
      const el = afterLayerRef.current;
      if (!el) return;

      const elapsed = now - startTime;
      let clipRight: number;

      if (elapsed < DELAY) {
        clipRight = 0;
      } else {
        const t1 = Math.min((elapsed - DELAY) / PHASE1, 1);
        if (t1 < 1) {
          clipRight = easeInQuad(t1) * 100;
        } else {
          const t2 = Math.min((elapsed - DELAY - PHASE1) / PHASE2, 1);
          clipRight = (1 - easeOutQuad(t2)) * 100;
        }
      }

      el.style.clipPath = `inset(0 ${clipRight}% 0 0)`;

      if (elapsed < DELAY + PHASE1 + PHASE2) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        el.style.clipPath = "inset(0 0% 0 0)";
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [runAnimation]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={before}
        alt={`${altText ?? label}, voor`}
        className="absolute inset-0 w-full h-full"
        style={{ objectFit, objectPosition }}
      />
      <div
        ref={afterLayerRef}
        className="absolute inset-0"
        style={{ clipPath: "inset(0 0% 0 0)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={after}
          alt={`${altText ?? label}, na`}
          className="absolute inset-0 w-full h-full"
          style={{ objectFit, objectPosition }}
        />
      </div>
    </div>
  );
}

export default function PortfolioTeaser() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const lightboxProject = projects.find((p) => p.id === lightbox) ?? null;

  return (
    <section className="py-28 bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-14">
          <div>
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase block mb-3">
              Recent werk
            </span>
            <h2 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-none">
              Portfolio
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="group flex-shrink-0 inline-flex items-center gap-2 border border-border hover:border-accent/50 text-muted hover:text-foreground px-6 py-3 text-sm font-semibold rounded-sm transition-all duration-500"
          >
            Bekijk alle projecten
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </AnimatedSection>

        {/* Asymmetric grid: left large (row-span-2), right two stacked */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:grid-rows-2 lg:h-[600px]">

          {/* Left: Buitenschilderwerk — spans both rows */}
          <motion.button
            onClick={() => setLightbox(1)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="group relative overflow-hidden rounded-sm bg-background border border-border cursor-pointer h-72 lg:h-auto lg:row-span-2 transition-shadow duration-500 hover:shadow-glow-md"
          >
            <AnimatedCompareCard
              before={projects[0].before}
              after={projects[0].after}
              label={projects[0].label}
              altText={projects[0].description}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="text-[10px] text-accent tracking-[0.2em] uppercase font-semibold">
                Buiten
              </span>
              <p className="text-foreground font-semibold mt-1">Buitenschilderwerk</p>
              <p className="text-foreground/50 text-xs mt-0.5">Voor / na</p>
            </div>
          </motion.button>

          {/* Right top: Trap — binnenschilderwerk */}
          <motion.button
            onClick={() => setLightbox(2)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="group relative overflow-hidden rounded-sm bg-background border border-border cursor-pointer h-56 lg:h-auto transition-shadow duration-500 hover:shadow-glow-md"
          >
            <AnimatedCompareCard
              before={projects[1].before}
              after={projects[1].after}
              label={projects[1].label}
              altText={projects[1].description}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-[10px] text-accent tracking-[0.2em] uppercase font-semibold">
                Binnen
              </span>
              <p className="text-foreground font-semibold mt-1 text-sm">Binnenschilderwerk</p>
              <p className="text-foreground/50 text-xs mt-0.5">Voor / na</p>
            </div>
          </motion.button>

          {/* Right bottom: Raam houtrot */}
          <motion.button
            onClick={() => setLightbox(3)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="group relative overflow-hidden rounded-sm bg-background border border-border cursor-pointer h-56 lg:h-auto transition-shadow duration-500 hover:shadow-glow-md"
          >
            <AnimatedCompareCard
              before={projects[2].before}
              after={projects[2].after}
              label={projects[2].label}
              altText={projects[2].description}
              objectFit="cover"
              objectPosition="center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-[10px] text-accent tracking-[0.2em] uppercase font-semibold">
                Houtrot
              </span>
              <p className="text-foreground font-semibold mt-1 text-sm">Houtrotreparaties</p>
              <p className="text-foreground/50 text-xs mt-0.5">Voor / na</p>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Lightbox — zelfde als portfolio pagina */}
      <AnimatePresence>
        {lightbox !== null && lightboxProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative flex flex-col cursor-default rounded-lg overflow-hidden border border-border bg-card"
              style={{ width: "fit-content", boxShadow: "0 25px 60px rgba(0,0,0,0.7)" }}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors text-lg leading-none"
                aria-label="Sluiten"
              >
                ×
              </button>
              <div style={{ width: "100%", maxHeight: "80vh", overflow: "hidden" }}>
                <ReactCompareSlider
                  itemOne={
                    <ReactCompareSliderImage
                      src={lightboxProject.before}
                      alt={`${lightboxProject.description}, voor`}
                      style={{ width: "100%", height: "80vh", objectFit: "contain" }}
                    />
                  }
                  itemTwo={
                    <ReactCompareSliderImage
                      src={lightboxProject.after}
                      alt={`${lightboxProject.description}, na`}
                      style={{ width: "100%", height: "80vh", objectFit: "contain" }}
                    />
                  }
                  style={{ width: "100%", height: "80vh" }}
                />
              </div>
              <div className="px-4 py-3 border-t border-border">
                <p className="text-foreground font-semibold text-sm">
                  {lightboxProject.label}
                </p>
                <p className="text-muted text-xs mt-0.5">
                  {lightboxProject.description}
                </p>
                <p className="text-accent text-xs mt-1 opacity-70">
                  Schuif de slider om voor/na te vergelijken
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
