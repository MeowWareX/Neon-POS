"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import { syncExpense, syncLoanPayment } from "@/services/admin-sync-service";
import { getProfitEstimate } from "@/lib/analytics";
import { currency, formatDateTime } from "@/lib/utils";
import { expenseSchema, loanPaymentSchema } from "@/schemas/accounting";
import { useAppStore } from "@/stores/app-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AccountingOverview() {
  const { orders, expenses, loanPayments, addExpense, addLoanPayment } =
    useAppStore(
      useShallow((state) => ({
        orders: state.orders,
        expenses: state.expenses,
        loanPayments: state.loanPayments,
        addExpense: state.addExpense,
        addLoanPayment: state.addLoanPayment,
      })),
    );

  const profit = getProfitEstimate({ orders, expenses, loanPayments });

  const expenseForm = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      concept: "",
      amount: 0,
      category: "",
    },
  });

  const loanForm = useForm({
    resolver: zodResolver(loanPaymentSchema),
    defaultValues: {
      lender: "",
      amount: 0,
      balanceAfterPayment: 0,
    },
  });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <Metric label="Ingresos" value={currency(profit.revenue)} />
        <Metric label="Costo estimado" value={currency(profit.cogs)} />
        <Metric label="Gastos" value={currency(profit.expenses)} />
        <Metric label="Pagos de deuda" value={currency(profit.loans)} />
        <Metric label="Utilidad neta" value={currency(profit.netProfit)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Registrar gasto</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={expenseForm.handleSubmit((values) => {
                const expense = addExpense(values);
                expenseForm.reset({ concept: "", amount: 0, category: "" });
                toast.success("Gasto registrado.");
                if (navigator.onLine) {
                  void syncExpense(expense).catch(() => {
                    toast.warning(
                      "El gasto quedó guardado localmente. La sincronización remota falló.",
                    );
                  });
                }
              })}
            >
              <Field label="Concepto">
                <Input {...expenseForm.register("concept")} />
              </Field>
              <Field label="Categoría">
                <Input {...expenseForm.register("category")} />
              </Field>
              <Field label="Monto">
                <Input type="number" {...expenseForm.register("amount")} />
              </Field>
              <Button className="w-full" type="submit">
                Guardar gasto
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registrar pago de préstamo</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={loanForm.handleSubmit((values) => {
                const payment = addLoanPayment(values);
                loanForm.reset({
                  lender: "",
                  amount: 0,
                  balanceAfterPayment: 0,
                });
                toast.success("Pago de préstamo registrado.");
                if (navigator.onLine) {
                  void syncLoanPayment(payment).catch(() => {
                    toast.warning(
                      "El pago quedó guardado localmente. La sincronización remota falló.",
                    );
                  });
                }
              })}
            >
              <Field label="Prestamista">
                <Input {...loanForm.register("lender")} />
              </Field>
              <Field label="Monto">
                <Input type="number" {...loanForm.register("amount")} />
              </Field>
              <Field label="Saldo restante">
                <Input
                  type="number"
                  {...loanForm.register("balanceAfterPayment")}
                />
              </Field>
              <Button className="w-full" type="submit">
                Guardar pago
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Gastos recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{expense.concept}</p>
                    <p className="text-muted text-sm">{expense.category}</p>
                  </div>
                  <p className="font-semibold">{currency(expense.amount)}</p>
                </div>
                <p className="text-muted mt-2 text-xs">
                  {formatDateTime(expense.createdAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pagos de préstamo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loanPayments.map((payment) => (
              <div
                key={payment.id}
                className="rounded-[1.4rem] border border-white/10 bg-white/4 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{payment.lender}</p>
                    <p className="text-muted text-sm">
                      Saldo: {currency(payment.balanceAfterPayment)}
                    </p>
                  </div>
                  <p className="font-semibold">{currency(payment.amount)}</p>
                </div>
                <p className="text-muted mt-2 text-xs">
                  {formatDateTime(payment.createdAt)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-muted text-sm">{label}</p>
        <p className="mt-3 text-2xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
