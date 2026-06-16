"use client";

import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

type LightboxImage = {
  url: string;
  type: string;
  caption: string | null;
  captionEn: string | null;
};

type LightboxProps = {
  images: LightboxImage[];
  initialIndex: number;
  onClose: () => void;
};

export default function Lightbox({ images, initialIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const locale = useLocale();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    // Disable body scroll when lightbox is open
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [index]);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const activeImage = images[index];
  const displayCaption =
    locale === "en" && activeImage.captionEn ? activeImage.captionEn : activeImage.caption;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4">
        {/* Top bar */}
        <div className="flex items-center justify-between text-white/80 z-10">
          <span className="text-sm font-semibold">
            {index + 1} / {images.length}
          </span>
          <div className="flex items-center gap-4">
            {!activeImage.url.startsWith("/images/mock") && (
              <a
                href={activeImage.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:text-white transition-colors"
                title="Download"
              >
                <Download className="w-6 h-6" />
              </a>
            )}
            <button onClick={onClose} className="p-2 hover:text-white transition-colors" title="Close">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative flex items-center justify-center max-w-5xl mx-auto w-full">
          {/* Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 p-2 text-white/70 hover:text-white transition-colors bg-white/5 rounded-full backdrop-blur-sm z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 p-2 text-white/70 hover:text-white transition-colors bg-white/5 rounded-full backdrop-blur-sm z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Media Rendering */}
          <div className="relative w-full h-[70vh] flex items-center justify-center">
            {activeImage.type === "video" ? (
              <video
                src={activeImage.url}
                controls
                autoPlay
                className="max-w-full max-h-full rounded-lg shadow-2xl"
              />
            ) : activeImage.url.startsWith("/images/mock") ? (
              <div className="w-full h-full max-w-md max-h-[500px] bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-2xl flex items-center justify-center border border-white/10 text-white font-semibold">
                Bé Mèo 🐾 (Placeholder)
              </div>
            ) : (
              <Image
                src={activeImage.url}
                alt={displayCaption || "Lightbox Image"}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            )}
          </div>
        </div>

        {/* Bottom bar / Caption */}
        <div className="text-center text-white/90 py-4 max-w-xl mx-auto z-10">
          <p className="text-base font-medium">{displayCaption || "🐾"}</p>
        </div>
      </div>
    </AnimatePresence>
  );
}
