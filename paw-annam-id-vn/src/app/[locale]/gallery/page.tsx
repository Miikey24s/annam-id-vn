import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import GalleryClient from "./GalleryClient";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function GalleryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");

  // Fetch pet
  let pet = null;
  try {
    pet = await db.pet.findFirst({
      where: { isActive: true },
    });
  } catch (error) {
    console.warn("Database connection failed in gallery. Falling back to mock data.", error);
  }

  // Fetch albums and images
  let albums: any[] = [];
  let images: any[] = [];

  if (pet) {
    try {
      albums = await db.album.findMany({
        where: { petId: pet.id },
        orderBy: { sortOrder: "asc" },
      });

      images = await db.galleryImage.findMany({
        where: { petId: pet.id },
        orderBy: { createdAt: "desc" },
      });
    } catch (err) {
      console.warn("Failed to fetch gallery items. Resetting to mock.", err);
    }
  }

  // Fallback to mock images if empty
  if (images.length === 0) {
    images = [
      { id: "mock-g-1", url: "/images/mock/gallery-1.jpg", type: "image", caption: "Giấc ngủ trưa ngon lành", captionEn: "Sweet afternoon nap", isFavorite: true, albumId: null },
      { id: "mock-g-2", url: "/images/mock/gallery-2.jpg", type: "image", caption: "Đang rình bắt con đồ chơi chuột bông", captionEn: "Hunting his toy mouse", isFavorite: false, albumId: "album-fun" },
      { id: "mock-g-3", url: "/images/mock/gallery-3.jpg", type: "image", caption: "Ngơ ngác nhìn ống kính", captionEn: "Staring at the camera", isFavorite: true, albumId: null },
      { id: "mock-g-4", url: "/images/mock/gallery-4.jpg", type: "image", caption: "Ngủ gục trên laptop của Sen", captionEn: "Sleeping on my laptop", isFavorite: false, albumId: "album-fun" },
      { id: "mock-g-5", url: "/images/mock/gallery-1.jpg", type: "image", caption: "Đang rướn người tắm nắng", captionEn: "Sunbathing", isFavorite: false, albumId: null },
      { id: "mock-g-6", url: "/images/mock/gallery-2.jpg", type: "image", caption: "Mặt giận hờn dỗi hờn", captionEn: "Grumpy face", isFavorite: true, albumId: null },
    ];

    albums = [
      { id: "album-fun", name: "Vui chơi & Hài hước", nameEn: "Playful & Funny" },
    ];
  }

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

      <GalleryClient albums={albums} initialImages={images} />
    </main>
  );
}
