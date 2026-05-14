import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Offerte Aanvragen - Vrijblijvend Advies",
  description:
    "Vraag vrijblijvend een offerte aan bij Alex Schilderwerken. Bel 06 18 26 97 98 of stuur een bericht. Persoonlijke inmeting aan huis, snel reactie binnen 24 uur.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return <ContactPage />;
}
