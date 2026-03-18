import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { PLAN_CONFIG, normalizePlan } from "@/lib/plans";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (subError) {
      return NextResponse.json(
        { error: subError.message },
        { status: 500 }
      );
    }

    const plan = normalizePlan(subscription?.plan);
    const config = PLAN_CONFIG[plan];

    const { data: members, error: membersError } = await supabase
      .from("team_members")
      .select("*")
      .eq("owner_user_id", userId)
      .order("created_at", { ascending: false });

    if (membersError) {
      return NextResponse.json(
        { error: membersError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ownerUserId: userId,
      plan: config.name,
      maxUsers: config.maxUsers,
      seatsUsed: (members?.length || 0) + 1,
      members: members || [],
    });
  } catch (err) {
    console.error("GET /api/team/members error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}