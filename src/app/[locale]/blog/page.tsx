'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { Search, Clock, Calendar } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'building-portfolio-nextjs',
    title: 'Xây dựng Portfolio với Next.js 15',
    excerpt:
      'Hướng dẫn chi tiết cách xây dựng portfolio cá nhân hiện đại với Next.js 15 App Router, Tailwind CSS, và các best practices mới nhất.',
    date: '2026-06-10',
    readTime: 5,
  },
  {
    slug: 'typescript-must-have',
    title: 'TypeScript là Must-Have cho Developer',
    excerpt:
      'Tại sao TypeScript nên là ngôn ngữ mặc định của bạn? Phân tích lợi ích và cách áp dụng hiệu quả trong dự án thực tế.',
    date: '2026-06-05',
    readTime: 4,
  },
  {
    slug: 'docker-frontend',
    title: 'Docker cho Frontend Developer',
    excerpt:
      'Bắt đầu với Docker khi bạn là frontend developer. Từ container cơ bản đến multi-stage builds cho production.',
    date: '2026-05-28',
    readTime: 6,
  },
  {
    slug: 'cicd-github-actions',
    title: 'CI/CD với GitHub Actions',
    excerpt:
      'Tự động hóa deployment với GitHub Actions. Xây dựng pipeline hoàn chỉnh từ lint, test đến deploy.',
    date: '2026-05-20',
    readTime: 7,
  },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BlogPage() {
  const t = useTranslations('blog');
  const [search, setSearch] = useState('');

  const filtered = blogPosts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div
          className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 left-0 h-72 w-72 rounded-full bg-secondary/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-bold md:text-5xl">
              <span className="gradient-text">{t('title')}</span>
            </h1>
            <p className="mt-2 text-xl text-text-secondary">{t('subtitle')}</p>
            <p className="mt-4 text-text-muted">{t('description')}</p>
          </motion.div>
        </div>
      </section>

      {/* Search & posts */}
      <section className="pb-20 sm:pb-28" aria-labelledby="blog-heading">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 id="blog-heading" className="sr-only">
            {t('subtitle')}
          </h2>

          {/* Search input */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mb-10"
          >
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder={t('search_placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface py-3 pl-12 pr-4 text-text placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-label={t('search_placeholder')}
            />
          </motion.div>

          {/* Posts list */}
          <motion.div
            className="space-y-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {filtered.map((post) => (
              <motion.article
                key={post.slug}
                variants={fadeInUp}
                transition={{ duration: 0.4 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="group rounded-lg border border-border border-l-[3px] border-l-primary bg-surface p-6 transition-all hover:bg-surface-alt hover:shadow-md">
                    {/* Meta */}
                    <div className="mb-3 flex items-center gap-4 text-sm text-text-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {formatDate(post.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {post.readTime} {t('min_read')}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-semibold text-text transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="mt-2 text-text-secondary line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Read more */}
                    <span className="mt-3 inline-block text-sm font-medium text-primary">
                      {t('read_more')} →
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>

          {/* No results */}
          {filtered.length === 0 && (
            <motion.p
              className="py-12 text-center text-text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {t('no_results')}
            </motion.p>
          )}
        </div>
      </section>
    </>
  );
}
