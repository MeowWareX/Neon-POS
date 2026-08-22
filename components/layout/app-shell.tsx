"use client";

import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CreditCard,
  CupSoda,
  FlaskConical,
  LogOut,
  Menu,
  ReceiptText,
  Settings2,
  Sparkles,
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
import { logoutUser } from "@/services/auth-service";
import { useState } from "react";

const navItems: Array<{
  href: Route;
  label: string;
  icon: typeof CupSoda;
  adminOnly?: boolean;
}> = [
  {
    href: "/pos" as Route,
    label: "POS",
    icon: CupSoda,
  },
  {
    href: "/orders" as Route,
    label: "Pedidos",
    icon: ReceiptText,
  },
  {
    href: "/cash" as Route,
    label: "Caja",
    icon: Wallet,
  },
  {
    href: "/dashboard" as Route,
    label: "Dashboard",
    icon: BarChart3,
    adminOnly: true,
  },
  {
    href: "/liquid-sales" as Route,
    label: "Ventas Líquidos",
    icon: FlaskConical,
    adminOnly: true,
  },
  {
    href: "/flavors" as Route,
    label: "Sabores",
    icon: Settings2,
    adminOnly: true,
  },
  {
    href: "/inventory" as Route,
    label: "Inventario",
    icon: FlaskConical,
    adminOnly: true,
  },
  {
    href: "/configuration" as Route,
    label: "Configuración",
    icon: Settings2,
    adminOnly: true,
  },
  {
    href: "/accounting" as Route,
    label: "Finanzas",
    icon: CreditCard,
    adminOnly: true,
  },
  {
    href: "/loyalty" as Route,
    label: "Fidelización",
    icon: Sparkles,
    adminOnly: true,
  },
];


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isOnline = useNetworkStatus();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutUser();
    logout();
  };

  const visibleItems = navItems.filter((item) =>
    item.adminOnly ? user?.role === "admin" : true,
  );

  return (
    <div className="grid min-h-screen md:grid-cols-[280px_1fr]">
      <aside className="hidden border-r border-white/10 bg-black/30 p-5 backdrop-blur-xl md:flex md:flex-col">
        <div className="glass-panel rounded-3xl border border-white/10 p-5">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Neon Logo"
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-2xl border border-white/20 object-cover shadow-[0_0_18px_rgba(255,62,171,0.4)]"
            />
            <div>
              <p className="font-display text-gradient-neon text-2xl font-black tracking-[0.2em]">
                NEON
              </p>
              <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                Drinks & Concentrados
              </p>
            </div>
          </div>
          <p className="text-muted-foreground mt-3 text-xs leading-relaxed">
            Fast POS para operación de fin de semana.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant={isOnline ? "success" : "warning"} size="sm">
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <Badge variant="muted" size="sm">
              {user?.role === "admin" ? "Admin" : "Operador"}
            </Badge>
          </div>
        </div>

        <nav className="mt-6 grid gap-1.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all duration-200",
                  active
                    ? "border-pink-500/40 bg-pink-500/15 text-pink-300 shadow-[0_0_18px_rgba(255,62,171,0.2)]"
                    : "text-muted-foreground border-transparent bg-white/2 hover:border-white/10 hover:bg-white/6 hover:text-white",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="glass-panel mt-auto rounded-2xl border border-white/10 p-4">
          <p className="text-xs font-bold text-white">{user?.name}</p>
          <p className="text-muted-foreground mt-0.5 truncate text-xs">
            {user?.email}
          </p>
          <Button
            className="mt-3 w-full text-xs"
            size="sm"
            variant="ghost"
            onClick={handleLogout}
          >
            <LogOut className="size-3.5" />
            Cerrar sesión
          </Button>
          <div className="mt-2 text-center">
            <Link
              href="/privacy"
              className="text-muted-foreground text-[10px] underline underline-offset-4 transition-colors hover:text-pink-400"
            >
              Política de Privacidad
            </Link>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="glass-panel sticky top-0 z-30 border-b border-white/8 px-4 py-3 md:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Image
                src="/logo.jpg"
                alt="Neon Logo"
                width={36}
                height={36}
                className="size-9 rounded-xl border border-white/20 object-cover shadow-[0_0_12px_rgba(255,62,171,0.3)] md:hidden"
              />
              <div>
                <p className="font-display text-gradient-neon text-base font-black tracking-[0.2em] uppercase md:hidden">
                  NEON OS
                </p>
                <p className="text-muted-foreground text-xs">
                  {isOnline ? "Sincronización activa" : "Modo offline activo"}
                </p>
              </div>
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
              <Badge variant={isOnline ? "success" : "warning"} size="sm">
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
                  handleLogout();
                }}
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </Button>
              <div className="mt-2 text-center">
                <Link
                  href="/privacy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-muted hover:text-primary text-[11px] underline transition-colors"
                >
                  Política de Privacidad
                </Link>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
