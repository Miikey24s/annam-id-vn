import { ArrowUpRight, BriefcaseBusiness, Code2, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function Footer({ locale }: { locale: string }) {
  const en = locale === "en";
  return (
    <footer className="border-t-[3px] border-ink bg-ink text-paper">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-[1.3fr_1fr_1fr] sm:py-16">
        <div><span className="sticker inline-flex border-paper bg-orange text-ink">MIIKEY / OPEN ROUTE</span><h2 className="mt-5 max-w-sm text-3xl font-extrabold leading-tight">{en ? "No fixed route." : "Không có một route cố định."}</h2><p className="mt-4 max-w-sm text-paper/70">{en ? "Software, tools, games, and experiments — documented as they become real." : "Software, tools, game và experiment — được ghi lại khi đã có thứ thật để xem."}</p></div>
        <div><p className="mono-label text-paper/50">{en ? "Navigate" : "Điều hướng"}</p><div className="mt-4 grid gap-2 font-bold"><Link href="/projects" className="hover:text-orange">{en ? "Projects" : "Dự án"} <ArrowUpRight className="inline" size={15} /></Link><Link href="/now" className="hover:text-orange">{en ? "Current" : "Hiện tại"} <ArrowUpRight className="inline" size={15} /></Link><Link href="/blog" className="hover:text-orange">{en ? "Notes" : "Ghi chú"} <ArrowUpRight className="inline" size={15} /></Link><Link href="/about" className="hover:text-orange">{en ? "About" : "Về mình"} <ArrowUpRight className="inline" size={15} /></Link></div></div>
        <div><p className="mono-label text-paper/50">{en ? "Elsewhere" : "Kết nối"}</p><div className="mt-4 grid gap-3"><a className="inline-flex items-center gap-2 hover:text-orange" href="mailto:annamnguyen204@gmail.com"><Mail size={16} /> annamnguyen204@gmail.com</a><a className="inline-flex items-center gap-2 hover:text-orange" href="https://github.com/Miikey24s" target="_blank" rel="noreferrer"><Code2 size={16} /> GitHub</a><a className="inline-flex items-center gap-2 hover:text-orange" href="https://www.linkedin.com" target="_blank" rel="noreferrer"><BriefcaseBusiness size={16} /> LinkedIn</a></div></div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-paper/20 py-5 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} MIIKEY / Annam Nguyen</span><span className="mono-label">developer / open route</span></div>
    </footer>
  );
}
