"use client";

import { useState } from "react";
import { Star, Trash2, Heart, Play, Film, Image as ImageIcon, Check, Loader2 } from "lucide-react";
import ImageUploader from "./ImageUploader";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type ImageItem = {
  id: string;
  url: string;
  type: string;
  caption: string | null;
  captionEn: string | null;
  isFavorite: boolean;
  albumId: string | null;
};

type GalleryManagerProps = {
  petId: string;
  images: ImageItem[];
  albums: { id: string; name: string }[];
};

export default function GalleryManager({ petId, images, albums }: GalleryManagerProps) {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingCaptions, setEditingCaptions] = useState<{ [key: string]: string }>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleToggleFavorite = async (imgId: string, currentFav: boolean) => {
    try {
      const response = await fetch(`/api/gallery/${imgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFavorite: !currentFav }),
      });
      if (response.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    }
  };

  const handleUpdateCaption = async (imgId: string) => {
    setSavingId(imgId);
    try {
      const response = await fetch(`/api/gallery/${imgId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: editingCaptions[imgId] || "" }),
      });
      if (response.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to update caption:", err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDeleteImage = async (imgId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ảnh/video này không? Thao tác này sẽ xóa vĩnh viễn trên server.")) return;
    setDeletingId(imgId);

    try {
      const response = await fetch(`/api/gallery/${imgId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.refresh();
      } else {
        alert("Xóa thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Failed to delete image:", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCaptionChange = (imgId: string, value: string) => {
    setEditingCaptions((prev) => ({ ...prev, [imgId]: value }));
  };

  return (
    <div className="space-y-10">
      {/* Drag and Drop Uploader */}
      <ImageUploader petId={petId} albums={albums} onUploadSuccess={() => router.refresh()} />

      {/* Grid of uploaded items */}
      <div className="space-y-6">
        <h3 className="font-bold text-text text-base">Thư viện ảnh/video ({images.length})</h3>

        {images.length === 0 ? (
          <div className="text-center py-12 bg-surface border border-border rounded-2xl text-text-muted text-sm">
            Thư viện trống. Hãy kéo thả ảnh phía trên để tải lên.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Media Container */}
                <div className="relative aspect-square bg-surface-alt flex items-center justify-center border-b border-border/60">
                  {img.type === "video" ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <video src={img.url} className="w-full h-full object-cover" />
                      <div className="absolute p-3 bg-black/50 text-white rounded-full">
                        <Film className="w-6 h-6" />
                      </div>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.url} alt={img.caption || ""} className="w-full h-full object-cover" />
                  )}

                  {/* Actions overlay */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    {/* Star favorite */}
                    <button
                      onClick={() => handleToggleFavorite(img.id, img.isFavorite)}
                      className={`p-2 rounded-full backdrop-blur-md transition-colors shadow-sm ${
                        img.isFavorite
                          ? "bg-amber-500 text-white"
                          : "bg-black/40 text-white/80 hover:bg-black/60"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${img.isFavorite ? "fill-white" : ""}`} />
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      disabled={deletingId === img.id}
                      className="p-2 rounded-full bg-black/40 text-white/80 hover:bg-red-500 hover:text-white backdrop-blur-md transition-colors shadow-sm disabled:opacity-50"
                    >
                      {deletingId === img.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Edit Caption Input */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                      {img.type === "video" ? "Video Clip" : "Hình ảnh"}
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={
                          editingCaptions[img.id] !== undefined
                            ? editingCaptions[img.id]
                            : img.caption || ""
                        }
                        onChange={(e) => handleCaptionChange(img.id, e.target.value)}
                        placeholder="Thêm chú thích ảnh..."
                        className="flex-1 bg-surface-alt border border-border rounded-xl py-2 px-3 text-xs text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
                      />
                      <button
                        onClick={() => handleUpdateCaption(img.id)}
                        disabled={savingId === img.id}
                        className="p-2.5 bg-secondary hover:bg-secondary-dark text-white rounded-xl transition-colors shadow-sm disabled:opacity-50"
                      >
                        {savingId === img.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
