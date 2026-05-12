"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { currency } from "@/lib/utils";

export function SalesTrendChart({
  data,
}: {
  data: Array<{ label: string; sales: number; tickets: number }>;
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            stroke="#a08fc5"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#a08fc5"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${Math.round(value / 1000)}k`}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            contentStyle={{
              background: "#120325",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "1rem",
            }}
            formatter={(value) => [currency(Number(value ?? 0)), "Ventas"]}
          />
          <Bar dataKey="sales" radius={[16, 16, 6, 6]} fill="#37d6ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
