import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getWorkspaceId } from "@/lib/workspace";

function buildReviewMessage(params: {
  customerName: string;
  jobNotes: string;
  repairCost: string;
}) {
  const { customerName, jobNotes, repairCost } = params;

  const cleanName = customerName || "there";
  const cleanNotes = jobNotes || "the recent work completed";
  const cleanCost = repairCost ? ` The total came to ${repairCost}.` : "";

  return `Hi ${cleanName}, thank you for choosing Roux Review Rocket. We completed ${cleanNotes}.${cleanCost} If you were satisfied with the service provided, we would really appreciate your review.`;
}

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = await getWorkspaceId(userId);

    const { data: jobs, error: jobsError } = await supabaseAdmin
      .from("jobs")
      .select("id, customer_name, job_notes, repair_cost, generated_message, workspace_id")
      .eq("workspace_id", workspaceId);

    if (jobsError) {
      return NextResponse.json(
        { error: jobsError.message },
        { status: 500 }
      );
    }

    const missingMessageJobs = (jobs || []).filter((job: any) => {
      return !job.generated_message || String(job.generated_message).trim() === "";
    });

    let updatedCount = 0;

    for (const job of missingMessageJobs) {
      const repairCost =
        job.repair_cost !== null && job.repair_cost !== undefined
          ? String(job.repair_cost)
          : "";

      const generatedMessage = buildReviewMessage({
        customerName: String(job.customer_name || ""),
        jobNotes: String(job.job_notes || ""),
        repairCost,
      });

      const { error: updateError } = await supabaseAdmin
        .from("jobs")
        .update({
          generated_message: generatedMessage,
        })
        .eq("id", job.id)
        .eq("workspace_id", workspaceId);

      if (!updateError) {
        updatedCount += 1;
      } else {
        console.error("Backfill update error for job", job.id, updateError);
      }
    }

    return NextResponse.json({
      success: true,
      scanned: jobs?.length || 0,
      updated: updatedCount,
    });
  } catch (error) {
    console.error("POST /api/jobs/backfill-generated-messages error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}