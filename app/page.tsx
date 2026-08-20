import Link from "next/link";
import {
  CupSoda,
  Wallet,
  ShieldCheck,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  FileText,
  Smartphone,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neon | Sistema POS & Club de Fidelización Digital",
  description:
    "Neon es la plataforma integral de punto de venta (POS) y programa de fidelización digital en Google Wallet y Apple Wallet para www.clubneon.co.",
};

export default function HomePage() {
  return (
    <div
      className="min-h-screen font-sans text-slate-100 selection:bg-pink-500 selection:text-white"
      style={{
        background:
          "radial-gradient(ellipse at top, #1c0536 0%, #090014 60%, #04000a 100%)",
      }}
    >
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#090014]/80 px-4 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-emerald-400 p-0.5 shadow-[0_0_20px_rgba(255,115,227,0.4)]">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-black">
                <CupSoda className="h-5 w-5 text-pink-400" />
              </div>
            </div>
            <div>
              <span className="font-display bg-gradient-to-r from-pink-400 via-emerald-300 to-yellow-300 bg-clip-text text-2xl font-bold tracking-[0.2em] text-transparent">
                NEON
              </span>
              <span className="block text-[10px] tracking-wider text-slate-400 uppercase">
                Drinks & Snacks
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a
              href="#purpose"
              className="transition-colors hover:text-pink-400"
            >
              Propósito de la App
            </a>
            <a
              href="#features"
              className="transition-colors hover:text-pink-400"
            >
              Funcionalidades
            </a>
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

          <div className="flex items-center gap-3">
            <Link
              href="/club/register"
              className="rounded-xl border border-pink-500/40 px-4 py-2 text-xs font-semibold text-pink-300 transition-colors hover:bg-pink-500/10"
            >
              Neon Club
            </Link>
            <Link
              href="/pos"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-500 to-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-pink-500/20 transition-opacity hover:opacity-95"
            >
              Ingresar al POS
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl space-y-6 px-4 pt-12 pb-16 text-center sm:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-pink-300 uppercase backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          Plataforma Oficial de Gestión & Fidelización
        </div>

        <h1 className="font-display mx-auto max-w-4xl text-4xl leading-tight font-black tracking-tight sm:text-6xl md:text-7xl">
          Bienvenido a{" "}
          <span
            style={{
              background:
                "linear-gradient(90deg, #ff73e3 0%, #3de8c2 50%, #ffd24d 100%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            NEON
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          <strong className="text-white">Neon</strong> es la solución
          tecnológica integral que combina un sistema de{" "}
          <strong className="text-pink-400">Punto de Venta (POS)</strong> de
          alta velocidad para coctelería y snacks con el programa de
          fidelización digital{" "}
          <strong className="text-emerald-400">Neon Club</strong> integrado
          directamente en Google Wallet y Apple Wallet.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/club/register"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-emerald-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-xl shadow-pink-500/25 transition-transform hover:scale-[1.02]"
          >
            <Wallet className="h-4 w-4" />
            Obtener Tarjeta Neon Club
          </Link>
          <Link
            href="/pos"
            className="glass-panel flex items-center gap-2 rounded-2xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:border-pink-500/50 hover:text-pink-300"
          >
            <CupSoda className="h-4 w-4 text-pink-400" />
            Acceder al Sistema POS
          </Link>
        </div>
      </section>

      {/* App Purpose Section (Explicitly Addresses Google Reviewers) */}
      <section id="purpose" className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="glass-panel space-y-8 rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl sm:p-12">
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
              Propósito de la Aplicación Neon
            </h2>
            <p className="text-sm leading-relaxed text-slate-300">
              La plataforma <strong>Neon</strong> está concebida para
              transformar la experiencia del cliente y la eficiencia operativa
              del establecimiento a través de dos módulos interconectados:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Card 1: POS */}
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-pink-500/30">
              <div className="w-fit rounded-xl bg-pink-500/20 p-3 text-pink-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                1. Punto de Venta (Neon POS)
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Herramienta operativa interna que permite a los cajeros y
                administradores registrar pedidos, gestionar inventarios de
                líquidos (dosificación de licor y bases), realizar apertura y
                cierre de cajas financieras y atender a los clientes con alta
                velocidad durante horarios pico.
              </p>
              <ul className="space-y-1.5 pt-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Control dinámico de stock de líquidos y porciones.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Facturación rápida e historial de comandas.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Funcionamiento offline con sincronización PWA.
                </li>
              </ul>
            </div>

            {/* Card 2: Club & Google Wallet */}
            <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-emerald-500/30">
              <div className="w-fit rounded-xl bg-emerald-500/20 p-3 text-emerald-400">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                2. Fidelización (Neon Club)
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Permite a los usuarios registrarse y guardar una tarjeta de
                lealtad digital directamente en{" "}
                <strong className="text-white">Google Wallet</strong> o{" "}
                <strong className="text-white">Apple Wallet</strong>. Cada
                compra acumula sellos digitales bajo la promoción &quot;PAGA 10,
                LLEVA 11&quot;.
              </p>
              <ul className="space-y-1.5 pt-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-pink-400" />
                  Integración oficial con la API de Google Wallet.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-pink-400" />
                  Actualización de sellos y recompensas en tiempo real.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-pink-400" />
                  Acceso sin necesidad de descargar aplicaciones nativas
                  pesadas.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section
        id="features"
        className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-8"
      >
        <div className="space-y-2 text-center">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            Características Principales de Neon
          </h2>
          <p className="text-xs text-slate-400 sm:text-sm">
            Diseñado para ofrecer seguridad, agilidad y transparencia.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="glass-panel space-y-2 rounded-2xl border border-white/10 bg-white/5 p-6">
            <ShieldCheck className="h-6 w-6 text-pink-400" />
            <h4 className="text-sm font-semibold text-white">
              Privacidad Garantizada
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Los datos recolectados se limitan estrictamente a la gestión de
              sellos y transacciones comerciales sin compartirse con terceros.
            </p>
          </div>

          <div className="glass-panel space-y-2 rounded-2xl border border-white/10 bg-white/5 p-6">
            <Smartphone className="h-6 w-6 text-emerald-400" />
            <h4 className="text-sm font-semibold text-white">
              Tarjetas en Google Wallet
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Pases de lealtad nativos compatibles con la plataforma Google Pay
              y Apple Wallet con código QR único por cliente.
            </p>
          </div>

          <div className="glass-panel space-y-2 rounded-2xl border border-white/10 bg-white/5 p-6">
            <Lock className="h-6 w-6 text-yellow-400" />
            <h4 className="text-sm font-semibold text-white">
              Seguridad & Autenticación
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Infraestructura segura con protección de credenciales OAuth de
              Google Cloud y cifrado de datos.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 px-4 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-slate-400 sm:flex-row">
          <div>
            <span className="font-bold text-white">NEON</span> — www.clubneon.co
            © {new Date().getFullYear()}. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="flex items-center gap-1 transition-colors hover:text-pink-400"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Política de Privacidad
            </Link>
            <Link
              href="/terms"
              className="flex items-center gap-1 transition-colors hover:text-pink-400"
            >
              <FileText className="h-3.5 w-3.5" />
              Términos del Servicio
            </Link>
            <Link
              href="/club/register"
              className="transition-colors hover:text-pink-400"
            >
              Registro Club
            </Link>
            <Link href="/pos" className="transition-colors hover:text-pink-400">
              Punto de Venta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
