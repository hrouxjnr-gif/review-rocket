import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { PLAN_CONFIG, normalizePlan } from "@/lib/plans";
import { getWorkspaceId } from "@/lib/workspace";

const allowTestPlanSwitches =
  process.env.NEXT_PUBLIC_ALLOW_TEST_PLAN_SWITCHES === "true";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const workspaceId = await getWorkspaceId(userId);
    const subscriptionOwnerId = workspaceId || userId;

    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", subscriptionOwnerId)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      const config = PLAN_CONFIG.free;

      const { data: created, error: insertError } = await supabaseAdmin
        .from("subscriptions")
        .insert({
          user_id: subscriptionOwnerId,
          plan: "free",
          max_users: config.maxUsers,
          monthly_limit: config.monthlyLimit,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }

      return NextResponse.json(created);
    }

    const plan = normalizePlan(data.plan);
    const config = PLAN_CONFIG[plan];

    return NextResponse.json({
      ...data,
      plan,
      max_users: data.max_users ?? config.maxUsers,
      monthly_limit: data.monthly_limit ?? config.monthlyLimit,
    });
  } catch (error) {
    console.error("GET /api/subscription error:", error);
    return NextResponse.json(
      { error: "Failed to load subscription" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!allowTestPlanSwitches) {
      return NextResponse.json(
        { error: "Manual plan switching is disabled in this environment." },
        { status: 403 }
      );
    }

    const workspaceId = await getWorkspaceId(userId);
    const subscriptionOwnerId = workspaceId || userId;

    const body = await req.json();
    const plan = normalizePlan(body.plan);
    const config = PLAN_CONFIG[plan];

    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .upsert(
        {
          user_id: subscriptionOwnerId,
          plan,
          max_users: config.maxUsers,
          monthly_limit: config.monthlyLimit,
        },
        { onConflict: "user_id" }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: data,
    });
  } catch (error) {
    console.error("POST /api/subscription error:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
