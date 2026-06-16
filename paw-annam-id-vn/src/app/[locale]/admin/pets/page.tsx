import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import PetProfileForm from "@/components/ui/PetProfileForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPetsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch the first active pet profile (if any exists)
  let pet = null;
  try {
    pet = await db.pet.findFirst({
      where: { isActive: true },
    });
  } catch (err) {
    console.warn("Failed to fetch pet profile from database.", err);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text">Hồ sơ bé cưng</h1>
        <p className="text-text-secondary mt-1">
          {pet
            ? "Cập nhật lý lịch, giống loài, ngày sinh và các đặc điểm tính cách của bé."
            : "Tạo mới một hồ sơ lý lịch cho bé mèo cưng của bạn để bắt đầu lưu giữ kỷ niệm."}
        </p>
      </div>

      <PetProfileForm initialData={pet} />
    </div>
  );
}
