"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import {
  syncCashClosing,
  syncCashOpening,
} from "@/services/admin-sync-service";
import { getCashSummary } from "@/lib/analytics";
import { currency, formatDateTime } from "@/lib/utils";
import { closeCashSchema, openCashSchema } from "@/schemas/cash";
import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CashRegisterPanel() {
  const { cashSessions, orders, openCashSession, closeCashSession } =
    useAppStore(
      useShallow((state) => ({
        cashSessions: state.cashSessions,
        orders: state.orders,
        openCashSession: state.openCashSession,
        closeCashSession: state.closeCashSession,
      })),
    );

  const [openingLoading, setOpeningLoading] = useState(false);
  const [closingLoading, setClosingLoading] = useState(false);

  const summary = getCashSummary({ sessions: cashSessions, orders });

  const openForm = useForm({
    resolver: zodResolver(openCashSchema),
    defaultValues: { openingCash: 0 },
  });

  const closeForm = useForm({
    resolver: zodResolver(closeCashSchema),
    defaultValues: { closingCash: 0 },
  });

  const handleOpenCash = async (values: { openingCash: number }) => {
    try {
      setOpeningLoading(true);
      const session = openCashSession(values.openingCash);

      if (!session) {
        toast.error("No se pudo crear la sesión de caja.");
        return;
      }

      openForm.reset({ openingCash: 0 });

      if (navigator.onLine) {
        try {
          await syncCashOpening(session);
          toast.success("Caja abierta y sincronizada.");
        } catch (syncError) {
          toast.warning(
            "Caja abierta localmente. La sincronización con el servidor falló, pero los datos se recuperarán en la próxima conexión.",
          );
          console.error("Sync error:", syncError);
        }
      } else {
        toast.info("Caja abierta. Se sincronizará cuando recuperes conexión.");
      }
    } finally {
      setOpeningLoading(false);
    }
  };

  const handleCloseCash = async (values: { closingCash: number }) => {
    try {
      setClosingLoading(true);
      const session = closeCashSession(values.closingCash);

      if (!session) {
        toast.error("No se pudo cerrar la sesión de caja.");
        return;
      }

      closeForm.reset({ closingCash: 0 });

      if (navigator.onLine) {
        try {
          await syncCashClosing(session);
          toast.success("Caja cerrada y sincronizada.");
        } catch (syncError) {
          toast.warning(
            "Caja cerrada localmente. La sincronización con el servidor falló, pero los datos se recuperarán en la próxima conexión.",
          );
          console.error("Sync error:", syncError);
        }
      } else {
        toast.info("Caja cerrada. Se sincronizará cuando recuperes conexión.");
      }
    } finally {
      setClosingLoading(false);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{summary ? "Caja abierta" : "Abrir caja"}</CardTitle>
        </CardHeader>
        <CardContent>
          {summary ? (
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
                <p className="text-muted text-sm">Apertura</p>
                <p className="mt-2 text-2xl font-semibold">
                  {currency(summary.activeSession.openingCash)}
                </p>
                <p className="text-muted mt-2 text-sm">
                  {formatDateTime(summary.activeSession.openedAt)}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Stat
                  label="Ventas en efectivo"
                  value={currency(summary.cashSales)}
                />
                <Stat
                  label="Efectivo esperado"
                  value={currency(summary.expectedCash)}
                />
              </div>

              <form
                className="space-y-4"
                onSubmit={closeForm.handleSubmit(handleCloseCash)}
              >
                <div>
                  <Label>Cierre real</Label>
                  <Input type="number" {...closeForm.register("closingCash")} />
                </div>
                <Button
                  className="w-full"
                  type="submit"
                  disabled={closingLoading}
                >
                  {closingLoading ? "Cerrando..." : "Cerrar caja"}
                </Button>
              </form>
            </div>
          ) : (
            <form
              className="space-y-4"
              onSubmit={openForm.handleSubmit(handleOpenCash)}
            >
              <div>
                <Label>Efectivo inicial</Label>
                <Input type="number" {...openForm.register("openingCash")} />
              </div>
              <Button
                className="w-full"
                type="submit"
                disabled={openingLoading}
              >
                {openingLoading ? "Abriendo..." : "Abrir caja"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sesiones recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cashSessions.map((session) => (
            <div
              key={session.id}
              className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {session.status === "open" ? "Abierta" : "Cerrada"}
                </p>
                <p className="text-muted text-sm">
                  {formatDateTime(session.openedAt)}
                </p>
              </div>
              <div className="text-muted mt-3 grid gap-2 text-sm">
                <p>Apertura: {currency(session.openingCash)}</p>
                {session.expectedCash ? (
                  <p>Esperado: {currency(session.expectedCash)}</p>
                ) : null}
                {session.closingCash ? (
                  <p>Cierre: {currency(session.closingCash)}</p>
                ) : null}
                {typeof session.difference === "number" ? (
                  <p>Diferencia: {currency(session.difference)}</p>
                ) : null}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
      <p className="text-muted text-sm">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}
