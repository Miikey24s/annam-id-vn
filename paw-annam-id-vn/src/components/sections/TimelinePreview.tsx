"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Calendar, ArrowRight, BookOpen, Award } from "lucide-react";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

export type TimelinePreviewEntry = {
  id: string;
  title: string;
  titleEn: string | null;
  slug?: string;
  excerpt: string | null;
  excerptEn?: string | null;
  coverImage?: string | null;
  imageUrl?: string | null;
  category: string;
  date: Date;
  type: "journal" | "milestone";
};

type TimelinePreviewProps = {
  entries: TimelinePreviewEntry[];
};

export default function TimelinePreview({ entries }: TimelinePreviewProps) {
  const t = useTranslations("timeline");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const dateLocale = locale === "vi" ? vi : enUS;

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
          href="/timeline"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          {tCommon("back")} {t("title").toLowerCase()} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border rounded-2xl text-text-muted">
          {t("noEntries")}
        </div>
      ) : (
        <div className="relative border-l-2 border-border/80 pl-6 ml-3 space-y-12">
          {entries.map((entry, idx) => {
            const displayTitle = locale === "en" && entry.titleEn ? entry.titleEn : entry.title;
            const displayExcerpt = locale === "en" && entry.excerptEn ? entry.excerptEn : entry.excerpt;
            const entryDate = new Date(entry.date);
            const formattedDate = format(entryDate, "dd MMMM, yyyy", { locale: dateLocale });

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="relative"
              >
                {/* Dot marker */}
                <div className="absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-bg flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>

                <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-6">
                  {/* Text Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-text-muted">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formattedDate}</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="flex items-center gap-1 font-semibold text-primary uppercase tracking-wider">
                        {entry.type === "journal" ? (
                          <>
                            <BookOpen className="w-3 h-3" />
                            {entry.category}
                          </>
                        ) : (
                          <>
                            <Award className="w-3 h-3" />
                            {t("filterMilestone")}
                          </>
                        )}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-text hover:text-primary transition-colors">
                      {entry.type === "journal" ? (
                        <Link href={`/journal/${entry.slug}`}>{displayTitle}</Link>
                      ) : (
                        <span>{displayTitle}</span>
                      )}
                    </h3>

                    <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                      {displayExcerpt || "..."}
                    </p>
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
