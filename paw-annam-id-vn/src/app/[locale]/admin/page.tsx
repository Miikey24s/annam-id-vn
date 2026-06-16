import db from "@/lib/db";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  FileText,
  Image as ImageIcon,
  Award,
  Activity,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminDashboardPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Fetch count statistics from the database
  let stats = {
    journals: 0,
    images: 0,
    milestones: 0,
    weight: 0,
  };
  let recentJournals: any[] = [];
  let recentImages: any[] = [];

  try {
    const pet = await db.pet.findFirst({ where: { isActive: true } });
    if (pet) {
      const journalCount = await db.journalEntry.count({ where: { petId: pet.id } });
      const imageCount = await db.galleryImage.count({ where: { petId: pet.id } });
      const milestoneCount = await db.milestone.count({
        where: { petId: pet.id, isCompleted: true },
      });
      const latestWeight = await db.weightLog.findFirst({
        where: { petId: pet.id },
        orderBy: { date: "desc" },
      });

      stats = {
        journals: journalCount,
        images: imageCount,
        milestones: milestoneCount,
        weight: latestWeight?.weight || pet.weight || 0,
      };

      recentJournals = await db.journalEntry.findMany({
        where: { petId: pet.id },
        orderBy: { updatedAt: "desc" },
        take: 3,
      });

      recentImages = await db.galleryImage.findMany({
        where: { petId: pet.id },
        orderBy: { createdAt: "desc" },
        take: 4,
      });
    }
  } catch (err) {
    console.warn("Failed to fetch dashboard stats. Database may be unseeded.", err);
  }

  const statCards = [
    { name: "Nhật ký viết", value: stats.journals, icon: FileText, color: "text-primary bg-primary-light" },
    { name: "Ảnh thư viện", value: stats.images, icon: ImageIcon, color: "text-secondary bg-secondary-light" },
    { name: "Cột mốc hoàn thành", value: stats.milestones, icon: Award, color: "text-amber-500 bg-amber-50" },
    { name: "Cân nặng mới nhất", value: stats.weight > 0 ? `${stats.weight} kg` : "Chưa có", icon: Activity, color: "text-rose-500 bg-rose-50" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-text">Bảng quản trị</h1>
        <p className="text-text-secondary mt-1">
          Quản lý lý lịch, nhật ký hành trình, thư viện ảnh và cột mốc phát triển của bé mèo.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className={`p-4 rounded-xl ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-text-muted font-medium block">{card.name}</span>
                <span className="text-2xl font-bold text-text mt-0.5">{card.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-text flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <span>Thao tác nhanh</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/journal"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl py-3.5 px-4 text-sm transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Viết nhật ký
          </Link>
          <Link
            href="/admin/gallery"
            className="flex items-center justify-center gap-2 border border-primary hover:bg-primary-light text-primary font-bold rounded-xl py-3.5 px-4 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Tải lên ảnh mới
          </Link>
          <Link
            href="/admin/milestones"
            className="flex items-center justify-center gap-2 border border-secondary hover:bg-secondary-light text-secondary font-bold rounded-xl py-3.5 px-4 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Cập nhật cột mốc
          </Link>
          <Link
            href="/admin/health"
            className="flex items-center justify-center gap-2 border border-border hover:bg-surface-alt text-text-secondary font-bold rounded-xl py-3.5 px-4 text-sm transition-colors"
          >
            <Plus className="w-4 h-4" /> Ghi nhận sức khỏe
          </Link>
        </div>
      </div>

      {/* Lists Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Journal Entries */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-text text-base">Nhật ký cập nhật gần đây</h3>
            <Link href="/admin/journal" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
              Tất cả <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentJournals.length === 0 ? (
            <p className="text-sm text-text-muted py-6 text-center">Chưa có bài viết nhật ký nào.</p>
          ) : (
            <div className="space-y-3">
              {recentJournals.map((journal) => (
                <div key={journal.id} className="flex items-center justify-between p-3 border border-border/50 rounded-xl hover:bg-surface-alt/20 transition-colors">
                  <div className="space-y-0.5 max-w-[70%]">
                    <span className="font-bold text-sm text-text block truncate">{journal.title}</span>
                    <span className="text-xs text-text-muted block">
                      {journal.isPublished ? (
                        <span className="text-secondary font-medium">Đã xuất bản</span>
                      ) : (
                        <span className="text-amber-500 font-medium">Bản nháp</span>
                      )}
                    </span>
                  </div>
                  <Link href={`/admin/journal/${journal.id}`} className="text-xs font-semibold text-primary hover:underline">
                    Chỉnh sửa
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Gallery Images */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-text text-base">Ảnh mới tải lên</h3>
            <Link href="/admin/gallery" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
              Tất cả <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentImages.length === 0 ? (
            <p className="text-sm text-text-muted py-6 text-center">Chưa có ảnh nào trong thư viện.</p>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {recentImages.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-border bg-surface-alt">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.caption || ""} className="object-cover w-full h-full" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
