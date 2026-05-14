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
  metadataBase: new URL("https://alex-schilderwerken.vercel.app"),
  title: {
    default: "Alex Schilderwerken | Professioneel Schildersbedrijf in Nederland",
    template: "%s | Alex Schilderwerken",
  },
  description:
    "Alex Schilderwerken: gediplomeerd schilder met 8 jaar ervaring. Binnenschilderwerk, buitenschilderwerk, houtrotreparaties, tex spuiten en pleisterwerk door heel Nederland. Vrijblijvende offerte aan huis.",
  keywords: [
    "schildersbedrijf",
    "schilder",
    "schilder inhuren",
    "binnenschilderwerk",
    "buitenschilderwerk",
    "tex spuiten",
    "houtrotreparaties",
    "pleisterwerk",
    "BA-verzekerd",
    "gediplomeerd schilder",
    "Sigma verf",
    "kozijnen schilderen",
    "gevel schilderen",
    "vrijblijvende offerte schilder",
    "schilder nederland",
    "Alex Schilderwerken",
    "Alex Lanotte",
  ],
  authors: [{ name: "Alex Lanotte" }],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Alex Schilderwerken",
    title: "Alex Schilderwerken | Professioneel Schildersbedrijf in Nederland",
    description:
      "Gediplomeerd schilder met 8 jaar ervaring. Binnenschilderwerk, buitenschilderwerk, houtrotreparaties en meer. BA-verzekerd, vrijblijvende offerte.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://alex-schilderwerken.vercel.app",
              "name": "Alex Schilderwerken",
              "description": "Professioneel schildersbedrijf met 8 jaar ervaring. Binnenschilderwerk, buitenschilderwerk, houtrotreparaties, tex spuiten en pleisterwerk door heel Nederland.",
              "url": "https://alex-schilderwerken.vercel.app",
              "telephone": "+31618269798",
              "email": "schildersbedrijf.lanotte@gmail.com",
              "founder": {
                "@type": "Person",
                "name": "Alex Lanotte",
                "jobTitle": "Gediplomeerd Schilder"
              },
              "areaServed": { "@type": "Country", "name": "NL" },
              "hasCredential": {
                "@type": "EducationalOccupationalCredential",
                "credentialCategory": "Officieel gediplomeerd schilder"
              },
              "knowsAbout": [
                "Binnenschilderwerk",
                "Buitenschilderwerk",
                "Tex spuiten",
                "Houtrotreparaties",
                "Pleisterwerk"
              ],
              "priceRange": "$$",
              "sameAs": ["https://www.instagram.com/alexschilderwerken"]
            })
          }}
        />
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
