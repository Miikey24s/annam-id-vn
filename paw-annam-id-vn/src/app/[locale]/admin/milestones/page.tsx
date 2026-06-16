import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import MilestoneManager from "@/components/ui/MilestoneManager";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminMilestonesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch the first active pet profile
  let pet = null;
  let milestones: any[] = [];

  try {
    pet = await db.pet.findFirst({
      where: { isActive: true },
    });

    if (pet) {
      milestones = await db.milestone.findMany({
        where: { petId: pet.id },
        orderBy: [{ isCompleted: "desc" }, { sortOrder: "asc" }],
      });
    }
  } catch (err) {
    console.warn("Failed to fetch milestones from database.", err);
  }

  if (!pet) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 text-center text-text-secondary text-sm">
        Vui lòng tạo hồ sơ bé cưng trước khi quản lý cột mốc.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text">Quản lý cột mốc lớn khôn</h1>
        <p className="text-text-secondary mt-1">
          Theo dõi tiến trình phát triển và các sự kiện ý nghĩa đầu đời của bé.
        </p>
      </div>

      <MilestoneManager petId={pet.id} milestones={milestones} />
    </div>
  );
}
