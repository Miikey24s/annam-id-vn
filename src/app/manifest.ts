import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Annam Nguyen — Builder portfolio",
    short_name: "ANNAM",
    description: "Build useful systems. Learn in public. Keep shipping.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8f0",
    theme_color: "#ff6b35",
    orientation: "portrait-primary",
  };
}
