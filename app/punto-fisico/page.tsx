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
    <div
      className="min-h-screen font-sans text-slate-100 selection:bg-pink-500 selection:text-white"
      style={{
        background:
          "radial-gradient(ellipse at top, #1c0536 0%, #090014 60%, #04000a 100%)",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090014]/80 px-4 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="glass-panel inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 transition-all hover:border-pink-500/50 hover:text-pink-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Inicio
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="size-9 overflow-hidden rounded-xl bg-gradient-to-tr from-pink-500 to-emerald-400 p-0.5 shadow-[0_0_15px_rgba(255,115,227,0.4)]">
                <Image
                  src="/logo.jpg"
                  alt="Logo Neon"
                  width={36}
                  height={36}
                  className="h-full w-full rounded-[10px] object-cover"
                />
              </div>
              <span className="font-display bg-gradient-to-r from-pink-400 via-emerald-300 to-yellow-300 bg-clip-text text-xl font-bold tracking-[0.15em] text-transparent">
                Neon
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/573113795540?text=Hola%20Neon%2C%20quisiera%20saber%20la%20ubicaci%C3%B3n%20del%20punto%20f%C3%ADsico"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 transition-colors hover:bg-emerald-500/30"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>WhatsApp Store</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-5xl space-y-6 px-4 pt-10 pb-12 text-center sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-400 uppercase backdrop-blur-md">
          <CupSoda className="h-4 w-4" />
          Punto Físico de Granizados & Coctelería
        </div>

        <h1 className="font-display mx-auto max-w-3xl text-4xl leading-tight font-black tracking-tight sm:text-6xl">
          <span className="bg-gradient-to-r from-pink-400 via-emerald-300 to-yellow-300 bg-clip-text text-transparent">
            Experiencia Neon en Punto de Venta
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg">
          Disfruta de nuestros espectaculares granizados preparados al instante
          con las recetas más intensas, toppings explosivos y licor de primera
          calidad en un ambiente lleno de buena vibra y luces neon.
        </p>

        {/* Quick Info Grid */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
          <div className="glass-panel flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <MapPin className="mb-2 h-6 w-6 text-pink-400" />
            <span className="text-xs font-semibold text-white">Ubicación</span>
            <span className="text-xs text-slate-400">Cartagena, Colombia</span>
          </div>

          <div className="glass-panel flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <Clock className="mb-2 h-6 w-6 text-emerald-400" />
            <span className="text-xs font-semibold text-white">Atención</span>
            <span className="text-xs text-slate-400">Todos los días</span>
          </div>

          <div className="glass-panel flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
            <InstagramIcon className="mb-2 h-6 w-6 text-yellow-400" />
            <span className="text-xs font-semibold text-white">Redes Sociales</span>
            <span className="text-xs text-slate-400">@neon_ctg</span>
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
            <p className="text-xs text-slate-400 sm:text-sm">
              Servidos helados al instante directamente desde nuestras máquinas granizadoras.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Sin Licor */}
            <div className="glass-panel rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-black/40 to-black/60 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/20 p-3 text-emerald-400">
                  <CupSoda className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Granizados Sin Licor</h3>
                  <p className="text-xs text-emerald-400">Sabores Frutales e Intensos</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span>Mango Biche / Sandía / Fresa</span>
                  <span className="font-semibold text-emerald-400">Punto Físico</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span>Maracumango / Mora Azul</span>
                  <span className="font-semibold text-emerald-400">Punto Físico</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span>Chicle / Bombombum / Lulo</span>
                  <span className="font-semibold text-emerald-400">Punto Físico</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span>Kiwi / Mandarina / Limonada</span>
                  <span className="font-semibold text-emerald-400">Punto Físico</span>
                </li>
              </ul>
            </div>

            {/* Premium */}
            <div className="glass-panel rounded-3xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-black/40 to-black/60 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-500/20 p-3 text-amber-400">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Sabores Premium</h3>
                  <p className="text-xs text-amber-400">Recetas Especiales de la Casa</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span>Limonada Cerezada</span>
                  <span className="font-semibold text-amber-400">Especial</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span>Limonada de Coco / Maracucoco</span>
                  <span className="font-semibold text-amber-400">Especial</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span>Piña Colada / Milo</span>
                  <span className="font-semibold text-amber-400">Especial</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span>Cocoloco / Bayllys</span>
                  <span className="font-semibold text-amber-400">Especial</span>
                </li>
              </ul>
            </div>

            {/* Con Licor */}
            <div className="glass-panel rounded-3xl border border-pink-500/30 bg-gradient-to-b from-pink-950/20 via-black/40 to-black/60 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-pink-500/20 p-3 text-pink-400">
                  <Wine className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">Granizados Con Licor</h3>
                  <p className="text-xs text-pink-400">Cócteles Prenden la Noche</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span>Ojo de Diablo (Fresa+Vodka+Whisky+Champagne)</span>
                  <span className="font-semibold text-pink-400">TOP</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span>Sambapalo (Limón + Tequila)</span>
                  <span className="font-semibold text-pink-400">Tequila</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span>Tussy (Sandía/Fresa/Cereza + Whisky)</span>
                  <span className="font-semibold text-pink-400">Whisky</span>
                </li>
                <li className="flex items-center justify-between border-b border-white/5 pb-1">
                  <span>Chichonero / Sombra / Azulito</span>
                  <span className="font-semibold text-pink-400">Vodka</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Loyalty Club Section */}
      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-8">
        <div className="glass-panel space-y-6 rounded-3xl border border-pink-500/40 bg-gradient-to-r from-pink-950/30 via-purple-950/20 to-emerald-950/30 p-8 backdrop-blur-xl">
          <div className="flex flex-col items-center text-center gap-4 sm:flex-row sm:text-left sm:justify-between">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-xs font-semibold text-pink-400 uppercase">
                <Wallet className="h-4 w-4" />
                Programa de Lealtad Neon Club
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                ¡PAGA 10 Y LLEVA 11 EN PUNTO FÍSICO!
              </h2>
              <p className="text-xs text-slate-300 sm:text-sm">
                Registra tu tarjeta digital en Google Wallet o Apple Wallet. Con cada compra en nuestro punto físico acumulas sellos automáticamente.
              </p>
            </div>
            <Link
              href="/club/register"
              className="shrink-0 flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-pink-500/25 transition-transform hover:scale-[1.03]"
            >
              <Wallet className="h-4 w-4" />
              Obtener Tarjeta Digital
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 px-4 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Logo Neon"
              width={28}
              height={28}
              className="size-7 rounded-lg object-cover"
            />
            <div>
              <span className="font-bold text-white">Neon Drinks & Snacks</span> — Cartagena, Colombia.
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="transition-colors hover:text-pink-400">
              Inicio
            </Link>
            <Link href="/privacy" className="transition-colors hover:text-pink-400">
              Privacidad
            </Link>
            <Link href="/terms" className="transition-colors hover:text-pink-400">
              Términos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
