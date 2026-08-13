import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import { Link } from "@/i18n/navigation";
import ContactForm from "@/components/ui/ContactForm";

type Props = { params: Promise<{ locale: string }> };

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const en = locale === "en";
  return <main className="container-page py-14 sm:py-20"><Link href="/" className="inline-flex items-center gap-2 font-extrabold underline decoration-2 underline-offset-4"><ArrowLeft size={18} />{en ? "Back home" : "Về trang chủ"}</Link><div className="mt-10 grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><span className="section-kicker">contact / start here</span><h1 className="mt-5 text-5xl font-extrabold leading-[.92] tracking-tight sm:text-7xl">{en ? <>Let&apos;s make it <span className="text-orange">useful.</span></> : <>Cùng làm thứ <span className="text-orange">có ích.</span></>}</h1><p className="mt-7 text-xl font-medium leading-relaxed">{en ? "A project, a collaboration, a technical conversation, or just a good question — I am listening." : "Một dự án, một lời mời hợp tác, một cuộc trao đổi kỹ thuật hoặc chỉ là một câu hỏi hay — mình đang lắng nghe."}</p><div className="neo-card mt-8 bg-yellow p-5"><p className="mono-label">{en ? "Prefer email?" : "Nếu thích email?"}</p><a href="mailto:annamnguyen204@gmail.com" className="mt-4 flex items-center gap-2 break-all text-lg font-extrabold underline decoration-2 underline-offset-4"><Mail size={20} /> annamnguyen204@gmail.com <ArrowUpRight size={18} /></a></div></div><ContactForm locale={locale} /></div></main>;
}
