import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import WeightChart from "@/components/ui/WeightChart";
import { Calendar, Syringe, Clipboard, User, Heart, Activity } from "lucide-react";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HealthPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("health");
  const dateLocale = locale === "vi" ? vi : enUS;

  // Fetch pet
  let pet = null;
  try {
    pet = await db.pet.findFirst({
      where: { isActive: true },
    });
  } catch (error) {
    console.warn("Database connection failed in health. Falling back to mock data.", error);
  }

  let weightLogs: any[] = [];
  let healthRecords: any[] = [];

  if (pet) {
    try {
      weightLogs = await db.weightLog.findMany({
        where: { petId: pet.id },
        orderBy: { date: "asc" },
      });

      healthRecords = await db.healthRecord.findMany({
        where: { petId: pet.id },
        orderBy: { date: "desc" },
      });
    } catch (err) {
      console.warn("Failed to fetch health/weight logs. Resetting to mock.", err);
    }
  }

  // Fallback to mock data if empty
  if (weightLogs.length === 0) {
    weightLogs = [
      { id: "w1", weight: 1.2, date: new Date("2026-05-15"), note: "Ngày đón về" },
      { id: "w2", weight: 1.5, date: new Date("2026-05-25"), note: "Cân tại nhà" },
      { id: "w3", weight: 1.8, date: new Date("2026-06-05"), note: "Khám định kỳ" },
      { id: "w4", weight: 2.1, date: new Date("2026-06-15"), note: "Cân hôm nay" },
    ];
  }

  if (healthRecords.length === 0) {
    healthRecords = [
      {
        id: "h1",
        type: "vaccination",
        title: "Tiêm phòng 4-trong-1 Mũi 1",
        titleEn: "1st 4-in-1 Vaccination",
        description: "Ngừa Rhinotracheitis, Calicivirus, Panleukopenia, Chlamydia psittaci. Bé hơi buồn ngủ sau tiêm.",
        descriptionEn: "Prevents feline rhinotracheitis, calicivirus, panleukopenia, chlamydia. A bit sleepy after.",
        date: new Date("2026-05-27"),
        nextDate: new Date("2026-06-27"),
        vetName: "PetCare Clinic",
        cost: 350000,
      },
      {
        id: "h2",
        type: "vet-visit",
        title: "Tẩy giun & Khám sức khỏe ban đầu",
        titleEn: "Initial Deworming & Checkup",
        description: "Khám tổng quát, tai mũi họng sạch sẽ, uống thuốc tẩy giun định kỳ.",
        descriptionEn: "General wellness check. Clean ears, nose, throat. Took deworming pill.",
        date: new Date("2026-05-20"),
        nextDate: null,
        vetName: "Vet Clinic District 1",
        cost: 150000,
      },
    ];
  }

  const vaccinations = healthRecords.filter((r) => r.type === "vaccination");
  const vetVisits = healthRecords.filter((r) => r.type !== "vaccination");

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

      {/* Grid: Growth Chart & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <WeightChart data={weightLogs} />
        </div>

        {/* Upcoming Reminders Card */}
        <div className="bg-surface border border-border p-6 rounded-3xl shadow-sm h-full flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold text-text flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <span>{t("upcoming")}</span>
            </h3>

            <div className="space-y-4">
              {healthRecords.some((r) => r.nextDate) ? (
                healthRecords
                  .filter((r) => r.nextDate)
                  .map((record) => {
                    const displayTitle = locale === "en" && record.titleEn ? record.titleEn : record.title;
                    const nextDate = new Date(record.nextDate);

                    return (
                      <div
                        key={`next-${record.id}`}
                        className="p-4 rounded-2xl bg-primary-light/40 border border-primary-light flex gap-3 items-start"
                      >
                        <Syringe className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-bold text-text">{displayTitle}</h4>
                          <p className="text-xs text-text-secondary mt-1">
                            {locale === "vi" ? "Lịch hẹn kế tiếp:" : "Next due:"}{" "}
                            <span className="font-semibold text-primary">
                              {format(nextDate, "dd/MM/yyyy", { locale: dateLocale })}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })
              ) : (
                <div className="text-center py-8 text-text-muted text-xs">
                  {locale === "vi" ? "Chưa có lịch hẹn tiêm phòng kế tiếp." : "No upcoming vaccination appointments."}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-secondary-light/40 border border-secondary-light/60 flex items-center gap-3 text-xs text-text-secondary">
            <Heart className="w-5 h-5 text-secondary flex-shrink-0" />
            <span>
              {locale === "vi"
                ? "Giữ lịch tiêm và cân nặng ổn định giúp mèo cưng có cuộc sống khỏe mạnh và hạnh phúc bên bạn!"
                : "Keeping a steady vaccine schedule and tracking weight helps your pet lead a healthy life!"}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vaccination History */}
        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-text border-b border-border pb-2 flex items-center gap-2">
            <Syringe className="w-5 h-5 text-secondary" />
            <span>{t("vaccination")}</span>
          </h3>

          {vaccinations.length === 0 ? (
            <div className="text-center py-8 bg-surface/50 border border-dashed border-border rounded-3xl text-text-muted text-sm">
              {locale === "vi" ? "Chưa có lịch sử tiêm chủng." : "No vaccination history."}
            </div>
          ) : (
            <div className="space-y-4">
              {vaccinations.map((v) => {
                const displayTitle = locale === "en" && v.titleEn ? v.titleEn : v.title;
                const displayDesc = locale === "en" && v.descriptionEn ? v.descriptionEn : v.description;
                const vDate = new Date(v.date);

                return (
                  <div key={v.id} className="bg-surface border border-border p-5 rounded-2xl shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-secondary-light flex items-center justify-center text-secondary flex-shrink-0">
                      <Syringe className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-text">{displayTitle}</h4>
                      <p className="text-xs text-text-muted">
                        {format(vDate, "dd/MM/yyyy", { locale: dateLocale })}
                        {v.vetName && ` • ${v.vetName}`}
                      </p>
                      {displayDesc && <p className="text-xs text-text-secondary leading-relaxed pt-1">{displayDesc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Vet Visits & Other Health Records */}
        <div className="space-y-6">
          <h3 className="text-xl font-extrabold text-text border-b border-border pb-2 flex items-center gap-2">
            <Clipboard className="w-5 h-5 text-primary" />
            <span>Lịch sử khám & Điều trị</span>
          </h3>

          {vetVisits.length === 0 ? (
            <div className="text-center py-8 bg-surface/50 border border-dashed border-border rounded-3xl text-text-muted text-sm">
              {locale === "vi" ? "Chưa có lịch sử khám bệnh." : "No checkup history."}
            </div>
          ) : (
            <div className="space-y-4">
              {vetVisits.map((v) => {
                const displayTitle = locale === "en" && v.titleEn ? v.titleEn : v.title;
                const displayDesc = locale === "en" && v.descriptionEn ? v.descriptionEn : v.description;
                const vDate = new Date(v.date);

                return (
                  <div key={v.id} className="bg-surface border border-border p-5 rounded-2xl shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary flex-shrink-0">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-text">{displayTitle}</h4>
                      <p className="text-xs text-text-muted">
                        {format(vDate, "dd/MM/yyyy", { locale: dateLocale })}
                        {v.vetName && ` • ${v.vetName}`}
                      </p>
                      {displayDesc && <p className="text-xs text-text-secondary leading-relaxed pt-1">{displayDesc}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
