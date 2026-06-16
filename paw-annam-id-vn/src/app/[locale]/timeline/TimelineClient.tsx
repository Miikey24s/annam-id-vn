"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { Calendar, BookOpen, Award, Sparkles, Activity } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import EmptyState from "@/components/ui/EmptyState";

type TimelineItem = {
  id: string;
  title: string;
  titleEn: string | null;
  slug?: string;
  excerpt: string | null;
  excerptEn?: string | null;
  coverImage?: string | null;
  category: string;
  date: string;
  type: "journal" | "milestone";
  mood?: string | null;
  ageAtEvent?: string | null;
};

type TimelineClientProps = {
  initialItems: TimelineItem[];
};

export default function TimelineClient({ initialItems }: TimelineClientProps) {
  const t = useTranslations("timeline");
  const locale = useLocale();
  const dateLocale = locale === "vi" ? vi : enUS;
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: t("filterAll") },
    { id: "journal", label: "Nhật ký (Journals)" },
    { id: "milestone", label: t("filterMilestone") },
    { id: "health", label: t("filterHealth") },
  ];

  const filteredItems = initialItems.filter((item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "journal") return item.type === "journal";
    if (activeFilter === "milestone") return item.type === "milestone";
    if (activeFilter === "health") return item.category === "health" || item.category === "medical";
    return true;
  });

  return (
    <div className="space-y-10">
      {/* Filtering Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeFilter === f.id
                ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                : "bg-surface border border-border text-text-secondary hover:bg-surface-alt"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          title={t("noEntries")}
          description={locale === "vi" ? "Hãy thử chọn một bộ lọc khác xem sao!" : "Try picking another filter!"}
        />
      ) : (
        <div className="relative border-l-2 border-border/60 ml-4 md:ml-0 md:before:absolute md:before:left-1/2 md:before:top-0 md:before:bottom-0 md:before:w-0.5 md:before:bg-border/60 md:before:content-[''] md:border-l-0">
          <div className="space-y-12">
            {filteredItems.map((item, idx) => {
              const displayTitle = locale === "en" && item.titleEn ? item.titleEn : item.title;
              const displayExcerpt = locale === "en" && item.excerptEn ? item.excerptEn : item.excerpt;
              const itemDate = new Date(item.date);
              const formattedDate = format(itemDate, "dd MMMM, yyyy", { locale: dateLocale });
              const isEven = idx % 2 === 0;

              // Determine icon and color
              let icon = <Sparkles className="w-4 h-4" />;
              let badgeColor = "bg-primary-light text-primary border-primary/20";
              if (item.type === "journal") {
                icon = <BookOpen className="w-4 h-4" />;
                badgeColor = "bg-secondary-light text-secondary border-secondary/20";
              } else if (item.category === "health") {
                icon = <Activity className="w-4 h-4" />;
                badgeColor = "bg-red-500/10 text-red-500 border-red-500/20";
              } else {
                icon = <Award className="w-4 h-4" />;
              }

              return (
                <div key={item.id} className="relative md:flex md:justify-between items-center group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[25px] md:left-1/2 md:-ml-3 top-2 md:top-6 w-6 h-6 rounded-full border-4 border-surface bg-primary shadow-sm z-10 flex items-center justify-center text-white text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </div>

                  {/* Left spacer for desktop */}
                  <div className={`hidden md:block w-[45%] ${isEven ? "order-1" : "order-3"}`} />

                  {/* Timeline Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 90 }}
                    className={`w-full md:w-[45%] bg-surface border border-border p-6 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${
                      isEven ? "order-3" : "order-1"
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Meta header */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 text-xs text-text-muted font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {formattedDate}
                        </span>
                        {item.ageAtEvent && (
                          <span className="text-[10px] bg-surface-alt border border-border px-2 py-0.5 rounded-full font-bold">
                            {item.ageAtEvent}
                          </span>
                        )}
                        <span className={`flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider ${badgeColor}`}>
                          {icon}
                          {item.type === "journal" ? "Nhật ký" : "Cột mốc"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-extrabold text-text group-hover:text-primary transition-colors">
                        {item.type === "journal" && item.slug ? (
                          <Link href={`/journal/${item.slug}`} className="hover:underline">
                            {displayTitle}
                          </Link>
                        ) : (
                          displayTitle
                        )}
                      </h3>

                      {/* Cover Image if any */}
                      {item.coverImage && (
                        <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-border/60">
                          <img
                            src={item.coverImage}
                            alt={displayTitle}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Content excerpt */}
                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                        {displayExcerpt}
                      </p>

                      {/* Action footer */}
                      {item.type === "journal" && item.slug && (
                        <div className="pt-2">
                          <Link
                            href={`/journal/${item.slug}`}
                            className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 hover:underline"
                          >
                            {locale === "vi" ? "Xem chi tiết →" : "Read more →"}
                          </Link>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
