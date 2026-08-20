import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Neon",
    short_name: "Neon",
    description:
      "Aplicación oficial de punto de venta (POS) y programa de fidelización digital Neon Club con pases para Google Wallet y Apple Wallet.",
    start_url: "/",
    display: "standalone",
    background_color: "#090014",
    theme_color: "#090014",
    orientation: "portrait-primary",
    lang: "es-CO",
    icons: [
      {
        src: "/logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
      {
        src: "/logo.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "maskable",
      },
      {
        src: "/icon.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
