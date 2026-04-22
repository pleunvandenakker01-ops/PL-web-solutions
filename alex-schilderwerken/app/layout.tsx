import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/ui/SmoothScroll";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import CallButton from "@/components/ui/CallButton";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Alex Schilderwerken | Vakmanschap dat je ziet",
    template: "%s | Alex Schilderwerken",
  },
  description:
    "Premium schildersbedrijf met 8 jaar ervaring. Binnenschilderwerk, buitenschilderwerk, tex spuiten, houtrotreparaties en meer. BA-verzekerd, officieel gediplomeerd.",
  keywords: [
    "schildersbedrijf",
    "schilder",
    "binnenschilderwerk",
    "buitenschilderwerk",
    "tex spuiten",
    "houtrotreparaties",
    "pleisterwerk",
    "BA-verzekerd",
    "gediplomeerd schilder",
    "Sigma verf",
  ],
  authors: [{ name: "Alex Schilderwerken" }],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Alex Schilderwerken",
    title: "Alex Schilderwerken | Vakmanschap dat je ziet",
    description:
      "Premium schildersbedrijf met 8 jaar ervaring. BA-verzekerd, officieel gediplomeerd.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body
        className={`${inter.variable} ${playfair.variable} bg-background text-foreground antialiased`}
      >
        <SmoothScroll>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
          <CallButton />
        </SmoothScroll>
      </body>
    </html>
  );
}
