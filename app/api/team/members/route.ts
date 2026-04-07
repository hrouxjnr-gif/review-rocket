import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { PLAN_CONFIG, normalizePlan } from "@/lib/plans";
import { getWorkspaceId } from "@/lib/workspace";

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

    const ownerUserId = await getWorkspaceId(userId);
    const isOwner = ownerUserId === userId;

    const { data: subscription, error: subError } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("user_id", ownerUserId)
      .maybeSingle();

    if (subError) {
      return NextResponse.json(
        { error: subError.message },
        { status: 500 }
      );
    }

    const plan = normalizePlan(subscription?.plan);
    const config = PLAN_CONFIG[plan];

    const { data: members, error: membersError } = await supabaseAdmin
      .from("team_members")
      .select("*")
      .eq("owner_user_id", ownerUserId)
      .order("created_at", { ascending: false });

    if (membersError) {
      return NextResponse.json(
        { error: membersError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ownerUserId,
      currentUserId: userId,
      isOwner,
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
