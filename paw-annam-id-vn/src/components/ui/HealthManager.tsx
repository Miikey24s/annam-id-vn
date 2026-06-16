"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Plus, Trash2, Calendar, Scale, Activity, PlusCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

type WeightLog = {
  id: string;
  weight: number;
  date: Date;
  note: string | null;
};

type HealthRecord = {
  id: string;
  type: string;
  title: string;
  date: Date;
  nextDate: Date | null;
  vetName: string | null;
  cost: number | null;
  description: string | null;
};

type HealthManagerProps = {
  petId: string;
  weightLogs: WeightLog[];
  healthRecords: HealthRecord[];
};

export default function HealthManager({ petId, weightLogs, healthRecords }: HealthManagerProps) {
  const router = useRouter();
  const tCommon = useTranslations("common");
  const [activeTab, setActiveTab] = useState<"weight" | "medical">("weight");

  // Weight Form States
  const [newWeight, setNewWeight] = useState("");
  const [weightDate, setWeightDate] = useState(new Date().toISOString().split("T")[0]);
  const [weightNote, setWeightNote] = useState("");

  // Health Record Form States
  const [recordType, setRecordType] = useState("vaccination");
  const [recordTitle, setRecordTitle] = useState("");
  const [recordDate, setRecordDate] = useState(new Date().toISOString().split("T")[0]);
  const [recordNextDate, setRecordNextDate] = useState("");
  const [recordVet, setRecordVet] = useState("");
  const [recordCost, setRecordCost] = useState("");
  const [recordDesc, setRecordDesc] = useState("");

  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight || isNaN(parseFloat(newWeight))) return;
    setLoading(true);

    try {
      const response = await fetch("/api/weight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weight: parseFloat(newWeight),
          date: new Date(weightDate),
          note: weightNote,
        }),
      });

      if (response.ok) {
        setNewWeight("");
        setWeightNote("");
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to add weight:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWeight = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa lịch sử cân nặng này không?")) return;
    setActionId(id);
    try {
      const response = await fetch(`/api/weight/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete weight log:", err);
    } finally {
      setActionId(null);
    }
  };

  const handleAddHealth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordTitle.trim()) return;
    setLoading(true);

    try {
      const response = await fetch("/api/health", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: recordType,
          title: recordTitle.trim(),
          date: new Date(recordDate),
          nextDate: recordNextDate ? new Date(recordNextDate) : null,
          vetName: recordVet,
          cost: recordCost ? parseFloat(recordCost) : null,
          description: recordDesc,
        }),
      });

      if (response.ok) {
        setRecordTitle("");
        setRecordNextDate("");
        setRecordVet("");
        setRecordCost("");
        setRecordDesc("");
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to add health record:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHealth = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa hồ sơ sức khỏe này không?")) return;
    setActionId(id);
    try {
      const response = await fetch(`/api/health/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error("Failed to delete health record:", err);
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("weight")}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "weight"
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-primary"
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Theo dõi cân nặng</span>
        </button>
        <button
          onClick={() => setActiveTab("medical")}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 flex items-center gap-2 ${
            activeTab === "medical"
              ? "border-primary text-primary"
              : "border-transparent text-text-secondary hover:text-primary"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Hồ sơ y tế & Tiêm phòng</span>
        </button>
      </div>

      {activeTab === "weight" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Weight Form */}
          <form onSubmit={handleAddWeight} className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4 h-fit">
            <h3 className="font-bold text-text text-base flex items-center gap-1.5">
              <PlusCircle className="w-5 h-5 text-primary" />
              <span>Ghi nhận cân nặng mới</span>
            </h3>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text">Cân nặng (kg) *</label>
              <input
                type="text"
                required
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Ví dụ: 1.8"
                className="w-full bg-surface-alt border border-border rounded-xl py-2 px-3 text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text">Ngày cân *</label>
              <input
                type="date"
                required
                value={weightDate}
                onChange={(e) => setWeightDate(e.target.value)}
                className="w-full bg-surface-alt border border-border rounded-xl py-2 px-3 text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text">Ghi chú</label>
              <input
                type="text"
                value={weightNote}
                onChange={(e) => setWeightNote(e.target.value)}
                placeholder="Ví dụ: Bé khỏe, ăn tốt..."
                className="w-full bg-surface-alt border border-border rounded-xl py-2 px-3 text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl py-2.5 text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Lưu số cân</span>
            </button>
          </form>

          {/* Weight Logs List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-text text-base">Nhật ký cân nặng ({weightLogs.length})</h3>
            {weightLogs.length === 0 ? (
              <div className="text-center py-12 bg-surface border border-border rounded-2xl text-text-muted text-xs">
                Chưa có nhật ký cân nặng nào.
              </div>
            ) : (
              <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-alt border-b border-border font-semibold text-text-secondary">
                      <th className="p-4">Ngày cân</th>
                      <th className="p-4">Cân nặng (kg)</th>
                      <th className="p-4">Ghi chú</th>
                      <th className="p-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {weightLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-surface-alt/10">
                        <td className="p-4 font-medium text-text-secondary">
                          {new Date(log.date).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="p-4 font-bold text-text">{log.weight} kg</td>
                        <td className="p-4 text-text-muted">{log.note || "-"}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteWeight(log.id)}
                            disabled={actionId === log.id}
                            className="p-1.5 text-text-muted hover:text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Health Form */}
          <form onSubmit={handleAddHealth} className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4 h-fit">
            <h3 className="font-bold text-text text-base flex items-center gap-1.5">
              <PlusCircle className="w-5 h-5 text-primary" />
              <span>Ghi nhận hồ sơ y tế mới</span>
            </h3>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text">Loại hồ sơ *</label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full bg-surface-alt border border-border rounded-xl py-2 px-3 text-xs text-text focus:outline-none focus:border-primary"
              >
                <option value="vaccination">Tiêm phòng (Vaccination)</option>
                <option value="vet-visit">Thăm khám bác sĩ (Vet Visit)</option>
                <option value="medication">Uống thuốc / Tẩy giun (Medication)</option>
                <option value="grooming">Tắm rửa / Chăm sóc lông (Grooming)</option>
                <option value="surgery">Phẫu thuật / Điều trị (Surgery)</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text">Tiêu đề (Lý do) *</label>
              <input
                type="text"
                required
                value={recordTitle}
                onChange={(e) => setRecordTitle(e.target.value)}
                placeholder="Ví dụ: Tiêm phòng dại mũi 1"
                className="w-full bg-surface-alt border border-border rounded-xl py-2 px-3 text-xs text-text focus:outline-none focus:border-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">Ngày thực hiện *</label>
                <input
                  type="date"
                  required
                  value={recordDate}
                  onChange={(e) => setRecordDate(e.target.value)}
                  className="w-full bg-surface-alt border border-border rounded-xl py-2 px-3 text-xs text-text focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">Ngày tái chủng / hẹn tiếp</label>
                <input
                  type="date"
                  value={recordNextDate}
                  onChange={(e) => setRecordNextDate(e.target.value)}
                  className="w-full bg-surface-alt border border-border rounded-xl py-2 px-3 text-xs text-text focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">Phòng khám / Bác sĩ</label>
                <input
                  type="text"
                  value={recordVet}
                  onChange={(e) => setRecordVet(e.target.value)}
                  placeholder="Ví dụ: PetClinic"
                  className="w-full bg-surface-alt border border-border rounded-xl py-2 px-3 text-xs text-text focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text">Chi phí (VND)</label>
                <input
                  type="text"
                  value={recordCost}
                  onChange={(e) => setRecordCost(e.target.value)}
                  placeholder="Ví dụ: 250000"
                  className="w-full bg-surface-alt border border-border rounded-xl py-2 px-3 text-xs text-text focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text">Chi tiết mô tả</label>
              <textarea
                rows={2}
                value={recordDesc}
                onChange={(e) => setRecordDesc(e.target.value)}
                placeholder="Ghi chú chi tiết biểu hiện của bé hoặc chỉ định bác sĩ..."
                className="w-full bg-surface-alt border border-border rounded-xl py-2 px-3 text-xs text-text focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl py-2.5 text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
              <span>Lưu hồ sơ</span>
            </button>
          </form>

          {/* Health Records List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-text text-base">Hồ sơ sức khỏe ({healthRecords.length})</h3>
            {healthRecords.length === 0 ? (
              <div className="text-center py-12 bg-surface border border-border rounded-2xl text-text-muted text-xs">
                Chưa có hồ sơ sức khỏe nào.
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {healthRecords.map((rec) => (
                  <div key={rec.id} className="bg-surface border border-border rounded-2xl p-5 shadow-sm space-y-3 relative">
                    <button
                      onClick={() => handleDeleteHealth(rec.id)}
                      disabled={actionId === rec.id}
                      className="absolute top-4 right-4 p-1.5 text-text-muted hover:text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2.5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      <span className="bg-primary-light text-primary px-2.5 py-0.5 rounded-full">
                        {rec.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(rec.date).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <h4 className="font-bold text-text text-base pr-8">{rec.title}</h4>

                    {rec.description && (
                      <p className="text-xs text-text-secondary leading-relaxed bg-surface-alt/20 p-3 rounded-xl border border-border/40">
                        {rec.description}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-xs text-text-muted pt-1">
                      {rec.vetName && (
                        <div>
                          <span className="font-semibold text-text-secondary block">Phòng khám</span>
                          <span className="mt-0.5 block">{rec.vetName}</span>
                        </div>
                      )}
                      {rec.nextDate && (
                        <div>
                          <span className="font-semibold text-text-secondary block">Hẹn tái khám</span>
                          <span className="mt-0.5 block text-primary font-medium">
                            {new Date(rec.nextDate).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
