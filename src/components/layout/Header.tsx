"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Menu, X } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import MobileNav from "@/components/layout/MobileNav";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 20);
    if (latest > 150 && latest > previous) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const isActive = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname.startsWith(href);
    },
    [pathname]
  );

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 glass transition-shadow duration-300 ${
          scrolled ? "shadow-lg shadow-black/5" : ""
        }`}
        initial={{ y: 0 }}
        animate={{ y: hidden ? -100 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <nav
          className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-bold tracking-tight gradient-text
                         hover:opacity-80 transition-opacity duration-200"
            >
              ANNAM
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                      ${
                        isActive(item.href)
                          ? "text-primary"
                          : "text-text-secondary hover:text-text hover:bg-surface-alt"
                      }`}
                  >
                    {t(item.key)}
                    {isActive(item.href) && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute inset-x-1 -bottom-px h-0.5 bg-primary rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right side actions */}
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden relative h-9 w-9 rounded-lg flex items-center justify-center
                           text-text hover:bg-surface-alt transition-colors duration-200
                           focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Spacer to prevent content from going under fixed header */}
      <div className="h-16" aria-hidden="true" />

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
