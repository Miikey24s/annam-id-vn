import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://annam.id.vn";
  const locales = ["vi", "en"];
  const lastModified = new Date();

  const pages = ["", "/about", "/projects", "/blog", "/contact"];

  const blogSlugs = [
    "building-portfolio-nextjs",
    "typescript-must-have",
    "docker-frontend",
    "cicd-github-actions",
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const page of pages) {
    for (const locale of locales) {
      const url = locale === "vi" ? `${baseUrl}${page}` : `${baseUrl}/${locale}${page}`;
      entries.push({
        url,
        lastModified,
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
      });
    }
  }

  // Blog posts
  for (const slug of blogSlugs) {
    for (const locale of locales) {
      const url = locale === "vi" ? `${baseUrl}/blog/${slug}` : `${baseUrl}/${locale}/blog/${slug}`;
      entries.push({
        url,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
