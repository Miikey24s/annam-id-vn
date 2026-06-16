"use client";

import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Heart,
  BookOpen,
  Image as ImageIcon,
  Award,
  Activity,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AdminSidebar() {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.replace("/admin/login");
  };

  const menuItems = [
    { name: t("dashboard"), href: "/admin", icon: LayoutDashboard },
    { name: t("petInfo"), href: "/admin/pets", icon: Heart },
    { name: t("manageJournal"), href: "/admin/journal", icon: BookOpen },
    { name: t("manageGallery"), href: "/admin/gallery", icon: ImageIcon },
    { name: t("manageMilestones"), href: "/admin/milestones", icon: Award },
    { name: t("manageHealth"), href: "/admin/health", icon: Activity },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden w-full bg-surface border-b border-border h-16 px-4 flex items-center justify-between z-20">
        <Link href="/admin" className="font-bold text-lg text-primary flex items-center gap-2">
          <Heart className="w-5 h-5 fill-primary" />
          <span className="gradient-text font-extrabold">Paw Admin</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-text-secondary hover:text-primary transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 z-30 transition-transform duration-300 ease-in-out
                   w-64 bg-surface border-r border-border flex flex-col justify-between h-full min-h-screen`}
      >
        <div className="p-6 space-y-8">
          {/* Logo (Desktop) */}
          <Link href="/admin" className="hidden md:flex items-center gap-2 font-bold text-xl text-primary">
            <Heart className="w-6 h-6 fill-primary" />
            <span className="gradient-text font-extrabold">Paw Admin</span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-secondary hover:bg-surface-alt hover:text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions (Sign Out) */}
        <div className="p-6 border-t border-border/60">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-10"
        />
      )}
    </>
  );
}
