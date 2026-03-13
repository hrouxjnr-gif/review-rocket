import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const FREE_PLAN_LIMIT = 5;

function buildMessageByTemplate(
  template: string,
  notes: string,
  customerName: string,
  businessName: string,
  reviewLink: string
) {
  const cleanNotes = notes.trim();
  const formattedNotes =
    cleanNotes.charAt(0).toUpperCase() + cleanNotes.slice(1);

  const customer = customerName || "there";
  const business = businessName || "our business";

  if (template === "short-sms") {
    return `Hi ${customer}, thanks for choosing ${business}. ${formattedNotes}. If you have a moment, please leave us a quick review here: ${reviewLink || "[review link]"}`;
  }

  if (template === "professional") {
    return `Hello ${customer},

Thank you for choosing ${business}.

${formattedNotes}.

If you were satisfied with the service provided, we would sincerely appreciate a review.

${
  reviewLink
    ? `Please leave your review here:
${reviewLink}

`
    : ""
}Thank you for your support.`;
  }

  if (template === "follow-up") {
    return `Hi ${customer},

Just following up from ${business}.

We recently completed your job and wanted to thank you again for your support.

If you have a moment, we would really appreciate a review.

${
  reviewLink
    ? `Leave your review here:
${reviewLink}

`
    : ""
}Thank you again.`;
  }

  return `Hi ${customer},

Thanks for choosing ${business}.

${formattedNotes}.

If you have a moment, we would really appreciate a quick review. It helps our business a lot.

${
  reviewLink
    ? `Leave your review here:
${reviewLink}

`
    : ""
}Thank you again for your support!`;
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count, error: countError } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  const usedThisMonth = count || 0;

  if (usedThisMonth >= FREE_PLAN_LIMIT) {
    return NextResponse.json(
      {
        error: `You reached your free limit of ${FREE_PLAN_LIMIT} messages this month.`,
      },
      { status: 403 }
    );
  }

  const body = await req.json();
  const inputText = body.text?.trim();
  const customerName = body.customerName?.trim() || "";
  const businessName = body.businessName?.trim() || "";
  const reviewLink = body.reviewLink?.trim() || "";
  const template = body.template?.trim() || "friendly";

  if (!inputText) {
    return NextResponse.json({ error: "No text provided" }, { status: 400 });
  }

  const outputText = buildMessageByTemplate(
    template,
    inputText,
    customerName,
    businessName,
    reviewLink
  );

  const { error } = await supabase.from("reviews").insert({
    user_id: userId,
    input_text: inputText,
    output_text: outputText,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ review: outputText });
}