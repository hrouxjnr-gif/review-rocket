import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getWorkspaceId } from "@/lib/workspace";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        totalJobs: 0,
        jobsToday: 0,
        plan: "free",
      });
    }

    const workspaceId = await getWorkspaceId(userId);

    const { count: totalJobsCount, error: totalError } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId);

    if (totalError) {
      console.error("Total jobs error:", totalError);
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const todayIso = startOfToday.toISOString();

    const { count: jobsTodayCount, error: todayError } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .gte("created_at", todayIso);

    if (todayError) {
      console.error("Jobs today error:", todayError);
    }

    const { data: subscriptionData, error: subError } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", workspaceId)
      .maybeSingle();

    if (subError) {
      console.error("Subscription error:", subError);
    }

    return NextResponse.json({
      totalJobs: Number(totalJobsCount || 0),
      jobsToday: Number(jobsTodayCount || 0),
      plan: subscriptionData?.plan || "free",
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      {
        totalJobs: 0,
        jobsToday: 0,
        plan: "free",
      },
      { status: 500 }
    );
  }
}