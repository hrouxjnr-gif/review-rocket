import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getWorkspaceId } from "@/lib/workspace";

function buildReviewMessage(params: {
  customerName: string;
  jobNotes: string;
  repairCost: string;
  businessName: string;
  reviewLink: string;
  style: string;
}) {
  const {
    customerName,
    jobNotes,
    repairCost,
    businessName,
    reviewLink,
    style,
  } = params;

  const cleanName = customerName || "there";
  const cleanNotes = jobNotes || "the recent work completed";
  const cleanCost = repairCost ? ` The total came to ${repairCost}.` : "";
  const linkLine = reviewLink
    ? ` You can leave a review here: ${reviewLink}`
    : "";

  if (style === "friendly") {
    return `Hi ${cleanName}, thanks again for choosing ${businessName}. We completed ${cleanNotes}.${cleanCost} If you were happy with the service, we would really appreciate a quick review.${linkLine}`;
  }

  if (style === "short") {
    return `Hi ${cleanName}, thanks for choosing ${businessName}. We completed ${cleanNotes}.${cleanCost} We would appreciate a review.${linkLine}`;
  }

  if (style === "follow-up") {
    return `Hi ${cleanName}, just following up after the recent job for ${cleanNotes}.${cleanCost} Thank you for choosing ${businessName}. If you were happy with our service, we would appreciate a review.${linkLine}`;
  }

  return `Hi ${cleanName}, thank you for choosing ${businessName}. We completed ${cleanNotes}.${cleanCost} If you were satisfied with the service provided, we would really appreciate your review.${linkLine}`;
}

function normalizeDatetime(value: string) {
  if (!value) return new Date().toISOString();

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString();
  }

  return parsed.toISOString();
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const body = await req.json();

    const customerName = String(
      body.customer_name ?? body.customerName ?? body.name ?? ""
    ).trim();

    const customerPhone = String(
      body.phone ?? body.customerPhone ?? ""
    ).trim();

    const customerAddress = String(
      body.address ?? body.customerAddress ?? ""
    ).trim();

    const jobNotes = String(
      body.notes ?? body.jobNotes ?? body.input_text ?? ""
    ).trim();

    const repairCostRaw = String(
      body.cost ?? body.repairCost ?? ""
    ).trim();

    const style = String(
      body.style ?? body.messageStyle ?? "professional"
    ).trim();

    const rawJobDatetime = String(
      body.job_datetime ??
        body.jobDateTime ??
        body.job_date ??
        body.date ??
        ""
    ).trim();

    const jobDatetime = normalizeDatetime(rawJobDatetime);

    if (!jobNotes) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const repairCostNumber = repairCostRaw ? Number(repairCostRaw) : 0;

    if (!userId) {
      const outputText = buildReviewMessage({
        customerName,
        jobNotes,
        repairCost: repairCostRaw || "",
        businessName: "Roux Review Rocket",
        reviewLink: "",
        style,
      });

      return NextResponse.json({
        success: true,
        output_text: outputText,
        demo_mode: true,
      });
    }

    const workspaceId = await getWorkspaceId(userId);

    const { data: settingsData } = await supabaseAdmin
      .from("settings")
      .select("business_name,currency,review_link")
      .eq("user_id", workspaceId || userId)
      .maybeSingle();

    const businessName = settingsData?.business_name || "Roux Review Rocket";
    const currency = settingsData?.currency || "";
    const reviewLink = settingsData?.review_link || "";

    const formattedCost =
      repairCostRaw && !Number.isNaN(repairCostNumber)
        ? `${currency}${repairCostRaw}`
        : "";

    const outputText = buildReviewMessage({
      customerName,
      jobNotes,
      repairCost: formattedCost,
      businessName,
      reviewLink,
      style,
    });

    const reviewInsert = await supabaseAdmin.from("reviews").insert({
      user_id: userId,
      workspace_id: workspaceId,
      input_text: jobNotes,
      output_text: outputText,
    });

    if (reviewInsert.error) {
      console.error("Review insert error:", reviewInsert.error);
      return NextResponse.json(
        {
          error: `Message generated but review save failed: ${reviewInsert.error.message}`,
          output_text: outputText,
        },
        { status: 500 }
      );
    }

    const jobInsert = await supabaseAdmin.from("jobs").insert({
      user_id: userId,
      workspace_id: workspaceId,
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_address: customerAddress,
      job_datetime: jobDatetime,
      job_notes: jobNotes,
      repair_cost: Number.isNaN(repairCostNumber) ? 0 : repairCostNumber,
      generated_message: outputText,
    });

    if (jobInsert.error) {
      console.error("Job insert error:", jobInsert.error);
      return NextResponse.json(
        {
          error: `Message generated but job save failed: ${jobInsert.error.message}`,
          output_text: outputText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      output_text: outputText,
      demo_mode: false,
    });
  } catch (error) {
    console.error("POST /api/review error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}