"use client";

import { useState } from "react";
import { ArrowUpRight, Filter } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import ProjectCard from "@/components/ui/ProjectCard";
import { kindLabel, projects, type ProjectKind } from "@/lib/content";

const filters: (ProjectKind | "all")[] = ["all", "enterprise", "dashboard", "mobile", "game", "tool"];

export default function ProjectsPage() {
  const locale = useLocale();
  const en = locale === "en";
  const [filter, setFilter] = useState<ProjectKind | "all">("all");
  const visible = filter === "all" ? projects : projects.filter((project) => project.kind === filter);
  return <main className="container-page py-14 sm:py-20"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><span className="section-kicker">work / index</span><h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-7xl">{en ? "Things I build." : "Nhá»¯ng thá»© mÃ¬nh xÃ¢y."}</h1></div><div className="neo-card bg-orange p-5 sm:p-6"><p className="mono-label">{en ? "A flexible archive" : "Má»™t archive linh hoáº¡t"}</p><p className="mt-4 text-lg font-bold leading-relaxed">{en ? "Some are products, some are experiments. Each one gets more detail as the story becomes public." : "CÃ³ project lÃ  sáº£n pháº©m, cÃ³ project lÃ  thá»­ nghiá»‡m. Má»—i project sáº½ cÃ³ thÃªm chiá»u sÃ¢u khi cÃ¢u chuyá»‡n Ä‘á»§ an toÃ n Ä‘á»ƒ cÃ´ng khai."}</p></div></div><div className="mt-12 flex flex-wrap items-center gap-3 border-y-[3px] border-ink py-4"><Filter size={18} /><span className="mono-label mr-2">{en ? "Filter" : "Lá»c"}</span>{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-md border-2 border-ink px-3 py-2 text-sm font-extrabold transition-transform hover:-translate-y-0.5 ${filter === item ? "bg-lilac" : "bg-cream"}`}>{item === "all" ? (en ? "All" : "Táº¥t cáº£") : kindLabel[item][en ? "en" : "vi"]}</button>)}</div><p className="mono-label mt-8">{visible.length} {en ? "projects in this view" : "project trong danh sÃ¡ch"}</p><div className="mt-4 grid gap-8 md:grid-cols-2">{visible.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} />)}</div><div className="mt-12 border-t-[3px] border-ink pt-6"><Link href="/contact" className="inline-flex items-center gap-2 font-extrabold underline decoration-2 underline-offset-4">{en ? "Want to talk about a project?" : "Muá»‘n trao Ä‘á»•i vá» má»™t project?"} <ArrowUpRight size={18} /></Link></div></main>;
}
