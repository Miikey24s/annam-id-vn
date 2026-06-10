"use client";

import { use } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";

const blogData: Record<string, { title: string; date: string; readTime: number; content: string }> = {
  "building-portfolio-nextjs": {
    title: "Xây dựng Portfolio với Next.js 15",
    date: "2026-06-10",
    readTime: 5,
    content: `
## Giới thiệu

Next.js 15 với App Router mang đến những cải tiến đáng kể cho việc xây dựng website hiện đại. Trong bài viết này, tôi sẽ chia sẻ cách tôi xây dựng portfolio cá nhân với Next.js 15.

## Tại sao chọn Next.js?

- **Server Components**: Giảm JavaScript phía client, tăng performance
- **SEO tốt nhất**: Built-in metadata API, sitemap, robots.txt
- **Streaming**: Progressive rendering với Suspense
- **Image Optimization**: Tự động WebP/AVIF

## Tech Stack

Tôi sử dụng stack hiện đại:
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- next-intl (i18n)
- next-themes (dark mode)

## Kết luận

Next.js 15 là lựa chọn tuyệt vời cho portfolio developer. Performance tốt, SEO mạnh, và developer experience xuất sắc.
    `,
  },
  "typescript-must-have": {
    title: "TypeScript là Must-Have cho Developer",
    date: "2026-06-05",
    readTime: 4,
    content: `
## Tại sao TypeScript?

TypeScript đã trở thành ngôn ngữ tiêu chuẩn trong phát triển web hiện đại. Với type safety và tooling mạnh mẽ, TypeScript giúp giảm bugs và tăng productivity.

## Lợi ích chính

1. **Type Safety**: Bắt lỗi tại compile time thay vì runtime
2. **IntelliSense**: Auto-complete và documentation tốt hơn
3. **Refactoring**: Dễ dàng rename, move, và restructure code
4. **Team Collaboration**: Interface và type làm documentation sống

## Kết luận

Nếu bạn chưa dùng TypeScript, hãy bắt đầu ngay hôm nay.
    `,
  },
  "docker-frontend": {
    title: "Docker cho Frontend Developer",
    date: "2026-05-28",
    readTime: 6,
    content: `
## Docker là gì?

Docker cho phép bạn đóng gói ứng dụng và dependencies vào container, đảm bảo môi trường nhất quán từ development đến production.

## Multi-stage Builds

Sử dụng multi-stage builds để tạo image nhỏ gọn cho production. Tách biệt build stage và runtime stage giúp giảm kích thước image đáng kể.

## Kết luận

Docker không chỉ dành cho backend. Frontend developer cũng nên nắm vững Docker.
    `,
  },
  "cicd-github-actions": {
    title: "CI/CD với GitHub Actions",
    date: "2026-05-20",
    readTime: 7,
    content: `
## CI/CD là gì?

Continuous Integration / Continuous Deployment là practice tự động hóa quá trình build, test, và deploy code.

## GitHub Actions

GitHub Actions cung cấp CI/CD miễn phí cho public repository và 2000 minutes/tháng cho private repo.

## Pipeline cơ bản

Một pipeline đơn giản: Lint → Test → Build → Deploy. Mỗi bước đảm bảo code quality trước khi đến production.

## Kết luận

Automation là chìa khóa cho developer productivity.
    `,
  },
};

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const t = useTranslations("blog");
  const tCommon = useTranslations("common");
  const post = blogData[slug];

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-text">Post not found</h1>
        <Link href="/blog" className="mt-4 inline-block text-primary">
          ← {tCommon("back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      {/* Back */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          {tCommon("back")}
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold text-text md:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(post.date).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readTime} {t("min_read")}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            Annam Nguyen
          </span>
        </div>
      </motion.div>

      {/* Divider */}
      <hr className="my-8 border-border" />

      {/* Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="prose max-w-none"
      >
        {post.content.split("\n").map((line, i) => {
          const trimmed = line.trim();
          if (!trimmed) return <br key={i} />;
          if (trimmed.startsWith("## "))
            return (
              <h2 key={i} className="mt-8 mb-4 text-2xl font-bold text-text">
                {trimmed.slice(3)}
              </h2>
            );
          if (trimmed.startsWith("1. ") || trimmed.startsWith("- "))
            return (
              <li key={i} className="ml-6 text-text-secondary">
                {trimmed.startsWith("1. ") ? trimmed.slice(3) : trimmed.slice(2)}
              </li>
            );
          return (
            <p key={i} className="mb-4 leading-relaxed text-text-secondary">
              {trimmed}
            </p>
          );
        })}
      </motion.article>

      {/* Share */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-12 flex items-center gap-4 border-t border-border pt-6"
      >
        <Share2 className="h-5 w-5 text-text-muted" />
        <span className="text-sm text-text-muted">{t("share")}:</span>
        <div className="flex gap-2">
          {["Twitter", "Facebook", "LinkedIn"].map((platform) => (
            <button
              key={platform}
              className="rounded-lg bg-surface-alt px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-primary hover:text-white"
            >
              {platform}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
