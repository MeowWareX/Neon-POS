"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  CupSoda,
  LogOut,
  Menu,
  Package,
  ReceiptText,
  Settings2,
  Wallet,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useAuthStore } from "@/stores/auth-store";
import { useState } from "react";

const navItems: Array<{
  href: Route;
  label: string;
  icon: typeof CupSoda;
  adminOnly?: boolean;
}> = [
  { href: "/pos", label: "POS", icon: CupSoda },
  { href: "/orders", label: "Pedidos", icon: ReceiptText },
  { href: "/dashboard", label: "Dashboard", icon: BarChart3, adminOnly: true },
  { href: "/flavors", label: "Sabores", icon: Settings2, adminOnly: true },
  {
    href: "/configuration",
    label: "Configuración",
    icon: Settings2,
    adminOnly: true,
  },
  { href: "/cash", label: "Caja", icon: Wallet },
  // Finanzas and Inventario temporarily hidden for weekend operation
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isOnline = useNetworkStatus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const visibleItems = navItems.filter((item) =>
    item.adminOnly ? user?.role === "admin" : true,
  );

  return (
    <div className="grid min-h-screen md:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-white/10 bg-black/18 p-5 md:flex md:flex-col">
        <div className="glass-panel rounded-4xl border border-white/10 p-5">
          <p className="font-display text-primary text-2xl tracking-[0.3em]">
            NEON
          </p>
          <p className="text-muted mt-2 text-sm">
            Fast POS para operación de fin de semana.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant={isOnline ? "success" : "warning"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <Badge variant="muted">
              {user?.role === "admin" ? "Admin" : "Operador"}
            </Badge>
          </div>
        </div>

        <nav className="mt-6 grid gap-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-[1.4rem] border px-4 py-3 text-sm font-semibold transition-all",
                  active
                    ? "border-primary/40 bg-primary/12 text-white shadow-[0_0_22px_rgba(255,79,216,0.18)]"
                    : "text-muted border-white/8 bg-white/4 hover:bg-white/8 hover:text-white",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="glass-panel mt-auto rounded-[1.75rem] border border-white/10 p-4">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-muted mt-1 text-sm">{user?.email}</p>
          <Button
            className="mt-4 w-full"
            size="sm"
            variant="ghost"
            onClick={logout}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-white/8 bg-[#090014]/80 px-4 py-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-display text-primary text-lg tracking-[0.24em] uppercase md:hidden">
                NEON OS
              </p>
              <p className="text-muted text-sm">
                {isOnline ? "Sincronización activa" : "Modo offline activo"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="md:hidden"
                size="icon"
                variant="ghost"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Abrir menú"
              >
                <Menu className="size-5" />
              </Button>
              <Badge variant={isOnline ? "success" : "warning"}>
                {isOnline ? (
                  <>
                    <Wifi className="mr-1 size-3" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="mr-1 size-3" />
                    Offline
                  </>
                )}
              </Badge>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 pb-6 md:px-8 md:pb-8">
          {children}
        </main>

        <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <DialogContent className="max-w-sm md:hidden">
            <DialogHeader>
              <DialogTitle>Menu</DialogTitle>
              <DialogDescription>
                Accesos rapidos para operacion en punto de venta.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 grid gap-2">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-[1.1rem] border px-4 py-3 text-sm font-semibold transition-all",
                      active
                        ? "border-primary/30 bg-primary/12 text-white"
                        : "text-muted border-white/10 bg-white/5",
                    )}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-5 rounded-[1.2rem] border border-white/10 bg-white/4 p-3">
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-muted mt-1 text-xs">{user?.email}</p>
              <Button
                className="mt-3 w-full"
                size="sm"
                variant="ghost"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
              >
                <LogOut className="size-4" />
                Cerrar sesion
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
