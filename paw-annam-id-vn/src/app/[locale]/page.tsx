import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import HeroSection from "@/components/sections/HeroSection";
import TimelinePreview, { TimelinePreviewEntry } from "@/components/sections/TimelinePreview";
import GalleryPreview, { GalleryPreviewImage } from "@/components/sections/GalleryPreview";
import MilestonePreview, { MilestonePreviewItem } from "@/components/sections/MilestonePreview";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch the first active pet
  let pet = null;
  try {
    pet = await db.pet.findFirst({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            galleryImages: true,
            milestones: { where: { isCompleted: true } },
            journalEntries: { where: { isPublished: true } },
          },
        },
      },
    });
  } catch (error) {
    console.warn("Database connection failed. Falling back to mock data.", error);
  }

  // Fetch actual data if pet exists
  let timelineEntries: TimelinePreviewEntry[] = [];
  let galleryImages: GalleryPreviewImage[] = [];
  let milestones: MilestonePreviewItem[] = [];

  if (pet) {
    try {
      // 1. Fetch recent published journal entries
      const dbJournals = await db.journalEntry.findMany({
        where: { petId: (pet as any).id, isPublished: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      });

      // 2. Fetch recent completed milestones
      const dbMilestones = await db.milestone.findMany({
        where: { petId: (pet as any).id, isCompleted: true },
        orderBy: { date: "desc" },
        take: 3,
      });

      // Map and combine for timeline preview
      const mappedJournals = dbJournals.map(
        (j): TimelinePreviewEntry => ({
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
        })
      );

      const mappedMilestones = dbMilestones.map(
        (m): TimelinePreviewEntry => ({
          id: m.id,
          title: m.title,
          titleEn: m.titleEn,
          excerpt: m.description,
          excerptEn: m.descriptionEn,
          category: m.category,
          date: m.date || m.createdAt,
          type: "milestone",
        })
      );

      timelineEntries = [...mappedJournals, ...mappedMilestones]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 3);

      // 3. Fetch recent gallery images
      const dbImages = await db.galleryImage.findMany({
        where: { petId: (pet as any).id },
        orderBy: { createdAt: "desc" },
        take: 4,
      });

      galleryImages = dbImages.map((img) => ({
        id: img.id,
        url: img.url,
        type: img.type,
        caption: img.caption,
        captionEn: img.captionEn,
      }));

      // 4. Fetch general milestones preview
      const dbMilestoneList = await db.milestone.findMany({
        where: { petId: (pet as any).id },
        orderBy: [{ isCompleted: "desc" }, { sortOrder: "asc" }],
        take: 6,
      });

      milestones = dbMilestoneList.map((m) => ({
        id: m.id,
        title: m.title,
        titleEn: m.titleEn,
        category: m.category,
        isCompleted: m.isCompleted,
        date: m.date,
        ageAtEvent: m.ageAtEvent,
      }));
    } catch (err) {
      console.warn("Failed to fetch sub-data. Resetting pet to mock fallback.", err);
      pet = null;
    }
  } else {
    // Fallback/Mock Data
    timelineEntries = [
      {
        id: "mock-j-1",
        title: "Ngày đầu tiên đón bé về nhà mới",
        titleEn: "First day bringing the kitty home",
        slug: "welcome-home",
        excerpt: "Hôm nay chúng mình đón bé về nhà. Bé có vẻ hơi nhút nhát, cứ trốn dưới gầm giường suốt cả buổi chiều...",
        excerptEn: "Today we brought our kitty home. He was a bit shy and hid under the bed all afternoon...",
        category: "daily",
        date: new Date("2026-05-15"),
        type: "journal",
      },
      {
        id: "mock-m-1",
        title: "Tiếng kêu grừ grừ (purr) đầu tiên",
        titleEn: "The very first purr",
        excerpt: "Sau khi ăn tối xong và được xoa cằm, bé bắt đầu kêu grừ grừ rất to. Cảm giác thật hạnh phúc!",
        excerptEn: "After dinner and chin scratches, he started purring loudly. What a happy feeling!",
        category: "first-time",
        date: new Date("2026-05-18"),
        type: "milestone",
      },
    ];

    galleryImages = [
      { id: "mock-g-1", url: "/images/mock/gallery-1.jpg", type: "image", caption: "Giấc ngủ trưa ngon lành" },
      { id: "mock-g-2", url: "/images/mock/gallery-2.jpg", type: "image", caption: "Đang rình bắt con đồ chơi chuột bông" },
      { id: "mock-g-3", url: "/images/mock/gallery-3.jpg", type: "image", caption: "Ngơ ngác nhìn ống kính" },
      { id: "mock-g-4", url: "/images/mock/gallery-4.jpg", type: "image", caption: "Ngủ gục trên laptop của Sen" },
    ];

    milestones = [
      { id: "mock-m-1", title: "Đón bé về nhà", titleEn: "Adoption Day", category: "first-time", isCompleted: true, date: new Date("2026-05-15"), ageAtEvent: "2.5 tháng" },
      { id: "mock-m-2", title: "Kêu grừ grừ đầu tiên", titleEn: "First Purr", category: "first-time", isCompleted: true, date: new Date("2026-05-18"), ageAtEvent: "2.5 tháng" },
      { id: "mock-m-3", title: "Khám sức khỏe lần đầu", titleEn: "First Vet Visit", category: "health", isCompleted: true, date: new Date("2026-05-20"), ageAtEvent: "2.5 tháng" },
      { id: "mock-m-4", title: "Tiêm phòng mũi đầu", titleEn: "First Vaccination", category: "health", isCompleted: false, date: null, ageAtEvent: null },
      { id: "mock-m-5", title: "Cắt móng tay đầu tiên", titleEn: "First Nail Trim", category: "growth", isCompleted: false, date: null, ageAtEvent: null },
      { id: "mock-m-6", title: "Sinh nhật 1 tuổi", titleEn: "First Birthday", category: "growth", isCompleted: false, date: null, ageAtEvent: null },
    ];
  }

  // Set default details if no DB pet exists
  const mockPetDetails = {
    id: "mock",
    name: null,
    nameEn: null,
    species: "cat",
    breed: "Mèo ta (Domestic Shorthair)",
    color: "Mướp cam & Trắng",
    gender: "male",
    birthday: new Date("2026-03-01"),
    adoptionDate: new Date("2026-05-15"),
    weight: 1.8,
    personality: ["Hiếu động", "Tò mò", "Quấn sen"],
    avatarUrl: null,
    coverUrl: null,
    bio: "Hành trình lần đầu nuôi mèo của chúng mình. Lưu trữ tất cả kỷ niệm đẹp cùng bé.",
    bioEn: "Our first journey raising a cat. Preserving all beautiful memories together.",
    _count: {
      galleryImages: galleryImages.length,
      milestones: milestones.filter((m) => m.isCompleted).length,
      journalEntries: timelineEntries.filter((e) => e.type === "journal").length,
    },
  };

  const activePet = pet
    ? {
        ...pet,
        _count: {
          galleryImages: pet._count.galleryImages,
          milestones: pet._count.milestones,
          journalEntries: pet._count.journalEntries,
        },
      }
    : mockPetDetails;

  return (
    <div className="flex flex-col gap-16 pb-20">
      <HeroSection pet={activePet} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col gap-24">
        <TimelinePreview entries={timelineEntries} />
        <GalleryPreview images={galleryImages} />
        <MilestonePreview milestones={milestones} />
      </div>
    </div>
  );
}
