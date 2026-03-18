import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { PLAN_CONFIG, normalizePlan } from "@/lib/plans";
import { getWorkspaceId } from "@/lib/workspace";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const workspaceId = await getWorkspaceId(userId);

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", workspaceId)
      .maybeSingle();

    const plan = normalizePlan(subscription?.plan);
    const config = PLAN_CONFIG[plan];

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count, error } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .gte("created_at", startOfMonth);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const used = count || 0;
    const remaining = Math.max(config.monthlyLimit - used, 0);

    return NextResponse.json({
      plan: config.name,
      limit: config.monthlyLimit,
      used,
      remaining,
      maxUsers: config.maxUsers,
    });
  } catch (err) {
    console.error("Usage API error:", err);
    return NextResponse.json({ error: "Usage API crashed" }, { status: 500 });
  }
}