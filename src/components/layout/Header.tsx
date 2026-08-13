"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";

const navItems = [
  { href: "/projects", vi: "Work", en: "Work" },
  { href: "/now", vi: "Đang làm", en: "Now" },
  { href: "/blog", vi: "Notes", en: "Notes" },
  { href: "/about", vi: "Về mình", en: "About" },
] as const;

export default function Header({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isEnglish = locale === "en";
  const label = (item: (typeof navItems)[number]) => (isEnglish ? item.en : item.vi);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-ink bg-paper/95 backdrop-blur">
      <div className="container-page flex min-h-[78px] items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3 no-underline" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center border-[3px] border-ink bg-orange text-lg font-extrabold shadow-[4px_4px_0_var(--color-ink)] transition-transform group-hover:-rotate-6">A</span>
          <span className="leading-none"><strong className="block text-xl font-extrabold tracking-tight">ANNAM<span className="text-orange">.</span></strong><span className="mono-label text-[.62rem]">build / learn / ship</span></span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex" aria-label={isEnglish ? "Main navigation" : "Điều hướng chính"}>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`rounded-lg border-2 border-transparent px-3 py-2 text-sm font-bold transition-colors hover:border-ink hover:bg-yellow ${isActive(item.href) ? "border-ink bg-lilac" : ""}`}>
              {label(item)}
            </Link>
          ))}
          <Link href="/contact" className="neo-button neo-button-orange ml-2 min-h-0 px-4 py-2 text-sm">{isEnglish ? "Contact" : "Liên hệ"}</Link>
        </nav>

        <button type="button" className="neo-button neo-button-yellow min-h-0 p-2 md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && <div className="container-page pb-5 md:hidden">
        <nav className="neo-card-sm grid gap-2 bg-cream p-3" aria-label={isEnglish ? "Mobile navigation" : "Điều hướng mobile"}>
          {navItems.map((item) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-3 font-bold ${isActive(item.href) ? "bg-lilac" : "hover:bg-yellow"}`}>{label(item)}</Link>)}
          <Link href="/contact" onClick={() => setOpen(false)} className="neo-button neo-button-orange mt-1">{isEnglish ? "Contact me" : "Liên hệ mình"}</Link>
        </nav>
      </div>}
    </header>
  );
}
