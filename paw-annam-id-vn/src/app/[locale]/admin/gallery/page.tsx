import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import GalleryManager from "@/components/ui/GalleryManager";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminGalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch the first active pet profile
  let pet = null;
  let images: any[] = [];
  let albums: any[] = [];

  try {
    pet = await db.pet.findFirst({
      where: { isActive: true },
    });

    if (pet) {
      images = await db.galleryImage.findMany({
        where: { petId: pet.id },
        orderBy: { createdAt: "desc" },
      });

      albums = await db.album.findMany({
        where: { petId: pet.id },
        orderBy: { sortOrder: "asc" },
      });
    }
  } catch (err) {
    console.warn("Failed to fetch gallery details from database.", err);
  }

  if (!pet) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-8 text-center text-text-secondary text-sm">
        Vui lòng tạo hồ sơ bé cưng trước khi quản lý thư viện ảnh.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text">Quản lý thư viện</h1>
        <p className="text-text-secondary mt-1">
          Tải lên ảnh và video clip kỷ niệm đáng yêu của bé. Tích hợp tối ưu ảnh qua Cloudinary.
        </p>
      </div>

      <GalleryManager petId={pet.id} images={images} albums={albums} />
    </div>
  );
}
