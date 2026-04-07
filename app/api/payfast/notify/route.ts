import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { PLAN_CONFIG, normalizePlan } from "@/lib/plans";
import crypto from "crypto";

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function createSignatureFromPayFastBody(
  form: URLSearchParams,
  passphrase?: string
) {
  const params = new URLSearchParams();

  for (const [key, value] of form.entries()) {
    const clean = String(value ?? "").trim();

    if (key === "signature" || clean === "") {
      continue;
    }

    params.append(key, clean);
  }

  if (passphrase && passphrase.trim() !== "") {
    params.append("passphrase", passphrase.trim());
  }

  return crypto.createHash("md5").update(params.toString()).digest("hex");
}

function getPayFastValidateUrl(sandbox: boolean) {
  return sandbox
    ? "https://sandbox.payfast.co.za/eng/query/validate"
    : "https://www.payfast.co.za/eng/query/validate";
}

async function updatePaymentRow(
  merchantPaymentId: string,
  updates: Record<string, string | number>
) {
  const { error } = await supabaseAdmin
    .from("payments")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("payfast_payment_id", merchantPaymentId);

  if (error) {
    throw error;
  }
}

async function updatePaymentRowWithOptionalToken(
  merchantPaymentId: string,
  updates: Record<string, string | number>,
  payfastToken: string
) {
  if (!payfastToken) {
    await updatePaymentRow(merchantPaymentId, updates);
    return;
  }

  const { error } = await supabaseAdmin
    .from("payments")
    .update({
      ...updates,
      payfast_token: payfastToken,
      updated_at: new Date().toISOString(),
    } as any)
    .eq("payfast_payment_id", merchantPaymentId);

  if (!error) {
    return;
  }

  console.warn(
    "Could not store payfast_token on payments, falling back without token:",
    error.message
  );

  await updatePaymentRow(merchantPaymentId, updates);
}

async function upsertSubscriptionWithOptionalToken(
  subscriptionOwnerId: string,
  plan: "free" | "pro" | "agency",
  payfastToken: string
) {
  const config = PLAN_CONFIG[plan];

  const payload = {
    user_id: subscriptionOwnerId,
    plan,
    max_users: config.maxUsers,
    monthly_limit: config.monthlyLimit,
  };

  if (!payfastToken) {
    const { error } = await supabaseAdmin
      .from("subscriptions")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      throw error;
    }

    return;
  }

  const { error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(
      {
        ...payload,
        payfast_token: payfastToken,
      } as any,
      { onConflict: "user_id" }
    );

  if (!error) {
    return;
  }

  console.warn(
    "Could not store payfast_token on subscriptions, falling back without token:",
    error.message
  );

  const { error: fallbackError } = await supabaseAdmin
    .from("subscriptions")
    .upsert(payload, { onConflict: "user_id" });

  if (fallbackError) {
    throw fallbackError;
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const form = new URLSearchParams(rawBody);

    const sandbox = process.env.PAYFAST_SANDBOX === "true";
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";

    const submittedSignature = form.get("signature") || "";
    const generatedSignature = createSignatureFromPayFastBody(form, passphrase);

    if (!submittedSignature || !safeEqual(submittedSignature, generatedSignature)) {
      console.error("PayFast notify signature mismatch");
      return new NextResponse("Invalid signature", { status: 400 });
    }

    const validationRes = await fetch(getPayFastValidateUrl(sandbox), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: rawBody,
      cache: "no-store",
    });

    const validationText = (await validationRes.text()).trim();

    if (validationText !== "VALID") {
      console.error("PayFast ITN validation failed:", validationText);
      return new NextResponse("Invalid ITN data", { status: 400 });
    }

    const paymentStatusRaw = String(form.get("payment_status") || "").trim();
    const paymentStatusUpper = paymentStatusRaw.toUpperCase();
    const merchantPaymentId = String(form.get("m_payment_id") || "").trim();
    const pfPaymentId = String(form.get("pf_payment_id") || "").trim();
    const payfastToken = String(form.get("token") || "").trim();
    const amountGross = Number(form.get("amount_gross") || "0");

    if (!merchantPaymentId) {
      return new NextResponse("Missing merchant payment id", { status: 400 });
    }

    const { data: paymentRow, error: paymentLookupError } = await supabaseAdmin
      .from("payments")
      .select("user_id, workspace_id, plan, amount, status")
      .eq("payfast_payment_id", merchantPaymentId)
      .maybeSingle();

    if (paymentLookupError) {
      console.error("Payment lookup error:", paymentLookupError);
      return new NextResponse("Payment lookup failed", { status: 500 });
    }

    if (!paymentRow) {
      return new NextResponse("Payment not found", { status: 404 });
    }

    const incomingUserId = String(form.get("custom_str1") || "").trim();
    const incomingWorkspaceId = String(form.get("custom_str2") || "").trim();
    const incomingPlan = String(form.get("custom_str3") || "").trim();

    const resolvedUserId = incomingUserId || String(paymentRow.user_id || "").trim();
    const resolvedWorkspaceId =
      incomingWorkspaceId || String(paymentRow.workspace_id || "").trim();
    const resolvedPlan = normalizePlan(incomingPlan || String(paymentRow.plan || ""));
    const subscriptionOwnerId = resolvedWorkspaceId || resolvedUserId;

    if (!subscriptionOwnerId) {
      console.error("Could not resolve subscription owner from ITN", {
        merchantPaymentId,
        incomingUserId,
        incomingWorkspaceId,
        paymentRow,
      });
      return new NextResponse("Missing subscription owner", { status: 400 });
    }

    if (
      paymentStatusUpper === "COMPLETE" &&
      Number.isFinite(amountGross) &&
      amountGross > 0 &&
      Math.abs(Number(paymentRow.amount) - amountGross) > 0.01
    ) {
      console.error("PayFast amount mismatch", {
        storedAmount: paymentRow.amount,
        amountGross,
        merchantPaymentId,
      });
      return new NextResponse("Amount mismatch", { status: 400 });
    }

    if (paymentStatusUpper === "COMPLETE") {
      await updatePaymentRowWithOptionalToken(
        merchantPaymentId,
        {
          status: "complete",
          payfast_pf_payment_id: pfPaymentId,
        },
        payfastToken
      );

      await upsertSubscriptionWithOptionalToken(
        subscriptionOwnerId,
        resolvedPlan,
        payfastToken
      );

      return new NextResponse("OK", { status: 200 });
    }

    const normalizedStatus = paymentStatusRaw
      ? paymentStatusRaw.toLowerCase()
      : "failed";

    await updatePaymentRowWithOptionalToken(
      merchantPaymentId,
      {
        status: normalizedStatus,
        payfast_pf_payment_id: pfPaymentId,
      },
      payfastToken
    );

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("POST /api/payfast/notify error:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}