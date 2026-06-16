"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import ThemeToggle from "../ui/ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const t = useTranslations("nav");
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: t("home"), href: "/" },
    { name: t("timeline"), href: "/timeline" },
    { name: t("gallery"), href: "/gallery" },
    { name: t("milestones"), href: "/milestones" },
    { name: t("journal"), href: "/journal" },
    { name: t("health"), href: "/health" },
    { name: t("about"), href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary transition-colors hover:text-primary-dark">
          <Heart className="w-6 h-6 fill-primary" />
          <span className="gradient-text font-extrabold">Paw Memories</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-text-secondary hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <div className="flex items-center gap-3 border-l border-border pl-6">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-text-secondary hover:text-primary transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-b border-border overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium text-text-secondary hover:text-primary py-2 border-b border-border/50 transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex items-center justify-between pt-4">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
