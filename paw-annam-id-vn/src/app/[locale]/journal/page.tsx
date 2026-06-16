import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import JournalClient from "./JournalClient";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function JournalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("journal");

  // Fetch pet
  let pet = null;
  try {
    pet = await db.pet.findFirst({
      where: { isActive: true },
    });
  } catch (error) {
    console.warn("Database connection failed in journal. Falling back to mock data.", error);
  }

  let entries: any[] = [];

  if (pet) {
    try {
      entries = await db.journalEntry.findMany({
        where: { petId: pet.id, isPublished: true },
        orderBy: { publishedAt: "desc" },
      });
    } catch (err) {
      console.warn("Failed to fetch journal entries. Resetting to mock.", err);
    }
  }

  // Fallback to mock entries if empty
  if (entries.length === 0) {
    entries = [
      {
        id: "j1",
        title: "Ngày đầu tiên đón bé về nhà mới",
        titleEn: "First day bringing the kitty home",
        slug: "welcome-home",
        content: "<p>Hôm nay chúng mình đón bé về nhà. Bé có vẻ hơi nhút nhát, cứ trốn dưới gầm giường suốt cả buổi chiều. Chúng mình đã chuẩn bị cát, đồ ăn hạt đầy đủ nhưng bé chưa chịu ăn gì cả. Hy vọng tối nay bé sẽ quen hơn.</p><p>Chúng mình chưa nghĩ ra tên gì hay, nên tạm thời cứ gọi là Bé Miu nha!</p>",
        contentEn: "<p>Today we brought our kitty home. He was a bit shy and hid under the bed all afternoon. We prepared sand and kibble, but he hasn't eaten anything yet. Hopefully he gets used to it tonight.</p><p>We haven't thought of a name yet, so we just call him Miu for now!</p>",
        excerpt: "Hôm nay chúng mình đón bé về nhà. Bé có vẻ hơi nhút nhát, cứ trốn dưới gầm giường...",
        excerptEn: "Today we brought our kitty home. He was a bit shy and hid under the bed...",
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
        content: "<p>Thật kỳ diệu! Sau 3 ngày trốn tránh, chiều nay khi mình đang làm việc, bé tự bò lại gần rồi dụi đầu vào chân mình. Khi mình đưa tay xoa nhẹ cằm bé, bé nhắm tịt mắt lại rồi phát ra tiếng kêu 'grừ... grừ...' liên tục.</p><p>Đó là âm thanh hạnh phúc nhất mình từng nghe! Bé đã tin tưởng tụi mình rồi.</p>",
        contentEn: "<p>Magical! After 3 days of hiding, this afternoon while I was working, he crawled over and rubbed against my leg. When I scratched his chin, he closed his eyes and purred.</p><p>The happiest sound ever! He finally trusts us.</p>",
        excerpt: "Thật kỳ diệu! Sau 3 ngày trốn tránh, chiều nay bé tự bò lại gần rồi dụi đầu...",
        excerptEn: "Magical! After 3 days of hiding, this afternoon he crawled over and rubbed...",
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
        content: "<p>Sáng nay tụi mình đưa bé đi phòng khám thú y để kiểm tra sức khỏe tổng quát và lên lịch tiêm phòng. Bé nặng 1.8kg, bác sĩ khám tai, mắt, răng miệng đều bình thường.</p><p>Bé được cho uống thuốc tẩy giun lần đầu tiên và sẽ quay lại tiêm mũi vaccine 4-trong-1 sau 1 tuần nữa. Chi phí hết 250k VNĐ.</p>",
        contentEn: "<p>This morning we took him to the vet for a general checkup and vaccine schedule. He weighs 1.8kg, ears, eyes, and mouth are normal.</p><p>He got his first deworming pill. Will return in a week for the first 4-in-1 vaccine.</p>",
        excerpt: "Sáng nay tụi mình đưa bé đi phòng khám thú y để kiểm tra sức khỏe tổng quát...",
        excerptEn: "This morning we took him to the vet for a general checkup and vaccine schedule...",
        coverImage: "/images/mock/gallery-3.jpg",
        category: "health",
        tags: ["vet", "vaccine", "weight"],
        mood: "curious",
        readingTime: 3,
        publishedAt: new Date("2026-05-20T09:30:00Z"),
        createdAt: new Date("2026-05-20T09:30:00Z"),
      },
    ];
  }

  // Serialize dates
  const serializedEntries = entries.map((entry) => ({
    ...entry,
    publishedAt: entry.publishedAt ? new Date(entry.publishedAt).toISOString() : null,
    createdAt: new Date(entry.createdAt).toISOString(),
  }));

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-text">
          {t("title")}
        </h1>
        <p className="text-text-secondary mt-2 text-lg max-w-xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <JournalClient initialEntries={serializedEntries} />
    </main>
  );
}
