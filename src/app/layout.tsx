import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { beVietnamPro, plexMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://annam.id.vn"),
  title: { default: "Annam Nguyen — Builder portfolio", template: "%s — Annam Nguyen" },
  description: "Portfolio sống của Annam Nguyen — xây hệ thống, dashboard, mobile workflow và những thử nghiệm nhỏ.",
  keywords: ["Annam Nguyen", "developer portfolio", ".NET", "Blazor", "product engineering"],
  openGraph: { type: "website", siteName: "Annam Nguyen", title: "Annam Nguyen — Builder portfolio", description: "Build useful systems. Learn in public. Keep shipping.", url: "https://annam.id.vn" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" suppressHydrationWarning><body className={`${beVietnamPro.variable} ${plexMono.variable}`}><ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>{children}</ThemeProvider></body></html>;
}
