import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { ArrowLeft, Gift, Heart, Info, Globe, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { vi, enUS } from "date-fns/locale";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const dateLocale = locale === "vi" ? vi : enUS;

  // Fetch pet
  let pet = null;
  try {
    pet = await db.pet.findFirst({
      where: { isActive: true },
    });
  } catch (error) {
    console.warn("Database connection failed in about. Falling back to mock data.", error);
  }

  // Set default details if no DB pet exists
  const mockPetDetails = {
    name: "Bé Miu",
    nameEn: "Little Miu",
    breed: "Mèo ta (Domestic Shorthair)",
    color: "Mướp cam & Trắng",
    gender: "male",
    birthday: new Date("2026-03-01"),
    adoptionDate: new Date("2026-05-15"),
    weight: 2.1,
    personality: ["Hiếu động", "Tò mò", "Quấn sen"],
    avatarUrl: null,
    bio: "Hành trình lần đầu nuôi mèo của chúng mình. Lưu trữ tất cả kỷ niệm đẹp cùng bé.",
    bioEn: "Our first journey raising a cat. Preserving all beautiful memories together.",
  };

  const activePet = pet ? pet : mockPetDetails;

  const displayGender = (g: string | null) => {
    if (g === "male") return locale === "vi" ? "Đực" : "Male";
    if (g === "female") return locale === "vi" ? "Cái" : "Female";
    return locale === "vi" ? "Không xác định" : "Unknown";
  };

  // Fun facts
  const funFacts = [
    {
      title: locale === "vi" ? "Tại sao mèo kêu grừ grừ?" : "Why do cats purr?",
      desc: locale === "vi" 
        ? "Mèo kêu grừ grừ không chỉ khi hạnh phúc mà còn để tự xoa dịu, chữa lành xương cơ và giảm căng thẳng."
        : "Cats purr not only when they're happy, but also to soothe themselves, heal bones/muscles, and reduce stress.",
    },
    {
      title: locale === "vi" ? "Đặc điểm của mèo mướp cam" : "Orange tabby personality",
      desc: locale === "vi"
        ? "Mèo mướp cam thường được cho là rất thân thiện, năng động, bám người và... cực kỳ thích ăn!"
        : "Orange tabbies are widely known to be very friendly, energetic, vocal, and extremely food-motivated!",
    },
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-text">
          {t("title")}
        </h1>
        <p className="text-text-secondary mt-2 text-lg max-w-xl mx-auto">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Story details */}
        <div className="space-y-6 text-text-secondary leading-relaxed">
          <h3 className="text-2xl font-extrabold text-text flex items-center gap-2">
            <Heart className="w-6 h-6 text-primary fill-primary/10" />
            <span>Hành trình bắt đầu</span>
          </h3>
          <p>
            {locale === "vi" 
              ? "Trang web này được tạo ra để ghi chép lại toàn bộ hành trình lần đầu nuôi mèo của tụi mình. Từ những ngày đầu bỡ ngỡ, không biết cách chọn cát, dọn hạt cho đến những cột mốc đáng nhớ như buổi khám sức khỏe đầu tiên, hay tiếng kêu grừ grừ đầu tiên bé dành tặng cho sen."
              : "This website was created to document our very first journey of raising a cat. From the confusing early days of selecting litter and kibble, to memorable milestones like the first vet checkup or that first purring sound."}
          </p>
          <p>
            {locale === "vi"
              ? "Nuôi thú cưng mang lại rất nhiều niềm vui và cũng không ít thử thách. Mỗi bức ảnh, mỗi dòng nhật ký đều lưu giữ một câu chuyện nhỏ đáng yêu mà chúng mình không muốn lãng quên theo thời gian."
              : "Raising a pet brings so much joy along with challenges. Every photo and journal entry preserves a tiny sweet story that we don't want to fade away over time."}
          </p>
          <div className="p-4 rounded-3xl bg-surface border border-border flex items-start gap-3 text-xs">
            <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-text mb-1">
                {locale === "vi" ? "Chuyển hướng trang chính" : "Main Website"}
              </span>
              {locale === "vi" 
                ? "Dự án này là một phần nhỏ trong hệ sinh thái cá nhân."
                : "This project is a sub-project of our personal ecosystem."}{" "}
              <a
                href="https://annam.id.vn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-bold"
              >
                Ghé thăm annam.id.vn →
              </a>
            </div>
          </div>
        </div>

        {/* Pet Profile Card */}
        <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <svg className="w-40 h-40 text-secondary" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.4 2.72 6.2 6 6.72V21h2v-3.28c3.28-.52 6-3.32 6-6.72h-1.7z" className="hidden" />
              <path d="M12 3a9 9 0 0 0-9 9c0 2.22.8 4.25 2.12 5.84l.03-.04A2.99 2.99 0 0 1 10 15h4a2.99 2.99 0 0 1 4.85 2.8c1.32-1.59 2.12-3.62 2.12-5.8a9 9 0 0 0-9-9zm-3 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
          </div>

          <div className="relative z-10 space-y-6">
            <h3 className="text-xl font-bold text-text border-b border-border/60 pb-3">
              {t("petProfile")}
            </h3>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-2 border-primary overflow-hidden relative bg-surface-alt flex items-center justify-center">
                {activePet.avatarUrl ? (
                  <Image src={activePet.avatarUrl} alt="Cat avatar" fill className="object-cover" />
                ) : (
                  <span className="text-2xl">🐱</span>
                )}
              </div>
              <div>
                <h4 className="font-extrabold text-lg text-text">
                  {activePet.name || (locale === "vi" ? "Chưa đặt tên" : "Unnamed")}
                </h4>
                <p className="text-xs text-text-muted">
                  {locale === "en" && activePet.nameEn ? activePet.nameEn : activePet.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <span className="text-xs text-text-muted font-medium block">{t("breed")}</span>
                <span className="font-semibold text-text">{activePet.breed || "—"}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-text-muted font-medium block">{t("gender")}</span>
                <span className="font-semibold text-text">{displayGender(activePet.gender)}</span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-text-muted font-medium block">{t("birthday")}</span>
                <span className="font-semibold text-text">
                  {activePet.birthday
                    ? format(new Date(activePet.birthday), "dd/MM/yyyy", { locale: dateLocale })
                    : "—"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-text-muted font-medium block">{locale === "vi" ? "Cân nặng mới nhất" : "Latest Weight"}</span>
                <span className="font-semibold text-text">{activePet.weight ? `${activePet.weight} kg` : "—"}</span>
              </div>
              <div className="col-span-2 space-y-1">
                <span className="text-xs text-text-muted font-medium block">{t("color")}</span>
                <span className="font-semibold text-text">{activePet.color || "—"}</span>
              </div>
              {activePet.personality && activePet.personality.length > 0 && (
                <div className="col-span-2 space-y-1.5">
                  <span className="text-xs text-text-muted font-medium block">{t("personality")}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {activePet.personality.map((p: string) => (
                      <span key={p} className="text-[10px] bg-secondary-light text-secondary px-2.5 py-0.5 rounded-full font-bold">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fun Facts Section */}
      <div className="space-y-6">
        <h3 className="text-2xl font-extrabold text-text text-center flex justify-center items-center gap-2">
          <Gift className="w-6 h-6 text-primary" />
          <span>{t("funFacts")}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {funFacts.map((fact, i) => (
            <div key={i} className="p-6 bg-surface-alt/40 border border-border rounded-3xl space-y-2">
              <h4 className="font-bold text-text text-base">{fact.title}</h4>
              <p className="text-sm text-text-secondary leading-relaxed">{fact.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Credits */}
      <div className="text-center pt-8 border-t border-border/60 text-xs text-text-muted">
        <p>{t("credits", { author: "An Nam" })}</p>
        <p className="mt-1 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
          <span>Powered by Next.js 16 • Tailwind CSS v4 • Supabase</span>
        </p>
      </div>
    </main>
  );
}
