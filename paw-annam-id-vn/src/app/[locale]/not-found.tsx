"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import PawPrint from "@/components/ui/PawPrint";
import { motion } from "framer-motion";

export default function NotFoundPage() {
  const t = useTranslations("common");
  const locale = useLocale();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      {/* Background drifting paws */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <PawPrint className="absolute top-1/4 left-1/4 w-12 h-12 rotate-12" />
        <PawPrint className="absolute bottom-1/4 right-1/4 w-16 h-16 -rotate-45" />
        <PawPrint className="absolute top-1/3 right-1/3 w-8 h-8 rotate-90" />
      </div>

      {/* Cute Peeking Cat Animation */}
      <div className="relative w-48 h-48 mb-8 flex items-end justify-center">
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, -3, 3, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-32 h-32 text-primary relative"
        >
          {/* Peeking Cat Ears & Eyes SVG */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 3c-1.2 0-2.4.3-3.5.8L5 2 6.5 6.2C4.3 7.8 3 10.3 3 13c0 1.2.3 2.3.8 3.3L12 11.5l8.2 4.8c.5-1 .8-2.1.8-3.3 0-2.7-1.3-5.2-3.5-6.8L19 2l-3.5 1.8C14.4 3.3 13.2 3 12 3zm-3 8c.8 0 1.5.7 1.5 1.5S9.8 14 9 14s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5zm6 0c.8 0 1.5.7 1.5 1.5S15.8 14 15 14s-1.5-.7-1.5-1.5.7-1.5 1.5-1.5z" />
          </svg>
        </motion.div>
        {/* Ground Line */}
        <div className="absolute bottom-0 w-full h-0.5 bg-border/80" />
      </div>

      <h1 className="text-6xl font-black text-primary mb-2">404</h1>
      <h2 className="text-2xl font-extrabold text-text mb-4">
        {locale === "vi" ? "Bé mèo không tìm thấy trang này" : "Page not found by the kitty"}
      </h2>
      <p className="text-sm text-text-secondary max-w-sm mb-8 leading-relaxed">
        {locale === "vi"
          ? "Trang bạn đang tìm kiếm không tồn tại hoặc bé mèo của chúng mình đã giấu nó đi mất rồi! 🧶"
          : "The page you are looking for doesn't exist, or our kitty has hidden it under the carpet! 🧶"}
      </p>

      <Link
        href="/"
        className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-full font-bold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
      >
        {t("backToHome")}
      </Link>
    </div>
  );
}
