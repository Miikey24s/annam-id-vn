import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Circle, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { copy, getProject, kindLabel, projects, statusLabel } from "@/lib/content";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() { return ["vi", "en"].flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug }))); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: copy(project.summary, locale) };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const en = locale === "en";
  const accent = project.accent === "orange" ? "bg-orange" : project.accent === "lilac" ? "bg-lilac" : "bg-yellow";
  const sections = [
    [en ? "The challenge" : "BÃ i toÃ¡n", project.challenge],
    [en ? "The approach" : "CÃ¡ch lÃ m", project.approach],
    [en ? "Public evidence" : "Báº±ng chá»©ng public", project.outcome],
    [en ? "What I learned" : "BÃ i há»c", project.learning],
  ] as const;
  return <main className="container-page py-12 sm:py-20"><Link href="/projects" className="inline-flex items-center gap-2 font-extrabold underline decoration-2 underline-offset-4"><ArrowLeft size={18} />{en ? "Back to work" : "Quay láº¡i Work"}</Link><div className={`neo-card mt-8 overflow-hidden ${accent}`}><div className="flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-ink bg-cream px-5 py-4 sm:px-8"><span className="mono-label">{kindLabel[project.kind][en ? "en" : "vi"]} / {project.year}</span><span className="inline-flex items-center gap-2 text-sm font-bold"><Circle size={11} fill="currentColor" />{statusLabel[project.status][en ? "en" : "vi"]}</span></div><div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.1fr_.9fr]"><div><h1 className="max-w-3xl text-5xl font-extrabold leading-[.92] tracking-tight sm:text-7xl">{project.title}</h1><p className="mt-6 max-w-2xl text-xl font-medium leading-relaxed">{copy(project.summary, locale)}</p><div className="mt-8 flex flex-wrap gap-2">{project.stack.map((item) => <span key={item} className="rounded-md border-2 border-ink bg-cream px-3 py-2 font-mono text-xs font-semibold">{item}</span>)}</div></div><div className="neo-card-sm self-start overflow-hidden bg-cream">{project.image && <div className="relative aspect-[16/9] border-b-[3px] border-ink"><Image src={project.image.src} alt={copy(project.image.alt, locale)} fill sizes="(min-width: 1024px) 35vw, 100vw" className="object-cover object-top" priority /></div>}<div className="p-5"><p className="mono-label">{en ? "My role" : "Vai trÃ²"}</p><p className="mt-3 text-xl font-extrabold">{copy(project.role, locale)}</p><div className="mt-6 border-t-2 border-ink pt-4"><p className="mono-label">{en ? "Evidence status" : "Tráº¡ng thÃ¡i báº±ng chá»©ng"}</p><p className="mt-2 text-sm leading-relaxed">{project.image ? (en ? "This page includes approved public material from the linked repository." : "Trang nÃ y sá»­ dá»¥ng tÃ i liá»‡u public Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t tá»« repository Ä‘Æ°á»£c liÃªn káº¿t.") : (en ? "This project is represented by verified public repository details; visual assets can be added when approved." : "Project Ä‘Æ°á»£c trÃ¬nh bÃ y báº±ng thÃ´ng tin repository public Ä‘Ã£ xÃ¡c minh; asset trá»±c quan sáº½ Ä‘Æ°á»£c thÃªm khi Ä‘Æ°á»£c duyá»‡t.")}</p></div>{project.links && <div className="mt-5 flex flex-wrap gap-3">{project.links.demo && <a className="neo-button neo-button-orange min-h-0 px-3 py-2 text-sm" href={project.links.demo} target="_blank" rel="noreferrer">Demo <ExternalLink size={15} /></a>}{project.links.repo && <a className="neo-button neo-button-plain min-h-0 px-3 py-2 text-sm" href={project.links.repo} target="_blank" rel="noreferrer">Code <ExternalLink size={15} /></a>}</div>}</div></div></div></div><div className="mt-12 grid gap-5 md:grid-cols-2">{sections.map(([title, value]) => value ? <section key={title} className="neo-card-sm bg-cream p-5 sm:p-6"><p className="mono-label">{title}</p><p className="mt-5 text-lg font-medium leading-relaxed">{copy(value, locale)}</p></section> : null)}</div>{project.gallery && project.gallery.length > 0 && <section className="mt-12"><div className="flex flex-wrap items-end justify-between gap-4"><div><span className="section-kicker">public / gallery</span><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">{en ? "Selected public screens" : "Má»™t sá»‘ mÃ n hÃ¬nh public"}</h2></div><p className="max-w-md text-sm font-medium leading-relaxed">{en ? "Screens are included only when they are already public in the source repository." : "Chá»‰ dÃ¹ng cÃ¡c mÃ n hÃ¬nh Ä‘Ã£ cÃ´ng khai trong repository nguá»“n."}</p></div><div className="mt-6 grid gap-5 md:grid-cols-2">{project.gallery.map((asset) => <figure key={asset.src} className="neo-card-sm overflow-hidden bg-cream"><div className="relative aspect-[16/9] border-b-[3px] border-ink"><Image src={asset.src} alt={copy(asset.alt, locale)} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-top" /></div><figcaption className="p-4 text-sm font-bold">{copy(asset.alt, locale)}</figcaption></figure>)}</div></section>}<div className="mt-12 flex flex-wrap items-center justify-between gap-5 border-t-[3px] border-ink pt-6"><p className="font-bold">{en ? "This project can grow as the evidence grows." : "Project nÃ y sáº½ lá»›n dáº§n cÃ¹ng vá»›i pháº§n báº±ng chá»©ng."}</p><Link href="/contact" className="inline-flex items-center gap-2 font-extrabold underline decoration-2 underline-offset-4">{en ? "Ask me about it" : "Há»i mÃ¬nh vá» project"} <ArrowUpRight size={18} /></Link></div></main>;
}
