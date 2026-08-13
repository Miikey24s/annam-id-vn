import Image from "next/image";
import { ArrowUpRight, Circle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { copy, kindLabel, statusLabel, type Project } from "@/lib/content";

const accentClass = { orange: "bg-orange", lilac: "bg-lilac", yellow: "bg-yellow" } as const;

export default function ProjectCard({ project, locale, featured = false }: { project: Project; locale: string; featured?: boolean }) {
  const en = locale === "en";
  const title = copy(project.summary, locale);
  return (
    <article className={`neo-card group flex h-full flex-col overflow-hidden ${accentClass[project.accent]} ${featured ? "min-h-[420px]" : "min-h-[320px]"}`}>
      <div className="flex items-center justify-between border-b-[3px] border-ink bg-cream px-4 py-3">
        <span className="mono-label">{kindLabel[project.kind][en ? "en" : "vi"]}</span>
        <span className="inline-flex items-center gap-1 text-xs font-bold"><Circle size={10} fill="currentColor" />{statusLabel[project.status][en ? "en" : "vi"]}</span>
      </div>
      <div className="relative aspect-[16/9] overflow-hidden border-b-[3px] border-ink bg-paper">
        {project.image ? (
          <Image src={project.image.src} alt={copy(project.image.alt, locale)} fill sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.025]" />
        ) : (
          <div className="flex h-full items-end justify-between p-5"><span className="flex min-h-16 min-w-16 items-center justify-center border-[3px] border-ink bg-cream px-3 text-center text-xs font-extrabold uppercase leading-tight shadow-[4px_4px_0_var(--color-ink)]">{kindLabel[project.kind][en ? "en" : "vi"]}</span><span className="mono-label">{en ? "Evidence in progress" : "Đang bổ sung bằng chứng"}</span></div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
        <div><div className="mb-5 flex items-start justify-between gap-4"><span className="mono-label">{project.year}</span><span className="max-w-[65%] text-right text-xs font-bold">{copy(project.role, locale)}</span></div><h3 className="text-2xl font-extrabold leading-tight sm:text-3xl">{project.title}</h3><p className="mt-3 max-w-md leading-relaxed">{title}</p></div>
        <div className="mt-8"><div className="flex flex-wrap gap-2">{project.stack.slice(0, 4).map((item) => <span key={item} className="rounded-md border-2 border-ink bg-cream px-2 py-1 font-mono text-[.68rem] font-semibold">{item}</span>)}</div><Link href={`/projects/${project.slug}`} className="mt-5 inline-flex items-center gap-2 font-extrabold underline decoration-2 underline-offset-4 group-hover:text-ink">{en ? "Open project" : "Xem dự án"} <ArrowUpRight size={18} /></Link></div>
      </div>
    </article>
  );
}
