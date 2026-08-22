import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/auth-server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import {
  deleteLiquidSaleWithSupabase,
  getLiquidSalesWithSupabase,
  insertLiquidSaleWithSupabase,
} from "@/repositories/admin-repository";

export async function GET(request: Request) {
  const auth = await requireApiAuth(request, ["admin", "operator"]);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json([]);
    }

    const sales = await getLiquidSalesWithSupabase(supabase);
    return NextResponse.json(sales);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Error fetching liquid sales",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireApiAuth(request, ["admin", "operator"]);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const json = await request.json();
    const supabase = getSupabaseAdminClient();

    if (!supabase) {
      return NextResponse.json({ synced: true, mode: "demo" });
    }

    await insertLiquidSaleWithSupabase(supabase, json);
    return NextResponse.json({ synced: true, mode: "supabase" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        synced: false,
        message: error instanceof Error ? error.message : "Sync error",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(request: Request) {
  const auth = await requireApiAuth(request, ["admin"]);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "ID parameter missing" },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json({ success: true, mode: "demo" });
    }

    await deleteLiquidSaleWithSupabase(supabase, id);
    return NextResponse.json({ success: true, mode: "supabase" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Delete error" },
      { status: 500 },
    );
  }
}
