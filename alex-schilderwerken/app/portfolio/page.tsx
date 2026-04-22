import type { Metadata } from "next";
import PortfolioPage from "@/components/portfolio/PortfolioPage";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Bekijk het werk van Alex Schilderwerken. Voor/na-foto's van schilderprojecten, tex spuiten, houtrotreparaties en meer.",
};

export default function Portfolio() {
  return <PortfolioPage />;
}
