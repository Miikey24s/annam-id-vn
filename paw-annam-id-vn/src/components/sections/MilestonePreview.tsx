"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

export type MilestonePreviewItem = {
  id: string;
  title: string;
  titleEn: string | null;
  category: string;
  isCompleted: boolean;
  date: Date | null;
  ageAtEvent: string | null;
};

type MilestonePreviewProps = {
  milestones: MilestonePreviewItem[];
};

export default function MilestonePreview({ milestones }: MilestonePreviewProps) {
  const t = useTranslations("milestones");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text">
            {t("title")}
          </h2>
          <p className="text-text-secondary mt-1">
            {t("subtitle")}
          </p>
        </div>
        <Link
          href="/milestones"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          {tCommon("back")} {t("title").toLowerCase()} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {milestones.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border rounded-2xl text-text-muted">
          {tCommon("noData")}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {milestones.map((milestone, idx) => {
            const displayTitle =
              locale === "en" && milestone.titleEn ? milestone.titleEn : milestone.title;
            const categoryName = t(`categories.${milestone.category as "first-time" | "health" | "growth" | "social" | "fun"}`);

            return (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex items-start gap-4">
                  {milestone.isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-secondary flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-6 h-6 text-text-muted flex-shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                      {categoryName}
                    </span>
                    <h3 className="font-bold text-text text-base leading-tight">
                      {displayTitle}
                    </h3>
                    {milestone.isCompleted && milestone.ageAtEvent && (
                      <span className="text-xs text-text-muted block mt-1">
                        Cột mốc lúc: {milestone.ageAtEvent}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
