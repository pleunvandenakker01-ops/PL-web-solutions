import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Neem contact op met Alex Schilderwerken. Bel 06 18 26 97 98 of stuur een e-mail. Altijd een vrijblijvende offerte.",
};

export default function Contact() {
  return <ContactPage />;
}
