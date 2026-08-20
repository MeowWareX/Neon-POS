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

export function ClubCardPage() {
  const params = useParams<{ passToken: string }>();
  const passToken = params?.passToken ?? "";

  if (!passToken) {
    // Redirect to register if no pass_token passed via URL (deep link)
    return (
      <div
        className="flex min-h-screen items-center justify-center p-6"
        style={{
          background:
            "linear-gradient(180deg, #090014 0%, #0f0320 45%, #05010d 100%)",
        }}
      >
        <div className="space-y-4 text-center">
          <h1
            className="font-display text-3xl"
            style={{
              background: "linear-gradient(90deg, #ff73e3, #3de8c2)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Tarjeta NEON Club
          </h1>
          <p className="text-muted">
            Entra a tu tarjeta desde la app de Neón o usa tu código QR.
          </p>
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
      alert("No se pudo generar tu tarjeta de Google Wallet.");
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
      <div
        className="flex min-h-screen items-center justify-center p-6"
        style={{
          background:
            "linear-gradient(180deg, #090014 0%, #0f0320 45%, #05010d 100%)",
        }}
      >
        <div className="text-muted text-center">Cargando tu tarjeta...</div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div
        className="flex min-h-screen items-center justify-center p-6"
        style={{
          background:
            "linear-gradient(180deg, #090014 0%, #0f0320 45%, #05010d 100%)",
        }}
      >
        <div className="space-y-4 text-center">
          <h1 className="font-display text-3xl" style={{ color: "#ff5577" }}>
            Tarjeta no encontrada
          </h1>
          <p className="text-muted">Verifica que el código QR sea válido.</p>
        </div>
      </div>
    );
  }

  const remainingStamps = Math.max(0, 10 - customer.stampsCount);

  return (
    <div
      className="grid-dots min-h-screen p-4 sm:p-6"
      style={{
        background:
          "linear-gradient(180deg, #090014 0%, #0f0320 45%, #05010d 100%)",
      }}
    >
      <div className="mx-auto w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1
            className="font-display text-4xl tracking-tight sm:text-5xl"
            style={{
              background: "linear-gradient(90deg, #ff73e3, #3de8c2, #ffd24d)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            NEON CLUB
          </h1>
          <p className="text-muted text-sm">Tarjeta de Fidelización Digital</p>
        </div>

        {/* Main Loyalty Card */}
        <Card
          className="relative overflow-hidden"
          style={{
            borderColor: "rgba(61, 232, 194, 0.3)",
            boxShadow:
              "0 0 50px rgba(61, 232, 194, 0.2), 0 0 100px rgba(255, 115, 227, 0.1)",
          }}
        >
          {/* Glossy gradient at top */}
          <div
            className="absolute inset-x-0 top-0 h-48"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 115, 227, 0.12) 0%, transparent 100%)",
            }}
          />

          <CardHeader className="relative z-10 pt-8">
            <CardTitle style={{ color: "#ffd24d" }}>
              {customer.fullName}
            </CardTitle>
            <CardDescription>
              ✨ +{remainingStamps} sellos para tu recompensa
            </CardDescription>
          </CardHeader>

          <CardContent className="relative z-10 space-y-8">
            {/* Stamp grid */}
            <div
              className="grid grid-cols-5 gap-4 rounded-2xl p-6"
              style={{ background: "rgba(255, 115, 227, 0.05)" }}
            >
              {Array.from({ length: 10 }, (_, i) => {
                const filled = i < customer.stampsCount;
                const color = filled ? "#3de8c2" : "#ffd24d";
                return (
                  <div
                    key={i}
                    className="flex aspect-square items-center justify-center rounded-xl text-2xl font-bold transition-all"
                    style={{
                      background: filled
                        ? "linear-gradient(135deg, rgba(61, 232, 194, 0.3), rgba(255, 115, 227, 0.2))"
                        : "rgba(255, 255, 255, 0.04)",
                      color,
                      boxShadow: filled
                        ? `0 0 16px rgba(61, 232, 194, ${0.3 + (i / 10) * 0.4})`
                        : "none",
                      border: filled
                        ? "none"
                        : "2px solid rgba(255, 115, 227, 0.2)",
                      fontSize: filled ? "28px" : "20px",
                    }}
                  >
                    {filled ? "✓" : i + 1}
                  </div>
                );
              })}
            </div>

            {/* QR Code */}
            <div className="space-y-3">
              <p className="text-muted text-center text-xs">
                Muestra este código QR al cajero para sumar sellos
              </p>
              <div className="flex justify-center">
                <div
                  className="rounded-2xl p-4"
                  style={{
                    background: "white",
                    boxShadow: "0 0 30px rgba(61, 232, 194, 0.3)",
                  }}
                >
                  <QRCodeSVG
                    value={qrUrl}
                    size={180}
                    fgColor="#090014"
                    bgColor="transparent"
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>
            </div>

            {/* Info section */}
            <div className="space-y-3 pt-2">
              <div className="text-muted flex items-center gap-3 text-sm">
                <span>📱</span>
                <span className="font-mono">{customer.phone}</span>
                {customer.email && (
                  <>
                    <span>•</span>
                    <span className="font-mono">{customer.email}</span>
                  </>
                )}
              </div>
              <div className="text-muted flex items-center gap-3 text-sm">
                <span>💎</span>
                <span>
                  Sellos acumulados:{" "}
                  <strong className="text-white">
                    {customer.totalRewardsClaimed}
                  </strong>
                </span>
              </div>
            </div>

            <style jsx>{`
              @keyframes glow {
                0%,
                100% {
                  opacity: 0.6;
                }
                50% {
                  opacity: 1;
                }
              }
            `}</style>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all"
                style={{
                  background: "rgba(55, 214, 255, 0.15)",
                  color: "#3de8c2",
                  border: "1px solid rgba(61, 232, 194, 0.3)",
                  opacity: walletLoading ? 0.6 : 1,
                  cursor: walletLoading ? "wait" : "pointer",
                }}
                onClick={handleGoogleWallet}
                disabled={walletLoading}
              >
                {walletLoading ? "Generando..." : "📱 Google Wallet"}
              </button>
              <button
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all"
                style={{
                  background: "rgba(55, 214, 255, 0.15)",
                  color: "#3de8c2",
                  border: "1px solid rgba(61, 232, 194, 0.3)",
                }}
              >
                🍎 Apple Wallet
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        {recentLogs.length > 0 && (
          <Card style={{ borderColor: "rgba(133, 93, 255, 0.2)" }}>
            <CardHeader>
              <CardTitle style={{ color: "#3de8c2" }}>Historial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentLogs.slice(0, 5).map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 text-sm"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-center gap-2">
                    <span>{log.rewardRedeemed ? "🎁" : "✨"}</span>
                    <span>
                      {log.rewardRedeemed
                        ? "Premio canjeado"
                        : `${log.stampsAdded} sello(s) ganados`}
                    </span>
                  </div>
                  <span className="text-muted text-xs">
                    {new Date(log.createdAt).toLocaleDateString("es-CO")}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Footer terms */}
        <div className="space-y-4 pb-8 text-center">
          <div className="text-muted flex flex-wrap items-center justify-center gap-4 text-xs">
            <span>Acepta tarjetas</span>
            <span>•</span>
            <span>PAGA 10, LLEVA 11</span>
            <span>•</span>
            <Link
              href="/privacy"
              className="underline transition-colors hover:text-pink-400"
            >
              Política de Privacidad
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
