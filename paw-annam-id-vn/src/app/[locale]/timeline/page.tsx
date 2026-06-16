import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import TimelineClient from "./TimelineClient";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TimelinePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("timeline");

  // Fetch pet
  let pet = null;
  try {
    pet = await db.pet.findFirst({
      where: { isActive: true },
    });
  } catch (error) {
    console.warn("Database connection failed in timeline. Falling back to mock data.", error);
  }

  // Combined timeline items
  let timelineItems: any[] = [];

  if (pet) {
    try {
      // Fetch all published journal entries
      const dbJournals = await db.journalEntry.findMany({
        where: { petId: pet.id, isPublished: true },
        orderBy: { publishedAt: "desc" },
      });

      // Fetch all completed milestones
      const dbMilestones = await db.milestone.findMany({
        where: { petId: pet.id, isCompleted: true },
        orderBy: { date: "desc" },
      });

      // Map journals
      const mappedJournals = dbJournals.map((j) => ({
        id: j.id,
        title: j.title,
        titleEn: j.titleEn,
        slug: j.slug,
        excerpt: j.excerpt,
        excerptEn: j.excerptEn,
        coverImage: j.coverImage,
        category: j.category,
        date: j.publishedAt || j.createdAt,
        type: "journal",
        mood: j.mood,
      }));

      // Map milestones
      const mappedMilestones = dbMilestones.map((m) => ({
        id: m.id,
        title: m.title,
        titleEn: m.titleEn,
        excerpt: m.description,
        excerptEn: m.descriptionEn,
        coverImage: m.imageUrl,
        category: m.category,
        date: m.date || m.createdAt,
        type: "milestone",
        ageAtEvent: m.ageAtEvent,
      }));

      // Combine and sort
      timelineItems = [...mappedJournals, ...mappedMilestones].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } catch (err) {
      console.warn("Failed to fetch timeline items. Resetting to mock.", err);
    }
  }

  // Fallback to mock data if empty
  if (timelineItems.length === 0) {
    timelineItems = [
      {
        id: "mock-j-3",
        title: "Lần đầu tiên tự đi vệ sinh đúng chỗ",
        titleEn: "Mastered the litter box",
        slug: "litter-box-success",
        excerpt: "Sau vài ngày hướng dẫn kiên nhẫn, bé đã tự biết trèo vào thau cát để đi vệ sinh mà không cần ai chỉ nữa! Sen vui lắm luôn.",
        excerptEn: "After a few days of patient guidance, he finally learned to use the litter box all by himself!",
        coverImage: null,
        category: "growth",
        date: new Date("2026-06-05T08:30:00Z"),
        type: "journal",
        mood: "happy",
      },
      {
        id: "mock-m-3",
        title: "Khám sức khỏe & Tẩy giun lần đầu",
        titleEn: "First Vet Visit & Deworming",
        excerpt: "Bác sĩ nói bé hoàn toàn khỏe mạnh, hơi nhát một chút khi đo nhiệt độ nhưng nhìn chung mọi thứ đều rất tốt.",
        excerptEn: "The vet said he is completely healthy, just a bit nervous. Weight is standard for his age.",
        coverImage: null,
        category: "health",
        date: new Date("2026-05-20T10:00:00Z"),
        type: "milestone",
        ageAtEvent: "2.5 tháng",
      },
      {
        id: "mock-j-2",
        title: "Bé bắt đầu biết quấn người",
        titleEn: "Getting cuddly and sweet",
        slug: "first-cuddles",
        excerpt: "Đêm qua khi đang ngủ, bé tự bò lên ngực mình nằm rồi ngủ say sưa. Nghe tiếng kêu grừ grừ bên tai thấy ấm áp vô cùng.",
        excerptEn: "Last night while I was sleeping, he crawled onto my chest and slept soundly. Listening to his purring was so warm.",
        coverImage: null,
        category: "daily",
        date: new Date("2026-05-18T22:15:00Z"),
        type: "journal",
        mood: "playful",
      },
      {
        id: "mock-m-1",
        title: "Ngày đầu tiên đón bé về nhà mới",
        titleEn: "Adoption Day",
        excerpt: "Bắt đầu hành trình nuôi bé mèo đầu tiên trong đời. Ngôi nhà nhỏ từ nay có thêm tiếng kêu meo meo rồi!",
        excerptEn: "Began our first-ever cat parent journey. The house is now filled with sweet meows!",
        coverImage: null,
        category: "first-time",
        date: new Date("2026-05-15T14:00:00Z"),
        type: "milestone",
        ageAtEvent: "2.5 tháng",
      },
    ];
  }

  // Convert dates to ISO strings for client side
  const serializedItems = timelineItems.map((item) => ({
    ...item,
    date: item.date instanceof Date ? item.date.toISOString() : new Date(item.date).toISOString(),
  }));

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-text">
          {t("title")}
        </h1>
        <p className="text-text-secondary mt-2 text-lg max-w-xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <TimelineClient initialItems={serializedItems} />
    </main>
  );
}
