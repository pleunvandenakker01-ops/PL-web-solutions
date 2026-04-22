"use client";

import { motion } from "framer-motion";
import AnimatedSection from "@/components/ui/AnimatedSection";

const reviews = [
  {
    name: "Martijn V.",
    rating: 5,
    text: "Alex heeft ons hele huis van binnen geschilderd. Netjes, snel en het resultaat is prachtig. Echt een vakman — ik zou hem zo weer inschakelen.",
    date: "2 maanden geleden",
    initial: "M",
  },
  {
    name: "Sandra K.",
    rating: 5,
    text: "De kozijnen en gevel zijn als nieuw. Alex werkt zorgvuldig, laat alles tip-top achter en communiceert helder. Absolute aanrader.",
    date: "3 maanden geleden",
    initial: "S",
  },
  {
    name: "Peter M.",
    rating: 5,
    text: "Perfecte afwerking, keurig opgeruimd achtergelaten en een heel eerlijke prijs. Niets te klagen — gewoon heel goed werk.",
    date: "5 maanden geleden",
    initial: "P",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="py-28 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-5">
            <Stars count={5} />
            <span className="text-foreground font-bold text-lg">5.0</span>
            <span className="text-muted text-sm">op Google</span>
          </div>
          <span className="block text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4">
            Wat klanten zeggen
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
            Google Reviews
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="group bg-card border border-border hover:border-accent/25 p-7 rounded-sm transition-all duration-500 hover:shadow-glow-sm flex flex-col"
            >
              <Stars count={review.rating} />
              <p className="text-foreground/75 text-sm leading-[1.85] mt-5 mb-6 flex-1">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-5 border-t border-border/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary/30 rounded-full flex items-center justify-center text-accent text-xs font-bold">
                    {review.initial}
                  </div>
                  <span className="text-foreground text-sm font-semibold">{review.name}</span>
                </div>
                <span className="text-muted text-xs">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatedSection delay={0.3} className="text-center mt-12">
          <a
            href="#"
            className="inline-flex items-center gap-2.5 text-muted hover:text-foreground text-sm transition-colors duration-300 group"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Bekijk alle Google Reviews
            <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
