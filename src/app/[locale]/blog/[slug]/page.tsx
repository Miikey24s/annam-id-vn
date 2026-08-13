import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { copy, getNote, notes } from "@/lib/content";

type Props = { params: Promise<{ locale: string; slug: string }> };
export function generateStaticParams() { return ["vi", "en"].flatMap((locale) => notes.map((note) => ({ locale, slug: note.slug }))); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { locale, slug } = await params; const note = getNote(slug); return note ? { title: copy(note.title, locale), description: copy(note.excerpt, locale) } : {}; }

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const note = getNote(slug);
  if (!note) notFound();
  const en = locale === "en";
  return <main className="container-page py-14 sm:py-20"><Link href="/blog" className="inline-flex items-center gap-2 font-extrabold underline decoration-2 underline-offset-4"><ArrowLeft size={18} />{en ? "Back to notes" : "Quay lại ghi chú"}</Link><article className="mx-auto mt-10 max-w-3xl"><div className="flex flex-wrap items-center gap-3"><span className="sticker bg-lilac">{copy(note.tag, locale)}</span><span className="mono-label">{note.readTime} min read</span><span className="mono-label">{note.date}</span></div><h1 className="mt-8 text-5xl font-extrabold leading-[.95] tracking-tight sm:text-7xl">{copy(note.title, locale)}</h1><p className="mt-7 text-xl font-medium leading-relaxed">{copy(note.excerpt, locale)}</p><div className="neo-card mt-12 bg-cream p-6 sm:p-10"><div className="prose-neo">{note.body.map((paragraph) => <p key={paragraph.en}>{copy(paragraph, locale)}</p>)}</div></div><div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t-[3px] border-ink pt-6"><span className="font-bold">{en ? "Keep building." : "Tiếp tục xây."}</span><Link href="/contact" className="inline-flex items-center gap-2 font-extrabold underline decoration-2 underline-offset-4">{en ? "Say hello" : "Gửi lời chào"} <ArrowUpRight size={18} /></Link></div></article></main>;
}
