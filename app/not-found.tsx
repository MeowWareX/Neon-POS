import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="glass-panel max-w-md rounded-[2rem] border border-white/10 p-8 text-center">
        <p className="font-display text-secondary text-5xl">404</p>
        <h1 className="mt-3 text-2xl font-semibold">Ruta no encontrada</h1>
        <p className="text-muted mt-3 text-sm leading-6">
          La pantalla que buscas no existe o fue movida.
        </p>
        <Button asChild className="mt-6">
          <Link href="/pos">Volver al POS</Link>
        </Button>
      </div>
    </main>
  );
}
