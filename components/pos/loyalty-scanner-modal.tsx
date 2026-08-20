"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Search, Camera } from "lucide-react";
import jsQR from "jsqr";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerInfo {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  stampsCount: number;
  totalRewardsClaimed: number;
  passToken: string;
}

interface LoyaltyScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerFound: (customer: CustomerInfo) => void;
}

export function LoyaltyScannerModal({
  isOpen,
  onClose,
  onCustomerFound,
}: LoyaltyScannerModalProps) {
  const [phone, setPhone] = useState("");
  const [searching, setSearching] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [foundCustomer, setFoundCustomer] = useState<CustomerInfo | null>(null);
  const [error, setError] = useState("");
  const [showResult, setShowResult] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastScanRef = useRef<string>("");

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  }, []);

  const searchByPassToken = useCallback(async (passToken: string) => {
    setSearching(true);
    setError("");

    try {
      const res = await fetch(`/api/loyalty/card/${passToken}`);
      if (!res.ok) throw new Error("Tarjeta no encontrada");
      const data = await res.json();
      setFoundCustomer({
        id: data.customer?.id,
        fullName: data.customer?.fullName ?? data.customer?.full_name,
        phone: data.customer?.phone,
        email: data.customer?.email,
        stampsCount:
          data.customer?.stampsCount ?? data.customer?.stamps_count ?? 0,
        totalRewardsClaimed:
          data.customer?.totalRewardsClaimed ??
          data.customer?.total_rewards_claimed ??
          0,
        passToken: data.pass?.passToken ?? data.pass?.pass_token ?? passToken,
      });
      setShowResult(true);
    } catch {
      setError("Tarjeta no encontrada.");
    } finally {
      setSearching(false);
    }
  }, []);

  const startCamera = useCallback(async () => {
    try {
      setScanning(true);
      setError("");

      let stream: MediaStream | null = null;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
      }

      streamRef.current = stream;

      // Wait for the <video> element to be mounted by React
      const attachStream = () => {
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          void video.play().catch(() => {});
        } else {
          setTimeout(attachStream, 50);
        }
      };
      attachStream();
    } catch {
      setError("No se pudo acceder a la cámara. Usa búsqueda por teléfono.");
      setScanning(false);
    }
  }, []);

  const handleQRResult = useCallback(
    async (qrValue: string) => {
      const passTokenMatch =
        qrValue.match(/pass_token=([a-f0-9-]+)/i) ||
        qrValue.match(
          /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i,
        );
      const passToken = passTokenMatch?.[1] || qrValue;

      if (
        !passToken.match(
          /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
        )
      ) {
        return;
      }

      stopCamera();
      await searchByPassToken(passToken);
    },
    [searchByPassToken, stopCamera],
  );

  const scanQRCode = useCallback(() => {
    if (!videoRef.current || !scanning) return;

    try {
      const video = videoRef.current;
      if (!video.videoWidth || !video.videoHeight) {
        requestAnimationFrame(() => scanQRCode());
        return;
      }

      const canvasWidth = Math.min(video.videoWidth, 640);
      const canvasHeight = Math.floor(
        canvasWidth * (video.videoHeight / video.videoWidth),
      );

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code && code.data) {
        const rawValue = code.data;
        if (rawValue && rawValue !== lastScanRef.current) {
          lastScanRef.current = rawValue;
          handleQRResult(rawValue);
          return;
        }
      }

      requestAnimationFrame(() => scanQRCode());
    } catch {
      requestAnimationFrame(() => scanQRCode());
    }
  }, [handleQRResult, scanning]);

  useEffect(() => {
    if (isOpen) {
      setPhone("");
      setFoundCustomer(null);
      setError("");
      setShowResult(false);
      lastScanRef.current = "";
    } else {
      stopCamera();
    }
  }, [isOpen, stopCamera]);

  useEffect(() => {
    if (scanning) {
      const animate = () => {
        if (scanning && videoRef.current?.videoWidth) {
          scanQRCode();
        }
        requestAnimationFrame(animate);
      };
      const frame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(frame);
    }
  }, [scanning, scanQRCode]);

  const searchByPhone = useCallback(async () => {
    if (!phone || phone.length < 7) return;
    setSearching(true);
    setError("");

    try {
      const res = await fetch(
        `/api/loyalty/lookup?phone=${encodeURIComponent(phone)}`,
      );
      if (!res.ok) throw new Error("Cliente no encontrado");
      const data = await res.json();
      setFoundCustomer(data);
      setShowResult(true);
    } catch {
      setError("Cliente no encontrado. Verifica el número.");
    } finally {
      setSearching(false);
    }
  }, [phone]);

  const handleSelectCustomer = useCallback(() => {
    if (foundCustomer) {
      onCustomerFound(foundCustomer);
      onClose();
    }
  }, [foundCustomer, onClose, onCustomerFound]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        className="glass-panel flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-white/10 sm:max-w-lg sm:rounded-2xl"
        style={{ maxHeight: "92dvh" }}
      >
        <CardHeader className="flex shrink-0 items-center justify-between border-b border-white/10 pb-4">
          <CardTitle className="text-lg">💎 Tarjeta NEON Club</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 space-y-4 overflow-y-auto p-6">
          {!showResult ? (
            <>
              {/* Search by phone */}
              <div className="space-y-3">
                <label className="text-muted text-sm">Buscar por celular</label>
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="311 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchByPhone()}
                    disabled={searching}
                  />
                  <Button
                    onClick={searchByPhone}
                    disabled={searching || !phone}
                  >
                    <Search className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="relative my-4 h-px bg-white/10">
                <span className="text-muted absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0a0a0f] px-3 text-xs">
                  O ESCANEAR QR
                </span>
              </div>

              {/* QR Scanner */}
              <div className="space-y-3">
                <Button
                  variant={scanning ? "destructive" : "secondary"}
                  className="w-full"
                  onClick={scanning ? stopCamera : startCamera}
                  disabled={!navigator.mediaDevices?.getUserMedia}
                >
                  {scanning ? (
                    <>
                      Detener cámara <X className="size-4" />
                    </>
                  ) : (
                    <>
                      Escanear QR <Camera className="size-4" />
                    </>
                  )}
                </Button>

                {scanning && (
                  <div
                    className="relative aspect-video w-full overflow-hidden rounded-xl"
                    style={{ background: "#000" }}
                  >
                    <video
                      ref={videoRef}
                      className="h-full w-full object-cover"
                      autoPlay
                      playsInline
                      muted
                      controls={false}
                      disablePictureInPicture
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div
                        className="border-primary/50 size-48 rounded-lg border-2"
                        style={{ boxShadow: "0 0 20px rgba(255,79,216,0.3)" }}
                      />
                    </div>
                    <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-center text-xs text-white/70">
                      Apunta el código QR de la tarjeta del cliente
                    </div>
                  </div>
                )}

                {!navigator.mediaDevices?.getUserMedia && (
                  <p className="text-muted text-center text-xs">
                    Escaneo QR no disponible en este navegador. Usa búsqueda por
                    teléfono.
                  </p>
                )}
              </div>

              {error && (
                <p className="text-center text-sm" style={{ color: "#ff5577" }}>
                  {error}
                </p>
              )}
            </>
          ) : (
            <>
              {/* Customer found result */}
              <div className="space-y-4">
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-semibold">
                    {foundCustomer?.fullName}
                  </h3>
                  <p className="text-muted text-sm">{foundCustomer?.phone}</p>
                  {foundCustomer?.email && (
                    <p className="text-muted text-xs">{foundCustomer?.email}</p>
                  )}
                </div>

                {/* Stamp display */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                      style={{
                        background:
                          i < (foundCustomer?.stampsCount ?? 0)
                            ? "linear-gradient(135deg, #3de8c2, #ff73e3)"
                            : "rgba(255,255,255,0.05)",
                        color:
                          i < (foundCustomer?.stampsCount ?? 0)
                            ? "#000"
                            : "rgba(255,255,255,0.3)",
                        boxShadow:
                          i < (foundCustomer?.stampsCount ?? 0)
                            ? "0 0 12px rgba(61,232,194,0.5)"
                            : "none",
                      }}
                    >
                      {i < (foundCustomer?.stampsCount ?? 0) ? "✓" : i + 1}
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  {foundCustomer && foundCustomer.stampsCount >= 10 ? (
                    <div className="animate-pulse rounded-xl border border-amber-500/50 bg-amber-500/20 p-3">
                      <p className="font-semibold text-amber-300">
                        🎁 ¡Raspado Gratis Disponible!
                      </p>
                      <p className="text-sm text-amber-200/80">
                        Presiona &quot;Canjear&quot; para aplicar al pedido
                        actual
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted text-sm">
                      {foundCustomer
                        ? `${foundCustomer.stampsCount}/10 sellos`
                        : "0/10 sellos"}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => {
                      setShowResult(false);
                      setFoundCustomer(null);
                    }}
                  >
                    Buscar otro
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSelectCustomer}
                    style={{
                      background:
                        foundCustomer && foundCustomer.stampsCount >= 10
                          ? "linear-gradient(90deg, #ffd24d, #ff73e3)"
                          : undefined,
                    }}
                  >
                    {foundCustomer && foundCustomer.stampsCount >= 10
                      ? "Canjear y seleccionar"
                      : "Seleccionar cliente"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </div>
    </div>
  );
}
