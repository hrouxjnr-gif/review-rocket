import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getWorkspaceId } from "@/lib/workspace";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = await getWorkspaceId(userId);

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("workspace_id", workspaceId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const jobs = data || [];

    const today = new Date();
    const todayDate = today.toISOString().split("T")[0];

    const jobsToday = jobs.filter((job) => {
      const jobDate = new Date(job.job_datetime).toISOString().split("T")[0];
      return jobDate === todayDate;
    });

    const totalRevenue = jobs.reduce(
      (sum, job) => sum + Number(job.repair_cost || 0),
      0
    );

    return NextResponse.json({
      totalJobs: jobs.length,
      jobsToday: jobsToday.length,
      totalRevenue,
      latestTodayJobs: jobsToday
        .sort(
          (a, b) =>
            new Date(b.job_datetime).getTime() -
            new Date(a.job_datetime).getTime()
        )
        .slice(0, 5),
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { error: "Failed to load stats" },
      { status: 500 }
    );
  }
}