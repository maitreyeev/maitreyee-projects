import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CrackIt — Interview Prep",
    short_name: "CrackIt",
    description:
      "Practice real PM & Program Management interview rounds with AI feedback, built for Indian candidates.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f7",
    theme_color: "#5b53f0",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
