import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET() {
  const checks: Record<string, { ok: boolean; message: string }> = {
    supabase: { ok: false, message: "No configurado" },
    tables: { ok: false, message: "No verificado" },
  };

  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    checks.supabase.message = "No configurado";
    return NextResponse.json(
      { healthy: false, checks },
      { status: 503 }
    );
  }

  checks.supabase.ok = true;
  checks.supabase.message = "Conectado";

  // Check critical tables
  const criticalTables = [
    "orders",
    "order_items",
    "order_item_extras",
    "inventory_items",
    "inventory_consumption_rules",
    "inventory_movements",
    "flavors",
    "product_sizes",
    "product_types",
    "extras",
  ];

  const missingTables: string[] = [];

  for (const tableName of criticalTables) {
    try {
      const { error } = await supabase
        .from(tableName)
        .select("*", { count: "exact", head: true })
        .limit(1);

      if (error && error.message.includes("does not exist")) {
        missingTables.push(tableName);
      }
    } catch {
      missingTables.push(tableName);
    }
  }

  if (missingTables.length === 0) {
    checks.tables.ok = true;
    checks.tables.message = `Todas ${criticalTables.length} tablas existen`;
  } else {
    checks.tables.ok = false;
    checks.tables.message = `Faltan tablas: ${missingTables.join(", ")}`;
  }

  const healthy = Object.values(checks).every((check) => check.ok);

  return NextResponse.json(
    { healthy, checks, timestamp: new Date().toISOString() },
    { status: healthy ? 200 : 503 }
  );
}
