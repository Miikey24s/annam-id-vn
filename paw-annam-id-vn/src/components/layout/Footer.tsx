"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Heart } from "lucide-react";

export default function Footer() {
  const t = useTranslations("nav");
  const tAbout = useTranslations("about");

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-surface border-t border-border mt-auto py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
              <Heart className="w-5 h-5 fill-primary" />
              <span className="gradient-text font-extrabold">Paw Memories</span>
            </Link>
            <p className="text-sm text-text-secondary max-w-xs">
              Lưu giữ từng cột mốc lớn khôn và khoảnh khắc đáng yêu trong hành trình nuôi bé mèo đầu tiên.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider mb-4">Danh mục</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-text-secondary hover:text-primary transition-colors">
                  {t("home")}
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="text-text-secondary hover:text-primary transition-colors">
                  {t("timeline")}
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-text-secondary hover:text-primary transition-colors">
                  {t("gallery")}
                </Link>
              </li>
              <li>
                <Link href="/milestones" className="text-text-secondary hover:text-primary transition-colors">
                  {t("milestones")}
                </Link>
              </li>
              <li>
                <Link href="/journal" className="text-text-secondary hover:text-primary transition-colors">
                  {t("journal")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Integration & Credits */}
          <div>
            <h3 className="text-sm font-semibold text-text uppercase tracking-wider mb-4">Kết nối</h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a
                  href="https://annam.id.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Trang chính: annam.id.vn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Miikey24s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/60 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <p>© {currentYear} Paw Memories. All rights reserved.</p>
          <p>{tAbout("credits", { author: "Annam Nguyen" })}</p>
        </div>
      </div>
    </footer>
  );
}
