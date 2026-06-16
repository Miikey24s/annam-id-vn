import { getMessages, setRequestLocale } from "next-intl/server";
import AdminSidebar from "@/components/layout/AdminSidebar";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-surface-alt/30">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Main Admin Content */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
