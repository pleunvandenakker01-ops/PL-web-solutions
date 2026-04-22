"use client";

const reviews = [
  {
    name: "Martijn van den Berg",
    location: "Amsterdam",
    text: "Alex heeft onze volledige woonkamer en hal geschilderd. Strak, netjes en hij liet alles tip-top achter. Echt een vakman die trots is op zijn werk.",
    rating: 5,
  },
  {
    name: "Sandra Hoekstra",
    location: "Haarlem",
    text: "Buitenschilderwerk laat er na jaren verwaarlozing weer prachtig uit. Punctueel, eerlijke prijs en het resultaat overtrof mijn verwachtingen.",
    rating: 5,
  },
  {
    name: "Peter de Vries",
    location: "Utrecht",
    text: "Houtrotreparaties aan onze kozijnen perfect uitgevoerd. Je ziet niets meer van de schade — alsof het nooit gebeurd is. Absolute aanrader.",
    rating: 5,
  },
  {
    name: "Lisa Janssen",
    location: "Amstelveen",
    text: "Tex gespoten in de gang en slaapkamer, geweldig resultaat. Alex werkt snel, zorgvuldig en communiceert helder over wat hij doet. Top service.",
    rating: 5,
  },
  {
    name: "Kees Bakker",
    location: "Hoofddorp",
    text: "Al voor de tweede keer ingeschakeld en weer volledig tevreden. Betrouwbaar, vakkundig en altijd op tijd. Ga hem zeker nogmaals bellen.",
    rating: 5,
  },
  {
    name: "Emma Willems",
    location: "Zaandam",
    text: "Volledige schilderbeurt van ons rijtjeshuis. Nette voorbereiding, strakke afwerking en een heel fijne prijs-kwaliteitverhouding. Dikke 5 sterren.",
    rating: 5,
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-3.5 h-3.5 fill-yellow-400" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

const doubled = [...reviews, ...reviews];

export default function ReviewsMarquee() {
  return (
    <>
      <style>{`
        @keyframes reviews-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .reviews-track {
          animation: reviews-scroll 40s linear infinite;
          will-change: transform;
        }
        .reviews-wrapper:hover .reviews-track {
          animation-play-state: paused;
        }
      `}</style>

      <section className="py-24 bg-[#080C14] border-t border-[#1E2D47]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 text-center">
          <span className="text-accent text-xs font-semibold tracking-[0.22em] uppercase block mb-3">
            Reviews
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-foreground">
            Wat klanten zeggen
          </h2>
        </div>

        {/* Marquee */}
        <div
          className="reviews-wrapper overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          }}
        >
          <div
            className="reviews-track flex gap-5"
            style={{ width: "max-content" }}
          >
            {doubled.map((review, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 rounded-sm p-6"
                style={{
                  background: "#0F1624",
                  border: "1px solid #1E2D47",
                  transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  el.style.background = "#131e30";
                  el.style.borderColor = "rgba(61,111,212,0.4)";
                  el.style.boxShadow = "0 0 24px rgba(61,111,212,0.18), inset 0 0 24px rgba(61,111,212,0.04)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  el.style.background = "#0F1624";
                  el.style.borderColor = "#1E2D47";
                  el.style.boxShadow = "none";
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <Stars />
                  <div className="flex items-center gap-1.5 text-[#8A9BB5] text-[10px] tracking-wide">
                    <GoogleIcon />
                    Google
                  </div>
                </div>

                {/* Review text */}
                <p className="text-foreground/75 text-sm leading-relaxed mb-5">
                  &ldquo;{review.text}&rdquo;
                </p>

                {/* Reviewer */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#1E2D47]">
                  <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/25 flex items-center justify-center text-accent text-xs font-bold flex-shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-foreground text-sm font-semibold leading-none">
                      {review.name}
                    </p>
                    <p className="text-[#8A9BB5] text-[10px] mt-1">
                      {review.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
