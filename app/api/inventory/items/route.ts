import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { mapInventoryItemRow } from "@/lib/catalog-mappers";
import { inventoryItemSchema } from "@/schemas/configuration";

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 },
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const withMovements = searchParams.get("withMovements") === "true";
    const limit = searchParams.get("limit")
      ? Number(searchParams.get("limit"))
      : 100;

    const { data, error } = await supabase
      .from("inventory_items")
      .select()
      .order("name", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const items = (data ?? []).map(mapInventoryItemRow);

    if (!withMovements) {
      return NextResponse.json(items);
    }

    // Include recent movements for each item
    const { data: movementsData, error: movementsError } = await supabase
      .from("inventory_movements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (movementsError) {
      console.warn("Error fetching movements:", movementsError);
      return NextResponse.json(items);
    }

    const itemsWithMovements = items.map((item) => ({
      ...item,
      recentMovements: (movementsData ?? []).filter(
        (m) => m.inventory_item_id === item.id,
      ),
    }));

    return NextResponse.json(itemsWithMovements);
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

    // Validate input
    const validated = inventoryItemSchema.parse(body);

    const { data, error } = await supabase
      .from("inventory_items")
      .insert([
        {
          name: validated.name,
          unit: validated.unit,
          category: validated.category || "",
          reorder_point: validated.reorderPoint,
          unit_cost: validated.unitCost,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating inventory item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const item = data?.[0];
    return NextResponse.json(item ? mapInventoryItemRow(item) : null, {
      status: 201,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create inventory item";
    console.error("Error in POST /api/inventory/items:", error);
    return NextResponse.json({ error: message }, { status: 400 });
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

    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Validate input
    const validated = inventoryItemSchema.parse(updateData);

    const { data, error } = await supabase
      .from("inventory_items")
      .update({
        name: validated.name,
        unit: validated.unit,
        category: validated.category || "",
        reorder_point: validated.reorderPoint,
        unit_cost: validated.unitCost,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating inventory item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const item = data?.[0];
    return NextResponse.json(item ? mapInventoryItemRow(item) : null);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update inventory item";
    console.error("Error in PUT /api/inventory/items:", error);
    return NextResponse.json({ error: message }, { status: 400 });
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

    // Check if item is used in any consumption rules
    const { data: rulesUsing, error: rulesError } = await supabase
      .from("inventory_consumption_rules")
      .select("id")
      .eq("inventory_item_id", id);

    if (rulesError) {
      console.error("Error checking consumption rules:", rulesError);
      return NextResponse.json({ error: rulesError.message }, { status: 500 });
    }

    if (rulesUsing && rulesUsing.length > 0) {
      return NextResponse.json(
        {
          error:
            "Este ítem está siendo usado en recetas de consumo. No se puede eliminar.",
        },
        { status: 409 },
      );
    }

    const { error } = await supabase
      .from("inventory_items")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting inventory item:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete inventory item";
    console.error("Error in DELETE /api/inventory/items:", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
