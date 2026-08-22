import Image from "next/image";
import { LoginForm } from "@/components/auth/login-form";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen px-6 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
      <section className="hidden lg:block">
        <div className="glass-panel-elevated grid-dots rounded-4xl border border-white/10 p-10">
          <div className="flex items-center gap-4">
            <Image
              src="/logo.jpg"
              alt="Neon Logo"
              width={64}
              height={64}
              className="size-16 rounded-2xl border border-white/20 object-cover shadow-[0_0_24px_rgba(255,62,171,0.45)]"
            />
            <div>
              <p className="font-display text-gradient-neon text-3xl font-black tracking-[0.25em]">
                NEON
              </p>
              <p className="font-display text-xs font-bold tracking-[0.35em] text-cyan-400 uppercase">
                Drinks & Concentrados
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <Badge variant="default" className="gap-1.5 px-3 py-1">
              <Zap className="h-3.5 w-3.5" />
              Operaciones Rápidas
            </Badge>
            <h1 className="font-display text-4xl leading-tight font-black text-white">
              POS ultrarrápido, inventario simple y cierre de caja sin fricción.
            </h1>
            <p className="text-muted-foreground max-w-lg text-sm leading-relaxed sm:text-base">
              Diseñado para vender bebidas congeladas en menos de 10 segundos
              por pedido, incluso con conexión inestable.
            </p>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center">
        <LoginForm />
      </section>
    </main>
  );
}
