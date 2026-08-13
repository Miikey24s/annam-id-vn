import { ArrowUpRight, BriefcaseBusiness, Code2, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function Footer({ locale }: { locale: string }) {
  const en = locale === "en";
  return (
    <footer className="border-t-[3px] border-ink bg-ink text-paper">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-[1.3fr_1fr_1fr] sm:py-16">
        <div><span className="sticker inline-flex border-paper bg-orange text-ink">Still building</span><h2 className="mt-5 max-w-sm text-3xl font-extrabold leading-tight">{en ? "Good work leaves a trail." : "Sáº£n pháº©m tá»‘t luÃ´n Ä‘á»ƒ láº¡i dáº¥u váº¿t."}</h2><p className="mt-4 max-w-sm text-paper/70">{en ? "Projects, notes and experiments â€” updated as the work evolves." : "Dá»± Ã¡n, ghi chÃº vÃ  thá»­ nghiá»‡m â€” Ä‘Æ°á»£c cáº­p nháº­t theo quÃ¡ trÃ¬nh lÃ m tháº­t."}</p></div>
        <div><p className="mono-label text-paper/50">{en ? "Navigate" : "Äiá»u hÆ°á»›ng"}</p><div className="mt-4 grid gap-2 font-bold"><Link href="/projects" className="hover:text-orange">Work <ArrowUpRight className="inline" size={15} /></Link><Link href="/now" className="hover:text-orange">Now <ArrowUpRight className="inline" size={15} /></Link><Link href="/blog" className="hover:text-orange">Notes <ArrowUpRight className="inline" size={15} /></Link><Link href="/about" className="hover:text-orange">{en ? "About" : "Vá» mÃ¬nh"} <ArrowUpRight className="inline" size={15} /></Link></div></div>
        <div><p className="mono-label text-paper/50">{en ? "Elsewhere" : "Káº¿t ná»‘i"}</p><div className="mt-4 grid gap-3"><a className="inline-flex items-center gap-2 hover:text-orange" href="mailto:annamnguyen204@gmail.com"><Mail size={16} /> annamnguyen204@gmail.com</a><a className="inline-flex items-center gap-2 hover:text-orange" href="https://github.com/Miikey24s" target="_blank" rel="noreferrer"><Code2 size={16} /> GitHub</a><a className="inline-flex items-center gap-2 hover:text-orange" href="https://www.linkedin.com" target="_blank" rel="noreferrer"><BriefcaseBusiness size={16} /> LinkedIn</a></div></div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-paper/20 py-5 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between"><span>Â© {new Date().getFullYear()} Annam Nguyen</span><span className="mono-label">made with intent / not a template</span></div>
    </footer>
  );
}
