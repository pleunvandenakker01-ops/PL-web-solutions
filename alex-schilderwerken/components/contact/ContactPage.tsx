"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

const werkTypes = [
  "Binnenschilderwerk",
  "Buitenschilderwerk",
  "Tex spuiten of rollen",
  "Houtrotreparaties",
  "Pleisterwerk",
  "Verzekeringsherstel",
  "Meerdere diensten",
  "Anders",
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    naam: "",
    telefoon: "",
    email: "",
    werkType: "",
    omschrijving: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        setStatus("success");
        setFormState({ naam: "", telefoon: "", email: "", werkType: "", omschrijving: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="py-20 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <span className="text-accent text-sm font-semibold tracking-widest uppercase">
              Neem contact op
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mt-3 mb-6">
              Contact
            </h1>
            <p className="text-muted text-lg max-w-xl leading-relaxed">
              Ik kom graag persoonlijk langs om alles te bekijken en op te meten. De
              offerte is altijd volledig vrijblijvend.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-16">
            {/* Contact info */}
            <AnimatedSection direction="left" className="lg:col-span-2 space-y-8">
              {/* Direct contact */}
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Bereikbaarheid
                </h2>
                <div className="space-y-5">
                  <a
                    href="tel:0618269798"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-sm flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-primary/30 transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-muted text-xs uppercase tracking-wide mb-0.5">Telefoon</p>
                      <p className="text-foreground font-semibold text-lg group-hover:text-accent transition-colors duration-300">
                        06 18 26 97 98
                      </p>
                    </div>
                  </a>

                  <a
                    href="mailto:schildersbedrijf.lanotte@gmail.com"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-sm flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-primary/30 transition-colors duration-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-muted text-xs uppercase tracking-wide mb-0.5">E-mail</p>
                      <p className="text-foreground font-semibold group-hover:text-accent transition-colors duration-300 break-all">
                        schildersbedrijf.lanotte@gmail.com
                      </p>
                    </div>
                  </a>

                  <a
                    href="https://www.instagram.com/alexschilderwerken"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 group"
                  >
                    <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-sm flex items-center justify-center text-accent flex-shrink-0 group-hover:bg-primary/30 transition-colors duration-300">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-muted text-xs uppercase tracking-wide mb-0.5">Instagram</p>
                      <p className="text-foreground font-semibold group-hover:text-accent transition-colors duration-300">
                        @alexschilderwerken
                      </p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Note */}
              <div className="bg-primary/10 border border-primary/20 rounded-sm p-5">
                <p className="text-accent text-xs font-semibold tracking-wide uppercase mb-2">
                  Vrijblijvende offerte
                </p>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  Ik kom altijd langs om alles te bekijken en op te meten. De offerte is
                  altijd volledig vrijblijvend. U zit nergens aan vast.
                </p>
              </div>

              {/* Google Maps placeholder */}
              <div>
                <p className="text-muted text-xs uppercase tracking-wide mb-3">Werkgebied</p>
                <div className="aspect-video bg-card border border-border rounded-sm flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-8 h-8 text-muted mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                    </svg>
                    <p className="text-muted text-xs">Google Maps volgt</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Form */}
            <AnimatedSection direction="right" delay={0.2} className="lg:col-span-3">
              <div className="bg-card border border-border rounded-sm p-8">
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                  Stuur een bericht
                </h2>

                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-5">
                      <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-foreground font-display text-xl font-bold mb-2">
                      Bericht verzonden!
                    </h3>
                    <p className="text-muted text-sm">
                      Alex neemt zo snel mogelijk contact met u op.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-muted text-xs uppercase tracking-wide mb-2">
                          Naam *
                        </label>
                        <input
                          type="text"
                          name="naam"
                          value={formState.naam}
                          onChange={handleChange}
                          required
                          placeholder="Uw volledige naam"
                          className="w-full bg-background border border-border focus:border-accent/50 rounded-sm px-4 py-3 text-foreground text-sm placeholder:text-muted/50 outline-none transition-colors duration-300"
                        />
                      </div>
                      <div>
                        <label className="block text-muted text-xs uppercase tracking-wide mb-2">
                          Telefoon *
                        </label>
                        <input
                          type="tel"
                          name="telefoon"
                          value={formState.telefoon}
                          onChange={handleChange}
                          required
                          placeholder="06 00 00 00 00"
                          className="w-full bg-background border border-border focus:border-accent/50 rounded-sm px-4 py-3 text-foreground text-sm placeholder:text-muted/50 outline-none transition-colors duration-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-muted text-xs uppercase tracking-wide mb-2">
                        E-mailadres *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        placeholder="uw@email.nl"
                        className="w-full bg-background border border-border focus:border-accent/50 rounded-sm px-4 py-3 text-foreground text-sm placeholder:text-muted/50 outline-none transition-colors duration-300"
                      />
                    </div>

                    <div>
                      <label className="block text-muted text-xs uppercase tracking-wide mb-2">
                        Type werk
                      </label>
                      <select
                        name="werkType"
                        value={formState.werkType}
                        onChange={handleChange}
                        className="w-full bg-background border border-border focus:border-accent/50 rounded-sm px-4 py-3 text-foreground text-sm outline-none transition-colors duration-300"
                      >
                        <option value="" className="bg-card">Selecteer een dienst</option>
                        {werkTypes.map((type) => (
                          <option key={type} value={type} className="bg-card">
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-muted text-xs uppercase tracking-wide mb-2">
                        Omschrijving
                      </label>
                      <textarea
                        name="omschrijving"
                        value={formState.omschrijving}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Beschrijf kort het werk dat u wilt laten uitvoeren..."
                        className="w-full bg-background border border-border focus:border-accent/50 rounded-sm px-4 py-3 text-foreground text-sm placeholder:text-muted/50 outline-none transition-colors duration-300 resize-none"
                      />
                    </div>

                    {status === "error" && (
                      <p className="text-red-400 text-sm">
                        Er ging iets mis. Probeer het opnieuw of bel direct: 06 18 26 97 98.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full bg-primary hover:bg-accent text-foreground py-4 font-semibold text-sm tracking-wide rounded-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {status === "sending" ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Verzenden...
                        </>
                      ) : (
                        "Stuur bericht"
                      )}
                    </button>
                    <p className="text-muted text-xs text-center">
                      Vrijblijvend, ik reageer altijd binnen 24 uur
                    </p>
                  </form>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
}
