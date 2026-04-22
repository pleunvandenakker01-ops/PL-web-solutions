"use client";

const items = [
  "8+ JAAR ERVARING",
  "100% TEVREDEN KLANTEN",
  "SIGMA VERF",
  "BA-VERZEKERD",
  "GRATIS OFFERTE",
  "OFFICIEEL GEDIPLOMEERD",
];

const text = items.join("  ·  ") + "  ·  ";

export default function MarqueeBar() {
  return (
    <div className="relative bg-card border-y border-border overflow-hidden py-3.5 select-none">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-card to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-card to-transparent pointer-events-none" />

      {/* Ticker */}
      <div className="flex whitespace-nowrap animate-marquee" aria-hidden>
        <span className="text-muted/70 text-[10px] font-semibold tracking-[0.22em]">
          {text}{text}{text}
        </span>
        <span className="text-muted/70 text-[10px] font-semibold tracking-[0.22em]" aria-hidden>
          {text}{text}{text}
        </span>
      </div>
    </div>
  );
}
