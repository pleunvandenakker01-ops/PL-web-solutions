import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import MarqueeBar from "@/components/home/MarqueeBar";
import ServicesPreview from "@/components/home/ServicesPreview";
import PortfolioTeaser from "@/components/home/PortfolioTeaser";
import ReviewsMarquee from "@/components/home/ReviewsMarquee";
import CTASection from "@/components/home/CTASection";

export const metadata: Metadata = {
  title: "Alex Schilderwerken | Professioneel Schildersbedrijf in Nederland",
  description:
    "Alex Schilderwerken: gediplomeerd schilder met 8 jaar ervaring. Binnenschilderwerk, buitenschilderwerk, houtrotreparaties en tex spuiten door heel Nederland. Vraag een vrijblijvende offerte aan.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeBar />
      <ServicesPreview />
      <PortfolioTeaser />
      <ReviewsMarquee />
      <CTASection />
    </>
  );
}
