"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import {
  ArrowRightLeft,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  History,
  Landmark,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { formatDateTime, currency } from "@/lib/utils";
import { historicalDaySchema, treasuryTransferSchema } from "@/schemas/accounting";
import { useAppStore } from "@/stores/app-store";
import { AccountingOverview } from "@/components/dashboard/accounting-overview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { TreasuryAccountType } from "@/types/domain";

export function FinancialControl() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="resumen">
            <TrendingUp className="mr-2 size-4" />
            Resumen & Gastos
          </TabsTrigger>
          <TabsTrigger value="tesoreria">
            <Wallet className="mr-2 size-4" />
            Tesorería (Bolsillos)
          </TabsTrigger>
          <TabsTrigger value="historico">
            <History className="mr-2 size-4" />
            Carga Histórica
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <AccountingOverview />
        </TabsContent>

        <TabsContent value="tesoreria" className="space-y-6">
          <TreasuryPanel />
        </TabsContent>

        <TabsContent value="historico" className="space-y-6">
          <HistoricalDaysPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TreasuryPanel() {
  const { treasuryAccounts = [], treasuryTransfers = [], addTreasuryTransfer } =
    useAppStore(
      useShallow((state) => ({
        treasuryAccounts: state.treasuryAccounts || [],
        treasuryTransfers: state.treasuryTransfers || [],
        addTreasuryTransfer: state.addTreasuryTransfer,
      })),
    );

  const [transferModalOpen, setTransferModalOpen] = useState(false);

  const transferForm = useForm({
    resolver: zodResolver(treasuryTransferSchema),
    defaultValues: {
      fromAccountId: "",
      toAccountId: "",
      amount: 0,
      note: "",
    },
  });

  const totalLiquidity = treasuryAccounts.reduce(
    (sum, acc) => sum + acc.balance,
    0,
  );

  const getAccountIcon = (type: TreasuryAccountType) => {
    switch (type) {
      case "cash":
        return Wallet;
      case "vault":
        return Building2;
      case "digital":
        return CreditCard;
      case "bank":
        return Landmark;
      default:
        return Wallet;
    }
  };

  const getAccountBadge = (type: TreasuryAccountType) => {
    switch (type) {
      case "cash":
        return "Efectivo";
      case "vault":
        return "Caja Fuerte";
      case "digital":
        return "Digital";
      case "bank":
        return "Bancario";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-muted text-sm">Liquidez Total en Bolsillos</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-white">
            {currency(totalLiquidity)}
          </p>
        </div>

        <Dialog open={transferModalOpen} onOpenChange={setTransferModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <ArrowRightLeft className="size-4" />
              Nuevo Traslado de Liquidez
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Traslado entre Bolsillos</DialogTitle>
              <DialogDescription>
                Mueve fondos entre tus cuentas o cajas. Estos movimientos no son
                ventas ni gastos operativos.
              </DialogDescription>
            </DialogHeader>

            <form
              className="mt-4 space-y-4"
              onSubmit={transferForm.handleSubmit((values) => {
                addTreasuryTransfer(values);
                transferForm.reset({
                  fromAccountId: "",
                  toAccountId: "",
                  amount: 0,
                  note: "",
                });
                setTransferModalOpen(false);
                toast.success("Traslado de tesorería registrado.");
              })}
            >
              <div>
                <Label className="mb-1.5 block text-sm">Cuenta de Origen</Label>
                <Select
                  onValueChange={(val) =>
                    transferForm.setValue("fromAccountId", val, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona origen..." />
                  </SelectTrigger>
                  <SelectContent>
                    {treasuryAccounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name} ({currency(acc.balance)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {transferForm.formState.errors.fromAccountId && (
                  <p className="text-destructive mt-1 text-xs">
                    {transferForm.formState.errors.fromAccountId.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-1.5 block text-sm">Cuenta de Destino</Label>
                <Select
                  onValueChange={(val) =>
                    transferForm.setValue("toAccountId", val, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona destino..." />
                  </SelectTrigger>
                  <SelectContent>
                    {treasuryAccounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name} ({currency(acc.balance)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {transferForm.formState.errors.toAccountId && (
                  <p className="text-destructive mt-1 text-xs">
                    {transferForm.formState.errors.toAccountId.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-1.5 block text-sm">Monto a Trasladar</Label>
                <Input
                  type="number"
                  placeholder="Ej: 1000000"
                  {...transferForm.register("amount")}
                />
                {transferForm.formState.errors.amount && (
                  <p className="text-destructive mt-1 text-xs">
                    {transferForm.formState.errors.amount.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-1.5 block text-sm">
                  Descripción / Motivo
                </Label>
                <Input
                  placeholder="Ej: Traslado de Caja Mayor a Cuenta Nu"
                  {...transferForm.register("note")}
                />
                {transferForm.formState.errors.note && (
                  <p className="text-destructive mt-1 text-xs">
                    {transferForm.formState.errors.note.message}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Confirmar Traslado
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {treasuryAccounts.map((acc) => {
          const Icon = getAccountIcon(acc.type);
          return (
            <Card key={acc.id} className="overflow-hidden border-white/10 bg-white/4">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{acc.name}</p>
                      <Badge variant="secondary" className="mt-1 text-[11px]">
                        {getAccountBadge(acc.type)}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-2xl font-bold tracking-tight text-white">
                  {currency(acc.balance)}
                </p>

                {acc.description && (
                  <p className="text-muted mt-2 text-xs leading-relaxed">
                    {acc.description}
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="size-5 text-primary" />
            Traslados Recientes
          </CardTitle>
          <CardDescription>
            Historial de movimientos internos de tesorería y liquidez.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {treasuryTransfers.length === 0 ? (
            <p className="text-muted py-6 text-center text-sm">
              No hay traslados registrados aún.
            </p>
          ) : (
            treasuryTransfers.map((transfer) => {
              const fromAcc = treasuryAccounts.find(
                (a) => a.id === transfer.fromAccountId,
              );
              const toAcc = treasuryAccounts.find(
                (a) => a.id === transfer.toAccountId,
              );

              return (
                <div
                  key={transfer.id}
                  className="flex flex-col justify-between gap-3 rounded-[1.4rem] border border-white/10 bg-white/4 p-4 md:flex-row md:items-center"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold">
                      <span>{fromAcc?.name || "Cuenta Origen"}</span>
                      <ArrowRightLeft className="text-muted size-3.5" />
                      <span className="text-primary">
                        {toAcc?.name || "Cuenta Destino"}
                      </span>
                    </div>
                    <p className="text-muted text-sm">{transfer.note}</p>
                    <p className="text-muted text-xs">
                      {formatDateTime(transfer.createdAt)}
                    </p>
                  </div>
                  <div className="text-right font-bold text-white">
                    {currency(transfer.amount)}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function HistoricalDaysPanel() {
  const { historicalDays = [], addHistoricalDay } = useAppStore(
    useShallow((state) => ({
      historicalDays: state.historicalDays || [],
      addHistoricalDay: state.addHistoricalDay,
    })),
  );

  const form = useForm({
    resolver: zodResolver(historicalDaySchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      unitsSold: 0,
      totalCash: 0,
      totalDigital: 0,
      nextDayBase: 150000,
      estimatedCost: undefined as number | undefined,
    },
  });

  return (
    <div className="space-y-6">
      <Card className="border-primary/30 bg-primary/8">
        <CardContent className="flex items-start gap-4 p-5">
          <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-primary" />
          <div className="space-y-1">
            <p className="font-semibold text-white">
              Bypass Inteligente para Dashboard Dinámico
            </p>
            <p className="text-muted text-sm leading-relaxed">
              Al guardar un cierre manual pasado, el sistema genera registros
              agregados que alimentan directamente el <strong>Dashboard</strong> y las
              métricas de rentabilidad, sin requerir la creación individual de ítems
              de pedido. Además, actualiza automáticamente la base de Caja Menor
              para el día siguiente.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="size-5 text-primary" />
              Registrar Día Histórico
            </CardTitle>
            <CardDescription>
              Introduce los totales consolidados de un día anterior.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit((values) => {
                addHistoricalDay(values);
                form.reset({
                  date: new Date().toISOString().split("T")[0],
                  unitsSold: 0,
                  totalCash: 0,
                  totalDigital: 0,
                  nextDayBase: 150000,
                  estimatedCost: undefined,
                });
                toast.success("Día histórico integrado al Dashboard.");
              })}
            >
              <div>
                <Label className="mb-1.5 block text-sm">Fecha del Cierre</Label>
                <Input type="date" {...form.register("date")} />
                {form.formState.errors.date && (
                  <p className="text-destructive mt-1 text-xs">
                    {form.formState.errors.date.message}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-1.5 block text-sm">
                  Total Unidades Vendidas
                </Label>
                <Input
                  type="number"
                  placeholder="Ej: 54"
                  {...form.register("unitsSold")}
                />
                {form.formState.errors.unitsSold && (
                  <p className="text-destructive mt-1 text-xs">
                    {form.formState.errors.unitsSold.message}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block text-sm">Total Efectivo ($)</Label>
                  <Input
                    type="number"
                    placeholder="Ej: 350000"
                    {...form.register("totalCash")}
                  />
                  {form.formState.errors.totalCash && (
                    <p className="text-destructive mt-1 text-xs">
                      {form.formState.errors.totalCash.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm">
                    Total Digital (Nequi/Otros) ($)
                  </Label>
                  <Input
                    type="number"
                    placeholder="Ej: 210000"
                    {...form.register("totalDigital")}
                  />
                  {form.formState.errors.totalDigital && (
                    <p className="text-destructive mt-1 text-xs">
                      {form.formState.errors.totalDigital.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="mb-1.5 block text-sm">
                    Base Día Siguiente ($)
                  </Label>
                  <Input
                    type="number"
                    placeholder="Ej: 150000"
                    {...form.register("nextDayBase")}
                  />
                  {form.formState.errors.nextDayBase && (
                    <p className="text-destructive mt-1 text-xs">
                      {form.formState.errors.nextDayBase.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="mb-1.5 block text-sm">
                    Costo Estimado (COGS) ($) [Opcional]
                  </Label>
                  <Input
                    type="number"
                    placeholder="Auto: ~30% ventas"
                    {...form.register("estimatedCost")}
                  />
                  {form.formState.errors.estimatedCost && (
                    <p className="text-destructive mt-1 text-xs">
                      {form.formState.errors.estimatedCost.message}
                    </p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Guardar Cierre Histórico
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="size-5 text-primary" />
              Historial de Cierres Cargados
            </CardTitle>
            <CardDescription>
              Días anteriores migrados al sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {historicalDays.length === 0 ? (
              <p className="text-muted py-8 text-center text-sm">
                Aún no has registrado días históricos.
              </p>
            ) : (
              historicalDays.map((day) => (
                <div
                  key={day.id}
                  className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4"
                >
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="font-semibold text-white">
                        {day.date}
                      </span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {day.unitsSold} unds
                      </Badge>
                    </div>
                    <span className="text-lg font-bold text-primary">
                      {currency(day.totalSales)}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-muted">Efectivo</p>
                      <p className="font-medium text-white">
                        {currency(day.totalCash)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Digital</p>
                      <p className="font-medium text-white">
                        {currency(day.totalDigital)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted">Base Siguiente</p>
                      <p className="font-medium text-white">
                        {currency(day.nextDayBase)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
