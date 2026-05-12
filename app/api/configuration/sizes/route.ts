import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapProductSizeRow } from "@/lib/catalog-mappers";
import { suggestConfiguredCost } from "@/lib/catalog-costs";
import {
  createProductSizeWithSupabase,
  deleteProductSizeWithSupabase,
  updateProductSizeWithSupabase,
} from "@/repositories/admin-repository";
import { productSizeSchema } from "@/schemas/configuration";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("product_sizes")
      .select()
      .is("deleted_at", null);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json((data ?? []).map(mapProductSizeRow));
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
    const parsed = productSizeSchema.parse(body);

    const { data: inventoryItems } = await supabase
      .from("inventory_items")
      .select("id,name,unit_cost");

    const suggested = suggestConfiguredCost({
      inventoryItems: inventoryItems ?? [],
      candidates: [parsed.code, parsed.label, `Vaso ${parsed.label}`],
      usageQuantity: parsed.usageQuantity ?? 1,
      fallbackCost: parsed.baseCost,
    });

    const result = await createProductSizeWithSupabase(supabase, {
      code: parsed.code,
      label: parsed.label,
      ounces: parsed.ounces,
      price: parsed.price,
      baseCost: suggested.cost,
      inventoryItemId: parsed.inventoryItemId ?? suggested.inventoryItemId,
      usageQuantity: parsed.usageQuantity ?? 1,
    });

    return NextResponse.json(result, { status: 201 });
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
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { data: inventoryItems } = await supabase
      .from("inventory_items")
      .select("id,name,unit_cost");

    const suggested = suggestConfiguredCost({
      inventoryItems: inventoryItems ?? [],
      candidates: [updates.code, updates.label, `Vaso ${updates.label}`],
      usageQuantity: updates.usageQuantity ?? 1,
      fallbackCost: updates.baseCost ?? 0,
    });

    await updateProductSizeWithSupabase(supabase, id, {
      ...updates,
      baseCost: suggested.cost,
      inventoryItemId: updates.inventoryItemId ?? suggested.inventoryItemId,
      usageQuantity: updates.usageQuantity ?? 1,
    });
    return NextResponse.json({ success: true });
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

    await deleteProductSizeWithSupabase(supabase, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
