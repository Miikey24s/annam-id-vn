import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Annam Nguyen | Developer Portfolio",
    short_name: "ANNAM",
    description: "Personal developer portfolio of Annam Nguyen",
    start_url: "/",
    display: "standalone",
    background_color: "#FDF8F4",
    theme_color: "#E8913A",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
