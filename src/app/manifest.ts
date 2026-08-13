import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MIIKEY — Developer portfolio",
    short_name: "MIIKEY",
    description: "Software, tools, games, and experiments on an open route.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff8f0",
    theme_color: "#ff6b35",
    orientation: "portrait-primary",
  };
}
