"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLoyaltyCard } from "@/hooks/use-loyalty-card";
import { QRCodeSVG } from "qrcode.react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check, Smartphone, Gift, History } from "lucide-react";

export function ClubCardPage() {
  const params = useParams<{ passToken: string }>();
  const passToken = params?.passToken ?? "";

  if (!passToken) {
    // Redirect to register if no pass_token passed via URL (deep link)
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-6">
        <div className="space-y-4 text-center">
          <h1 className="font-display text-gradient-neon text-3xl font-bold">
            Tarjeta NEON Club
          </h1>
          <p className="text-muted-foreground text-sm">
            Entra a tu tarjeta desde la app de Neón o usa tu código QR.
          </p>
          <Button asChild variant="default" size="sm">
            <Link href="/club/register">Registrar Tarjeta</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <LoyaltyCardInner passToken={passToken} />;
}

function LoyaltyCardInner({ passToken }: { passToken: string }) {
  const { customer, recentLogs, loading, error, load } =
    useLoyaltyCard(passToken);

  const [walletLoading, setWalletLoading] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  async function handleGoogleWallet() {
    setWalletLoading(true);
    try {
      const response = await fetch(`/api/loyalty/google-pass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passToken }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "No se pudo generar el pase");
      }

      window.open(payload.saveUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Google Wallet error:", err);
      const message =
        err instanceof Error && err.message && err.message !== "Failed to fetch"
          ? err.message
          : "Asegúrate de estar conectado e intenta de nuevo.";
      alert(`No se pudo generar tu tarjeta de Google Wallet: ${message}`);
    } finally {
      setWalletLoading(false);
    }
  }

  // QR apunta a la propia tarjeta; el POS extrae el pass_token del contenido
  const qrUrl = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") ?? "";
    return `${base}/club/${passToken}`;
  }, [passToken]);

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-6">
        <div className="text-muted-foreground flex items-center gap-3 text-sm">
          <span className="size-4 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
          <span>Cargando tu tarjeta VIP...</span>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-6">
        <div className="max-w-sm space-y-4 text-center">
          <Badge variant="destructive" size="lg">
            Error
          </Badge>
          <h1 className="font-display text-2xl font-bold text-white">
            Tarjeta no encontrada
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Verifica que el código QR o enlace sea válido.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/club/register">Crear Nueva Tarjeta</Link>
          </Button>
        </div>
      </div>
    );
  }

  const remainingStamps = Math.max(0, 10 - customer.stampsCount);

  return (
    <div className="grid-dots bg-background min-h-screen p-4 sm:p-6">
      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Header */}
        <div className="space-y-2 pt-4 text-center">
          <Badge variant="default" className="gap-1.5 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" />
            Tarjeta VIP Digital
          </Badge>
          <h1 className="font-display text-gradient-neon text-3xl font-black tracking-tight sm:text-4xl">
            NEON CLUB
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Programa de Fidelización Digital
          </p>
        </div>

        {/* Main Loyalty Card */}
        <Card
          variant="elevated"
          className="relative overflow-hidden border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.15)]"
        >
          {/* Glossy gradient at top */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-36"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 62, 171, 0.15) 0%, transparent 100%)",
            }}
          />

          <CardHeader className="relative z-10 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display text-xl font-bold text-white">
                  {customer.fullName}
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs font-semibold text-emerald-400">
                  {remainingStamps === 0
                    ? "🎉 ¡TIENES UN PREMIO DISPONIBLE!"
                    : `✨ Faltan ${remainingStamps} sellos para tu premio`}
                </CardDescription>
              </div>
              <Badge variant="success" size="sm">
                {customer.stampsCount}/10 Sellos
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-6">
            {/* Stamp grid */}
            <div className="grid grid-cols-5 gap-3 rounded-2xl border border-white/8 bg-white/4 p-4">
              {Array.from({ length: 10 }, (_, i) => {
                const filled = i < customer.stampsCount;
                return (
                  <div
                    key={i}
                    className={`font-display flex aspect-square items-center justify-center rounded-xl font-bold transition-all duration-300 ${
                      filled
                        ? "scale-105 bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-[0_0_14px_rgba(16,185,129,0.5)]"
                        : "border border-pink-500/25 bg-white/3 text-pink-300/60"
                    }`}
                  >
                    {filled ? (
                      <Check className="h-5 w-5 stroke-[3]" />
                    ) : (
                      <span className="text-xs">{i + 1}</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* QR Code */}
            <div className="space-y-3">
              <p className="text-muted-foreground text-center text-xs">
                Muestra este código QR en el mostrador para sumar sellos
              </p>
              <div className="flex justify-center">
                <div className="rounded-2xl border border-white/20 bg-white p-4 shadow-[0_0_30px_rgba(0,240,255,0.25)]">
                  <QRCodeSVG
                    value={qrUrl}
                    size={170}
                    fgColor="#070010"
                    bgColor="transparent"
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>
            </div>

            {/* Info section */}
            <div className="text-muted-foreground space-y-2 rounded-xl border border-white/6 bg-white/3 p-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Smartphone className="h-3.5 w-3.5 text-cyan-400" />
                  Celular:
                </span>
                <span className="font-mono text-white">{customer.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Gift className="h-3.5 w-3.5 text-pink-400" />
                  Premios Canjeados:
                </span>
                <span className="font-bold text-emerald-400">
                  {customer.totalRewardsClaimed}
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <Button
              variant="emerald"
              size="lg"
              className="w-full font-bold"
              onClick={handleGoogleWallet}
              disabled={walletLoading}
            >
              <Smartphone className="h-4 w-4" />
              <span>
                {walletLoading
                  ? "Generando pase..."
                  : "Guardar en Google Wallet"}
              </span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent activity */}
        {recentLogs.length > 0 && (
          <Card variant="interactive">
            <CardHeader className="px-5 py-3">
              <CardTitle className="flex items-center gap-2 text-sm font-bold text-white">
                <History className="h-4 w-4 text-cyan-400" />
                Historial de Visitas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 px-5 pb-4">
              {recentLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between border-b border-white/5 py-2 text-xs last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span>{log.rewardRedeemed ? "🎁" : "✨"}</span>
                    <span className="text-white">
                      {log.rewardRedeemed
                        ? "Premio canjeado"
                        : `${log.stampsAdded} sello(s) ganados`}
                    </span>
                  </div>
                  <span className="text-muted-foreground font-mono">
                    {new Date(log.createdAt).toLocaleDateString("es-CO")}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Footer terms */}
        <div className="space-y-4 pb-8 text-center">
          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-3 text-xs">
            <span>Punto Físico Cartagena</span>
            <span>•</span>
            <span>PAGA 10, LLEVA 11</span>
            <span>•</span>
            <Link
              href="/privacy"
              className="underline transition-colors hover:text-pink-400"
            >
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
