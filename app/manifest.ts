import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Neon - Punto de Venta (POS) y Fidelización Digital",
    short_name: "Neon",
    description:
      "Aplicación oficial de punto de venta (POS) y programa de fidelización digital Neon Club con pases para Google Wallet y Apple Wallet.",
    start_url: "/",
    display: "standalone",
    background_color: "#090014",
    theme_color: "#090014",
    orientation: "portrait-primary",
    lang: "es-CO",
    categories: ["point of sale"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
