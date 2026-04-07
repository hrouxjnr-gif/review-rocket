import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getWorkspaceId } from "@/lib/workspace";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = await getWorkspaceId(userId);
    const body = await req.json();

    const {
      id,
      customer_name,
      customer_phone,
      customer_address,
      job_notes,
      repair_cost,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("jobs")
      .update({
        customer_name,
        customer_phone,
        customer_address,
        job_notes,
        repair_cost:
          repair_cost === null || repair_cost === undefined || repair_cost === ""
            ? null
            : Number(Number(repair_cost).toFixed(2)),
      })
      .eq("id", id)
      .eq("workspace_id", workspaceId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("POST /api/jobs/update error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}