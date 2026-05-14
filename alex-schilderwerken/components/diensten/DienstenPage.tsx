"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

function IconHome() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function IconBuilding() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
    </svg>
  );
}

function IconBrush() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
    </svg>
  );
}

function IconWrench() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0l4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0l-5.571 3-5.571-3" />
    </svg>
  );
}


const diensten = [
  {
    id: "binnenschilderwerk",
    icon: <IconHome />,
    image: { src: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800", position: "center" },
    title: "Binnenschilderwerk",
    shortDesc: "Vakkundig afgewerkte muren, plafonds en kozijnen",
    desc: `Van voorbereiding tot eindresultaat zorg ik dat elke vierkante meter er perfect uitziet. Muren worden grondig voorbereid: plamuren waar nodig, schuren en ontstoffen voordat het schilderwerk begint.\n\nDe eindlaag wordt aangebracht met de verfspuit of roller, afhankelijk van het oppervlak. Altijd met Sigma-verf, want kwaliteit begint met het juiste materiaal.`,
    included: ["Muren en plafonds", "Kozijnen en deuren", "Radiatoren en plinten", "Voorbereiding en afdekking"],
  },
  {
    id: "buitenschilderwerk",
    icon: <IconBuilding />,
    image: { src: "/alex-schilderwerken/Huis 3 bezig met schilderen.jpeg", position: "center" },
    title: "Buitenschilderwerk",
    shortDesc: "Bescherming en uitstraling voor uw gevel",
    desc: `Buitenwerk vraagt om een andere aanpak dan binnenwerk. Hout moet grondig ontvet en geschuurd worden, oude verf die loslaat wordt verwijderd, en daarna volgt een grondlaag voor maximale hechting.\n\nKozijnen, boeidelen, dakgoten en gevelpanelen worden vakkundig behandeld met weerbestendige verf van Sigma. Het resultaat is jarenlange bescherming én een perfecte uitstraling.`,
    included: ["Gevels en kozijnen", "Dakgoten en boeidelen", "Schuren en gronden", "Weerbestendige afwerking"],
  },
  {
    id: "tex",
    icon: <IconBrush />,
    image: { src: "https://images.pexels.com/photos/6474302/pexels-photo-6474302.jpeg", position: "center" },
    title: "Tex spuiten & rollen",
    shortDesc: "Structuurpleister voor een modern, egaal resultaat",
    desc: `Tex is een structuurverf die muren en plafonds een moderne, effen uitstraling geeft. Het kan worden gespoten voor een fijn gespoten effect, of gerold voor een iets grovere textuur.\n\nEen uitstekende keuze voor nieuwbouw, renovatie of wanneer u rauwe of beschadigde muren wilt wegwerken. Ik geef u advies over de beste methode voor uw situatie.`,
    included: ["Spuittechniek of rolmethode", "Fijn of grof structuureffect", "Plafonds en muren", "Kleur naar keuze"],
  },
  {
    id: "houtrot",
    icon: <IconWrench />,
    image: { src: "https://images.pexels.com/photos/13159228/pexels-photo-13159228.jpeg", position: "center" },
    title: "Houtrotreparaties",
    shortDesc: "Aangetast hout vakkundig hersteld",
    desc: `Houtrot is een sluipend probleem. Wordt het niet tijdig aangepakt, dan kan schade aan kozijnen, raamkozijnen of dakranden snel uitbreiden.\n\nIk snij het aangetaste hout weg, behandel de ondergrond met een consolidant, en vul daarna op met reparatiemortel. Na uitharden wordt alles geschuurd en geschilderd. U ziet het verschil niet meer.`,
    included: ["Diagnose en reparatie", "Kozijnen en raamkozijnen", "Dakranden en boeidelen", "Afwerking en schilderen"],
  },
  {
    id: "pleisterwerk",
    icon: <IconLayers />,
    image: { src: "https://images.pexels.com/photos/5691596/pexels-photo-5691596.jpeg", position: "center" },
    title: "Pleisterwerk",
    shortDesc: "Gladde, vloeiende wandoppervlakken",
    desc: `Een goede schilderlaag staat of valt met de ondergrond. Ik voer pleisterwerk uit op muren en plafonds om oneffenheden weg te werken en een gladde, spuitklare ondergrond te creëren.\n\nOf het nu gaat om kleine reparaties of volledige wanden, ik zorg voor een naadloos resultaat dat als basis dient voor een perfecte verflaag.`,
    included: ["Muren en plafonds egaliseren", "Reparatie van beschadigingen", "Naden en scheuren opvullen", "Spuitklare ondergrond"],
  },
];

export default function DienstenPage() {
  return (
    <div className="min-h-screen bg-background pt-20">
      <section className="py-24 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection>
            <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase block mb-4">
              Wat ik doe
            </span>
            <h1 className="font-display text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Diensten
            </h1>
            <p className="text-muted text-lg max-w-2xl leading-relaxed">
              Van binnenschilderwerk tot verzekeringsherstel, elk project pak ik aan met dezelfde
              nauwkeurigheid en vakmanschap. Altijd met Sigma-verf, altijd BA-verzekerd.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-5">
          {diensten.map((dienst, i) => (
            <motion.div
              key={dienst.id}
              id={dienst.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="group bg-card border border-border hover:border-accent/30 rounded-sm overflow-hidden transition-all duration-500 hover:shadow-glow-sm"
            >
              {dienst.image && (
                <div className="h-52 sm:h-60 lg:h-64 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dienst.image.src}
                    alt={dienst.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: dienst.image.position }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent" />
                </div>
              )}
              <div className="p-8 lg:p-10 grid lg:grid-cols-2 gap-8 lg:gap-16">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-primary/20 border border-primary/30 rounded-sm flex items-center justify-center text-accent group-hover:bg-primary/30 group-hover:border-accent/50 transition-all duration-300">
                      {dienst.icon}
                    </div>
                    <div>
                      <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
                        {dienst.title}
                      </h2>
                      <p className="text-accent text-sm mt-1">{dienst.shortDesc}</p>
                    </div>
                  </div>
                  <div className="text-muted text-sm leading-relaxed space-y-4">
                    {dienst.desc.split("\n\n").map((para, j) => (
                      <p key={j}>{para}</p>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-foreground font-semibold text-xs tracking-[0.18em] uppercase mb-5">
                      Wat is inbegrepen
                    </h3>
                    <ul className="space-y-3">
                      {dienst.included.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-muted text-sm">
                          <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/contact"
                    className="mt-8 inline-flex items-center gap-2 bg-primary hover:bg-accent text-foreground px-6 py-3 text-sm font-semibold rounded-sm transition-all duration-500 w-fit shadow-glow-sm hover:shadow-glow-md"
                  >
                    Offerte aanvragen
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-5">
              Niet zeker welke dienst u nodig heeft?
            </h2>
            <p className="text-muted text-base mb-10 leading-relaxed">
              Ik kom altijd langs voor een vrijblijvende inmeting en geef u eerlijk advies.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary hover:bg-accent text-foreground px-8 py-4 font-semibold rounded-sm transition-all duration-500 shadow-glow-md"
            >
              Vraag een gratis adviesgesprek aan
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
