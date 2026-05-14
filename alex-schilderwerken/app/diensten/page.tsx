import type { Metadata } from "next";
import DienstenPage from "@/components/diensten/DienstenPage";

export const metadata: Metadata = {
  title: "Schilderdiensten: Binnenschilderwerk, Buitenschilderwerk & Houtrotreparaties",
  description:
    "Alle schilderdiensten van Alex Schilderwerken: binnenschilderwerk, buitenschilderwerk, tex spuiten, houtrotreparaties en pleisterwerk. BA-verzekerd, altijd met Sigma-verf. Vrijblijvende offerte.",
  alternates: { canonical: "/diensten" },
};

export default function Diensten() {
  return <DienstenPage />;
}
