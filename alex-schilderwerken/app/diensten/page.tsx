import type { Metadata } from "next";
import DienstenPage from "@/components/diensten/DienstenPage";

export const metadata: Metadata = {
  title: "Diensten",
  description:
    "Ontdek alle schilderdiensten van Alex Schilderwerken: binnenschilderwerk, buitenschilderwerk, tex spuiten, houtrotreparaties, pleisterwerk en verzekeringsherstel.",
};

export default function Diensten() {
  return <DienstenPage />;
}
