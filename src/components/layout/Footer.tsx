import { ArrowUpRight, BriefcaseBusiness, Code2, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default function Footer({ locale }: { locale: string }) {
  const en = locale === "en";
  return (
    <footer className="border-t-[3px] border-ink bg-ink text-paper">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-[1.3fr_1fr_1fr] sm:py-16">
        <div><span className="sticker inline-flex border-paper bg-orange text-ink">{en ? "Still building" : "Đang xây"}</span><h2 className="mt-5 max-w-sm text-3xl font-extrabold leading-tight">{en ? "Good work leaves a trail." : "Sản phẩm tốt luôn để lại dấu vết."}</h2><p className="mt-4 max-w-sm text-paper/70">{en ? "Projects, notes and experiments — updated as the work evolves." : "Dự án, ghi chú và thử nghiệm — được cập nhật theo quá trình làm thật."}</p></div>
        <div><p className="mono-label text-paper/50">{en ? "Navigate" : "Điều hướng"}</p><div className="mt-4 grid gap-2 font-bold"><Link href="/projects" className="hover:text-orange">{en ? "Work" : "Dự án"} <ArrowUpRight className="inline" size={15} /></Link><Link href="/now" className="hover:text-orange">{en ? "Now" : "Đang làm"} <ArrowUpRight className="inline" size={15} /></Link><Link href="/blog" className="hover:text-orange">{en ? "Notes" : "Ghi chú"} <ArrowUpRight className="inline" size={15} /></Link><Link href="/about" className="hover:text-orange">{en ? "About" : "Về mình"} <ArrowUpRight className="inline" size={15} /></Link></div></div>
        <div><p className="mono-label text-paper/50">{en ? "Elsewhere" : "Kết nối"}</p><div className="mt-4 grid gap-3"><a className="inline-flex items-center gap-2 hover:text-orange" href="mailto:annamnguyen204@gmail.com"><Mail size={16} /> annamnguyen204@gmail.com</a><a className="inline-flex items-center gap-2 hover:text-orange" href="https://github.com/Miikey24s" target="_blank" rel="noreferrer"><Code2 size={16} /> GitHub</a><a className="inline-flex items-center gap-2 hover:text-orange" href="https://www.linkedin.com" target="_blank" rel="noreferrer"><BriefcaseBusiness size={16} /> LinkedIn</a></div></div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-paper/20 py-5 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between"><span>© {new Date().getFullYear()} Annam Nguyen</span><span className="mono-label">{en ? "made with intent / not a template" : "làm có chủ đích / không dùng mẫu sẵn"}</span></div>
    </footer>
  );
}
