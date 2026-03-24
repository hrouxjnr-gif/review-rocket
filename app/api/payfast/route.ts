import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";
import { getWorkspaceId } from "@/lib/workspace";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = await getWorkspaceId(userId);
    const body = await req.json();

    const plan = body.plan as "pro" | "agency";
    const email = String(body.email || "").trim();
    const name = String(body.name || "Customer").trim();

    if (!plan || !["pro", "agency"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // PayFast charges in ZAR
    const amount = plan === "pro" ? "349.00" : "1199.00";

    const merchant_id = process.env.PAYFAST_MERCHANT_ID;
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!merchant_id || !merchant_key || !baseUrl) {
      return NextResponse.json(
        { error: "Missing PayFast environment variables" },
        { status: 500 }
      );
    }

    const paymentRef = crypto.randomUUID();

    const { error: paymentError } = await supabase.from("payments").insert({
      user_id: userId,
      workspace_id: workspaceId,
      plan,
      provider: "payfast",
      status: "pending",
      amount: Number(amount),
      payfast_payment_id: paymentRef,
      email,
    });

    if (paymentError) {
      return NextResponse.json({ error: paymentError.message }, { status: 500 });
    }

    const data = {
      merchant_id,
      merchant_key,
      return_url: `${baseUrl}/payment-success`,
      cancel_url: `${baseUrl}/payment-cancel`,
      notify_url: `${baseUrl}/api/payfast/notify`,
      name_first: name,
      email_address: email,
      m_payment_id: paymentRef,
      amount,
      item_name: plan === "pro" ? "Pro Plan" : "Agency Plan",
      custom_str1: userId,
      custom_str2: workspaceId,
      custom_str3: plan,
    };

    const paymentUrl =
      "https://sandbox.payfast.co.za/eng/process?" +
      new URLSearchParams(data).toString();

    return NextResponse.json({ url: paymentUrl });
  } catch (error) {
    console.error("POST /api/payfast error:", error);
    return NextResponse.json({ error: "Payment failed" }, { status: 500 });
  }
}