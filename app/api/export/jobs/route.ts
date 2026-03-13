import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

function escapeCsv(value: unknown) {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes('"') || text.includes("\n")) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("*")
    .eq("user_id", userId)
    .order("job_datetime", { ascending: false });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  const rows = data || [];

  const header = [
    "customer_name",
    "customer_phone",
    "customer_address",
    "job_datetime",
    "job_notes",
    "repair_cost",
    "generated_message",
    "created_at",
  ];

  const csvLines = [
    header.join(","),
    ...rows.map((row) =>
      [
        escapeCsv(row.customer_name),
        escapeCsv(row.customer_phone),
        escapeCsv(row.customer_address),
        escapeCsv(row.job_datetime),
        escapeCsv(row.job_notes),
        escapeCsv(row.repair_cost),
        escapeCsv(row.generated_message),
        escapeCsv(row.created_at),
      ].join(",")
    ),
  ];

  const csv = csvLines.join("\n");

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="review-rocket-jobs.csv"',
    },
  });
}