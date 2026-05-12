import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapProductTypeRow } from "@/lib/catalog-mappers";
import { suggestConfiguredCost } from "@/lib/catalog-costs";
import {
  createProductTypeWithSupabase,
  deleteProductTypeWithSupabase,
  updateProductTypeWithSupabase,
} from "@/repositories/admin-repository";
import { productTypeSchema } from "@/schemas/configuration";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json([]);
    }

    const { data, error } = await supabase
      .from("product_types")
      .select()
      .is("deleted_at", null);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json((data ?? []).map(mapProductTypeRow));
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

    const parsed = productTypeSchema.parse(body);

    const { data: inventoryItems } = await supabase
      .from("inventory_items")
      .select("id,name,unit_cost");

    const suggested = suggestConfiguredCost({
      inventoryItems: inventoryItems ?? [],
      candidates: [parsed.code, parsed.label],
      usageQuantity: parsed.usageQuantity ?? 1,
      fallbackCost: parsed.costModifier,
    });

    const result = await createProductTypeWithSupabase(supabase, {
      code: parsed.code,
      label: parsed.label,
      priceModifier: parsed.priceModifier,
      costModifier: suggested.cost,
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
      candidates: [updates.code, updates.label],
      usageQuantity: updates.usageQuantity ?? 1,
      fallbackCost: updates.costModifier ?? 0,
    });

    await updateProductTypeWithSupabase(supabase, id, {
      ...updates,
      costModifier: suggested.cost,
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

    await deleteProductTypeWithSupabase(supabase, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
