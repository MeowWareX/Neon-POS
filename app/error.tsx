"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="glass-panel border-destructive/30 max-w-lg rounded-[2rem] border p-8">
        <div className="text-destructive flex items-center gap-3">
          <AlertTriangle className="size-8" />
          <h1 className="font-display text-2xl tracking-[0.2em] uppercase">
            Error crítico
          </h1>
        </div>
        <p className="text-muted mt-4 text-sm leading-6">
          Algo falló en la app. Puedes reiniciar la vista sin perder los datos
          locales guardados en este dispositivo.
        </p>
        <Button className="mt-6" onClick={reset}>
          <RotateCcw className="size-4" />
          Reintentar
        </Button>
      </div>
    </main>
  );
}
