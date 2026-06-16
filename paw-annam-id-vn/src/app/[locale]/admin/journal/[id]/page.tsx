import db from "@/lib/db";
import { setRequestLocale } from "next-intl/server";
import JournalEditorForm from "@/components/ui/JournalEditorForm";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function AdminJournalEditPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const isNew = id === "new";
  let entry = null;

  if (!isNew) {
    try {
      entry = await db.journalEntry.findUnique({
        where: { id },
      });
    } catch (err) {
      console.warn("Failed to fetch journal entry from database.", err);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-text">
          {isNew ? "Viết nhật ký mới" : "Chỉnh sửa bài viết"}
        </h1>
        <p className="text-text-secondary mt-1">
          {isNew
            ? "Ghi lại những câu chuyện, kỷ niệm hoặc kinh nghiệm thú vị mới về bé mèo của bạn."
            : "Chỉnh sửa tiêu đề, nội dung hoặc các thiết lập hiển thị của bài viết nhật ký."}
        </p>
      </div>

      <JournalEditorForm initialData={entry} />
    </div>
  );
}
