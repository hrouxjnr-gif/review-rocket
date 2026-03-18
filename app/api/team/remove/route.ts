import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

    const { error } = await supabase
      .from("team_members")
      .delete()
      .eq("owner_user_id", userId)
      .eq("member_user_id", memberUserId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/team/remove error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}