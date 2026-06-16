"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Eye, Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "../ui/Lightbox";
import { motion } from "framer-motion";

export type GalleryPreviewImage = {
  id: string;
  url: string;
  type: string;
  caption: string | null;
  captionEn?: string | null;
};

type GalleryPreviewProps = {
  images: GalleryPreviewImage[];
};

export default function GalleryPreview({ images }: GalleryPreviewProps) {
  const t = useTranslations("gallery");
  const tCommon = useTranslations("common");
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);

  return (
    <section className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-text">
            {t("title")}
          </h2>
          <p className="text-text-secondary mt-1">
            {t("subtitle")}
          </p>
        </div>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
        >
          {tCommon("back")} {t("title").toLowerCase()} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border rounded-2xl text-text-muted">
          {t("noImages")}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, idx) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => setPhotoIndex(idx)}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-border bg-surface-alt cursor-pointer shadow-sm"
            >
              {image.url.startsWith("/images/mock") ? (
                // Mock SVG placeholder or div gradient for images that don't exist yet
                <div className="w-full h-full bg-gradient-to-tr from-primary-light to-secondary-light flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary/70">
                    Bé Mèo 🐾
                  </span>
                </div>
              ) : (
                <Image
                  src={image.url}
                  alt={image.caption || "Gallery"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {image.type === "video" ? (
                  <div className="p-3 bg-primary text-white rounded-full">
                    <Play className="w-5 h-5 fill-white" />
                  </div>
                ) : (
                  <div className="p-3 bg-white/20 backdrop-blur-sm text-white rounded-full">
                    <Eye className="w-5 h-5" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {photoIndex !== null && (
        <Lightbox
          images={images.map((img) => ({
            url: img.url,
            type: img.type,
            caption: img.caption,
            captionEn: img.captionEn || null,
          }))}
          initialIndex={photoIndex}
          onClose={() => setPhotoIndex(null)}
        />
      )}
    </section>
  );
}
