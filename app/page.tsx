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
      className="min-h-screen text-slate-100 font-sans selection:bg-pink-500 selection:text-white"
      style={{
        background:
          "radial-gradient(ellipse at top, #1c0536 0%, #090014 60%, #04000a 100%)",
      }}
    >
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#090014]/80 backdrop-blur-xl px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-emerald-400 p-0.5 shadow-[0_0_20px_rgba(255,115,227,0.4)]">
              <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                <CupSoda className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <div>
              <span className="font-display font-bold text-2xl tracking-[0.2em] bg-gradient-to-r from-pink-400 via-emerald-300 to-yellow-300 bg-clip-text text-transparent">
                NEON
              </span>
              <span className="block text-[10px] text-slate-400 tracking-wider uppercase">
                Drinks & Snacks
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-300">
            <a href="#purpose" className="hover:text-pink-400 transition-colors">
              Propósito de la App
            </a>
            <a href="#features" className="hover:text-pink-400 transition-colors">
              Funcionalidades
            </a>
            <Link href="/privacy" className="hover:text-pink-400 transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="hover:text-pink-400 transition-colors">
              Términos
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/club/register"
              className="text-xs font-semibold px-4 py-2 rounded-xl border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 transition-colors"
            >
              Neon Club
            </Link>
            <Link
              href="/pos"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-emerald-400 text-slate-950 hover:opacity-95 transition-opacity shadow-lg shadow-pink-500/20 flex items-center gap-1.5"
            >
              Ingresar al POS
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 pt-12 pb-16 max-w-6xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-pink-500/30 text-pink-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          Plataforma Oficial de Gestión & Fidelización
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight font-display max-w-4xl mx-auto leading-tight">
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

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          <strong className="text-white">Neon</strong> es la solución tecnológica integral que combina un sistema de <strong className="text-pink-400">Punto de Venta (POS)</strong> de alta velocidad para coctelería y snacks con el programa de fidelización digital <strong className="text-emerald-400">Neon Club</strong> integrado directamente en Google Wallet y Apple Wallet.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/club/register"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-pink-500/25 hover:scale-[1.02] transition-transform flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            Obtener Tarjeta Neon Club
          </Link>
          <Link
            href="/pos"
            className="px-6 py-3.5 rounded-2xl glass-panel border border-white/20 text-white font-semibold text-sm hover:border-pink-500/50 hover:text-pink-300 transition-all flex items-center gap-2"
          >
            <CupSoda className="w-4 h-4 text-pink-400" />
            Acceder al Sistema POS
          </Link>
        </div>
      </section>

      {/* App Purpose Section (Explicitly Addresses Google Reviewers) */}
      <section id="purpose" className="px-4 sm:px-8 py-12 max-w-6xl mx-auto">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
              Propósito de la Aplicación Neon
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              La plataforma <strong>Neon</strong> está concebida para transformar la experiencia del cliente y la eficiencia operativa del establecimiento a través de dos módulos interconectados:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: POS */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-pink-500/30 transition-colors">
              <div className="p-3 rounded-xl bg-pink-500/20 w-fit text-pink-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">1. Punto de Venta (Neon POS)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Herramienta operativa interna que permite a los cajeros y administradores registrar pedidos, gestionar inventarios de líquidos (dosificación de licor y bases), realizar apertura y cierre de cajas financieras y atender a los clientes con alta velocidad durante horarios pico.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Control dinámico de stock de líquidos y porciones.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Facturación rápida e historial de comandas.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Funcionamiento offline con sincronización PWA.
                </li>
              </ul>
            </div>

            {/* Card 2: Club & Google Wallet */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 hover:border-emerald-500/30 transition-colors">
              <div className="p-3 rounded-xl bg-emerald-500/20 w-fit text-emerald-400">
                <Wallet className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">2. Fidelización (Neon Club)</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Permite a los usuarios registrarse y guardar una tarjeta de lealtad digital directamente en <strong className="text-white">Google Wallet</strong> o <strong className="text-white">Apple Wallet</strong>. Cada compra acumula sellos digitales bajo la promoción &quot;PAGA 10, LLEVA 11&quot;.
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  Integración oficial con la API de Google Wallet.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  Actualización de sellos y recompensas en tiempo real.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
                  Acceso sin necesidad de descargar aplicaciones nativas pesadas.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section id="features" className="px-4 sm:px-8 py-12 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Características Principales de Neon
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Diseñado para ofrecer seguridad, agilidad y transparencia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-panel border border-white/10 bg-white/5 space-y-2">
            <ShieldCheck className="w-6 h-6 text-pink-400" />
            <h4 className="font-semibold text-white text-sm">Privacidad Garantizada</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Los datos recolectados se limitan estrictamente a la gestión de sellos y transacciones comerciales sin compartirse con terceros.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10 bg-white/5 space-y-2">
            <Smartphone className="w-6 h-6 text-emerald-400" />
            <h4 className="font-semibold text-white text-sm">Tarjetas en Google Wallet</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pases de lealtad nativos compatibles con la plataforma Google Pay y Apple Wallet con código QR único por cliente.
            </p>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10 bg-white/5 space-y-2">
            <Lock className="w-6 h-6 text-yellow-400" />
            <h4 className="font-semibold text-white text-sm">Seguridad & Autenticación</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Infraestructura segura con protección de credenciales OAuth de Google Cloud y cifrado de datos.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 px-4 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <span className="font-bold text-white">NEON</span> — www.clubneon.co © {new Date().getFullYear()}. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-pink-400 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Política de Privacidad
            </Link>
            <Link href="/terms" className="hover:text-pink-400 transition-colors flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              Términos del Servicio
            </Link>
            <Link href="/club/register" className="hover:text-pink-400 transition-colors">
              Registro Club
            </Link>
            <Link href="/pos" className="hover:text-pink-400 transition-colors">
              Punto de Venta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
