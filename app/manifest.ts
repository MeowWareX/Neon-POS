import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NEON OS",
    short_name: "NEON OS",
    description:
      "POS offline-first para NEON Drinks & Snacks con inventario, caja y analítica.",
    start_url: "/pos",
    display: "standalone",
    background_color: "#090014",
    theme_color: "#090014",
    orientation: "portrait-primary",
    lang: "es-CO",
    icons: [
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
