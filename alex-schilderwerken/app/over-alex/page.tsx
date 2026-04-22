import type { Metadata } from "next";
import OverAlexPage from "@/components/over-alex/OverAlexPage";

export const metadata: Metadata = {
  title: "Over Alex",
  description:
    "Leer Alex kennen — 8 jaar ervaring, officieel gediplomeerd schilder, BA-verzekerd. Persoonlijke aanpak, altijd met Sigma-verf.",
};

export default function OverAlex() {
  return <OverAlexPage />;
}
