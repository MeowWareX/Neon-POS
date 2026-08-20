"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X, Search, Camera } from "lucide-react";
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

interface DetectedBarcodeShape {
  rawValue: string;
}

interface BarcodeDetectorApi {
  detect: (source: ImageData) => Promise<DetectedBarcodeShape[]>;
}

type BarcodeDetectorCtor = new (options: {
  formats: string[];
}) => BarcodeDetectorApi;

interface LoyaltyScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomerFound: (customer: CustomerInfo) => void;
}

export function LoyaltyScannerModal({ isOpen, onClose, onCustomerFound }: LoyaltyScannerModalProps) {
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
        id: data.customer.id,
        fullName: data.customer.full_name,
        phone: data.customer.phone,
        email: data.customer.email,
        stampsCount: data.customer.stamps_count,
        totalRewardsClaimed: data.customer.total_rewards_claimed,
        passToken,
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
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
    if (!videoRef.current || scanning) return;

    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const BarcodeDetector = (
        window as Window & { BarcodeDetector?: BarcodeDetectorCtor }
      ).BarcodeDetector;
      const code = BarcodeDetector
        ? new BarcodeDetector({ formats: ["qr_code", "data_matrix"] })
        : null;

      if (code) {
        code
          .detect(imageData)
          .then((codes: DetectedBarcodeShape[]) => {
            if (codes.length > 0) {
              const rawValue = codes[0].rawValue;
              if (rawValue && rawValue !== lastScanRef.current) {
                lastScanRef.current = rawValue;
                handleQRResult(rawValue);
              }
            }
          })
          .catch(() => {
            if (scanning) requestAnimationFrame(() => scanQRCode());
          });
      } else {
        setError(
          "Tu navegador no soporta escaneo QR nativo. Usa búsqueda por teléfono.",
        );
        stopCamera();
      }
    } catch {
      if (scanning) requestAnimationFrame(() => scanQRCode());
    }
  }, [handleQRResult, scanning, stopCamera]);

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
    if (scanning && videoRef.current) {
      const animate = () => {
        if (scanning) {
          scanQRCode();
          requestAnimationFrame(animate);
        }
      };
      animate();
    }
  }, [scanning, scanQRCode]);

  const searchByPhone = useCallback(async () => {
    if (!phone || phone.length < 7) return;
    setSearching(true);
    setError("");

    try {
      const res = await fetch(`/api/loyalty/lookup?phone=${encodeURIComponent(phone)}`);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl glass-panel border border-white/10 overflow-hidden">
        <CardHeader className="flex items-center justify-between border-b border-white/10 pb-4">
          <CardTitle className="text-lg">💎 Tarjeta NEON Club</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-5" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 p-6">
          {!showResult ? (
            <>
              {/* Search by phone */}
              <div className="space-y-3">
                <label className="text-sm text-muted">Buscar por celular</label>
                <div className="flex gap-2">
                  <Input
                    type="tel"
                    placeholder="311 234 5678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchByPhone()}
                    disabled={searching}
                  />
                  <Button onClick={searchByPhone} disabled={searching || !phone}>
                    <Search className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="relative h-px bg-white/10 my-4">
                <span className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 bg-[#0a0a0f] px-3 text-xs text-muted">
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
                    <>Detener cámara <X className="size-4" /></>
                  ) : (
                    <>Escanear QR <Camera className="size-4" /></>
                  )}
                </Button>

                {scanning && (
                  <div className="relative rounded-xl overflow-hidden" style={{ background: "#000" }}>
                    <video
                      ref={videoRef}
                      className="w-full aspect-video object-cover"
                      playsInline
                      muted
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="size-48 border-2 border-primary/50 rounded-lg" style={{ boxShadow: "0 0 20px rgba(255,79,216,0.3)" }} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-center text-xs text-white/70">
                      Apunta el código QR de la tarjeta del cliente
                    </div>
                  </div>
                )}

                {!navigator.mediaDevices?.getUserMedia && (
                  <p className="text-xs text-muted text-center">
                    Escaneo QR no disponible en este navegador. Usa búsqueda por teléfono.
                  </p>
                )}
              </div>

              {error && (
                <p className="text-sm text-center" style={{ color: "#ff5577" }}>{error}</p>
              )}
            </>
          ) : (
            <>
              {/* Customer found result */}
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">{foundCustomer?.fullName}</h3>
                  <p className="text-muted text-sm">{foundCustomer?.phone}</p>
                  {foundCustomer?.email && <p className="text-muted text-xs">{foundCustomer?.email}</p>}
                </div>

                {/* Stamp display */}
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        background: i < (foundCustomer?.stampsCount ?? 0)
                          ? "linear-gradient(135deg, #3de8c2, #ff73e3)"
                          : "rgba(255,255,255,0.05)",
                        color: i < (foundCustomer?.stampsCount ?? 0) ? "#000" : "rgba(255,255,255,0.3)",
                        boxShadow: i < (foundCustomer?.stampsCount ?? 0) ? "0 0 12px rgba(61,232,194,0.5)" : "none",
                      }}
                    >
                      {i < (foundCustomer?.stampsCount ?? 0) ? "✓" : i + 1}
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  {foundCustomer && foundCustomer.stampsCount >= 10 ? (
                    <div className="rounded-xl bg-amber-500/20 border border-amber-500/50 p-3 animate-pulse">
                      <p className="text-amber-300 font-semibold">🎁 ¡Raspado Gratis Disponible!</p>
                      <p className="text-amber-200/80 text-sm">Presiona &quot;Canjear&quot; para aplicar al pedido actual</p>
                    </div>
                  ) : (
                    <p className="text-muted text-sm">
                      {foundCustomer ? `${foundCustomer.stampsCount}/10 sellos` : "0/10 sellos"}
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
                      background: foundCustomer && foundCustomer.stampsCount >= 10
                        ? "linear-gradient(90deg, #ffd24d, #ff73e3)"
                        : undefined,
                    }}
                  >
                    {foundCustomer && foundCustomer.stampsCount >= 10
                      ? "Canjear y seleccionar"
                      : "Seleccionar cliente"
                    }
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