"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const newLocale = locale === "vi" ? "en" : "vi";
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <button
      onClick={toggleLocale}
      className="relative flex items-center h-9 rounded-full bg-surface-alt border border-border
                 overflow-hidden transition-colors duration-200
                 hover:border-primary focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
      aria-label={`Switch to ${locale === "vi" ? "English" : "Tiếng Việt"}`}
    >
      <span
        className={`px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors duration-200 ${
          locale === "vi"
            ? "text-primary"
            : "text-text-muted hover:text-text-secondary"
        }`}
      >
        VI
      </span>
      <span className="w-px h-4 bg-border" aria-hidden="true" />
      <span
        className={`px-2.5 py-1 text-xs font-semibold tracking-wide transition-colors duration-200 ${
          locale === "en"
            ? "text-primary"
            : "text-text-muted hover:text-text-secondary"
        }`}
      >
        EN
      </span>
    </button>
  );
}
