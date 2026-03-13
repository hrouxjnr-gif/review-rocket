import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

type JobRow = {
  id: number;
  customer_name: string;
  customer_phone: string | null;
  customer_address: string | null;
  job_datetime: string;
  job_notes: string;
  repair_cost: number | null;
  generated_message: string | null;
  created_at: string;
};

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim().toLowerCase() || "";

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("user_id", userId)
      .order("job_datetime", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const jobs = (data || []) as JobRow[];

    const grouped = new Map<
      string,
      {
        customer_name: string;
        customer_phone: string;
        customer_address: string;
        total_jobs: number;
        total_spent: number;
        latest_job_datetime: string;
        jobs: JobRow[];
      }
    >();

    for (const job of jobs) {
      const key = `${job.customer_name}__${job.customer_phone || ""}__${job.customer_address || ""}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          customer_name: job.customer_name || "",
          customer_phone: job.customer_phone || "",
          customer_address: job.customer_address || "",
          total_jobs: 0,
          total_spent: 0,
          latest_job_datetime: job.job_datetime,
          jobs: [],
        });
      }

      const customer = grouped.get(key)!;
      customer.total_jobs += 1;
      customer.total_spent += Number(job.repair_cost || 0);
      customer.jobs.push(job);

      if (new Date(job.job_datetime) > new Date(customer.latest_job_datetime)) {
        customer.latest_job_datetime = job.job_datetime;
      }
    }

    let customers = Array.from(grouped.values());

    if (search) {
      customers = customers.filter((customer) => {
        const haystack = [
          customer.customer_name,
          customer.customer_phone,
          customer.customer_address,
          ...customer.jobs.map((j) => j.job_notes || ""),
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(search);
      });
    }

    customers.sort(
      (a, b) =>
        new Date(b.latest_job_datetime).getTime() -
        new Date(a.latest_job_datetime).getTime()
    );

    return NextResponse.json({ customers });
  } catch (error) {
    console.error("GET /api/customers error:", error);
    return NextResponse.json(
      { error: "Failed to load customers" },
      { status: 500 }
    );
  }
}