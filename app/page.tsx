import Link from "next/link";
import Image from "next/image";
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
  title: "Neon",
  description:
    "Neon es la aplicación oficial de punto de venta (POS) y fidelización digital en Google Wallet para www.clubneon.co.",
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
            <div className="size-11 overflow-hidden rounded-2xl bg-gradient-to-tr from-pink-500 to-emerald-400 p-0.5 shadow-[0_0_20px_rgba(255,115,227,0.4)]">
              <Image
                src="/logo.jpg"
                alt="Logo Neon"
                width={44}
                height={44}
                className="h-full w-full rounded-[14px] object-cover"
                priority
              />
            </div>
            <div>
              <span className="font-display bg-gradient-to-r from-pink-400 via-emerald-300 to-yellow-300 bg-clip-text text-2xl font-bold tracking-[0.2em] text-transparent">
                Neon
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
              Propósito de Neon
            </a>
            <a
              href="#google-compliance"
              className="transition-colors hover:text-pink-400"
            >
              Uso de Google APIs
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
        <div className="flex justify-center pb-2">
          <div className="relative size-24 rounded-3xl bg-gradient-to-tr from-pink-500 via-emerald-400 to-yellow-400 p-1 shadow-[0_0_40px_rgba(255,115,227,0.5)] sm:size-28">
            <Image
              src="/logo.jpg"
              alt="Logo Oficial Neon"
              width={112}
              height={112}
              className="h-full w-full rounded-[22px] object-cover shadow-inner"
              priority
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-pink-300 uppercase backdrop-blur-md">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          Aplicación Oficial Neon — www.clubneon.co
        </div>

        <h1 className="font-display mx-auto max-w-4xl text-5xl leading-tight font-black tracking-tight sm:text-7xl md:text-8xl">
          <span
            style={{
              background:
                "linear-gradient(90deg, #ff73e3 0%, #3de8c2 50%, #ffd24d 100%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Neon
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg font-medium text-pink-300 sm:text-xl">
          Aplicación Oficial de Punto de Venta (POS) y Fidelización Digital
        </p>

        <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          La aplicación Neon es la solución tecnológica de Punto de Venta (POS) y programa de fidelización digital Neon Club con pases interactivos para Google Wallet y Apple Wallet. Su propósito es gestionar ventas, inventario y recompensas de lealtad para Neon Drinks & Snacks.
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

      {/* App Purpose Section (Designed for Google Cloud Verification Reviewers) */}
      <section id="purpose" className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="glass-panel space-y-8 rounded-3xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl sm:p-12">
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <div className="inline-block rounded-full bg-pink-500/10 px-3 py-1 text-xs font-semibold tracking-wider text-pink-400 uppercase">
              Verificación de Aplicación
            </div>
            <h2 className="font-display text-2xl font-bold text-white sm:text-4xl">
              Propósito de la Aplicación Neon
            </h2>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              La aplicación Neon (disponible en{" "}
              <a href="https://www.clubneon.co" className="text-pink-400 hover:underline">
                www.clubneon.co
              </a>
              ) es una plataforma de punto de venta (POS) y fidelización digital diseñada para gestionar las ventas, inventario y lealtad de los clientes de Neon Drinks & Snacks. El propósito de solicitar permisos de Google OAuth 2.0 es únicamente para autenticar al usuario mediante su correo electrónico registrado en Google.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Card 1: POS */}
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-pink-500/30">
              <div className="w-fit rounded-xl bg-pink-500/20 p-3 text-pink-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                1. Punto de Venta (Neon POS)
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Sistema operativo que permite al personal de caja y
                administración registrar comisiones, gestionar inventario de
                licores y bebidas en tiempo real, abrir/cerrar caja y agilizar
                la atención comercial.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  Control de insumos, stock y dosificación.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  Registro ágil de pedidos y facturación.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  Soporte de funcionamiento offline PWA.
                </li>
              </ul>
            </div>

            {/* Card 2: Club & Google Wallet */}
            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-emerald-500/30">
              <div className="w-fit rounded-xl bg-emerald-500/20 p-3 text-emerald-400">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white">
                2. Club de Fidelización (Neon Club)
              </h3>
              <p className="text-xs leading-relaxed text-slate-300">
                Permite a los clientes registrarse y portar su tarjeta de
                lealtad digital en{" "}
                <strong className="text-white">Google Wallet</strong> y{" "}
                <strong className="text-white">Apple Wallet</strong>, sumando
                sellos en la promoción &quot;PAGA 10, LLEVA 11&quot;.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-pink-400" />
                  Emisión y actualización de pases en Google Wallet API.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-pink-400" />
                  Conteo automático de sellos y recompensas activas.
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-pink-400" />
                  Código QR único de identificación por cliente.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Google API Compliance & Usage Disclosure Section */}
      <section
        id="google-compliance"
        className="mx-auto max-w-6xl px-4 py-8 sm:px-8"
      >
        <div className="glass-panel space-y-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-black/40 to-black/60 p-8 backdrop-blur-xl sm:p-10">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-emerald-400 uppercase">
                <ShieldCheck className="h-4 w-4" />
                Declaración de Cumplimiento de Google OAuth & APIs
              </div>
              <h2 className="text-2xl font-bold text-white">
                Uso de Servicios de Google en la Aplicación Neon
              </h2>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-1.5 font-mono text-xs text-pink-300">
              <Image
                src="/logo.jpg"
                alt="Logo Neon"
                width={24}
                height={24}
                className="size-6 rounded-md object-cover"
              />
              <span>App Name: Neon</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 text-xs leading-relaxed text-slate-300 sm:text-sm md:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Lock className="h-4 w-4 text-pink-400" />
                Autenticación Google OAuth 2.0
              </h3>
              <p>
                La aplicación <strong className="text-white">Neon</strong>{" "}
                utiliza Google OAuth 2.0 para permitir a los usuarios iniciar
                sesión de manera rápida y autenticar su correo electrónico al
                registrarse en <strong className="text-white">Neon Club</strong>
                . Los datos obtenidos a través de la autenticación se emplean
                exclusivamente para verificar la identidad del titular.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                <Smartphone className="h-4 w-4 text-emerald-400" />
                Integración con Google Wallet API
              </h3>
              <p>
                La aplicación <strong className="text-white">Neon</strong> se
                conecta con la API de Google Wallet (Google Pay API for Passes)
                para generar, actualizar y sincronizar los pases de lealtad
                digitales directamente en el dispositivo móvil del usuario.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-slate-300">
            <p>
              <strong>Política de Uso Limitado de Datos:</strong> La aplicación{" "}
              <strong className="text-white">Neon</strong> cumple estrictamente
              con la{" "}
              <em>
                Política de Datos de Usuario de los Servicios de API de Google
                (Google API Services User Data Policy)
              </em>
              , incluidos los requisitos de Uso Limitado. No vendemos,
              transferimos ni compartimos datos de usuarios obtenidos mediante
              las API de Google con terceros o plataformas publicitarias.
            </p>
            <p className="mt-3">
              <strong>Otros datos procesados por esta aplicación:</strong><br />
              - Nombre completo del usuario (proporcionado al registrarse)<br />
              - ID de usuario único (para identificar cuentas de empleados/administradores)<br />
              - Dirección IP y timestamp de inicio de sesión (seguridad y auditoría)<br />
              - Datos de inventario, ventas, caja y contabilidad (proporcionados por el personal del negocio)
            </p>
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
            Características de la Aplicación Neon
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
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Logo Neon"
              width={28}
              height={28}
              className="size-7 rounded-lg object-cover"
            />
            <div>
              <span className="font-bold text-white">Neon</span> —
              www.clubneon.co © {new Date().getFullYear()}. Todos los derechos
              reservados.
            </div>
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
