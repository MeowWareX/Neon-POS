import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapInventoryConsumptionRuleRow } from "@/lib/catalog-mappers";
import { inventoryConsumptionRuleSchema } from "@/schemas/configuration";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("inventory_consumption_rules")
      .select()
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json((data ?? []).map(mapInventoryConsumptionRuleRow));
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const parsed = inventoryConsumptionRuleSchema.parse(body);

    const payload = {
      product_type_id: parsed.productTypeId ?? null,
      product_size_id: parsed.productSizeId ?? null,
      extra_id: parsed.extraId ?? null,
      consumes_selected_flavor: parsed.consumesSelectedFlavor,
      inventory_item_id: parsed.inventoryItemId ?? null,
      quantity: parsed.quantity,
      note: parsed.note ?? null,
      is_active: parsed.isActive,
    };

    const { data, error } = await supabase
      .from("inventory_consumption_rules")
      .insert(payload)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(mapInventoryConsumptionRuleRow(data), {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { id, ...input } = body as { id?: string };

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const parsed = inventoryConsumptionRuleSchema.parse(input);

    const payload = {
      product_type_id: parsed.productTypeId ?? null,
      product_size_id: parsed.productSizeId ?? null,
      extra_id: parsed.extraId ?? null,
      consumes_selected_flavor: parsed.consumesSelectedFlavor,
      inventory_item_id: parsed.inventoryItemId ?? null,
      quantity: parsed.quantity,
      note: parsed.note ?? null,
      is_active: parsed.isActive,
    };

    const { data, error } = await supabase
      .from("inventory_consumption_rules")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(mapInventoryConsumptionRuleRow(data));
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase
      .from("inventory_consumption_rules")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
