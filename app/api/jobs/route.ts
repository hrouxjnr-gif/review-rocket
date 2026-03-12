import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const search = url.searchParams.get("search")?.trim() || "";
    const date = url.searchParams.get("date")?.trim() || "";

    let query = supabase
      .from("jobs")
      .select("*")
      .eq("user_id", userId)
      .order("job_datetime", { ascending: false });

    if (search) {
      query = query.or(
        `customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%,customer_address.ilike.%${search}%,job_notes.ilike.%${search}%`
      );
    }

    if (date) {
      const start = new Date(`${date}T00:00:00`);
      const end = new Date(`${date}T23:59:59`);

      query = query
        .gte("job_datetime", start.toISOString())
        .lte("job_datetime", end.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ jobs: data || [] });
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to load jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const customer_name = body.customer_name?.trim();
    const customer_phone = body.customer_phone?.trim() || "";
    const customer_address = body.customer_address?.trim() || "";
    const job_datetime = body.job_datetime;
    const job_notes = body.job_notes?.trim();
    const repair_cost =
      body.repair_cost === "" || body.repair_cost === null || body.repair_cost === undefined
        ? null
        : Number(body.repair_cost);
    const generated_message = body.generated_message?.trim() || "";

    if (!customer_name || !job_datetime || !job_notes) {
      return NextResponse.json(
        { error: "Customer name, job date/time, and job notes are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("jobs")
      .insert({
        user_id: userId,
        customer_name,
        customer_phone,
        customer_address,
        job_datetime,
        job_notes,
        repair_cost,
        generated_message,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ job: data });
  } catch (error) {
    console.error("POST /api/jobs error:", error);
    return NextResponse.json({ error: "Failed to save job" }, { status: 500 });
  }
}