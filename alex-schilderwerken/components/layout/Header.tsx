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
            <Link href="/" className="flex items-center group" aria-label="Alex Schilderwerken - home">
              <div
                style={{
                  position: "relative",
                  height: 44,
                  overflow: "hidden",
                  flexShrink: 0,
                  mixBlendMode: "screen",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo-alex.jpg"
                  alt="Alex Schilderwerken"
                  style={{
                    position: "absolute",
                    top: "-3px",
                    left: 0,
                    height: 76,
                    width: "auto",
                    filter: "invert(1)",
                    display: "block",
                  }}
                />
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
              <a
                href="https://www.instagram.com/alexschilderwerken"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Volg Alex Schilderwerken op Instagram"
                className="hidden lg:flex items-center justify-center w-9 h-9 text-muted hover:text-accent transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
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
