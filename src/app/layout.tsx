import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { beVietnamPro, plexMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://annam.id.vn"),
  title: { default: "MIIKEY — Developer portfolio", template: "%s — MIIKEY" },
  description: "Portfolio cá nhân của MIIKEY — software, tools, game và các experiment đang phát triển.",
  keywords: ["MIIKEY", "Annam Nguyen", "developer portfolio", ".NET", "Blazor", "Unity", "game development"],
  openGraph: { type: "website", siteName: "MIIKEY", title: "MIIKEY — Developer portfolio", description: "Software, tools, games, and experiments on an open route.", url: "https://annam.id.vn" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi" suppressHydrationWarning><body className={`${beVietnamPro.variable} ${plexMono.variable}`}><ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>{children}</ThemeProvider></body></html>;
}
