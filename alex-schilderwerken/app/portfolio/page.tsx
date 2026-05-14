import type { Metadata } from "next";
import PortfolioPage from "@/components/portfolio/PortfolioPage";

export const metadata: Metadata = {
  title: "Portfolio: Schilderprojecten & Voor/Na Foto's",
  description:
    "Bekijk uitgevoerde schilderprojecten van Alex Schilderwerken. Voor- en nafoto's van binnenschilderwerk, buitenschilderwerk, houtrotreparaties en tex spuiten.",
  alternates: { canonical: "/portfolio" },
};

export default function Portfolio() {
  return <PortfolioPage />;
}
