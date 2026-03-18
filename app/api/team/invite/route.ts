import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { PLAN_CONFIG, normalizePlan } from "@/lib/plans";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const memberUserId = body.memberUserId?.trim();

    if (!memberUserId) {
      return NextResponse.json({ error: "Missing member ID" }, { status: 400 });
    }

    if (memberUserId === userId) {
      return NextResponse.json({ error: "You cannot add yourself." }, { status: 400 });
    }

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const plan = normalizePlan(sub?.plan);
    const config = PLAN_CONFIG[plan];

    const { count } = await supabase
      .from("team_members")
      .select("*", { count: "exact", head: true })
      .eq("owner_user_id", userId);

    const currentMembers = count || 0;
    const maxExtraMembers = config.maxUsers - 1;

    if (currentMembers >= maxExtraMembers) {
      return NextResponse.json(
        { error: "User limit reached for your plan." },
        { status: 400 }
      );
    }

    const { data: existing } = await supabase
      .from("team_members")
      .select("*")
      .eq("owner_user_id", userId)
      .eq("member_user_id", memberUserId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: "User already added." }, { status: 400 });
    }

    const { error } = await supabase.from("team_members").insert({
      owner_user_id: userId,
      member_user_id: memberUserId,
      role: "member",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/team/invite error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}