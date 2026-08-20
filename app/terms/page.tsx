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
      className="min-h-screen p-4 font-sans text-slate-100 selection:bg-pink-500 selection:text-white sm:p-6 md:p-10"
      style={{
        background:
          "radial-gradient(ellipse at top, #18052e 0%, #090014 60%, #04000a 100%)",
      }}
    >
      <div className="mx-auto max-w-4xl space-y-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link
            href="/"
            className="glass-panel inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 transition-all hover:border-pink-500/50 hover:text-pink-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Neon
          </Link>
          <span className="font-mono text-xs text-slate-400">
            Vigente desde: 19 de Agosto, 2026
          </span>
        </header>

        <div className="space-y-4 py-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-pink-400 uppercase">
            <ShieldCheck className="h-4 w-4" />
            Términos & Condiciones
          </div>
          <h1
            className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl"
            style={{
              background:
                "linear-gradient(90deg, #ff73e3 0%, #3de8c2 50%, #ffd24d 100%)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            TÉRMINOS DEL SERVICIO
          </h1>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-300">
            Condiciones de uso de la plataforma{" "}
            <strong className="text-white">Neon</strong> (POS y programa de
            fidelización Neon Club) en{" "}
            <strong className="text-pink-400">www.clubneon.co</strong>.
          </p>
        </div>

        <main className="glass-panel space-y-6 rounded-3xl border border-white/10 bg-black/40 p-6 text-sm leading-relaxed text-slate-300 backdrop-blur-xl sm:p-8">
          <section className="space-y-2">
            <h2 className="text-base font-semibold tracking-wide text-white uppercase">
              1. Aceptación de los Términos
            </h2>
            <p>
              Al acceder y utilizar la plataforma Neon (disponible en
              www.clubneon.co), el usuario acepta cumplir con estos Términos y
              Condiciones, así como con nuestra Política de Privacidad. Si no
              estás de acuerdo con alguna parte de estos términos, debes
              abstenerte de utilizar nuestros servicios.
            </p>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-2">
            <h2 className="text-base font-semibold tracking-wide text-white uppercase">
              2. Descripción del Servicio
            </h2>
            <p>
              <strong>Neon</strong> provee un sistema de punto de venta (POS)
              para la gestión comercial y operativa de bebidas y snacks, así
              como la emisión de pases de lealtad digitales compatibles con{" "}
              <strong>Google Wallet</strong> y <strong>Apple Wallet</strong>.
            </p>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-2">
            <h2 className="text-base font-semibold tracking-wide text-white uppercase">
              3. Programa de Fidelización Neon Club
            </h2>
            <p>
              Los sellos acumulados en las tarjetas digitales de Neon Club
              representan un beneficio de fidelidad (&quot;PAGA 10, LLEVA
              11&quot;). Carecen de valor monetario en efectivo y son válidos
              exclusivamente para las promociones especificadas en los
              establecimientos oficiales.
            </p>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-2">
            <h2 className="text-base font-semibold tracking-wide text-white uppercase">
              4. Integración con Google Wallet API
            </h2>
            <p>
              La integración con Google Wallet cumple con las políticas y
              estándares de Google Pay Business API. El usuario es responsable
              de mantener la seguridad de sus dispositivos móviles y sus cuentas
              de Google/Apple.
            </p>
          </section>

          <hr className="border-white/10" />

          <section className="space-y-2">
            <h2 className="text-base font-semibold tracking-wide text-white uppercase">
              5. Contacto y Soporte
            </h2>
            <p>
              Para cualquier consulta o soporte relacionado con estos términos,
              contáctanos con Oscar Castro en{" "}
              <a
                href="mailto:ocastrobeltran@gmail.com"
                className="text-pink-400 underline"
              >
                ocastrobeltran@gmail.com
              </a>
              .
            </p>
          </section>
        </main>

        <footer className="border-t border-white/5 py-6 text-center text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} Neon. Todos los derechos reservados.
            www.clubneon.co
          </p>
        </footer>
      </div>
    </div>
  );
}
