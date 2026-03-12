import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

const FREE_PLAN_LIMIT = 5;

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();

    const { count, error } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const used = count || 0;
    const remaining = Math.max(FREE_PLAN_LIMIT - used, 0);

    return NextResponse.json({
      plan: "Free",
      limit: FREE_PLAN_LIMIT,
      used,
      remaining,
    });
  } catch (err) {
    console.error("Usage API error:", err);

    return NextResponse.json(
      { error: "Usage API crashed" },
      { status: 500 }
    );
  }
}