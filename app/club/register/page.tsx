"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

type Step = "phone" | "details";

export default function ClubRegisterPage() {
  const [step, setStep] = useState<Step>("phone");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [checking, setChecking] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalizedPhone = () => phone.replace(/[\s-]/g, "");

  // Step 1: check if the phone already has a card
  const handlePhoneCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setMessage(null);

    try {
      const res = await fetch(
        `/api/loyalty/lookup?phone=${encodeURIComponent(normalizedPhone())}`,
      );

      if (res.ok) {
        const data = await res.json();
        if (data?.passToken) {
          // Already registered -> straight to their card
          window.location.href = `/club/${data.passToken}`;
          return;
        }
        // Customer exists but has no web pass yet: pre-fill and let them finish
        setFullName(data.fullName ?? "");
      }

      setStep("details");
    } catch {
      setMessage({
        text: "No pudimos verificar tu número. Intenta de nuevo.",
        type: "error",
      });
    } finally {
      setChecking(false);
    }
  };

  // Step 2: complete registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/loyalty/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone: normalizedPhone(),
          email: email || undefined,
        }),
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
    <div className="grid-dots bg-background relative min-h-dvh overflow-hidden">
      {/* Ambient glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at 50% -20%, rgba(255, 62, 171, 0.35), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at 50% 120%, rgba(0, 240, 255, 0.25), transparent 70%)",
        }}
      />

      <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center px-5 py-10 sm:max-w-md sm:py-14">
        {/* Brand mark */}
        <header className="space-y-4 text-center">
          <div className="mx-auto flex justify-center">
            <div className="size-16 overflow-hidden rounded-2xl bg-gradient-to-tr from-pink-500 to-cyan-400 p-0.5 shadow-[0_0_24px_rgba(255,62,171,0.4)]">
              <Image
                src="/logo.jpg"
                alt="NEON CLUB"
                width={64}
                height={64}
                className="h-full w-full rounded-[14px] object-cover"
                priority
              />
            </div>
          </div>
          <div className="space-y-2">
            <Badge variant="default" className="gap-1.5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              Programa VIP
            </Badge>
            <h1 className="font-display text-gradient-neon text-3xl font-bold tracking-[0.08em] sm:text-4xl">
              NEON CLUB
            </h1>
            <p className="text-muted-foreground mx-auto max-w-xs text-xs leading-relaxed sm:text-sm">
              Tu tarjeta de fidelización digital. Acumula 10 sellos y obtén un
              granizado gratis.
            </p>
          </div>
        </header>

        {/* Wizard card */}
        <section className="glass-panel-elevated mt-6 w-full rounded-3xl border border-white/15 p-6 shadow-[0_0_40px_rgba(255,62,171,0.15)] sm:mt-8 sm:p-7">
          {step === "phone" ? (
            <div key="step-phone" className="step-enter">
              <h2 className="text-lg font-bold text-white">
                Ingresa tu celular
              </h2>
              <p className="text-muted mt-1 text-sm">
                Verificamos si ya tienes tarjeta; si no, creamos una en
                segundos.
              </p>

              <form onSubmit={handlePhoneCheck} className="mt-6 space-y-4">
                <input type="hidden" name="fakeusernameremembered" />
                <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-muted text-sm">
                    Número de celular
                  </label>
                  <div className="relative">
                    <span className="text-muted pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-base select-none">
                      +57
                    </span>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="3112345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel-national"
                      pattern="[0-9\s\-]{7,15}"
                      title="Solo números, ej: 3112345678"
                      autoFocus
                      required
                      className="pl-14 text-base"
                    />
                  </div>
                </div>

                {message && <MessageBanner message={message} />}

                <Button
                  type="submit"
                  size="lg"
                  disabled={checking}
                  className="w-full text-base font-bold"
                >
                  {checking ? (
                    <>
                      <Spinner />
                      Verificando...
                    </>
                  ) : (
                    "Continuar"
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <div key="step-details" className="step-enter">
              <h2 className="text-lg font-bold text-white">
                Completa tu registro
              </h2>
              <p className="text-muted mt-1 text-sm">
                Últimos datos para activar tu tarjeta.
              </p>

              {/* Phone confirmed chip */}
              <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-white/12 bg-white/5 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-muted text-xs">Tu número</p>
                  <p className="truncate text-base font-semibold text-white">
                    +57 {normalizedPhone()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setMessage(null);
                  }}
                  className="text-secondary shrink-0 rounded-xl border border-white/12 bg-transparent px-3 py-2 text-sm underline-offset-4 transition-colors hover:bg-white/10 hover:underline"
                >
                  Cambiar
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="fullName" className="text-muted text-sm">
                    Nombre completo
                  </label>
                  <Input
                    id="fullName"
                    placeholder="Tu nombre"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    autoCapitalize="words"
                    required
                    className="text-base"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-muted text-sm">
                    Email <span className="text-muted/60">(opcional)</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="text-base"
                  />
                </div>

                {message && <MessageBanner message={message} />}

                <Button
                  type="submit"
                  size="lg"
                  disabled={loading}
                  className="mt-2 w-full text-base font-bold"
                >
                  {loading ? (
                    <>
                      <Spinner />
                      Activando...
                    </>
                  ) : (
                    "Activar mi tarjeta"
                  )}
                </Button>
              </form>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-8 w-full space-y-3 pb-[env(safe-area-inset-bottom)] text-center">
          <p className="text-muted text-xs">
            Acumula 10 sellos · 1 raspado gratis · Sin costos ocultos
          </p>
          <Link
            href="/privacy"
            className="text-muted/70 hover:text-primary inline-block text-xs underline underline-offset-4 transition-colors"
          >
            Política de Privacidad
          </Link>
        </footer>
      </main>
    </div>
  );
}

function MessageBanner({
  message,
}: {
  message: { text: string; type: "success" | "error" };
}) {
  return (
    <div
      role="alert"
      className="rounded-xl border px-4 py-3 text-sm"
      style={
        message.type === "error"
          ? {
              background: "rgba(255, 85, 119, 0.12)",
              borderColor: "rgba(255, 85, 119, 0.35)",
              color: "#ff8099",
            }
          : {
              background: "rgba(77, 255, 191, 0.08)",
              borderColor: "rgba(77, 255, 191, 0.35)",
              color: "#4dffbf",
            }
      }
    >
      {message.text}
    </div>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}
