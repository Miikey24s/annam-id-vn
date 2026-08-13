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

  return <main className="container-page py-14 sm:py-20"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><span className="section-kicker">{en ? "projects / index" : "dự án / chỉ mục"}</span><h1 className="mt-5 text-5xl font-extrabold tracking-tight sm:text-7xl">{en ? "Projects." : "Dự án."}</h1></div><div className="neo-card bg-orange p-5 sm:p-6"><p className="mono-label">{en ? "Open archive" : "Kho dự án đang mở"}</p><p className="mt-4 text-lg font-bold leading-relaxed">{en ? "Each project is a route I have explored. Details are added when they are safe to share." : "Mỗi dự án là một hướng mình đã thử. Thông tin được bổ sung khi đủ an toàn để công khai."}</p></div></div><div className="mt-12 flex flex-wrap items-center gap-3 border-y-[3px] border-ink py-4"><Filter size={18} /><span className="mono-label mr-2">{en ? "Filter" : "Lọc"}</span>{filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`rounded-md border-2 border-ink px-3 py-2 text-sm font-extrabold transition-transform hover:-translate-y-0.5 ${filter === item ? "bg-lilac" : "bg-cream"}`}>{item === "all" ? (en ? "All" : "Tất cả") : kindLabel[item][en ? "en" : "vi"]}</button>)}</div><p className="mono-label mt-8">{visible.length} {en ? "projects" : "dự án"}</p><div className="mt-4 grid gap-8 md:grid-cols-2">{visible.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} />)}</div><div className="mt-12 border-t-[3px] border-ink pt-6"><Link href="/contact" className="inline-flex items-center gap-2 font-extrabold underline decoration-2 underline-offset-4">{en ? "Talk about a project" : "Cùng trao đổi về một dự án"} <ArrowUpRight size={18} /></Link></div></main>;
}
