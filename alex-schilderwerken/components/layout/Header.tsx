"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/diensten", label: "Diensten" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/over-alex", label: "Over Alex" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <motion.div
          animate={
            scrolled
              ? {
                  backgroundColor: "rgba(8,12,20,0.88)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  borderColor: "rgba(30,45,71,0.8)",
                }
              : {
                  backgroundColor: "rgba(8,12,20,0)",
                  backdropFilter: "blur(0px)",
                  borderColor: "rgba(30,45,71,0)",
                }
          }
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ borderBottomWidth: 1, borderBottomStyle: "solid" }}
        >
          <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" aria-label="Alex Schilderwerken - home">
              <img
                src="/logo.svg"
                alt=""
                width={40}
                height={40}
                style={{ width: 40, height: 40, flexShrink: 0 }}
              />
              <div className="flex flex-col leading-none">
                <span
                  className="font-display text-foreground group-hover:text-accent transition-colors duration-300"
                  style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}
                >
                  Alex
                </span>
                <span
                  className="text-muted uppercase"
                  style={{ fontSize: 9, fontWeight: 400, letterSpacing: "0.15em", marginTop: 4 }}
                >
                  Schilderwerken
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative text-sm font-medium tracking-wide transition-colors duration-300 group ${
                      pathname === link.href
                        ? "text-accent"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-accent transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
                        pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="hidden lg:flex items-center gap-2 bg-primary hover:bg-accent text-foreground px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-500 rounded-sm shadow-glow-sm hover:shadow-glow-md"
              >
                Offerte aanvragen
              </Link>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden flex flex-col gap-[5px] p-2 cursor-pointer"
                aria-label={menuOpen ? "Menu sluiten" : "Menu openen"}
              >
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  className="block w-6 h-px bg-foreground"
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  className="block w-6 h-px bg-foreground"
                  transition={{ duration: 0.35 }}
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  className="block w-6 h-px bg-foreground"
                  transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                />
              </button>
            </div>
          </nav>
        </motion.div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-20 left-0 right-0 z-40 bg-background/96 bg-blur border-b border-border"
          >
            <ul className="flex flex-col max-w-7xl mx-auto px-6 py-8 gap-6">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={`text-lg font-medium tracking-wide transition-colors duration-300 ${
                      pathname === link.href ? "text-accent" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
              >
                <Link
                  href="/contact"
                  className="inline-flex bg-primary hover:bg-accent text-foreground px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 rounded-sm"
                >
                  Offerte aanvragen
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
