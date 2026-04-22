import Hero from "@/components/home/Hero";
import MarqueeBar from "@/components/home/MarqueeBar";
import ServicesPreview from "@/components/home/ServicesPreview";
import PortfolioTeaser from "@/components/home/PortfolioTeaser";
import ReviewsMarquee from "@/components/home/ReviewsMarquee";
import CTASection from "@/components/home/CTASection";

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
