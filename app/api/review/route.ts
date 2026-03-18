import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { PLAN_CONFIG, normalizePlan } from "@/lib/plans";
import { getWorkspaceId } from "@/lib/workspace";
import { rewriteReviewMessage } from "@/lib/rewrite";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const workspaceId = await getWorkspaceId(userId);

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", workspaceId)
      .maybeSingle();

    const plan = normalizePlan(subscription?.plan);
    const config = PLAN_CONFIG[plan];

    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();

    const { count, error: countError } = await supabase
      .from("reviews")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .gte("created_at", startOfMonth);

    if (countError) {
      return NextResponse.json(
        { error: countError.message },
        { status: 500 }
      );
    }

    const usedThisMonth = count || 0;

    if (usedThisMonth >= config.monthlyLimit) {
      return NextResponse.json(
        {
          error: `You reached your ${config.name} plan limit of ${config.monthlyLimit} messages this month.`,
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
      return NextResponse.json(
        { error: "No text provided" },
        { status: 400 }
      );
    }

    const outputText = rewriteReviewMessage({
      template,
      notes: inputText,
      customerName,
      businessName,
      reviewLink,
    });

    const { error } = await supabase.from("reviews").insert({
      user_id: userId,
      workspace_id: workspaceId,
      input_text: inputText,
      output_text: outputText,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ review: outputText });
  } catch (error) {
    console.error("Review API error:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}