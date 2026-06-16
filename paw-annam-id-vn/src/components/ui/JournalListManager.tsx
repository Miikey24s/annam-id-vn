"use client";

import { useState } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { Plus, Edit3, Trash2, Calendar, BookOpen, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useLocale } from "next-intl";

type JournalEntry = {
  id: string;
  title: string;
  category: string;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  slug: string;
};

type JournalListManagerProps = {
  entries: JournalEntry[];
};

export default function JournalListManager({ entries }: JournalListManagerProps) {
  const router = useRouter();
  const locale = useLocale();
  const dateLocale = locale === "vi" ? vi : enUS;
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bài viết nhật ký này không? Thao tác này không thể hoàn tác.")) return;
    setDeletingId(id);

    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.refresh();
      } else {
        alert("Xóa bài viết thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Failed to delete journal entry:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-text text-base">Danh sách bài viết ({entries.length})</h2>
        <Link
          href="/admin/journal/new"
          className="bg-primary hover:bg-primary-dark text-white font-bold rounded-xl px-5 py-2.5 text-xs transition-colors flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Viết bài mới
        </Link>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-12 bg-surface border border-border rounded-2xl text-text-muted text-sm">
          Chưa có bài viết nào. Click "Viết bài mới" để tạo bài viết đầu tiên.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {entries.map((entry) => {
            const entryDate = entry.publishedAt ? new Date(entry.publishedAt) : new Date(entry.createdAt);
            const formattedDate = format(entryDate, "dd MMMM, yyyy", { locale: dateLocale });

            return (
              <div
                key={entry.id}
                className="bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{entry.category}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <Calendar className="w-3 h-3" />
                    <span>{formattedDate}</span>
                  </div>
                  <h3 className="font-bold text-text text-lg">{entry.title}</h3>
                  <div className="flex items-center gap-2">
                    {entry.isPublished ? (
                      <span className="inline-block bg-secondary-light text-secondary px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Đã xuất bản
                      </span>
                    ) : (
                      <span className="inline-block bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Bản nháp
                      </span>
                    )}
                    <span className="text-xs text-text-muted truncate">Slug: /{entry.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/journal/${entry.id}`}
                    className="p-2 border border-border hover:bg-surface-alt text-text-secondary hover:text-primary rounded-xl transition-all shadow-sm flex items-center justify-center"
                    title="Chỉnh sửa"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    className="p-2 border border-border hover:bg-red-500/10 text-text-secondary hover:text-red-500 rounded-xl transition-all shadow-sm flex items-center justify-center disabled:opacity-50"
                    title="Xóa"
                  >
                    {deletingId === entry.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
