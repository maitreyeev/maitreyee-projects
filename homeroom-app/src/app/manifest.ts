import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Homeroom — Homeschool, Made Fun",
    short_name: "Homeroom",
    description:
      "A one-click homeschool planner with curated syllabi and hands-on activity lessons for CBSE, ICSE, IGCSE and IB.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf9f3",
    theme_color: "#2f8f5b",
    icons: [
      { src: "/icon", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
