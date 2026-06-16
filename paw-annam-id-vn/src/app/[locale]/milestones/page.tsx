import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import AgeCalculator from "@/components/ui/AgeCalculator";
import { Check, Calendar, Award } from "lucide-react";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function MilestonesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("milestones");
  const dateLocale = locale === "vi" ? vi : enUS;

  // Fetch pet
  let pet = null;
  try {
    pet = await db.pet.findFirst({
      where: { isActive: true },
    });
  } catch (error) {
    console.warn("Database connection failed in milestones. Falling back to mock data.", error);
  }

  let milestones: any[] = [];

  if (pet) {
    try {
      milestones = await db.milestone.findMany({
        where: { petId: pet.id },
        orderBy: { sortOrder: "asc" },
      });
    } catch (err) {
      console.warn("Failed to fetch milestones. Resetting to mock.", err);
    }
  }

  // Fallback to mock milestones if empty
  if (milestones.length === 0) {
    milestones = [
      { id: "m1", title: "Chào đón về nhà mới", titleEn: "Welcome Home", category: "first-time", isCompleted: true, date: new Date("2026-05-15"), ageAtEvent: "2.5 tháng" },
      { id: "m2", title: "Tiếng kêu grừ grừ (purr) đầu tiên", titleEn: "First Purr", category: "first-time", isCompleted: true, date: new Date("2026-05-18"), ageAtEvent: "2.5 tháng" },
      { id: "m3", title: "Lần đầu tiên đi khám bác sĩ", titleEn: "First Vet Visit", category: "health", isCompleted: true, date: new Date("2026-05-20"), ageAtEvent: "2.5 tháng" },
      { id: "m4", title: "Cắt móng tay lần đầu", titleEn: "First Nail Trim", category: "growth", isCompleted: false, date: null, ageAtEvent: null },
      { id: "m5", title: "Mũi tiêm phòng đầu tiên", titleEn: "First Vaccination", category: "health", isCompleted: false, date: null, ageAtEvent: null },
      { id: "m6", title: "Lần đầu tắm sấy", titleEn: "First Bath", category: "growth", isCompleted: false, date: null, ageAtEvent: null },
      { id: "m7", title: "Bắt được con chuột đồ chơi đầu tiên", titleEn: "First Toy Catch", category: "fun", isCompleted: true, date: new Date("2026-05-25"), ageAtEvent: "2.6 tháng" },
      { id: "m8", title: "Chào đón sinh nhật 1 tuổi", titleEn: "First Birthday (1 Year)", category: "growth", isCompleted: false, date: null, ageAtEvent: null },
      { id: "m9", title: "Làm quen với người lạ đầu tiên", titleEn: "First Meeting with Guest", category: "social", isCompleted: false, date: null, ageAtEvent: null },
    ];
  }

  const completedCount = milestones.filter((m) => m.isCompleted).length;
  const totalCount = milestones.length;
  const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Group milestones by category
  const categories = ["first-time", "health", "growth", "social", "fun"];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-text">
          {t("title")}
        </h1>
        <p className="text-text-secondary mt-2 text-lg max-w-xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      {/* Top Section: Progress & Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Progress Card */}
        <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm flex flex-col justify-between h-full min-h-[260px]">
          <div>
            <h3 className="text-xl font-bold text-text flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Tiến trình trưởng thành</span>
            </h3>
            <p className="text-text-secondary text-xs mt-1">
              Bé đã vượt qua được bao nhiêu chặng đường lớn khôn rồi?
            </p>
          </div>

          <div className="py-6 space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-text">
                {completedCount} <span className="text-sm text-text-muted font-normal">/ {totalCount} cột mốc</span>
              </span>
              <span className="text-xl font-bold text-primary">{percentComplete}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-3 bg-surface-alt border border-border rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-text-muted italic border-t border-border/60 pt-4">
            * Các cột mốc tiếp theo sẽ được mở khóa khi sen cập nhật nhật ký hoặc thông số cho bé.
          </div>
        </div>

        {/* Age Calculator Widget */}
        <AgeCalculator />
      </div>

      {/* Milestones Grouped List */}
      <div className="space-y-12">
        {categories.map((cat) => {
          const catMilestones = milestones.filter((m) => m.category === cat);
          if (catMilestones.length === 0) return null;

          return (
            <div key={cat} className="space-y-6">
              <h3 className="text-xl font-extrabold text-text border-b border-border pb-2 inline-block">
                {t(`categories.${cat}` as any)}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {catMilestones.map((m) => {
                  const displayTitle = locale === "en" && m.titleEn ? m.titleEn : m.title;
                  const displayDesc = locale === "en" && m.descriptionEn ? m.descriptionEn : m.description;
                  const milestoneDate = m.date ? new Date(m.date) : null;

                  return (
                    <div
                      key={m.id}
                      className={`relative border p-5 rounded-3xl shadow-sm transition-all duration-300 flex items-start gap-4 ${
                        m.isCompleted
                          ? "bg-surface border-primary-light/40"
                          : "bg-surface/40 border-border opacity-60"
                      }`}
                    >
                      {/* Left icon status */}
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border ${
                          m.isCompleted
                            ? "bg-primary-light text-primary border-primary/20"
                            : "bg-surface-alt text-text-muted border-border"
                        }`}
                      >
                        {m.isCompleted ? (
                          <Check className="w-4 h-4 stroke-[3]" />
                        ) : (
                          <span className="text-xs font-bold font-mono">?</span>
                        )}
                      </div>

                      {/* Content details */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <h4 className={`font-bold truncate ${m.isCompleted ? "text-text" : "text-text-secondary"}`}>
                          {displayTitle}
                        </h4>
                        {displayDesc && (
                          <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                            {displayDesc}
                          </p>
                        )}
                        {m.isCompleted && milestoneDate && (
                          <div className="flex items-center gap-1.5 text-[10px] text-text-muted font-medium pt-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {format(milestoneDate, "dd/MM/yyyy", { locale: dateLocale })}
                            </span>
                            {m.ageAtEvent && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span>({m.ageAtEvent})</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
