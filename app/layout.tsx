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
  applicationName: "Neon",
  title: {
    default: "Neon",
    template: "%s | Neon",
  },
  description:
    "Neon es la aplicación oficial de punto de venta (POS) y programa de fidelización digital Neon Club con pases para Google Wallet en www.clubneon.co.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Neon",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/icon.jpg",
    apple: "/apple-icon.jpg",
  },
  verification: {
    google: "google6ca0e040c77bd7a2",
  },
};

export const viewport: Viewport = {
  themeColor: "#090014",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
