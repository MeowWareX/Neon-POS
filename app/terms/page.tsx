import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos del Servicio | Neon",
  description:
    "Términos y Condiciones del servicio para la plataforma Neon POS y el programa de fidelización Neon Club (www.clubneon.co).",
};

export default function TermsPage() {
  return (
    <div
      className="min-h-screen text-slate-100 p-4 sm:p-6 md:p-10 font-sans selection:bg-pink-500 selection:text-white"
      style={{
        background:
          "radial-gradient(ellipse at top, #18052e 0%, #090014 60%, #04000a 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between pb-6 border-b border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full glass-panel border border-white/10 hover:border-pink-500/50 hover:text-pink-400 transition-all text-slate-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Neon
          </Link>
          <span className="text-xs text-slate-400 font-mono">
            Vigente desde: 19 de Agosto, 2026
          </span>
        </header>

        <div className="text-center space-y-4 py-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Términos & Condiciones
          </div>
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight font-display"
            style={{
              background:
                "linear-gradient(90deg, #ff73e3 0%, #3de8c2 50%, #ffd24d 100%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            TÉRMINOS DEL SERVICIO
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Condiciones de uso de la plataforma <strong className="text-white">Neon</strong> (POS y programa de fidelización Neon Club) en <strong className="text-pink-400">www.clubneon.co</strong>.
          </p>
        </div>

        <main className="space-y-6 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-xl text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white uppercase tracking-wide">
              1. Aceptación de los Términos
            </h2>
            <p>
              Al acceder y utilizar la plataforma Neon (disponible en www.clubneon.co), el usuario acepta cumplir con estos Términos y Condiciones, así como con nuestra Política de Privacidad. Si no estás de acuerdo con alguna parte de estos términos, debes abstenerte de utilizar nuestros servicios.
            </p>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white uppercase tracking-wide">
              2. Descripción del Servicio
            </h2>
            <p>
              <strong>Neon</strong> provee un sistema de punto de venta (POS) para la gestión comercial y operativa de bebidas y snacks, así como la emisión de pases de lealtad digitales compatibles con <strong>Google Wallet</strong> y <strong>Apple Wallet</strong>.
            </p>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white uppercase tracking-wide">
              3. Programa de Fidelización Neon Club
            </h2>
            <p>
              Los sellos acumulados en las tarjetas digitales de Neon Club representan un beneficio de fidelidad (&quot;PAGA 10, LLEVA 11&quot;). Carecen de valor monetario en efectivo y son válidos exclusivamente para las promociones especificadas en los establecimientos oficiales.
            </p>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white uppercase tracking-wide">
              4. Integración con Google Wallet API
            </h2>
            <p>
              La integración con Google Wallet cumple con las políticas y estándares de Google Pay Business API. El usuario es responsable de mantener la seguridad de sus dispositivos móviles y sus cuentas de Google/Apple.
            </p>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-2">
            <h2 className="text-base font-semibold text-white uppercase tracking-wide">
              5. Contacto y Soporte
            </h2>
            <p>
              Para cualquier consulta o soporte relacionado con estos términos, contáctanos en <a href="mailto:soporte@clubneon.co" className="text-pink-400 underline">soporte@clubneon.co</a>.
            </p>
          </section>
        </main>

        <footer className="text-center text-xs text-slate-500 py-6 border-t border-white/5">
          <p>© {new Date().getFullYear()} Neon. Todos los derechos reservados. www.clubneon.co</p>
        </footer>
      </div>
    </div>
  );
}
