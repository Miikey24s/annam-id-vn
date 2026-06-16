"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const handleLanguageChange = (newLocale: "vi" | "en") => {
    // @ts-ignore
    router.replace({ pathname, query: params }, { locale: newLocale });
  };

  return (
    <div className="flex items-center bg-surface-alt border border-border rounded-full p-1 text-xs">
      <button
        onClick={() => handleLanguageChange("vi")}
        className={`px-3 py-1 rounded-full font-medium transition-all ${
          locale === "vi"
            ? "bg-primary text-white shadow-sm"
            : "text-text-secondary hover:text-primary"
        }`}
      >
        VI
      </button>
      <button
        onClick={() => handleLanguageChange("en")}
        className={`px-3 py-1 rounded-full font-medium transition-all ${
          locale === "en"
            ? "bg-primary text-white shadow-sm"
            : "text-text-secondary hover:text-primary"
        }`}
      >
        EN
      </button>
    </div>
  );
}
