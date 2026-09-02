import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Family OS",
    short_name: "Family OS",
    description: "The operating system for your household.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf7f2",
    theme_color: "#8b7cf6",
    icons: [
      { src: "/icon", sizes: "192x192", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
