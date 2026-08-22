import type { Metadata, Viewport } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
import { AppProviders } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";
import "./globals.css";

const displayFont = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
});

const bodyFont = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.clubneon.co"),
  applicationName: "Neon Drinks & Concentrados",
  title: {
    default:
      "Neon | Líquidos Concentrados para Máquinas Granizadoras al Por Mayor y Detal",
    template: "%s | Neon Drinks & Concentrados",
  },
  description:
    "Distribuidor líder en Colombia de líquidos concentrados de alto rendimiento para máquinas granizadoras. Sabores intensos con y sin licor para negocios, eventos y punto de venta físico en Cartagena.",
  keywords: [
    "líquidos para máquinas granizadoras",
    "concentrados para granizados",
    "distribuidor de granizados al por mayor",
    "insumos para máquinas de granizados Colombia",
    "granizados con licor",
    "granizados sin licor",
    "líquidos concentrados Cartagena",
    "Neon Drinks",
    "máquinas de granizados negocio",
    "jarabes para granizadora",
  ],
  authors: [{ name: "Neon Drinks & Snacks", url: "https://www.clubneon.co" }],
  creator: "Neon Drinks & Snacks",
  publisher: "Neon Drinks & Snacks",
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://www.clubneon.co",
    title: "Neon | Líquidos Concentrados para Máquinas Granizadoras",
    description:
      "Venta al por mayor y detal de líquidos concentrados para granizadoras. Sabores intensos, fórmula de alto rendimiento y asesoría para tu negocio.",
    siteName: "Neon Drinks & Concentrados",
    images: [
      {
        url: "/images/promos/promocion-liquidos-mayorista.jpg",
        width: 1200,
        height: 1600,
        alt: "Promoción Líquidos Concentrados para Máquinas Granizadoras - Neon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Neon | Líquidos Concentrados para Máquinas Granizadoras",
    description:
      "Distribución de concentrados para granizadoras al por mayor y detal en Colombia.",
    images: ["/images/promos/promocion-liquidos-mayorista.jpg"],
  },
  appleWebApp: {
    capable: true,
    title: "Neon Drinks",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  verification: {
    google: "google6ca0e040c77bd7a2",
  },
};

export const viewport: Viewport = {
  themeColor: "#090014",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-CO"
      suppressHydrationWarning
      className={cn(displayFont.variable, bodyFont.variable, "dark")}
    >
      <body
        suppressHydrationWarning
        className="bg-background text-foreground min-h-screen antialiased"
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
