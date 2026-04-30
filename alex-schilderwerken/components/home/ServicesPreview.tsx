"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

const services = [
  {
    title: "Binnenschilderwerk",
    desc: "Muren, plafonds, kozijnen en deuren — afgewerkt met precisie.",
    href: "/diensten#binnenschilderwerk",
    img: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75" />
      </svg>
    ),
  },
  {
    title: "Buitenschilderwerk",
    desc: "Bescherming én uitstraling voor gevel, kozijnen en dakgoten.",
    href: "/diensten#buitenschilderwerk",
    img: "/alex-schilderwerken/Huis 3 bezig met schilderen.jpeg",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: "Tex spuiten & rollen",
    desc: "Professioneel structuurpleister voor een egaal, modern resultaat.",
    href: "/diensten#tex",
    img: "https://images.pexels.com/photos/6474302/pexels-photo-6474302.jpeg",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
  },
  {
    title: "Houtrotreparaties",
    desc: "Aangetast hout vakkundig hersteld — van kozijnen tot dakranden.",
    href: "/diensten#houtrot",
    img: "https://images.pexels.com/photos/13159228/pexels-photo-13159228.jpeg",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: "Pleisterwerk",
    desc: "Gladde wandoppervlakken als perfecte basis voor elk schilderwerk.",
    href: "/diensten#pleisterwerk",
    img: "https://images.pexels.com/photos/5691596/pexels-photo-5691596.jpeg",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
      </svg>
    ),
  },
];

export default function ServicesPreview() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".srv-card"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = parseInt(
              (entry.target as HTMLElement).dataset.index ?? "0"
            );
            setTimeout(() => {
              (entry.target as HTMLElement).style.opacity = "1";
              (entry.target as HTMLElement).style.transform = "translateY(0)";
            }, idx * 100);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes cta-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(61,111,212,0), 0 0 16px rgba(61,111,212,0.2); }
          50%       { box-shadow: 0 0 0 6px rgba(61,111,212,0), 0 0 32px rgba(61,111,212,0.45); }
        }
        .cta-glow {
          animation: cta-pulse 2.4s ease-in-out infinite;
        }
        .cta-glow:hover {
          animation: none;
          box-shadow: 0 0 0 1px rgba(61,111,212,0.6), 0 0 40px rgba(61,111,212,0.4);
          transform: scale(1.05);
        }
      `}</style>

      <section className="py-28 bg-[#080C14]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-accent text-xs font-semibold tracking-[0.22em] uppercase">
              Wat ik doe
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
              Diensten
            </h2>
            <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
              Van voorbereiding tot afwerking — elk detail telt.
            </p>
          </div>

          {/* Cards grid */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {services.map((service, i) => (
              <div
                key={service.title}
                className="srv-card"
                data-index={i}
                style={{
                  opacity: 0,
                  transform: "translateY(32px)",
                  transition: "opacity 0.7s ease, transform 0.7s ease",
                }}
              >
                <Link
                  href={service.href}
                  className="group block relative overflow-hidden rounded-sm"
                  style={{ minHeight: 320 }}
                >
                  {/* Background image — zooms on hover */}
                  <div
                    className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ willChange: "transform" }}
                  >
                    <Image
                      src={service.img}
                      alt={service.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>

                  {/* Dark gradient — lifts slightly on hover */}
                  <div
                    className="absolute inset-0 transition-all duration-500"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(8,12,20,0.92) 0%, rgba(8,12,20,0.55) 50%, rgba(8,12,20,0.15) 100%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(8,12,20,0.78) 0%, rgba(8,12,20,0.35) 55%, rgba(27,58,107,0.12) 100%)",
                    }}
                  />

                  {/* Blue border glow on hover */}
                  <div className="absolute inset-0 rounded-sm border border-transparent group-hover:border-accent/50 transition-all duration-400 group-hover:shadow-[0_0_24px_rgba(61,111,212,0.25),inset_0_0_24px_rgba(61,111,212,0.05)]" />

                  {/* Content — bottom-aligned */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-sm bg-accent/15 border border-accent/25 flex items-center justify-center text-accent mb-4 backdrop-blur-sm group-hover:bg-accent/25 group-hover:border-accent/50 transition-all duration-300">
                      {service.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-foreground font-semibold text-lg leading-snug mb-1.5 group-hover:text-accent transition-colors duration-300">
                      {service.title}
                    </h3>

                    {/* Desc */}
                    <p className="text-foreground/60 text-sm leading-relaxed">
                      {service.desc}
                    </p>

                    {/* Arrow — appears on hover */}
                    <div className="flex items-center gap-1.5 mt-4 text-accent text-xs font-semibold tracking-wide opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      Meer info
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-14">
            <Link
              href="/diensten"
              className="cta-glow inline-flex items-center gap-2.5 border border-accent/30 hover:border-accent/60 bg-accent/5 hover:bg-accent/10 text-foreground px-9 py-4 text-sm font-semibold tracking-wide rounded-sm transition-all duration-300"
            >
              Alle diensten bekijken
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
