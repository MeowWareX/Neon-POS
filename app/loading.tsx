export default function RootLoading() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="glass-panel neon-ring w-full max-w-sm rounded-[2rem] border border-white/10 p-8 text-center">
        <p className="font-display text-primary text-3xl tracking-[0.3em]">
          NEON OS
        </p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/8">
          <div className="from-primary via-secondary to-accent h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r" />
        </div>
        <p className="text-muted mt-4 text-sm">Cargando estación de venta...</p>
      </div>
    </main>
  );
}
