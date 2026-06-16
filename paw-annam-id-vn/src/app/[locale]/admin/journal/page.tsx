import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import JournalListManager from "@/components/ui/JournalListManager";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminJournalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch the first active pet
  let pet = null;
  let entries: any[] = [];

  try {
    pet = await db.pet.findFirst({
      where: { isActive: true },
    });

    if (pet) {
      entries = await db.journalEntry.findMany({
        where: { petId: pet.id },
        orderBy: { createdAt: "desc" },
      });
    }
  } catch (err) {
    console.warn("Failed to fetch journal entries from database.", err);
  }

  if (!pet) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 text-center text-text-secondary text-sm">
        Vui lòng tạo hồ sơ bé cưng trước khi quản lý nhật ký.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text">Quản lý nhật ký</h1>
        <p className="text-text-secondary mt-1">
          Ghi lại nhật ký hành trình nuôi mèo, chia sẻ những bài học, kinh nghiệm và khoảnh khắc đáng nhớ.
        </p>
      </div>

      <JournalListManager entries={entries} />
    </div>
  );
}
