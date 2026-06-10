"use client";

import { useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

type MobileNavProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const t = useTranslations("nav");

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, handleEscape]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Slide-in panel */}
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-bg border-l border-border
                       flex flex-col md:hidden"
            aria-label="Mobile navigation"
          >
            {/* Close area / spacing */}
            <div className="h-16 flex items-center px-6">
              <span className="text-lg font-bold gradient-text">ANNAM</span>
            </div>

            {/* Nav links */}
            <ul className="flex-1 flex flex-col gap-1 px-4 py-4">
              {NAV_ITEMS.map((item, index) => (
                <motion.li
                  key={item.key}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="block px-4 py-3 text-lg font-medium text-text-secondary
                               rounded-xl hover:bg-surface-alt hover:text-text
                               transition-colors duration-200"
                  >
                    {t(item.key)}
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Bottom controls */}
            <div className="border-t border-border px-6 py-4 flex items-center justify-between">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
