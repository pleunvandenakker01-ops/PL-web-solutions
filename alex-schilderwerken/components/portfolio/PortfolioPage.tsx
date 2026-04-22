"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

const categories = [
  { id: "all", label: "Alles" },
  { id: "binnen", label: "Binnenschilderwerk" },
  { id: "buiten", label: "Buitenschilderwerk" },
  { id: "tex", label: "Tex spuiten" },
  { id: "houtrot", label: "Houtrotreparaties" },
];

const placeholderProjects = [
  { id: 1, cat: "binnen", label: "Woonkamer renovatie", aspect: "aspect-[4/3]" },
  { id: 2, cat: "buiten", label: "Gevel schilderwerk", aspect: "aspect-square" },
  { id: 3, cat: "tex", label: "Tex plafond", aspect: "aspect-[3/4]" },
  { id: 4, cat: "houtrot", label: "Kozijn reparatie", aspect: "aspect-[4/3]" },
  { id: 5, cat: "binnen", label: "Slaapkamer", aspect: "aspect-[3/4]" },
  { id: 6, cat: "buiten", label: "Kozijnen buiten", aspect: "aspect-[4/3]" },
  { id: 7, cat: "tex", label: "Tex muren woonkamer", aspect: "aspect-square" },
  { id: 8, cat: "houtrot", label: "Dakranden herstel", aspect: "aspect-[4/3]" },
  { id: 9, cat: "binnen", label: "Hal en trap", aspect: "aspect-[3/4]" },
];

export default function PortfolioPage() {
  const [active, setActive] = useState("all");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    active === "all"
      ? placeholderProjects
      : placeholderProjects.filter((p) => p.cat === active);

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
              Elke foto vertelt een verhaal van vakmanschap. Beeldmateriaal wordt binnenkort
              toegevoegd — kom snel terug voor voor/na-foto&apos;s van echte projecten.
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

          {/* Masonry-style grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="break-inside-avoid"
                >
                  <button
                    onClick={() => setLightbox(project.id)}
                    className="group w-full relative overflow-hidden rounded-sm bg-card border border-border cursor-pointer block"
                  >
                    <div className={`${project.aspect} relative`}>
                      {/* Placeholder — vervang met echte foto via next/image */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-background flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className="w-12 h-12 border border-border rounded-sm flex items-center justify-center mx-auto mb-3">
                            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                          </div>
                          <p className="text-muted text-xs">Foto volgt</p>
                        </div>
                      </div>
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-primary/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-foreground font-semibold text-sm">
                        {project.label}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Simple lightbox overlay */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-8 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-3xl w-full"
            >
              <div className="aspect-[4/3] bg-card border border-border rounded-sm flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted">Foto volgt binnenkort</p>
                  <p className="text-accent text-sm mt-2">
                    {placeholderProjects.find((p) => p.id === lightbox)?.label}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-card border border-border rounded-sm flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
