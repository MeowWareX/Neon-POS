import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { insertOrderWithSupabase } from "@/repositories/order-repository";
import { orderSyncSchema } from "@/schemas/order";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const order = orderSyncSchema.parse(json);
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        {
          synced: false,
          mode: "demo",
          message: "Supabase no configurado. Pedido pendiente de sincronizar.",
        },
        { status: 503 },
      );
    }

    const result = await insertOrderWithSupabase(supabase, order);

    return NextResponse.json({
      synced: true,
      mode: "supabase",
      orderNumber: result.orderNumber,
    });
  } catch (error) {
    console.error("Error syncing order:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    return NextResponse.json(
      {
        synced: false,
        message: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 400 },
    );
  }
}
