"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";
import StatCounter from "@/components/ui/StatCounter";

const trustBadges = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: "Officieel gediplomeerd",
    desc: "2 jaar vakopleiding gevolgd en met diploma afgerond",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "BA-verzekerd",
    desc: "Aansprakelijkheidsverzekering voor alle werkzaamheden",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
      </svg>
    ),
    title: "Altijd Sigma-verf",
    desc: "Topkwaliteit verf voor een duurzaam en mooi resultaat",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "Persoonlijke aanpak",
    desc: "Ik werk alleen — u heeft altijd met Alex zelf te maken",
  },
];

const timeline = [
  { year: "2016", title: "Start vakopleiding", desc: "Begon met de officiële schildersopleiding — twee jaar intensief leren." },
  { year: "2018", title: "Diploma behaald", desc: "Afgestudeerd als officieel gediplomeerd schilder." },
  { year: "2018–2022", title: "In loondienst", desc: "Jaren praktijkervaring opgedaan als schilder bij een bedrijf — van woningen tot grote projecten." },
  { year: "2022", title: "Eigen bedrijf gestart", desc: "Alex Schilderwerken opgericht. Zelfstandig verder gegaan met dezelfde vakkennis en toewijding." },
  { year: "Nu", title: "~3 jaar zelfstandig", desc: "Elk project — groot of klein — met dezelfde nauwkeurigheid en persoonlijke aanpak." },
];

export default function OverAlexPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Header */}
      <section className="py-24 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase block mb-4">
              Het verhaal
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Persoonlijk vakmanschap
            </h1>
            <p className="text-muted text-lg max-w-xl leading-relaxed">
              8 jaar ervaring. Diploma op zak. Uitsluitend Sigma-verf. Altijd dezelfde vakman aan de deur.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main story */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-stretch">
            {/* Text */}
            <AnimatedSection direction="left">
              <div className="space-y-6 text-muted text-base leading-[1.85]">
                <p>
                  Mijn naam is Alex Lanotte. Na een gedegen 2-jarige vakopleiding en meer dan
                  8 jaar praktijkervaring weet ik wat kwalitatief schilderwerk vraagt — en wat
                  nodig is om het consequent goed te leveren.
                </p>
                <p>
                  Ik werk als zelfstandige, wat betekent dat u van begin tot eind met mij
                  persoonlijk te maken heeft. Geen onderaannemers, geen tussenpersonen. U weet
                  altijd wie er bij u aan het werk is en wie verantwoordelijk is voor het
                  eindresultaat.
                </p>
                <p>
                  Voor elk project kies ik bewust voor Sigma-verf. Niet omdat het verplicht is,
                  maar omdat ik ervan overtuigd ben dat een duurzaam resultaat begint bij de
                  juiste materialen. Het verschil met goedkopere alternatieven is na twee jaar
                  duidelijk zichtbaar.
                </p>
                <p>
                  Of het nu gaat om een binnenkamer of een complete gevelrenovatie: elk project
                  verdient dezelfde voorbereiding en zorgvuldigheid. Ik neem de tijd, werk
                  nauwkeurig, en ga pas weg als ik tevreden ben met het resultaat.
                </p>
                <p className="text-foreground font-medium">
                  Ik kom graag persoonlijk langs voor een inspectie en opmeting. De offerte
                  die u ontvangt is volledig vrijblijvend — u zit nergens aan vast.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-accent text-foreground px-7 py-3.5 text-sm font-semibold rounded-sm transition-all duration-500 shadow-glow-sm hover:shadow-glow-md"
                >
                  Plan een vrijblijvend gesprek
                </Link>
                <a
                  href="tel:0618269798"
                  className="inline-flex items-center gap-2 border border-border hover:border-accent/50 text-muted hover:text-foreground px-7 py-3.5 text-sm font-semibold rounded-sm transition-all duration-500"
                >
                  06 18 26 97 98
                </a>
              </div>

              {/* Mini stat row */}
              <div className="mt-12 flex gap-10 pt-8">
                <div>
                  <span className="font-display text-3xl font-bold text-foreground block">
                    <StatCounter end={8} suffix="+" />
                  </span>
                  <span className="text-muted text-xs tracking-[0.15em] uppercase mt-1 block">Jaar ervaring</span>
                </div>
                <div>
                  <span className="font-display text-3xl font-bold text-foreground block">
                    <StatCounter end={100} suffix="%" />
                  </span>
                  <span className="text-muted text-xs tracking-[0.15em] uppercase mt-1 block">Sigma verf</span>
                </div>
              </div>
            </AnimatedSection>

            {/* Project image */}
            <AnimatedSection direction="right" delay={0.2} className="h-full">
              <div className="relative h-full">
                <div className="h-full overflow-hidden rounded-sm border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/alex-schilderwerken/Huis 3 bezig met schilderen.jpeg"
                    alt="Pand in uitvoering"
                    className="w-full h-full object-cover block"
                  />
                </div>
                {/* Decorative accent */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-accent/20 rounded-sm -z-10" />
                <div className="absolute -top-4 -left-4 w-16 h-16 border border-border/60 rounded-sm -z-10" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-14">
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase block mb-4">
              Waarom kiezen voor
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Alex Schilderwerken
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="bg-background border border-border hover:border-accent/30 p-7 rounded-sm transition-all duration-500 hover:shadow-glow-sm group"
              >
                <div className="w-12 h-12 bg-primary/20 border border-primary/30 rounded-sm flex items-center justify-center text-accent mb-5 group-hover:bg-primary/30 group-hover:border-accent/50 transition-all duration-300">
                  {badge.icon}
                </div>
                <h3 className="text-foreground font-semibold text-sm mb-2">{badge.title}</h3>
                <p className="text-muted text-xs leading-relaxed">{badge.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="mb-16 text-center">
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase block mb-4">
              Het pad
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground">
              Van opleiding tot meesterschap
            </h2>
          </AnimatedSection>

          <div className="relative">
            <div className="absolute left-[31px] top-0 bottom-0 w-px bg-border" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary border border-accent/30 rounded-full flex items-center justify-center z-10 mt-0.5">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                  </div>
                  <div className="pb-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-accent text-sm font-mono font-bold">{item.year}</span>
                      <h3 className="text-foreground font-semibold text-base">{item.title}</h3>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-5">
              Klaar om samen te werken?
            </h2>
            <p className="text-muted text-base mb-10 leading-relaxed">
              Ik kom langs, bekijk het werk, en geef u een eerlijke en vrijblijvende offerte.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-primary hover:bg-accent text-foreground px-8 py-4 font-semibold rounded-sm transition-all duration-500 shadow-glow-md"
              >
                Neem contact op
              </Link>
              <a
                href="tel:0618269798"
                className="inline-flex items-center gap-2 border border-border hover:border-accent/50 text-muted hover:text-foreground px-8 py-4 font-semibold rounded-sm transition-all duration-500"
              >
                06 18 26 97 98
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
