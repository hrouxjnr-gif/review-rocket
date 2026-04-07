import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getWorkspaceId } from "@/lib/workspace";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ reviews: [] });
    }

    const workspaceId = await getWorkspaceId(userId);

    const { data, error } = await supabaseAdmin
      .from("reviews")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ reviews: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reviews: data || [] });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json({ reviews: [], error: "Server error" }, { status: 500 });
  }
}