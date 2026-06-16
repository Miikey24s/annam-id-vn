"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Search, Calendar, BookOpen, Clock, Smile, Tag, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import EmptyState from "@/components/ui/EmptyState";

type JournalEntry = {
  id: string;
  title: string;
  titleEn: string | null;
  slug: string;
  excerpt: string | null;
  excerptEn: string | null;
  coverImage: string | null;
  category: string;
  tags: string[];
  mood: string | null;
  readingTime: number | null;
  publishedAt: string | null;
  createdAt: string;
};

type JournalClientProps = {
  initialEntries: JournalEntry[];
};

export default function JournalClient({ initialEntries }: JournalClientProps) {
  const t = useTranslations("journal");
  const locale = useLocale();
  const dateLocale = locale === "vi" ? vi : enUS;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Extract unique categories and tags
  const categories = ["all", "daily", "milestone", "health", "funny", "tips"];
  const allTags = Array.from(new Set(initialEntries.flatMap((e) => e.tags)));

  // Filter logic
  const filteredEntries = initialEntries.filter((entry) => {
    const title = (locale === "en" && entry.titleEn ? entry.titleEn : entry.title).toLowerCase();
    const excerpt = (locale === "en" && entry.excerptEn ? entry.excerptEn : entry.excerpt || "").toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || excerpt.includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;
    const matchesTag = !selectedTag || entry.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesTag;
  });

  const getMoodEmoji = (mood: string | null) => {
    switch (mood) {
      case "happy":
        return "😸";
      case "playful":
        return "😼";
      case "sleepy":
        return "😾";
      case "sick":
        return "😿";
      case "curious":
        return "🙀";
      default:
        return "🐱";
    }
  };

  return (
    <div className="space-y-8">
      {/* Search & Filtering Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface border border-border p-4 rounded-3xl shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-full text-sm bg-surface-alt/50 focus:outline-none focus:border-primary text-text"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-start md:justify-end">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-primary text-white scale-105"
                  : "bg-surface-alt/70 border border-border/80 text-text-secondary hover:bg-surface-alt"
              }`}
            >
              {cat === "all" ? t("filterAll" as any) : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Tag Active Filter */}
      {selectedTag && (
        <div className="flex items-center gap-2 bg-primary-light border border-primary/20 text-primary text-xs px-3 py-1.5 rounded-full w-max">
          <Tag className="w-3.5 h-3.5" />
          <span>Tag: {selectedTag}</span>
          <button onClick={() => setSelectedTag(null)} className="hover:text-primary-dark cursor-pointer font-bold ml-1">
            ✕
          </button>
        </div>
      )}

      {/* Entries Grid */}
      {filteredEntries.length === 0 ? (
        <EmptyState
          title={t("noEntries")}
          description={locale === "vi" ? "Không tìm thấy bài viết nào phù hợp." : "No matching entries found."}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry) => {
              const displayTitle = locale === "en" && entry.titleEn ? entry.titleEn : entry.title;
              const displayExcerpt = locale === "en" && entry.excerptEn ? entry.excerptEn : entry.excerpt;
              const postDate = new Date(entry.publishedAt || entry.createdAt);
              const formattedDate = format(postDate, "dd MMMM, yyyy", { locale: dateLocale });

              return (
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.3 }}
                  key={entry.id}
                  className="bg-surface border border-border rounded-3xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full group"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video w-full bg-surface-alt border-b border-border/60 overflow-hidden">
                    {entry.coverImage ? (
                      <img
                        src={entry.coverImage}
                        alt={displayTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-light/40 to-secondary-light/40 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm border border-border px-3 py-1 rounded-full text-[10px] font-extrabold uppercase text-primary tracking-wider shadow-sm">
                      {entry.category}
                    </span>
                    {entry.mood && (
                      <span className="absolute bottom-3 right-3 bg-surface/90 backdrop-blur-sm p-1.5 rounded-full text-base shadow-sm leading-none" title={`Mood: ${entry.mood}`}>
                        {getMoodEmoji(entry.mood)}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formattedDate}
                        </span>
                        {entry.readingTime && (
                          <span className="flex items-center gap-1 border-l border-border pl-3">
                            <Clock className="w-3.5 h-3.5" />
                            {t("readTime", { minutes: entry.readingTime })}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-extrabold text-text group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        <Link href={`/journal/${entry.slug}`}>{displayTitle}</Link>
                      </h3>

                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
                        {displayExcerpt}
                      </p>
                    </div>

                    {/* Tags & Action */}
                    <div className="pt-2 space-y-3">
                      {/* Tags chips */}
                      {entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                              className={`text-[9px] px-2 py-0.5 rounded-full border cursor-pointer transition-colors ${
                                selectedTag === tag
                                  ? "bg-primary text-white border-primary"
                                  : "bg-surface-alt/60 text-text-muted border-border hover:bg-border/40"
                              }`}
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="border-t border-border/60 pt-3">
                        <Link
                          href={`/journal/${entry.slug}`}
                          className="text-xs font-bold text-primary group-hover:text-primary-dark inline-flex items-center gap-1 group-hover:underline"
                        >
                          {t("readMore")} →
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
