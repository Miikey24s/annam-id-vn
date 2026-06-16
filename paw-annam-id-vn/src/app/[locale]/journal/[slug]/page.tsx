import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Calendar, Clock, ArrowLeft, Tag, BookOpen } from "lucide-react";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// Mock fallback database
const mockEntries = [
  {
    id: "j1",
    title: "Ngày đầu tiên đón bé về nhà mới",
    titleEn: "First day bringing the kitty home",
    slug: "welcome-home",
    content: "<p>Hôm nay chúng mình đón bé về nhà. Bé có vẻ hơi nhút nhát, cứ trốn dưới gầm giường suốt cả buổi chiều. Chúng mình đã chuẩn bị cát, đồ ăn hạt đầy đủ nhưng bé chưa chịu ăn gì cả. Hy vọng tối nay bé sẽ quen hơn.</p><p>Chúng mình chưa nghĩ ra tên gì hay, nên tạm thời cứ gọi là Bé Miu nha!</p><p>Nhìn đôi mắt to tròn ngơ ngác sợ sệt thương lắm, cả buổi tối chỉ quanh quẩn xung quanh gầm tủ đầu giường. Để xem ngày mai bé có tiến bộ gì hơn không nhé!</p>",
    contentEn: "<p>Today we brought our kitty home. He was a bit shy and hid under the bed all afternoon. We prepared sand and kibble, but he hasn't eaten anything yet. Hopefully he gets used to it tonight.</p><p>We haven't thought of a name yet, so we just call him Miu for now!</p>",
    excerpt: "Hôm nay chúng mình đón bé về nhà...",
    coverImage: "/images/mock/gallery-1.jpg",
    category: "daily",
    tags: ["welcome", "newborn", "cát-mèo"],
    mood: "sleepy",
    readingTime: 2,
    publishedAt: new Date("2026-05-15T10:00:00Z"),
    createdAt: new Date("2026-05-15T10:00:00Z"),
  },
  {
    id: "j2",
    title: "Lần đầu tiên nghe tiếng rừ rừ (purring)",
    titleEn: "Hearing his first purr",
    slug: "first-purr-moment",
    content: "<p>Thật kỳ diệu! Sau 3 ngày trốn tránh, chiều nay khi mình đang làm việc, bé tự bò lại gần rồi dụi đầu vào chân mình. Khi mình đưa tay xoa nhẹ cằm bé, bé nhắm tịt mắt lại rồi phát ra tiếng kêu 'grừ... grừ...' liên tục.</p><p>Đó là âm thanh hạnh phúc nhất mình từng nghe! Bé đã tin tưởng tụi mình rồi.</p><p>Bé còn nằm ngửa bụng ra cho gãi nữa chứ, cưng xỉu luôn á! Có vẻ bé rất khoái được gãi cằm và hai bên má. Đúng là chiếc máy lọc không khí mini di động!</p>",
    contentEn: "<p>Magical! After 3 days of hiding, this afternoon while I was working, he crawled over and rubbed against my leg. When I scratched his chin, he closed his eyes and purred.</p><p>The happiest sound ever! He finally trusts us.</p>",
    excerpt: "Thật kỳ diệu! Sau 3 ngày trốn tránh...",
    coverImage: "/images/mock/gallery-2.jpg",
    category: "daily",
    tags: ["purr", "cuddles", "trust"],
    mood: "happy",
    readingTime: 1,
    publishedAt: new Date("2026-05-18T16:45:00Z"),
    createdAt: new Date("2026-05-18T16:45:00Z"),
  },
  {
    id: "j3",
    title: "Khám sức khỏe tổng quát đầu tiên tại Bệnh viện thú y",
    titleEn: "First overall health checkup at the Vet Clinic",
    slug: "first-vet-visit",
    content: "<p>Sáng nay tụi mình đưa bé đi phòng khám thú y để kiểm tra sức khỏe tổng quát và lên lịch tiêm phòng. Bé nặng 1.8kg, bác sĩ khám tai, mắt, răng miệng đều bình thường.</p><p>Bé được cho uống thuốc tẩy giun lần đầu tiên và sẽ quay lại tiêm mũi vaccine 4-trong-1 sau 1 tuần nữa. Chi phí hết 250k VNĐ.</p><p>Lúc ở phòng khám bé khá ngoan, không cào cấu hay gầm gừ gì cả, chỉ nép sát vào người Sen thôi. Bác sĩ khen bé trộm vía rất lanh lợi.</p>",
    contentEn: "<p>This morning we took him to the vet for a general checkup and vaccine schedule. He weighs 1.8kg, ears, eyes, and mouth are normal.</p><p>He got his first deworming pill. Will return in a week for the first 4-in-1 vaccine.</p>",
    excerpt: "Sáng nay tụi mình đưa bé đi phòng khám thú y...",
    coverImage: "/images/mock/gallery-3.jpg",
    category: "health",
    tags: ["vet", "vaccine", "weight"],
    mood: "curious",
    readingTime: 3,
    publishedAt: new Date("2026-05-20T09:30:00Z"),
    createdAt: new Date("2026-05-20T09:30:00Z"),
  },
];

export default async function JournalDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("journal");
  const tCommon = await getTranslations("common");
  const dateLocale = locale === "vi" ? vi : enUS;

  let entry = null;

  // Try DB
  try {
    entry = await db.journalEntry.findUnique({
      where: { slug },
    });
  } catch (err) {
    console.warn("Database lookup failed in journal details. Falling back to mock.", err);
  }

  // Fallback to mock
  if (!entry) {
    entry = mockEntries.find((e) => e.slug === slug) || null;
  }

  if (!entry) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-extrabold text-text">
          {locale === "vi" ? "Không tìm thấy bài viết" : "Journal Entry Not Found"}
        </h1>
        <p className="text-text-secondary">
          {locale === "vi" ? "Bài viết bạn tìm kiếm không tồn tại hoặc đã bị xóa." : "The story you are looking for does not exist."}
        </p>
        <Link href="/journal" className="inline-flex items-center gap-1.5 text-primary font-bold hover:underline">
          <ArrowLeft className="w-4 h-4" /> {tCommon("back")}
        </Link>
      </div>
    );
  }

  const displayTitle = locale === "en" && entry.titleEn ? entry.titleEn : entry.title;
  const displayContent = locale === "en" && entry.contentEn ? entry.contentEn : entry.content;
  const postDate = new Date(entry.publishedAt || entry.createdAt);
  const formattedDate = format(postDate, "dd MMMM, yyyy", { locale: dateLocale });

  const getMoodEmoji = (mood: string | null) => {
    switch (mood) {
      case "happy": return "😸";
      case "playful": return "😼";
      case "sleepy": return "😾";
      case "sick": return "😿";
      case "curious": return "🙀";
      default: return "🐱";
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Back Button */}
      <Link
        href="/journal"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> {tCommon("back")} {t("title").toLowerCase()}
      </Link>

      <article className="space-y-8">
        {/* Title and Meta */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
            <span className="bg-primary-light text-primary border border-primary/10 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]">
              {entry.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            {entry.readingTime && (
              <span className="flex items-center gap-1 border-l border-border pl-3">
                <Clock className="w-3.5 h-3.5" />
                {t("readTime", { minutes: entry.readingTime })}
              </span>
            )}
            {entry.mood && (
              <span className="flex items-center gap-1 border-l border-border pl-3">
                <span>Cảm xúc: {getMoodEmoji(entry.mood)}</span>
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-text leading-tight">
            {displayTitle}
          </h1>
        </div>

        {/* Cover Image */}
        {entry.coverImage && (
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-border shadow-sm">
            <img
              src={entry.coverImage}
              alt={displayTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article HTML Content */}
        <div
          className="prose dark:prose-invert max-w-none text-text-secondary leading-relaxed space-y-4 text-base"
          dangerouslySetInnerHTML={{ __html: displayContent }}
        />

        {/* Tags footer */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="border-t border-border/60 pt-6 flex flex-wrap gap-2">
            {entry.tags.map((tag: string) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-surface-alt border border-border text-text-secondary"
              >
                <Tag className="w-3 h-3" />
                #{tag}
              </span>
            ))}
          </div>
        )}
      </article>
    </main>
  );
}
