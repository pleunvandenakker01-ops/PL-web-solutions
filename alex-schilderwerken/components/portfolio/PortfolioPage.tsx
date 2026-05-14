"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import AnimatedSection from "@/components/ui/AnimatedSection";

const categories = [
  { id: "all", label: "Alles" },
  { id: "buiten", label: "Buitenschilderwerk" },
  { id: "binnen", label: "Binnenschilderwerk" },
  { id: "houtrot", label: "Houtrotreparaties" },
];

type Project = {
  id: number;
  cat: string;
  label: string;
  description?: string;
} & (
  | { type: "compare"; before: string; after: string }
  | { type: "single"; src: string }
);

const projects: Project[] = [
  {
    id: 1,
    cat: "buiten",
    label: "Pand",
    description: "Buitenschilderwerk gevel",
    type: "compare",
    before: "/alex-schilderwerken/Huis 1 before.jpeg",
    after: "/alex-schilderwerken/Huis 1 after.jpeg",
  },
  {
    id: 2,
    cat: "buiten",
    label: "Pand",
    description: "Gevel geschilderd",
    type: "compare",
    before: "/alex-schilderwerken/Huis 2 before.jpeg",
    after: "/alex-schilderwerken/Huis 2 after (2).jpeg",
  },
  {
    id: 3,
    cat: "buiten",
    label: "Pand",
    description: "Kozijnen en gevel geschilderd",
    type: "compare",
    before: "/alex-schilderwerken/Huis 3 before.jpeg",
    after: "/alex-schilderwerken/Huis 3 after.jpeg",
  },
  {
    id: 5,
    cat: "buiten",
    label: "Pand",
    description: "Buitenschilderwerk",
    type: "compare",
    before: "/alex-schilderwerken/Huis bes before.jpeg",
    after: "/alex-schilderwerken/Huis bes after.jpeg",
  },
  {
    id: 6,
    cat: "buiten",
    label: "Voordeur",
    description: "Voordeur geschilderd",
    type: "compare",
    before: "/alex-schilderwerken/Deur before 1.jpeg",
    after: "/alex-schilderwerken/Deur after 1.jpeg",
  },
  {
    id: 7,
    cat: "buiten",
    label: "Voordeur",
    description: "Voordeur geschilderd",
    type: "compare",
    before: "/alex-schilderwerken/Deur before 2.jpeg",
    after: "/alex-schilderwerken/Deur after 2.jpeg",
  },
  {
    id: 8,
    cat: "houtrot",
    label: "Klapdeur",
    description: "Houtrot behandeld en afgelakt",
    type: "compare",
    before: "/alex-schilderwerken/Klapdeur houtrot before.jpeg",
    after: "/alex-schilderwerken/Klapdeur houtrot after.jpeg",
  },
  {
    id: 9,
    cat: "binnen",
    label: "Binnendeur",
    description: "Binnendeur geschilderd",
    type: "compare",
    before: "/alex-schilderwerken/Deur binnen before.jpeg",
    after: "/alex-schilderwerken/Deur binnen after.jpeg",
  },
  {
    id: 10,
    cat: "binnen",
    label: "Kast",
    description: "Kast geschilderd",
    type: "compare",
    before: "/alex-schilderwerken/Kast before.jpeg",
    after: "/alex-schilderwerken/Kast after.jpeg",
  },
  {
    id: 11,
    cat: "houtrot",
    label: "Raam",
    description: "Houtrot behandeld en afgelakt",
    type: "compare",
    before: "/alex-schilderwerken/Raam houtrot before.jpeg",
    after: "/alex-schilderwerken/Raam houtrot after.jpeg",
  },
  {
    id: 12,
    cat: "binnen",
    label: "Trap",
    description: "Trap geschilderd",
    type: "compare",
    before: "/alex-schilderwerken/Trap before.jpeg",
    after: "/alex-schilderwerken/Trap after.jpeg",
  },
  {
    id: 13,
    cat: "houtrot",
    label: "Raam",
    description: "Houtrot behandeld en afgelakt",
    type: "compare",
    before: "/alex-schilderwerken/Houtrot raam before.jpeg",
    after: "/alex-schilderwerken/Houtrot raam after.jpeg",
  },
  {
    id: 14,
    cat: "buiten",
    label: "Pand",
    description: "Buitenschilderwerk gevel",
    type: "compare",
    before: "/alex-schilderwerken/Buitenschilderwerk voor.jpeg",
    after: "/alex-schilderwerken/Buitenschilderwerk after.jpeg",
  },
  {
    id: 15,
    cat: "buiten",
    label: "Dakkapel",
    description: "Dakkapel geschilderd",
    type: "compare",
    before: "/alex-schilderwerken/Dakkapel before.jpeg",
    after: "/alex-schilderwerken/Dakkapel achter.jpeg",
  },
  {
    id: 16,
    cat: "buiten",
    label: "Deuren",
    description: "Deuren geschilderd",
    type: "compare",
    before: "/alex-schilderwerken/Deuren before.jpeg",
    after: "/alex-schilderwerken/Deuren after.jpeg",
  },
];

const easeInQuad = (t: number) => t * t;
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

/**
 * Animated before/after reveal using CSS clip-path.
 * Sequence: after fully visible → fast sweep to reveal before → slow sweep back to after.
 * Triggered once via IntersectionObserver.
 */
function AnimatedCompareCard({
  before,
  after,
  label,
}: {
  before: string;
  after: string;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const afterLayerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const hasPlayed = useRef(false);

  const runAnimation = useCallback(() => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;

    const DELAY = 250;    // wait before starting
    const PHASE1 = 550;   // after → hidden (reveal before), fast
    const PHASE2 = 2400;  // before → after (reveal after), slow

    const startTime = performance.now();

    const tick = (now: number) => {
      const el = afterLayerRef.current;
      if (!el) return;

      const elapsed = now - startTime;
      let clipRight: number; // how much of the after image is clipped from the right (0–100%)

      if (elapsed < DELAY) {
        clipRight = 0;
      } else {
        const t1 = Math.min((elapsed - DELAY) / PHASE1, 1);
        if (t1 < 1) {
          // Phase 1: hide the after image (reveal before underneath)
          clipRight = easeInQuad(t1) * 100;
        } else {
          const t2 = Math.min((elapsed - DELAY - PHASE1) / PHASE2, 1);
          // Phase 2: reveal the after image slowly
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
      { threshold: 0.35 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [runAnimation]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      {/* Before — always visible underneath */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={before}
        alt={`${label} — voor`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* After — clip-path animated on top */}
      <div
        ref={afterLayerRef}
        className="absolute inset-0"
        style={{ clipPath: "inset(0 0% 0 0)" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={after}
          alt={`${label} — na`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

function CompareCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full relative overflow-hidden rounded-sm bg-card border border-border cursor-pointer block text-left"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {project.type === "compare" ? (
          <AnimatedCompareCard
            before={project.before}
            after={project.after}
            label={project.label}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.src}
            alt={project.label}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
      </div>

      {/* Caption */}
      <div className="p-3 border-t border-border">
        <p className="text-foreground text-sm font-semibold">{project.label}</p>
        {project.description && (
          <p className="text-muted text-xs mt-0.5">{project.description}</p>
        )}
        {project.type === "compare" && (
          <p className="text-accent text-xs mt-1 opacity-60">Voor / na</p>
        )}
      </div>
    </button>
  );
}

function LightboxContent({ project }: { project: Project }) {
  if (project.type === "compare") {
    return (
      <div style={{ width: "100%", maxHeight: "80vh", overflow: "hidden" }}>
        <ReactCompareSlider
          itemOne={
            <ReactCompareSliderImage
              src={project.before}
              alt={`${project.label} — voor`}
              style={{ width: "100%", height: "80vh", objectFit: "contain" }}
            />
          }
          itemTwo={
            <ReactCompareSliderImage
              src={project.after}
              alt={`${project.label} — na`}
              style={{ width: "100%", height: "80vh", objectFit: "contain" }}
            />
          }
          style={{ width: "100%", height: "80vh" }}
        />
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={project.src}
      alt={project.label}
      style={{
        display: "block",
        width: "100%",
        height: "80vh",
        objectFit: "contain",
      }}
    />
  );
}

export default function PortfolioPage() {
  const [active, setActive] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    active === "all"
      ? projects
      : projects.filter((p) => p.cat === active);

  const lightboxProject = projects.find((p) => p.id === lightbox) ?? null;

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="py-20 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              Recent werk
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              Portfolio
            </h1>
            <p className="text-muted text-lg max-w-2xl leading-relaxed">
              Schuif de slider om het verschil te zien — voor en na elk project,
              rechtstreeks uit de praktijk.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Filters */}
          <AnimatedSection className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`px-4 py-2 text-sm font-medium rounded-sm border transition-all duration-300 ${
                  active === cat.id
                    ? "bg-primary border-primary text-foreground"
                    : "border-border text-muted hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </AnimatedSection>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                >
                  <CompareCard
                    project={project}
                    onClick={() => setLightbox(project.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox — modal shrinks tightly around the photo */}
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
              {/* Close button — top-right inside the card */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors text-lg leading-none"
                aria-label="Sluiten"
              >
                ×
              </button>

              {/* Photo / slider */}
              <LightboxContent project={lightboxProject} />

              {/* Caption */}
              <div className="px-4 py-3 border-t border-border">
                <p className="text-foreground font-semibold text-sm">
                  {lightboxProject.label}
                </p>
                {lightboxProject.description && (
                  <p className="text-muted text-xs mt-0.5">
                    {lightboxProject.description}
                  </p>
                )}
                {lightboxProject.type === "compare" && (
                  <p className="text-accent text-xs mt-1 opacity-70">
                    Schuif de slider om voor/na te vergelijken
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
