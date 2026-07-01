import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
      <section className="hidden lg:block">
        <div className="glass-panel grid-dots rounded-[2.5rem] border border-white/10 p-10">
          <div className="flex items-center gap-4">
            <img
              src="/logo.jpg"
              alt="Neon Logo"
              className="size-16 rounded-2xl border border-white/20 object-cover shadow-[0_0_24px_rgba(255,79,216,0.45)]"
            />
            <div>
              <p className="font-display text-primary text-2xl tracking-[0.25em]">
                NEON
              </p>
              <p className="font-display text-secondary text-xs tracking-[0.35em] uppercase">
                Drinks & Snacks
              </p>
            </div>
          </div>
          <h1 className="mt-8 max-w-xl text-5xl leading-tight font-semibold">
            POS ultrarrápido, inventario simple y cierre de caja sin fricción.
          </h1>
          <p className="text-muted mt-5 max-w-lg text-base leading-7">
            Diseñado para vender bebidas congeladas en menos de 10 segundos por
            pedido, incluso con conexión inestable.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <LoginForm />
      </section>
    </main>
  );
}
