"use client";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { journalSchema } from "@/lib/validations";
import { useState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import RichTextEditor from "./RichTextEditor";

type JournalFormValues = z.input<typeof journalSchema>;

type JournalEditorFormProps = {
  initialData?: any;
};

export default function JournalEditorForm({ initialData }: JournalEditorFormProps) {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<JournalFormValues>({
    resolver: zodResolver(journalSchema),
    defaultValues: initialData
      ? {
          ...initialData,
        }
      : {
          title: "",
          titleEn: "",
          slug: "",
          content: "",
          contentEn: "",
          excerpt: "",
          excerptEn: "",
          coverImage: "",
          category: "daily",
          tags: [],
          mood: "happy",
          isPublished: false,
          isDraft: true,
        },
  });

  const title = watch("title");

  // Auto-generate slug from Vietnamese title if not set
  useEffect(() => {
    if (!initialData && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
        .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
        .replace(/ì|í|ị|ỉ|ĩ/g, "i")
        .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
        .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
        .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
        .replace(/đ/g, "d")
        .replace(/[^a-z0-9\s-]/g, "") // remove special chars
        .replace(/\s+/g, "-") // replace spaces with -
        .replace(/-+/g, "-"); // collapse multiple -
      setValue("slug", generatedSlug);
    }
  }, [title, setValue, initialData]);

  const onSubmit = async (values: JournalFormValues) => {
    setLoading(true);
    setError(null);

    // Set isDraft opposite to isPublished
    values.isDraft = !values.isPublished;

    const isEdit = initialData && initialData.id !== "new";
    const url = isEdit ? `/api/journal/${initialData.id}` : "/api/journal";
    const method = isEdit ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể lưu bài viết.");
      }

      router.refresh();
      router.replace("/admin/journal");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-surface border border-border rounded-3xl p-8 shadow-sm">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Grid of basic fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title (VI) */}
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-semibold text-text">Tiêu đề nhật ký (Tiếng Việt) *</label>
          <input
            type="text"
            {...register("title")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            placeholder="Ví dụ: Lần đầu tiên cắt móng tay cho Miu"
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
        </div>

        {/* Title (EN) */}
        <div className="space-y-1.5 col-span-1 md:col-span-2">
          <label className="text-sm font-semibold text-text">Tiêu đề nhật ký (Tiếng Anh)</label>
          <input
            type="text"
            {...register("titleEn")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            placeholder="Ví dụ: First time clipping Miu's nails"
          />
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Đường dẫn tĩnh (Slug) *</label>
          <input
            type="text"
            {...register("slug")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            placeholder="first-time-nails"
          />
          {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
        </div>

        {/* Cover Image URL */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Ảnh bìa (Cover Image URL)</label>
          <input
            type="text"
            {...register("coverImage")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
            placeholder="Link ảnh cover bài viết"
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Chuyên mục</label>
          <select
            {...register("category")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text focus:outline-none focus:border-primary transition-colors"
          >
            <option value="daily">Đời thường (Daily Life)</option>
            <option value="milestone">Cột mốc (Milestones)</option>
            <option value="health">Sức khỏe (Health & Vet)</option>
            <option value="funny">Hài hước (Funny Moments)</option>
            <option value="tips">Kinh nghiệm (Care Tips)</option>
          </select>
        </div>

        {/* Mood */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-text">Tâm trạng (Mood)</label>
          <select
            {...register("mood")}
            className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text focus:outline-none focus:border-primary transition-colors"
          >
            <option value="happy">Vui vẻ 😊</option>
            <option value="playful">Hiếu động 🧶</option>
            <option value="sleepy">Buồn ngủ 😴</option>
            <option value="sick">Mệt mỏi 😿</option>
            <option value="curious">Tò mò 🕵️</option>
          </select>
        </div>
      </div>

      {/* Excerpt (VI) */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-text">Tóm tắt ngắn (Tiếng Việt)</label>
        <textarea
          rows={2}
          {...register("excerpt")}
          className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
          placeholder="Mô tả ngắn gọn về bài viết nhật ký này..."
        />
      </div>

      {/* Excerpt (EN) */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-text">Tóm tắt ngắn (Tiếng Anh)</label>
        <textarea
          rows={2}
          {...register("excerptEn")}
          className="w-full bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors resize-none"
          placeholder="Short description in English..."
        />
      </div>

      {/* Content (VI) - Tiptap Editor */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-text">Nội dung chi tiết (Tiếng Việt) *</label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <RichTextEditor content={field.value} onChange={field.onChange} />
          )}
        />
        {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content.message}</p>}
      </div>

      {/* Content (EN) - Tiptap Editor */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-text">Nội dung chi tiết (Tiếng Anh)</label>
        <Controller
          name="contentEn"
          control={control}
          render={({ field }) => (
            <RichTextEditor content={field.value || ""} onChange={field.onChange} />
          )}
        />
      </div>

      {/* Publish Settings */}
      <div className="flex items-center gap-2.5 p-4 border border-border bg-surface-alt/10 rounded-2xl">
        <input
          id="isPublished"
          type="checkbox"
          {...register("isPublished")}
          className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
        />
        <label htmlFor="isPublished" className="text-sm font-semibold text-text select-none cursor-pointer">
          Xuất bản công khai (Nếu không tích sẽ lưu là bản nháp)
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/60">
        <button
          type="button"
          onClick={() => router.replace("/admin/journal")}
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
