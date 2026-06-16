import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import HealthManager from "@/components/ui/HealthManager";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminHealthPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch the first active pet profile
  let pet = null;
  let weightLogs: any[] = [];
  let healthRecords: any[] = [];

  try {
    pet = await db.pet.findFirst({
      where: { isActive: true },
    });

    if (pet) {
      weightLogs = await db.weightLog.findMany({
        where: { petId: pet.id },
        orderBy: { date: "desc" },
      });

      healthRecords = await db.healthRecord.findMany({
        where: { petId: pet.id },
        orderBy: { date: "desc" },
      });
    }
  } catch (err) {
    console.warn("Failed to fetch health records from database.", err);
  }

  if (!pet) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 text-center text-text-secondary text-sm">
        Vui lòng tạo hồ sơ bé cưng trước khi quản lý cân nặng & hồ sơ y tế.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text">Quản lý sức khỏe & Cân nặng</h1>
        <p className="text-text-secondary mt-1">
          Theo dõi sát sao cân nặng để vẽ biểu đồ tăng trưởng và ghi nhận lịch trình tiêm phòng phòng dịch cho bé.
        </p>
      </div>

      <HealthManager petId={pet.id} weightLogs={weightLogs} healthRecords={healthRecords} />
    </div>
  );
}
