import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const form = new URLSearchParams(rawBody);

    const paymentStatus = form.get("payment_status") || "";
    const merchantPaymentId = form.get("m_payment_id") || "";
    const pfPaymentId = form.get("pf_payment_id") || "";
    const userId = form.get("custom_str1") || "";
    const workspaceId = form.get("custom_str2") || "";
    const plan = form.get("custom_str3") || "";

    console.log("PayFast notify received:", {
      paymentStatus,
      merchantPaymentId,
      pfPaymentId,
      userId,
      workspaceId,
      plan,
    });

    if (!merchantPaymentId || !userId || !plan) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const normalizedPlan =
      plan === "agency" ? "agency" : plan === "pro" ? "pro" : "free";

    const planConfig =
      normalizedPlan === "agency"
        ? { max_users: 9999, monthly_limit: 10000 }
        : normalizedPlan === "pro"
          ? { max_users: 1, monthly_limit: 300 }
          : { max_users: 1, monthly_limit: 5 };

    const finalSubscriptionUserId = workspaceId || userId;

    if (paymentStatus === "COMPLETE") {
      const { error: paymentUpdateError } = await supabase
        .from("payments")
        .update({
          status: "complete",
          payfast_pf_payment_id: pfPaymentId,
          updated_at: new Date().toISOString(),
        })
        .eq("payfast_payment_id", merchantPaymentId);

      if (paymentUpdateError) {
        console.error("Payment update error:", paymentUpdateError);
      }

      const { error: subError } = await supabase
        .from("subscriptions")
        .upsert(
          {
            user_id: finalSubscriptionUserId,
            plan: normalizedPlan,
            max_users: planConfig.max_users,
            monthly_limit: planConfig.monthly_limit,
          },
          { onConflict: "user_id" }
        );

      if (subError) {
        console.error("Subscription update error:", subError);
        return new NextResponse("Subscription update failed", { status: 500 });
      }

      console.log("Subscription updated successfully:", {
        user_id: finalSubscriptionUserId,
        plan: normalizedPlan,
      });
    } else {
      const { error: paymentUpdateError } = await supabase
        .from("payments")
        .update({
          status: paymentStatus.toLowerCase() || "failed",
          payfast_pf_payment_id: pfPaymentId,
          updated_at: new Date().toISOString(),
        })
        .eq("payfast_payment_id", merchantPaymentId);

      if (paymentUpdateError) {
        console.error("Payment update error:", paymentUpdateError);
      }
    }

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("POST /api/payfast/notify error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}