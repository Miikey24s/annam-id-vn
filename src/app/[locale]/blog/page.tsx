"use client";

import { ArrowUpRight, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { copy, notes } from "@/lib/content";

export default function BlogPage() {
  const locale = useLocale();
  const en = locale === "en";
  const [query, setQuery] = useState("");
  const visible = notes.filter((note) => `${copy(note.title, locale)} ${copy(note.excerpt, locale)}`.toLowerCase().includes(query.toLowerCase()));
  return <main className="container-page py-14 sm:py-20"><div className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-end"><div><span className="section-kicker">notes / build log</span><h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-7xl">{en ? "Notes from the loop." : "Ghi chú trong quá trình làm."}</h1></div><div className="neo-card bg-yellow p-6"><p className="text-lg font-extrabold leading-relaxed">{en ? "Short thoughts about product, code, interfaces, and the decisions between them." : "Những ghi chú ngắn về sản phẩm, code, giao diện và các quyết định nằm giữa chúng."}</p></div></div><div className="mt-12 flex items-center gap-3 border-y-[3px] border-ink py-4"><Search size={18} /><label className="sr-only" htmlFor="note-search">{en ? "Search notes" : "Tìm ghi chú"}</label><input id="note-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={en ? "Search notes..." : "Tìm trong ghi chú..."} className="w-full bg-transparent font-medium outline-none placeholder:text-muted" /></div><div className="mt-8 grid gap-5">{visible.map((note, index) => <Link key={note.slug} href={`/blog/${note.slug}`} className="neo-card-sm group grid gap-6 bg-cream p-5 transition-transform hover:-translate-y-1 sm:grid-cols-[80px_1fr_auto] sm:items-start sm:p-6"><span className="flex h-14 w-14 items-center justify-center border-[3px] border-ink bg-lilac text-xl font-extrabold shadow-[3px_3px_0_var(--color-ink)]">0{index + 1}</span><div><div className="flex flex-wrap gap-x-3 gap-y-1"><span className="mono-label">{copy(note.tag, locale)}</span><span className="mono-label text-muted">{note.readTime} min read</span></div><h2 className="mt-4 text-2xl font-extrabold">{copy(note.title, locale)}</h2><p className="mt-2 max-w-2xl leading-relaxed">{copy(note.excerpt, locale)}</p></div><span className="inline-flex items-center gap-2 font-extrabold sm:pt-1">{en ? "Read" : "Đọc"} <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span></Link>)}{visible.length === 0 && <div className="neo-card bg-cream p-8 text-center font-bold">{en ? "No notes found." : "Chưa tìm thấy ghi chú phù hợp."}</div>}</div></main>;
}
