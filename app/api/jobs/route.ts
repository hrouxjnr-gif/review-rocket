import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getWorkspaceId } from "@/lib/workspace";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ jobs: [] });
    }

    const workspaceId = await getWorkspaceId(userId);

    const { data, error } = await supabaseAdmin
      .from("jobs")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("job_datetime", { ascending: false });

    if (error) {
      return NextResponse.json({ jobs: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ jobs: data || [] });
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    return NextResponse.json({ jobs: [], error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = await getWorkspaceId(userId);
    const body = await req.json();

    const {
      customer_name,
      customer_phone,
      customer_address,
      job_datetime,
      job_notes,
      repair_cost,
      generated_message,
    } = body;

    const { error } = await supabaseAdmin.from("jobs").insert({
      user_id: userId,
      workspace_id: workspaceId,
      customer_name,
      customer_phone,
      customer_address,
      job_datetime,
      job_notes,
      repair_cost:
        repair_cost === null || repair_cost === undefined || repair_cost === ""
          ? null
          : Number(Number(repair_cost).toFixed(2)),
      generated_message,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/jobs error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}