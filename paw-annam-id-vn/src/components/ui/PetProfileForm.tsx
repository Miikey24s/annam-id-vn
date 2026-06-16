"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { petSchema } from "@/lib/validations";
import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Loader2, Plus, X, Upload, Sparkles, Heart } from "lucide-react";
import { useTranslations } from "next-intl";

type PetFormValues = z.input<typeof petSchema>;

type PetProfileFormProps = {
  initialData?: any;
};

export default function PetProfileForm({ initialData }: PetProfileFormProps) {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [personalityTag, setPersonalityTag] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Format dates for input field (YYYY-MM-DD)
  const formatDateForInput = (dateVal: any) => {
    if (!dateVal) return "";
    const d = new Date(dateVal);
    return d.toISOString().split("T")[0];
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          birthday: formatDateForInput(initialData.birthday),
          adoptionDate: formatDateForInput(initialData.adoptionDate),
          weight: initialData.weight?.toString() || "",
        }
      : {
          name: "",
          nameEn: "",
          species: "cat",
          breed: "",
          color: "",
          gender: "unknown",
          birthday: "",
          adoptionDate: "",
          weight: "",
          personality: [],
          avatarUrl: "",
          coverUrl: "",
          bio: "",
          bioEn: "",
        },
  });

  const personality = watch("personality") || [];

  const handleAddTag = (e: React.MouseEvent) => {
    e.preventDefault();
    if (personalityTag.trim() && !personality.includes(personalityTag.trim())) {
      setValue("personality", [...personality, personalityTag.trim()]);
      setPersonalityTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "personality",
      personality.filter((tag) => tag !== tagToRemove)
    );
  };

  const onSubmit = async (values: PetFormValues) => {
    setLoading(true);
    setError(null);

    const url = initialData ? `/api/pets/${initialData.id}` : "/api/pets";
    const method = initialData ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể lưu hồ sơ bé.");
      }

      router.refresh();
      router.replace("/admin");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-surface border border-border rounded-3xl p-8 shadow-sm">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name (VI) */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Tên bé (Tiếng Việt) *</label>
          <input
            type="text"
            {...register("name")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            placeholder="Ví dụ: Bé Miu"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Name (EN) */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Tên bé (Tiếng Anh)</label>
          <input
            type="text"
            {...register("nameEn")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            placeholder="Ví dụ: Miu"
          />
        </div>

        {/* Breed */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Giống mèo (Breed)</label>
          <input
            type="text"
            {...register("breed")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            placeholder="Ví dụ: Anh lông ngắn, Mèo ta..."
          />
        </div>

        {/* Color */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Màu lông</label>
          <input
            type="text"
            {...register("color")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            placeholder="Ví dụ: Mướp cam, Bicolor..."
          />
        </div>

        {/* Gender */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Giới tính</label>
          <select
            {...register("gender")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text focus:outline-none focus:border-primary transition-colors"
          >
            <option value="male">Đực (Male)</option>
            <option value="female">Cái (Female)</option>
            <option value="unknown">Chưa rõ (Unknown)</option>
          </select>
        </div>

        {/* Weight */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Cân nặng (kg)</label>
          <input
            type="text"
            {...register("weight")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            placeholder="Ví dụ: 1.5"
          />
        </div>

        {/* Birthday */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Ngày sinh</label>
          <input
            type="date"
            {...register("birthday")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {/* Adoption Date */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Ngày đón về nhà mới</label>
          <input
            type="date"
            {...register("adoptionDate")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Personality Tags */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-text block">Đặc điểm tính cách</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {personality.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 bg-primary-light text-primary text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-primary-dark transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2 max-w-sm">
          <input
            type="text"
            value={personalityTag}
            onChange={(e) => setPersonalityTag(e.target.value)}
            className="flex-1 bg-surface-alt border border-border rounded-xl py-2 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            placeholder="Ví dụ: Nghịch ngợm, Ngủ nhiều..."
          />
          <button
            onClick={handleAddTag}
            className="bg-secondary hover:bg-secondary-dark text-white font-bold rounded-xl px-4 py-2 text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> Thêm
          </button>
        </div>
      </div>

      {/* Bio (VI) */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-text">Giới thiệu ngắn (Tiếng Việt)</label>
        <textarea
          rows={3}
          {...register("bio")}
          className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
          placeholder="Viết một đoạn ngắn giới thiệu về bé..."
        />
      </div>

      {/* Bio (EN) */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-text">Giới thiệu ngắn (Tiếng Anh)</label>
        <textarea
          rows={3}
          {...register("bioEn")}
          className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
          placeholder="Write a short bio in English..."
        />
      </div>

      {/* Image URL Fields (Cloudinary hook will fill this later) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Avatar Image URL</label>
          <input
            type="text"
            {...register("avatarUrl")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            placeholder="Cloudinary image URL"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Cover Image URL</label>
          <input
            type="text"
            {...register("coverUrl")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            placeholder="Cloudinary cover image URL"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
        <button
          type="button"
          onClick={() => router.replace("/admin")}
          className="px-6 py-3 border border-border hover:bg-surface-alt text-text-secondary font-bold rounded-xl text-sm transition-colors"
        >
          {tCommon("cancel")}
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary hover:bg-primary-dark disabled:bg-primary/50 text-white font-bold rounded-xl px-8 py-3 text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {tCommon("loading")}
            </>
          ) : (
            tCommon("save")
          )}
        </button>
      </div>
    </form>
  );
}
