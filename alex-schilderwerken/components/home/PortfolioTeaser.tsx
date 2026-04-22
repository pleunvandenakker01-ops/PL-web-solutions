"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

const placeholders = [
  { id: 1, label: "Binnenschilderwerk", category: "Binnen" },
  { id: 2, label: "Buitenschilderwerk", category: "Buiten" },
  { id: 3, label: "Tex spuiten", category: "Tex" },
];

function PlaceholderCard({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface to-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border border-border/60 rounded-sm flex items-center justify-center mx-auto mb-3">
          <svg className="w-5 h-5 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <p className="text-muted/60 text-xs font-medium">{label}</p>
        <p className="text-muted/40 text-[10px] mt-0.5">Foto volgt</p>
      </div>
    </div>
  );
}

export default function PortfolioTeaser() {
  const [lightbox, setLightbox] = useState<number | null>(null);

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
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </AnimatedSection>

        {/* Asymmetric grid: card 1 is 2x taller */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:grid-rows-2 sm:h-[600px]">
          {/* Card 1: tall, spans 2 rows */}
          <motion.button
            onClick={() => setLightbox(1)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.015 }}
            className="group relative overflow-hidden rounded-sm bg-background border border-border cursor-pointer sm:row-span-2 h-64 sm:h-auto transition-shadow duration-500 hover:shadow-glow-md"
          >
            <PlaceholderCard label="Binnenschilderwerk" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-colors duration-500 flex items-end p-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                className="group-hover:opacity-100 opacity-0 transition-opacity duration-300"
              >
                <span className="text-[10px] text-accent tracking-[0.2em] uppercase font-semibold">Binnen</span>
                <p className="text-foreground font-semibold mt-1">Binnenschilderwerk</p>
                <p className="text-foreground/60 text-sm mt-0.5">Bekijk project →</p>
              </motion.div>
            </div>
          </motion.button>

          {/* Card 2 */}
          <motion.button
            onClick={() => setLightbox(2)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.015 }}
            className="group relative overflow-hidden rounded-sm bg-background border border-border cursor-pointer h-64 sm:h-auto transition-shadow duration-500 hover:shadow-glow-md"
          >
            <PlaceholderCard label="Buitenschilderwerk" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-colors duration-500 flex items-end p-6">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] text-accent tracking-[0.2em] uppercase font-semibold">Buiten</span>
                <p className="text-foreground font-semibold mt-1">Buitenschilderwerk</p>
              </div>
            </div>
          </motion.button>

          {/* Card 3 */}
          <motion.button
            onClick={() => setLightbox(3)}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            whileHover={{ scale: 1.015 }}
            className="group relative overflow-hidden rounded-sm bg-background border border-border cursor-pointer h-64 sm:h-auto transition-shadow duration-500 hover:shadow-glow-md"
          >
            <PlaceholderCard label="Tex spuiten" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-colors duration-500 flex items-end p-6">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[10px] text-accent tracking-[0.2em] uppercase font-semibold">Tex</span>
                <p className="text-foreground font-semibold mt-1">Tex spuiten</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 bg-background/95 z-50 flex items-center justify-center p-6 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-card border border-border rounded-sm overflow-hidden cursor-default"
            >
              <div className="aspect-[4/3] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-14 h-14 border border-border rounded-sm flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  <p className="text-foreground/80 font-semibold">
                    {placeholders.find((p) => p.id === lightbox)?.label}
                  </p>
                  <p className="text-muted text-sm mt-2">Foto volgt binnenkort</p>
                </div>
              </div>
              <button
                onClick={() => setLightbox(null)}
                aria-label="Sluiten"
                className="absolute top-4 right-4 w-9 h-9 bg-background/80 border border-border rounded-sm flex items-center justify-center text-muted hover:text-foreground hover:border-accent/40 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
