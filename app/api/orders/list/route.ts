import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";
import type { Order, OrderItem } from "@/types/domain";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];
type OrderItemRow = Database["public"]["Tables"]["order_items"]["Row"];

function normalizePaymentMethod(value: string): Order["paymentMethod"] {
  return value === "nequi" ? "nequi" : "cash";
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { message: "Supabase not configured" },
      { status: 503 },
    );
  }

  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "100");

    // Get orders with related data
    const { data: ordersData, error: ordersError } = await supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        payment_method,
        subtotal,
        total,
        estimated_cost,
        sync_state,
        created_at,
        order_items (
          id,
          product_size_id,
          product_type_id,
          flavor_id,
          quantity,
          unit_price,
          unit_cost,
          line_total,
          order_item_extras (
            extra_id
          )
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (ordersError) {
      throw new Error(ordersError.message);
    }

    // Transform to match frontend types
    const orders: Order[] = (ordersData ?? []).map((order) => {
      const orderRow = order as OrderRow & {
        order_items?: (OrderItemRow & {
          order_item_extras?: { extra_id: string }[];
        })[];
      };

      return {
        id: orderRow.id,
        orderNumber: orderRow.order_number,
        paymentMethod: normalizePaymentMethod(orderRow.payment_method),
        subtotal: orderRow.subtotal,
        total: orderRow.total,
        estimatedCost: orderRow.estimated_cost,
        syncState: orderRow.sync_state as "local" | "pending" | "synced",
        createdAt: orderRow.created_at,
        items: (orderRow.order_items ?? []).map(
          (item) =>
            ({
              id: item.id,
              sizeId: item.product_size_id,
              typeId: item.product_type_id,
              flavorId: item.flavor_id,
              quantity: item.quantity,
              unitPrice: item.unit_price,
              unitCost: item.unit_cost,
              lineTotal: item.line_total,
              extraIds: (item.order_item_extras ?? []).map(
                (extra) => extra.extra_id,
              ),
            }) as OrderItem,
        ),
      };
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Error fetching orders",
      },
      { status: 500 },
    );
  }
}
