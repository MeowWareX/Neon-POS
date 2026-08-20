"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function ClubRegisterPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/loyalty/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, email: email || undefined }),
      });

      if (res.status === 403) {
        const data = await res.json();
        setMessage({ text: data.error, type: "error" });
        return;
      }

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const data = await res.json();
      const passToken = data?.pass?.passToken ?? data?.pass?.pass_token;
      if (!passToken) {
        throw new Error("No passToken returned");
      }
      // Redirect to loyalty card page
      window.location.href = `/club/${passToken}`;
    } catch {
      setMessage({
        text: "Error al registrar. Intenta de nuevo.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="grid-dots flex min-h-screen items-center justify-center p-6"
      style={{
        background:
          "linear-gradient(180deg, #090014 0%, #0f0320 45%, #05010d 100%)",
      }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <h1
            className="font-display text-5xl tracking-tight"
            style={{
              background: "linear-gradient(90deg, #ff73e3, #3de8c2, #ffd24d)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            NEON CLUB
          </h1>
          <p className="text-muted text-sm">
            Tu tarjeta de fidelización digital. Acumula 10 sellos y obtén un
            raspado gratis.
          </p>
        </div>

        {/* Registration Form */}
        <Card
          style={{
            border: "rgba(255, 115, 227, 0.2)",
            boxShadow: "0 0 40px rgba(255, 115, 227, 0.15)",
          }}
        >
          <CardHeader>
            <CardTitle style={{ color: "#ff73e3" }}>Únete al Club</CardTitle>
            <CardDescription>
              Ingresa tus datos para activar tu tarjeta virtual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-muted text-sm">
                  Nombre completo
                </label>
                <Input
                  id="fullName"
                  placeholder="Tu nombre"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{ borderColor: "rgba(255, 115, 227, 0.3)" }}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-muted text-sm">
                  Celular
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Ej: 3112345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{ borderColor: "rgba(61, 232, 194, 0.3)" }}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-muted text-sm">
                  Email (opcional)
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderColor: "rgba(61, 232, 194, 0.3)" }}
                />
              </div>

              {message && (
                <div
                  className="rounded-xl px-4 py-3 text-sm"
                  style={{
                    background:
                      message.type === "error"
                        ? "rgba(255, 85, 119, 0.15)"
                        : "rgba(77, 255, 191, 0.1)",
                    color: message.type === "error" ? "#ff5577" : "#4dffbf",
                  }}
                >
                  {message.text}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
                style={{
                  background: "linear-gradient(90deg, #ff73e3, #3de8c2)",
                }}
              >
                {loading ? "Registrando..." : "Activar mi tarjeta"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer info */}
        <div className="space-y-4 text-center">
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
