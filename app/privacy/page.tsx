import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  Database,
  UserCheck,
  FileText,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Smartphone,
  Wallet,
  Cookie,
  Bell,
} from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | Neon",
  description:
    "Política de Privacidad y Tratamiento de Datos Personales de Neon POS y el programa de fidelización Neon Club (Google Wallet & Apple Wallet).",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "19 de Agosto, 2026";

  return (
    <div
      className="min-h-screen p-4 font-sans text-slate-100 selection:bg-pink-500 selection:text-white sm:p-6 md:p-10"
      style={{
        background:
          "radial-gradient(ellipse at top, #18052e 0%, #090014 60%, #04000a 100%)",
      }}
    >
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header / Nav */}
        <header className="flex flex-col items-start justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="glass-panel inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-slate-300 transition-all hover:border-pink-500/50 hover:text-pink-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Neon
            </Link>
            <div className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="Logo Neon"
                width={28}
                height={28}
                className="size-7 rounded-lg object-cover"
              />
              <span className="font-display text-sm font-bold text-white tracking-wider">
                Neon
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400"></span>
            <span className="font-mono text-xs text-slate-400">
              Vigente desde: {lastUpdated}
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <div className="space-y-4 py-6 text-center">
          <div className="flex justify-center pb-2">
            <Image
              src="/logo.jpg"
              alt="Logo Neon"
              width={72}
              height={72}
              className="size-18 rounded-2xl object-cover shadow-[0_0_30px_rgba(255,115,227,0.4)]"
            />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold tracking-widest text-pink-400 uppercase">
            <ShieldCheck className="h-4 w-4" />
            Protección de Datos & Privacidad
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
            POLÍTICA DE PRIVACIDAD
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            En <strong className="text-white">NEON Drinks & Snacks</strong>{" "}
            (operador del sistema{" "}
            <strong className="text-pink-400">NEON POS</strong> y el programa de
            fidelización <strong className="text-emerald-400">NEON Club</strong>
            ), respetamos y protegemos la privacidad de nuestros clientes,
            usuarios y visitantes.
          </p>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="glass-panel space-y-2 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="w-fit rounded-xl bg-pink-500/20 p-2.5 text-pink-400">
              <UserCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Transparencia Total
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              Solo recopilamos los datos estrictamente necesarios para gestionar
              tus sellos, beneficios y compras.
            </p>
          </div>

          <div className="glass-panel space-y-2 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="w-fit rounded-xl bg-emerald-500/20 p-2.5 text-emerald-400">
              <Wallet className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Google & Apple Wallet
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              Tus pases virtuales están protegidos y cumplen con los más altos
              estándares de privacidad de Google y Apple.
            </p>
          </div>

          <div className="glass-panel space-y-2 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
            <div className="w-fit rounded-xl bg-cyan-500/20 p-2.5 text-cyan-400">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              Cifrado & Seguridad
            </h3>
            <p className="text-xs leading-relaxed text-slate-300">
              No vendemos ni comercializamos tus datos personales con ninguna
              entidad o tercero publicitario.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <main className="glass-panel space-y-8 rounded-3xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl sm:p-8">
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-pink-400">
              <FileText className="h-5 w-5 shrink-0" />
              <h2 className="text-lg font-semibold tracking-wide text-white uppercase">
                1. Identificación del Responsable
              </h2>
            </div>
            <p className="pl-8 text-sm leading-relaxed text-slate-300">
              El responsable del tratamiento de los datos recolectados a través
              de esta plataforma web, la aplicación de Punto de Venta (POS) y
              las tarjetas de fidelización digitales es{" "}
              <strong>NEON Drinks & Snacks</strong>, bajo la representación de{" "}
              <strong>Oscar Castro</strong> (en adelante &quot;NEON&quot;),
              disponible a través de{" "}
              <a
                href="https://www.clubneon.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 underline hover:text-pink-300"
              >
                www.clubneon.co
              </a>
              .
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-emerald-400">
              <Database className="h-5 w-5 shrink-0" />
              <h2 className="text-lg font-semibold tracking-wide text-white uppercase">
                2. Información que Recopilamos
              </h2>
            </div>
            <div className="space-y-3 pl-8 text-sm leading-relaxed text-slate-300">
              <p>
                Recopilamos información personal en las siguientes situaciones:
              </p>
              <ul className="list-inside list-disc space-y-2 text-slate-300">
                <li>
                  <strong className="text-white">
                    Registro en NEON Club (Programa de Fidelización):
                  </strong>{" "}
                  Nombre completo, número de teléfono móvil (para identificación
                  y envío de sellos) y opcionalmente dirección de correo
                  electrónico.
                </li>
                <li>
                  <strong className="text-white">
                    Pases Digitales (Google Wallet y Apple Wallet):
                  </strong>{" "}
                  Identificador único del pase (
                  <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-pink-300">
                    pass_token
                  </code>
                  ), conteo de sellos acumulados y estado de recompensas activas
                  (&quot;PAGA 10, LLEVA 11&quot;).
                </li>
                <li>
                  <strong className="text-white">
                    Transacciones y Pedidos (NEON POS):
                  </strong>{" "}
                  Registro de consumo, productos adquiridos, fecha, hora, monto
                  total y método de pago utilizado (efectivo, Nequi, etc.).
                </li>
                <li>
                  <strong className="text-white">
                    Datos Técnicos y Uso Web:
                  </strong>{" "}
                  Dirección IP, tipo de navegador, estado de conexión
                  (Online/Offline PWA) e identificadores de sesión almacenados
                  localmente.
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-cyan-400">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <h2 className="text-lg font-semibold tracking-wide text-white uppercase">
                3. Finalidad del Tratamiento de los Datos
              </h2>
            </div>
            <div className="space-y-2 pl-8 text-sm leading-relaxed text-slate-300">
              <p>
                Los datos personales recolectados son procesados exclusivamente
                para los siguientes fines:
              </p>
              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <span className="mb-1 block text-xs font-medium text-pink-300 uppercase">
                    Fidelización
                  </span>
                  Acumulación y redención de sellos en la promoción &quot;PAGA
                  10, LLEVA 11&quot;.
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <span className="mb-1 block text-xs font-medium text-emerald-300 uppercase">
                    Sincronización de Pases
                  </span>
                  Actualización en tiempo real de pases en Google Wallet y Apple
                  Wallet.
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <span className="mb-1 block text-xs font-medium text-cyan-300 uppercase">
                    Operación Comercial
                  </span>
                  Procesamiento eficiente de comandas y ventas en el punto de
                  atención (POS).
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <span className="mb-1 block text-xs font-medium text-yellow-300 uppercase">
                    Soporte y Seguridad
                  </span>
                  Validación de identidad para evitar fraudes o duplicidad de
                  recompensas.
                </div>
              </div>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-amber-400">
              <Smartphone className="h-5 w-5 shrink-0" />
              <h2 className="text-lg font-semibold tracking-wide text-white uppercase">
                4. Integración con Google Wallet y Apple Wallet
              </h2>
            </div>
            <div className="space-y-3 pl-8 text-sm leading-relaxed text-slate-300">
              <p>
                Al guardar una tarjeta de fidelización de{" "}
                <strong className="text-white">NEON Club</strong> en Google
                Wallet o Apple Wallet:
              </p>
              <ul className="list-inside list-disc space-y-2 text-slate-300">
                <li>
                  Utilizamos la API oficial de{" "}
                  <strong>Google Wallet (Google Pay Business Platform)</strong>{" "}
                  y los servicios de <strong>Apple Wallet (.pkpass)</strong>{" "}
                  para generar y actualizar tu pase digital.
                </li>
                <li>
                  Solo se envían a dichas plataformas los datos indispensables
                  para mostrar tu tarjeta (tu nombre, número de sellos
                  actualizados y un código de barras / QR seguro).
                </li>
                <li>
                  No compartimos datos sensibles ni historiales detallados de
                  compra con terceros. Los términos de servicio de Google LLC y
                  Apple Inc. rigen el uso del contenedor de Wallet en tu
                  dispositivo.
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-purple-400">
              <Lock className="h-5 w-5 shrink-0" />
              <h2 className="text-lg font-semibold tracking-wide text-white uppercase">
                5. Almacenamiento, Seguridad y Transferencia
              </h2>
            </div>
            <div className="space-y-3 pl-8 text-sm leading-relaxed text-slate-300">
              <p>
                Implementamos medidas tecnológicas y organizativas estrictas
                para proteger la información contra acceso no autorizado,
                pérdida, alteración o divulgación:
              </p>
              <ul className="list-inside list-disc space-y-2 text-slate-300">
                <li>
                  Almacenamiento seguro en bases de datos con cifrado de extremo
                  a extremo y conexiones SSL/TLS HTTPS.
                </li>
                <li>
                  Control estricto de acceso basado en roles (
                  <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-pink-300">
                    admin
                  </code>{" "}
                  vs{" "}
                  <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
                    operator
                  </code>
                  ).
                </li>
                <li>
                  No vendemos, cedemos ni alquilamos tus datos personales a
                  empresas de publicidad o terceros ajenos a la operación.
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 6 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-blue-400">
              <ShieldCheck className="h-5 w-5 shrink-0" />
              <h2 className="text-lg font-semibold tracking-wide text-white uppercase">
                6. Derechos del Usuario (Derechos ARCO)
              </h2>
            </div>
            <div className="space-y-3 pl-8 text-sm leading-relaxed text-slate-300">
              <p>Como titular de tus datos personales, tienes derecho a:</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <strong className="block text-xs font-semibold text-white uppercase">
                    Conocer y Acceder
                  </strong>
                  Solicitar detalles sobre la información personal almacenada
                  sobre ti.
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <strong className="block text-xs font-semibold text-white uppercase">
                    Actualizar y Rectificar
                  </strong>
                  Corregir datos inexactos o desactualizados (ej. cambio de
                  número de teléfono).
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <strong className="block text-xs font-semibold text-white uppercase">
                    Suprimir / Cancelar
                  </strong>
                  Solicitar la eliminación de tu registro de fidelización y
                  datos asociados.
                </div>
                <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                  <strong className="block text-xs font-semibold text-white uppercase">
                    Revocar Consentimiento
                  </strong>
                  Retirar el permiso para el procesamiento de tus datos en
                  cualquier momento.
                </div>
              </div>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 7 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-teal-400">
              <Cookie className="h-5 w-5 shrink-0" />
              <h2 className="text-lg font-semibold tracking-wide text-white uppercase">
                7. Almacenamiento Local y Cookies
              </h2>
            </div>
            <div className="space-y-2 pl-8 text-sm leading-relaxed text-slate-300">
              <p>
                Utilizamos{" "}
                <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-pink-300">
                  localStorage
                </code>{" "}
                y soporte PWA únicamente para permitir el funcionamiento fluido
                del sistema en modo sin conexión (offline) y mantener activa la
                sesión del punto de venta. No empleamos cookies de rastreo
                publicitario de terceros.
              </p>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 8 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-pink-400">
              <Bell className="h-5 w-5 shrink-0" />
              <h2 className="text-lg font-semibold tracking-wide text-white uppercase">
                8. Modificaciones a esta Política
              </h2>
            </div>
            <div className="space-y-2 pl-8 text-sm leading-relaxed text-slate-300">
              <p>
                Nos reservamos el derecho de actualizar esta Política de
                Privacidad cuando sea necesario para reflejar cambios en
                nuestras prácticas operativas, legales o reglamentarias.
                Cualquier cambio relevante será publicado en este mismo enlace.
              </p>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 9 */}
          <section className="space-y-3">
            <div className="flex items-center gap-3 text-emerald-400">
              <Mail className="h-5 w-5 shrink-0" />
              <h2 className="text-lg font-semibold tracking-wide text-white uppercase">
                9. Contacto y Atención de Solicitudes
              </h2>
            </div>
            <div className="space-y-3 pl-8 text-sm leading-relaxed text-slate-300">
              <p>
                Para ejercer tus derechos de privacidad, solicitar la
                eliminación de tu cuenta o realizar consultas relativas al
                tratamiento de tus datos, puedes contactarnos a través de los
                siguientes medios oficiales:
              </p>
              <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-emerald-500/10 p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold text-white">
                    NEON Drinks & Snacks — Oscar Castro
                  </p>
                  <p className="text-xs text-slate-400">
                    Atención de Tratamiento de Datos Personales
                  </p>
                  <p className="mt-1 font-mono text-xs text-pink-400">
                    www.clubneon.co
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <a
                    href="mailto:ocastrobeltran@gmail.com"
                    className="inline-flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2 text-xs font-medium text-white shadow-lg shadow-pink-500/25 transition-colors hover:bg-pink-600"
                  >
                    <Mail className="h-4 w-4" />
                    ocastrobeltran@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="space-y-2 border-t border-white/5 py-6 text-center text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} NEON Drinks & Snacks. Todos los
            derechos reservados.
          </p>
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <Link href="/pos" className="transition-colors hover:text-pink-400">
              Punto de Venta (POS)
            </Link>
            <span>•</span>
            <Link
              href="/club/register"
              className="transition-colors hover:text-pink-400"
            >
              NEON Club
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
