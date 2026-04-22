"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = {
      naam: (form.elements.namedItem("naam") as HTMLInputElement).value,
      telefoon: (form.elements.namedItem("telefoon") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      project: (form.elements.namedItem("project") as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full bg-[#0a111e] border border-[#1E2D47] rounded-sm px-4 py-3 text-foreground text-sm placeholder:text-[#8A9BB5]/60 outline-none transition-all duration-200 focus:border-accent/60 focus:ring-2 focus:ring-accent/20";

  return (
    <>
      <style>{`
        @keyframes btn-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(61,111,212,0), 0 0 16px rgba(61,111,212,0.25); }
          50%       { box-shadow: 0 0 0 6px rgba(61,111,212,0), 0 0 36px rgba(61,111,212,0.55); }
        }
        .submit-btn { animation: btn-pulse 2.4s ease-in-out infinite; }
        .submit-btn:hover {
          animation: none;
          box-shadow: 0 0 0 1px rgba(61,111,212,0.6), 0 0 48px rgba(61,111,212,0.45);
          transform: scale(1.02);
        }
      `}</style>

      <section className="py-28 bg-[#080C14] border-t border-[#1E2D47]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 48 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative bg-gradient-to-br from-primary/20 via-primary/8 to-transparent border border-primary/25 rounded-sm p-10 lg:p-16 overflow-hidden"
          >
            {/* Decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-accent/8 blur-3xl pointer-events-none" />

            {/* Corner accents */}
            <div className="absolute top-5 left-5 w-6 h-6 border-t border-l border-accent/25" />
            <div className="absolute top-5 right-5 w-6 h-6 border-t border-r border-accent/25" />
            <div className="absolute bottom-5 left-5 w-6 h-6 border-b border-l border-accent/25" />
            <div className="absolute bottom-5 right-5 w-6 h-6 border-b border-r border-accent/25" />

            <div className="relative z-10 max-w-[680px] mx-auto text-center">
              {/* Label */}
              <span className="inline-block bg-primary/35 border border-primary/45 text-accent px-4 py-1.5 text-[10px] font-semibold tracking-[0.22em] uppercase rounded-sm mb-7">
                Gratis inmeting
              </span>

              {/* Heading */}
              <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground mb-5 leading-tight">
                Klaar voor het allermooiste resultaat?
              </h2>

              {/* Subtext */}
              <p className="text-muted text-base lg:text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                Ik kom altijd langs om alles te bekijken en op te meten. De offerte is altijd
                volledig vrijblijvend — u zit nergens aan vast.
              </p>

              {/* Form */}
              {status === "sent" ? (
                <div className="py-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-foreground font-semibold text-lg mb-1">Aanvraag verstuurd!</p>
                  <p className="text-muted text-sm">Ik neem zo snel mogelijk contact met u op.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="text-left space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-1.5">
                        Naam
                      </label>
                      <input
                        name="naam"
                        type="text"
                        required
                        placeholder="Jan de Vries"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-1.5">
                        Telefoonnummer
                      </label>
                      <input
                        name="telefoon"
                        type="tel"
                        required
                        placeholder="06 12 34 56 78"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-1.5">
                      E-mailadres
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="jan@voorbeeld.nl"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.12em] uppercase text-muted mb-1.5">
                      Omschrijf uw project
                    </label>
                    <textarea
                      name="project"
                      rows={4}
                      required
                      placeholder="Bijv. binnenschilderwerk woonkamer en slaapkamers, ± 80m²..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="submit-btn w-full bg-accent hover:bg-accent/90 disabled:opacity-60 text-foreground py-4 text-sm font-semibold tracking-wide rounded-sm transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {status === "sending" ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Versturen...
                      </>
                    ) : (
                      <>
                        Verstuur aanvraag
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </>
                    )}
                  </button>

                  {status === "error" && (
                    <p className="text-red-400 text-xs text-center pt-1">
                      Er ging iets mis. Probeer het opnieuw of bel direct.
                    </p>
                  )}
                </form>
              )}

              {/* Phone CTA */}
              <div className="mt-8 pt-6 border-t border-[#1E2D47] flex items-center justify-center gap-3">
                <span className="text-muted text-sm">Of bel direct:</span>
                <a
                  href="tel:0618269798"
                  className="inline-flex items-center gap-2 text-foreground hover:text-accent font-semibold text-sm transition-colors duration-200"
                >
                  <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  06 18 26 97 98
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
