"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Plus, Check, Trash2, Calendar, Award, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

type MilestoneItem = {
  id: string;
  title: string;
  titleEn: string | null;
  category: string;
  isCompleted: boolean;
  date: Date | null;
  ageAtEvent: string | null;
  description: string | null;
};

type MilestoneManagerProps = {
  petId: string;
  milestones: MilestoneItem[];
};

export default function MilestoneManager({ petId, milestones }: MilestoneManagerProps) {
  const router = useRouter();
  const tCommon = useTranslations("common");
  
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("first-time");
  const [loading, setLoading] = useState(false);

  // Inline edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          isCompleted: false,
        }),
      });

      if (response.ok) {
        setNewTitle("");
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to add milestone:", err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (m: MilestoneItem) => {
    setEditingId(m.id);
    setEditDate(m.date ? new Date(m.date).toISOString().split("T")[0] : "");
    setEditAge(m.ageAtEvent || "");
    setEditDesc(m.description || "");
  };

  const handleSaveMilestone = async (m: MilestoneItem, isToggle: boolean = false) => {
    setSavingId(m.id);
    const isCompleted = isToggle ? !m.isCompleted : true;

    try {
      const response = await fetch(`/api/milestones/${m.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: m.title,
          category: m.category,
          description: isToggle ? m.description : editDesc,
          date: isToggle ? (isCompleted ? new Date() : null) : (editDate ? new Date(editDate) : null),
          ageAtEvent: isToggle ? m.ageAtEvent : editAge,
          isCompleted,
        }),
      });

      if (response.ok) {
        setEditingId(null);
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to save milestone:", err);
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa cột mốc này không?")) return;
    setSavingId(id);

    try {
      const response = await fetch(`/api/milestones/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete milestone:", err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Add new milestone */}
      <form onSubmit={handleAddMilestone} className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-text text-base">Thêm cột mốc mới</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Ví dụ: Lần đầu đi tiêm phòng..."
            className="flex-1 bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text placeholder-text-muted focus:outline-none focus:border-primary transition-colors"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="bg-surface-alt border border-border rounded-xl py-3 px-4 text-sm text-text focus:outline-none focus:border-primary transition-colors"
          >
            <option value="first-time">Lần đầu tiên 🐾</option>
            <option value="health">Sức khỏe & Y tế 💉</option>
            <option value="growth">Sự lớn khôn 📏</option>
            <option value="social">Làm quen 👋</option>
            <option value="fun">Vui chơi 🎉</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary-dark text-white font-bold rounded-xl px-6 py-3 text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Thêm
          </button>
        </div>
      </form>

      {/* Milestones list */}
      <div className="space-y-4">
        <h3 className="font-bold text-text text-base">Tất cả cột mốc ({milestones.length})</h3>

        <div className="grid grid-cols-1 gap-4">
          {milestones.map((m) => (
            <div
              key={m.id}
              className={`bg-surface border rounded-2xl p-5 shadow-sm transition-all flex flex-col gap-4 ${
                m.isCompleted ? "border-secondary/35" : "border-border"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={m.isCompleted}
                    onChange={() => handleSaveMilestone(m, true)}
                    className="w-5 h-5 text-secondary border-border focus:ring-secondary rounded mt-1 cursor-pointer"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                      {m.category}
                    </span>
                    <span className={`font-bold text-base block ${m.isCompleted ? "text-text" : "text-text-secondary line-through opacity-60"}`}>
                      {m.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!m.isCompleted ? (
                    <button
                      onClick={() => startEdit(m)}
                      className="text-xs font-bold text-primary bg-primary-light px-3.5 py-2 rounded-xl hover:bg-primary-dark hover:text-white transition-all shadow-sm"
                    >
                      Đánh dấu xong
                    </button>
                  ) : editingId !== m.id ? (
                    <button
                      onClick={() => startEdit(m)}
                      className="text-xs font-semibold text-text-secondary hover:text-primary transition-colors"
                    >
                      Sửa chi tiết
                    </button>
                  ) : null}

                  <button
                    onClick={() => handleDelete(m.id)}
                    disabled={savingId === m.id}
                    className="p-2 border border-border hover:bg-red-500/10 text-text-muted hover:text-red-500 rounded-xl transition-all shadow-sm disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Edit completed details inline */}
              {editingId === m.id && (
                <div className="bg-surface-alt/20 border border-border rounded-xl p-4 space-y-4 animate-scale-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">Ngày đạt được</label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full bg-surface border border-border rounded-lg py-2 px-3 text-xs text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-text">Tuổi của bé tại thời điểm đó</label>
                      <input
                        type="text"
                        value={editAge}
                        onChange={(e) => setEditAge(e.target.value)}
                        placeholder="Ví dụ: 3 tháng, 12 tuần..."
                        className="w-full bg-surface border border-border rounded-lg py-2 px-3 text-xs text-text focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-text">Ghi chú câu chuyện nhỏ</label>
                    <textarea
                      rows={2}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      placeholder="Ghi lại cảm xúc hoặc câu chuyện nhỏ về cột mốc này..."
                      className="w-full bg-surface border border-border rounded-lg py-2 px-3 text-xs text-text focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 border border-border hover:bg-surface text-text-secondary font-semibold rounded-lg text-xs transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => handleSaveMilestone(m, false)}
                      className="bg-primary hover:bg-primary-dark text-white font-bold rounded-lg px-4 py-1.5 text-xs transition-colors shadow-sm"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
