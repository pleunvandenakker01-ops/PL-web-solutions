import type { Metadata } from "next";
import OverAlexPage from "@/components/over-alex/OverAlexPage";

export const metadata: Metadata = {
  title: "Over Alex Lanotte | Gediplomeerd Schilder met 8 Jaar Ervaring",
  description:
    "Maak kennis met Alex Lanotte, gediplomeerd schilder met 8 jaar praktijkervaring. Persoonlijke aanpak, BA-verzekerd en altijd Sigma-verf voor een duurzaam resultaat.",
  alternates: { canonical: "/over-alex" },
};

export default function OverAlex() {
  return <OverAlexPage />;
}
