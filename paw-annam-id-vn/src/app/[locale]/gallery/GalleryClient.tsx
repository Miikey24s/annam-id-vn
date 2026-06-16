"use client";

import React, { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Heart, Image as ImageIcon, Video, Star } from "lucide-react";
import Image from "next/image";
import Lightbox from "@/components/ui/Lightbox";
import EmptyState from "@/components/ui/EmptyState";
import { motion, AnimatePresence } from "framer-motion";

type Album = {
  id: string;
  name: string;
  nameEn: string | null;
};

type GalleryImage = {
  id: string;
  url: string;
  type: string;
  caption: string | null;
  captionEn: string | null;
  isFavorite: boolean;
  albumId: string | null;
};

type GalleryClientProps = {
  albums: Album[];
  initialImages: GalleryImage[];
};

export default function GalleryClient({ albums, initialImages }: GalleryClientProps) {
  const t = useTranslations("gallery");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Tabs list
  const tabs = [
    { id: "all", label: t("all") },
    { id: "favorites", label: t("favorites") },
    ...albums.map((a) => ({
      id: a.id,
      label: locale === "en" && a.nameEn ? a.nameEn : a.name,
    })),
  ];

  // Filtered images
  const filteredImages = initialImages.filter((img) => {
    if (activeTab === "all") return true;
    if (activeTab === "favorites") return img.isFavorite;
    return img.albumId === activeTab;
  });

  const handleImageClick = (id: string) => {
    const idx = filteredImages.findIndex((img) => img.id === id);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-border pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-sm scale-105"
                : "bg-surface-alt hover:bg-border/40 text-text-secondary border border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      {filteredImages.length === 0 ? (
        <EmptyState
          title={t("noImages")}
          description={locale === "vi" ? "Hãy tải lên những bức ảnh đầu tiên của bé nhé!" : "Start uploading your kitty's first photos!"}
        />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img) => {
              const displayCaption =
                locale === "en" && img.captionEn ? img.captionEn : img.caption;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={img.id}
                  onClick={() => handleImageClick(img.id)}
                  className="group relative aspect-square rounded-3xl overflow-hidden border border-border cursor-pointer bg-surface-alt shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {img.url.startsWith("/images/mock") ? (
                    // Mock fallback
                    <div className="w-full h-full bg-gradient-to-tr from-primary-light/40 to-secondary-light/40 flex flex-col items-center justify-center p-4 text-center">
                      <ImageIcon className="w-8 h-8 text-primary/70 mb-2" />
                      <span className="text-xs font-semibold text-text-secondary line-clamp-2">
                        {displayCaption || "Cat memory"}
                      </span>
                    </div>
                  ) : (
                    // Cloudinary or regular image
                    <Image
                      src={img.url}
                      alt={displayCaption || "Pet gallery image"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  )}

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-semibold line-clamp-2">
                      {displayCaption || "🐾"}
                    </p>
                  </div>

                  {/* Icon tags */}
                  <div className="absolute top-2 right-2 flex gap-1.5 z-10">
                    {img.isFavorite && (
                      <div className="bg-red-500 text-white p-1.5 rounded-full shadow-sm">
                        <Heart className="w-3.5 h-3.5 fill-white" />
                      </div>
                    )}
                    {img.type === "video" && (
                      <div className="bg-black/60 text-white p-1.5 rounded-full shadow-sm backdrop-blur-sm">
                        <Video className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
