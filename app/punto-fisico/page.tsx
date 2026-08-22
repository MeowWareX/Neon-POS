import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  Wallet,
  CupSoda,
  Wine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const metadata: Metadata = {
  title: "Punto de Venta Físico - Granizados & Coctelería",
  description:
    "Visita nuestro punto de venta físico de Neon Drinks & Snacks en Cartagena. Disfruta los mejores granizados con y sin licor, topping intensos y acumula sellos con Neon Club.",
};

export default function PuntoFisicoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FoodEstablishment",
    name: "Neon Drinks & Snacks - Punto Físico",
    image: "https://www.clubneon.co/logo.jpg",
    "@id": "https://www.clubneon.co/punto-fisico",
    url: "https://www.clubneon.co/punto-fisico",
    telephone: "+573113795540",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cartagena",
      addressRegion: "Bolívar",
      addressCountry: "CO",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "14:00",
      closes: "23:00",
    },
    servesCuisine: "Granizados, Cócteles, Snacks",
    sameAs: ["https://instagram.com/neon_ctg"],
  };

  return (
    <div className="min-h-screen font-sans text-slate-100 selection:bg-pink-500 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 border-b border-white/10 px-4 py-4 sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="glass"
              size="sm"
              className="gap-2"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                <span>Inicio</span>
              </Link>
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="size-9 overflow-hidden rounded-xl bg-gradient-to-tr from-pink-500 to-emerald-400 p-0.5 shadow-[0_0_15px_rgba(255,62,171,0.4)]">
                <Image
                  src="/logo.jpg"
                  alt="Logo Neon"
                  width={36}
                  height={36}
                  className="h-full w-full rounded-[10px] object-cover"
                />
              </div>
              <span className="font-display text-gradient-neon text-xl font-bold tracking-[0.15em]">
                Neon
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/15"
            >
              <a
                href="https://wa.me/573113795540?text=Hola%20Neon%2C%20quisiera%20saber%20la%20ubicaci%C3%B3n%20del%20punto%20f%C3%ADsico"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>WhatsApp Store</span>
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl space-y-6 px-4 pt-12 pb-12 text-center sm:px-8">
        <Badge variant="success" className="gap-2 py-1.5 px-4">
          <CupSoda className="h-4 w-4" />
          Punto Físico de Granizados & Coctelería
        </Badge>

        <h1 className="font-display mx-auto max-w-3xl text-4xl leading-tight font-black tracking-tight sm:text-6xl">
          <span className="text-gradient-neon block">
            Experiencia Neon en Punto de Venta
          </span>
        </h1>

        <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg">
          Disfruta de nuestros espectaculares granizados preparados al instante
          con las recetas más intensas, toppings explosivos y licor de primera
          calidad en un ambiente lleno de buena vibra y luces neon.
        </p>

        {/* Quick Info Grid */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
          <div className="glass-card glass-interactive flex flex-col items-center justify-center rounded-2xl p-5 text-center">
            <MapPin className="mb-2 h-6 w-6 text-pink-400" />
            <span className="font-display text-xs font-bold text-white uppercase tracking-wider">Ubicación</span>
            <span className="text-muted-foreground text-xs">Cartagena, Colombia</span>
          </div>

          <div className="glass-card glass-interactive flex flex-col items-center justify-center rounded-2xl p-5 text-center">
            <Clock className="mb-2 h-6 w-6 text-emerald-400" />
            <span className="font-display text-xs font-bold text-white uppercase tracking-wider">Atención</span>
            <span className="text-muted-foreground text-xs">Todos los días</span>
          </div>

          <div className="glass-card glass-interactive flex flex-col items-center justify-center rounded-2xl p-5 text-center">
            <InstagramIcon className="mb-2 h-6 w-6 text-amber-400" />
            <span className="font-display text-xs font-bold text-white uppercase tracking-wider">
              Redes Sociales
            </span>
            <span className="text-muted-foreground text-xs">@neon_ctg</span>
          </div>
        </div>
      </section>


      {/* Specialty Highlights Section */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Nuestra Carta en Punto Físico
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Servidos helados al instante directamente desde nuestras máquinas
              granizadoras.
            </p>
          </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Sin Licor */}
              <div className="glass-card space-y-4 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-card to-black/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/20 p-3 text-emerald-400">
                    <CupSoda className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      Granizados Sin Licor
                    </h3>
                    <p className="text-xs text-emerald-400">
                      Sabores Frutales e Intensos
                    </p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Mango Biche / Sandía / Fresa</span>
                    <Badge variant="success" size="sm">
                      Punto Físico
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Maracumango / Mora Azul</span>
                    <Badge variant="success" size="sm">
                      Punto Físico
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Chicle / Bombombum / Lulo</span>
                    <Badge variant="success" size="sm">
                      Punto Físico
                    </Badge>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Kiwi / Mandarina / Limonada</span>
                    <Badge variant="success" size="sm">
                      Punto Físico
                    </Badge>
                  </li>
                </ul>
              </div>

              {/* Premium */}
              <div className="glass-card space-y-4 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-card to-black/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/20 p-3 text-amber-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      Sabores Premium
                    </h3>
                    <p className="text-xs text-amber-400">
                      Recetas Especiales de la Casa
                    </p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Limonada Cerezada</span>
                    <Badge variant="warning" size="sm">Especial</Badge>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Limonada de Coco / Maracucoco</span>
                    <Badge variant="warning" size="sm">Especial</Badge>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Piña Colada / Milo</span>
                    <Badge variant="warning" size="sm">Especial</Badge>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Cocoloco / Bayllys</span>
                    <Badge variant="warning" size="sm">Especial</Badge>
                  </li>
                </ul>
              </div>

              {/* Con Licor */}
              <div className="glass-card space-y-4 rounded-3xl border border-pink-500/30 bg-gradient-to-b from-pink-950/20 via-card to-black/60 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-pink-500/30 bg-pink-500/20 p-3 text-pink-400">
                    <Wine className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-white">
                      Granizados Con Licor
                    </h3>
                    <p className="text-xs text-pink-400">
                      Cócteles Prenden la Noche
                    </p>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Ojo de Diablo (Fresa+Vodka+Whisky+Champagne)</span>
                    <Badge variant="default" size="sm">TOP</Badge>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Sambapalo (Limón + Tequila)</span>
                    <Badge variant="default" size="sm">Tequila</Badge>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Tussy (Sandía/Fresa/Cereza + Whisky)</span>
                    <Badge variant="default" size="sm">Whisky</Badge>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-white">Chichonero / Sombra / Azulito</span>
                    <Badge variant="default" size="sm">Vodka</Badge>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Loyalty Club Section */}
        <section className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
          <div className="glass-panel-elevated space-y-6 rounded-3xl border border-pink-500/40 bg-gradient-to-r from-pink-950/30 via-purple-950/20 to-emerald-950/30 p-8 backdrop-blur-xl">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
              <div className="max-w-xl space-y-2">
                <Badge variant="default" className="gap-2 py-1 px-3">
                  <Wallet className="h-4 w-4" />
                  Programa de Lealtad Neon Club
                </Badge>
                <h2 className="font-display text-2xl font-black text-white sm:text-3xl">
                  ¡PAGA 10 Y LLEVA 11 EN PUNTO FÍSICO!
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm">
                  Registra tu tarjeta digital en Google Wallet o Apple Wallet. Con
                  cada compra en nuestro punto físico acumulas sellos
                  automáticamente.
                </p>
              </div>
              <Button
                asChild
                variant="default"
                size="lg"
                className="shrink-0 font-bold"
              >
                <Link href="/club/register">
                  <Wallet className="h-4 w-4" />
                  <span>Obtener Tarjeta Digital</span>
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/90 px-4 py-8 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpg"
                alt="Logo Neon"
                width={28}
                height={28}
                className="size-7 rounded-xl object-cover border border-white/15"
              />
              <div>
                <span className="font-bold text-white">Neon Drinks & Snacks</span>{" "}
                — Cartagena, Colombia.
              </div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="transition-colors hover:text-pink-400">
                Inicio
              </Link>
              <Link
                href="/privacy"
                className="transition-colors hover:text-pink-400"
              >
                Privacidad
              </Link>
              <Link
                href="/terms"
                className="transition-colors hover:text-pink-400"
              >
                Términos
              </Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

