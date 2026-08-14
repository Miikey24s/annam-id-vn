import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ProjectCard from "@/components/ui/ProjectCard";
import { capabilities, copy, notes, projects } from "@/lib/content";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const en = locale === "en";
  const featured = projects.filter((project) => project.featured).slice(0, 3);
  const recentNotes = notes.slice(0, 2);

  return <>
    <section className="container-page relative grid gap-8 pb-16 pt-12 sm:pb-24 sm:pt-20 lg:grid-cols-[1.15fr_.85fr] lg:items-end">
      <div className="absolute -right-24 top-20 hidden h-48 w-48 rounded-full border-[3px] border-ink bg-yellow lg:block" aria-hidden="true" />
      <div className="relative z-10">
        <span className="sticker bg-lilac">{en ? "Open route / active" : "Open route / đang mở"}</span>
        <p className="mono-label mt-7">MIIKEY / Annam Nguyễn / Developer</p>
        <h1 className="mt-4 max-w-4xl text-[clamp(3.3rem,9vw,7.8rem)] font-extrabold leading-[.88] tracking-[-.075em]">
          {en ? <>Not limited to<br />one <span className="text-orange">screen.</span></> : <>Không tự giới hạn<br />ở một <span className="text-orange">màn hình.</span></>}
        </h1>
        <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed sm:text-xl">
          {en ? "I build software, tools, games, and interactive experiments." : "Mình làm software, tools, game và những experiment tương tác."}
        </p>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
          {en ? "This is where I document my journey as a developer." : "Đây là nơi mình ghi lại hành trình phát triển của bản thân."}
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/projects" className="neo-button neo-button-orange">{en ? "See projects" : "Xem dự án"} <ArrowUpRight size={18} /></Link>
          <Link href="/now" className="neo-button neo-button-plain">{en ? "Current focus" : "Hiện tại"} <ArrowDownRight size={18} /></Link>
        </div>
      </div>
      <div className="relative z-10 neo-card grid-paper bg-cream p-5 sm:p-7">
        <div className="flex items-center justify-between border-b-2 border-ink pb-4"><span className="mono-label">/ open-route.log</span><span className="flex items-center gap-2 text-xs font-bold"><span className="h-3 w-3 rounded-full border-2 border-ink bg-orange" /> {en ? "active" : "đang mở"}</span></div>
        <div className="py-7">
          <p className="mono-label text-muted">{en ? "Current range" : "Phạm vi đang mở"}</p>
          <p className="mt-2 text-2xl font-extrabold leading-tight">software / tools / games / experiments</p>
          <p className="mt-5 text-sm font-semibold leading-relaxed">{en ? "Each project is a different route: ship something useful, learn from it, then take the next turn." : "Mỗi dự án là một hướng khác: làm thứ có thể chạy được, học từ nó, rồi đi tiếp."}</p>
        </div>
        <div className="border-t-2 border-ink pt-4 text-xs font-semibold">.NET · Blazor · Unity · AI experiments</div>
      </div>
    </section>

    <section className="border-y-[3px] border-ink bg-orange"><div className="container-page flex flex-wrap items-center justify-between gap-4 py-4"><p className="mono-label">{en ? "Current range" : "Phạm vi đang mở"}</p><p className="font-extrabold">software · tools · games · experiments</p></div></section>

    <section className="container-page py-20 sm:py-28"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><span className="section-kicker">01 / projects</span><h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">{en ? "Open projects" : "Dự án đang mở"}</h2></div><Link href="/projects" className="inline-flex min-h-11 items-center font-extrabold underline decoration-2 underline-offset-4">{en ? "See all projects" : "Xem toàn bộ dự án"} <ArrowUpRight className="inline" size={17} /></Link></div><div className="mt-10 grid gap-8 lg:grid-cols-3">{featured.map((project) => <ProjectCard key={project.slug} project={project} locale={locale} featured />)}</div></section>

    <section className="border-y-[3px] border-ink bg-lilac"><div className="container-page grid gap-10 py-20 sm:py-24 lg:grid-cols-[.8fr_1.2fr]"><div><span className="section-kicker">02 / directions</span><h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-6xl">{en ? "Directions I am exploring" : "Những hướng mình đang đi qua"}</h2><p className="mt-5 max-w-sm text-lg font-medium leading-relaxed">{en ? "Different product types, one habit: make something real, learn from it, and keep moving." : "Những dạng sản phẩm khác nhau, cùng một cách làm: tạo thứ thật, học từ đó và tiếp tục đi."}</p></div><div className="grid gap-4 sm:grid-cols-2">{capabilities.map((item, index) => <div key={item.en} className="neo-card-sm bg-cream p-5"><span className="mono-label">0{index + 1}</span><p className="mt-10 text-xl font-extrabold">{copy(item, locale)}</p><span className="mt-5 block h-2 w-16 bg-orange" /></div>)}</div></div></section>

    <section className="container-page grid gap-8 py-20 sm:py-28 lg:grid-cols-[1fr_1.1fr]"><div className="neo-card bg-yellow p-6 sm:p-8"><span className="section-kicker">03 / current</span><h2 className="mt-8 text-4xl font-extrabold leading-tight sm:text-5xl">{en ? "Current focus" : "Hiện tại"}</h2><p className="mt-5 text-lg font-medium leading-relaxed">{en ? "A short snapshot of what I am prioritizing, testing, and learning next." : "Một ghi nhận ngắn về những việc mình đang ưu tiên, thử nghiệm và học tiếp."}</p><Link href="/now" className="neo-button neo-button-plain mt-8">{en ? "Open current focus" : "Xem trang Hiện tại"} <ArrowUpRight size={18} /></Link></div><div><div className="flex items-center justify-between"><span className="section-kicker">04 / notes</span><Link href="/blog" className="inline-flex min-h-11 items-center font-extrabold underline decoration-2 underline-offset-4">{en ? "All notes" : "Xem tất cả"}</Link></div><div className="mt-5 grid gap-4">{recentNotes.map((note) => <Link key={note.slug} href={`/blog/${note.slug}`} className="neo-card-sm group bg-cream p-5 transition-transform hover:-translate-y-1"><div className="flex items-center justify-between gap-4"><span className="mono-label">{copy(note.tag, locale)}</span><span className="text-xs font-bold">{note.readTime} {en ? "min" : "phút đọc"}</span></div><h3 className="mt-6 text-xl font-extrabold">{copy(note.title, locale)}</h3><p className="mt-2 leading-relaxed">{copy(note.excerpt, locale)}</p><span className="mt-5 inline-flex items-center gap-2 font-extrabold">{en ? "Read" : "Đọc"} <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span></Link>)}</div></div></section>

    <section className="container-page pb-20 sm:pb-28"><div className="neo-card grid gap-8 bg-ink p-7 text-paper sm:p-10 lg:grid-cols-[1.1fr_.9fr] lg:items-end"><div><span className="sticker border-paper bg-orange text-ink">05 / contact</span><h2 className="mt-7 max-w-2xl text-4xl font-extrabold leading-tight sm:text-6xl">{en ? "Have an idea worth making real?" : "Có ý tưởng cần hiện thực hóa?"}</h2></div><div><p className="text-lg leading-relaxed text-paper/75">{en ? "Tell me what you are trying to build, what is unclear, and what a useful next step could look like." : "Kể mình nghe bạn đang muốn làm gì, điều gì còn chưa rõ và một bước tiếp theo hữu ích sẽ trông như thế nào."}</p><Link href="/contact" className="neo-button neo-button-orange mt-7">{en ? "Start a conversation" : "Bắt đầu trao đổi"} <ArrowUpRight size={18} /></Link></div></div></section>
  </>;
}
