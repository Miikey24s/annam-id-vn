import type { MetadataRoute } from "next";
import { notes, projects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://annam.id.vn";
  const routes = ["", "/about", "/projects", "/now", "/blog", "/contact"];
  return [
    ...["vi", "en"].flatMap((locale) => routes.map((route) => ({ url: `${baseUrl}${locale === "vi" ? "" : `/${locale}`}${route}`, lastModified: new Date(), changeFrequency: route === "/now" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : .7 }))),
    ...projects.map((project) => ({ url: `${baseUrl}/projects/${project.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: project.featured ? .8 : .5 })),
    ...notes.map((note) => ({ url: `${baseUrl}/blog/${note.slug}`, lastModified: new Date(note.date), changeFrequency: "yearly" as const, priority: .5 })),
  ];
}
