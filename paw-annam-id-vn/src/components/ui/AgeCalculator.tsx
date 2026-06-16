"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function AgeCalculator() {
  const t = useTranslations("milestones");
  const [months, setMonths] = useState(6);

  // Helper to convert cat age in months to human age
  const calculateHumanAge = (catMonths: number) => {
    if (catMonths <= 0) return 0;
    if (catMonths === 1) return 1;
    if (catMonths <= 3) {
      // 1 to 3 months maps to 1 to 4 human years
      return 1 + Math.round(((catMonths - 1) / 2) * 3);
    }
    if (catMonths <= 6) {
      // 3 to 6 months maps to 4 to 10 human years
      return 4 + Math.round(((catMonths - 3) / 3) * 6);
    }
    if (catMonths <= 12) {
      // 6 to 12 months maps to 10 to 15 human years
      return 10 + Math.round(((catMonths - 6) / 6) * 5);
    }
    if (catMonths <= 24) {
      // 12 to 24 months (1 to 2 years) maps to 15 to 24 human years
      return 15 + Math.round(((catMonths - 12) / 12) * 9);
    }
    // After 2 years: 24 + 4 human years for each additional cat year
    const remainingYears = (catMonths - 24) / 12;
    return Math.round(24 + remainingYears * 4);
  };

  const humanAge = calculateHumanAge(months);

  // Determine stage description
  const getStageInfo = (m: number) => {
    if (m <= 6) return { name: "Kitten (Mèo con)", color: "text-primary bg-primary-light" };
    if (m <= 12) return { name: "Junior (Thiếu niên)", color: "text-secondary bg-secondary-light" };
    if (m <= 72) return { name: "Adult (Trưởng thành)", color: "text-secondary-dark bg-secondary-light/60" };
    return { name: "Senior (Lão niên)", color: "text-primary-dark bg-primary-light" };
  };

  const stage = getStageInfo(months);

  const formatCatAge = (m: number) => {
    if (m < 12) {
      return `${m} ${t("months")}`;
    }
    const yrs = Math.floor(m / 12);
    const rem = m % 12;
    if (rem === 0) return `${yrs} ${t("years")}`;
    return `${yrs} ${t("years")} ${rem} ${t("months")}`;
  };

  return (
    <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <svg className="w-32 h-32 text-primary" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm-4.7-6.2a1 1 0 0 1 0-1.4l5.3-5.3a1 1 0 0 1 1.4 0l.7.7a1 1 0 0 1 0 1.4l-5.3 5.3a1 1 0 0 1-1.4 0l-.7-.7z" />
        </svg>
      </div>

      <div className="relative z-10 space-y-6">
        <div>
          <h3 className="text-xl font-bold text-text flex items-center gap-2">
            <span>🐱</span> {t("calculatorTitle")}
          </h3>
          <p className="text-text-secondary text-xs mt-1">
            {t("calculatorDesc")}
          </p>
        </div>

        {/* Dynamic Age Display */}
        <div className="flex items-center justify-between gap-4 py-4 border-y border-border/60">
          <div className="space-y-1">
            <span className="text-xs text-text-muted uppercase tracking-wider block font-semibold">
              {t("catAge")}
            </span>
            <span className="text-2xl font-extrabold text-primary">
              {formatCatAge(months)}
            </span>
            <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-bold ml-2 ${stage.color}`}>
              {stage.name}
            </span>
          </div>
          <div className="text-right space-y-1">
            <span className="text-xs text-text-muted uppercase tracking-wider block font-semibold">
              {t("humanAge")}
            </span>
            <motion.span
              key={humanAge}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl font-extrabold text-secondary block"
            >
              {humanAge} <span className="text-sm font-medium">{t("years")}</span>
            </motion.span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="120"
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value))}
            className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
          />
          <div className="flex justify-between text-xs text-text-muted font-medium px-1">
            <span>1 {t("months")}</span>
            <span>1 {t("years")}</span>
            <span>2 {t("years")}</span>
            <span>5 {t("years")}</span>
            <span>10 {t("years")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
