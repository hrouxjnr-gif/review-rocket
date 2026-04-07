import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getWorkspaceId } from "@/lib/workspace";
import crypto from "crypto";

type PayFastPlan = "pro" | "agency";

type CheckoutBuildResult =
  | {
      ok: true;
      actionUrl: string;
      fields: Record<string, string>;
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

type CheckoutOverrides = {
  email?: string;
  name?: string;
};

function getPayFastActionUrl(sandbox: boolean) {
  return sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";
}

function sanitizeBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function buildPayFastQueryString(
  fields: Record<string, string>,
  passphrase?: string
) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(fields)) {
    const clean = String(value ?? "").trim();

    if (clean !== "") {
      params.append(key, clean);
    }
  }

  if (passphrase && passphrase.trim() !== "") {
    params.append("passphrase", passphrase.trim());
  }

  return params.toString();
}

function createPayFastSignature(
  fields: Record<string, string>,
  passphrase?: string
) {
  const dataToSign = buildPayFastQueryString(fields, passphrase);
  return crypto.createHash("md5").update(dataToSign).digest("hex");
}

function formatDateYYYYMMDD(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addMonthsPreservingDay(date: Date, months: number) {
  const year = date.getUTCFullYear();
  const monthIndex = date.getUTCMonth() + months;
  const dayOfMonth = date.getUTCDate();

  const candidate = new Date(Date.UTC(year, monthIndex, 1));
  const lastDayOfTargetMonth = new Date(
    Date.UTC(candidate.getUTCFullYear(), candidate.getUTCMonth() + 1, 0)
  ).getUTCDate();

  candidate.setUTCDate(Math.min(dayOfMonth, lastDayOfTargetMonth));

  return candidate;
}

function getPlanDetails(plan: PayFastPlan) {
  if (plan === "agency") {
    return {
      amount: "1199.00",
      itemName: "Agency Plan",
    };
  }

  return {
    amount: "349.00",
    itemName: "Pro Plan",
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function buildPayFastCheckout(
  plan: PayFastPlan,
  overrides?: CheckoutOverrides
): Promise<CheckoutBuildResult> {
  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false,
      status: 401,
      error: "Please sign in before upgrading.",
    };
  }

  const user = await currentUser();

  const fallbackEmail =
    user?.emailAddresses?.find((entry) => entry.id === user.primaryEmailAddressId)
      ?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";

  const fallbackName = user?.fullName || user?.firstName || "Customer";

  const email = String(overrides?.email || fallbackEmail).trim();
  const displayName = String(overrides?.name || fallbackName).trim() || "Customer";

  if (!email) {
    return {
      ok: false,
      status: 400,
      error: "A valid account email is required before payment.",
    };
  }

  const workspaceId = await getWorkspaceId(userId);
  const { amount, itemName } = getPlanDetails(plan);

  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
  const passphrase = process.env.PAYFAST_PASSPHRASE || "";
  const baseUrlRaw = process.env.NEXT_PUBLIC_BASE_URL;
  const sandbox = process.env.PAYFAST_SANDBOX === "true";

  if (!merchantId || !merchantKey || !baseUrlRaw) {
    return {
      ok: false,
      status: 500,
      error: "Missing PayFast environment variables.",
    };
  }

  if (!sandbox && !passphrase) {
    return {
      ok: false,
      status: 500,
      error: "Missing PAYFAST_PASSPHRASE for live payments.",
    };
  }

  const baseUrl = sanitizeBaseUrl(baseUrlRaw);
  const paymentRef = crypto.randomUUID();
  const nextBillingDate = formatDateYYYYMMDD(
    addMonthsPreservingDay(new Date(), 1)
  );

  const { error: paymentInsertError } = await supabaseAdmin.from("payments").insert({
    user_id: userId,
    workspace_id: workspaceId,
    plan,
    provider: "payfast",
    status: "pending",
    amount: Number(amount),
    payfast_payment_id: paymentRef,
    email,
  });

  if (paymentInsertError) {
    return {
      ok: false,
      status: 500,
      error: paymentInsertError.message,
    };
  }

  const fields: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${baseUrl}/payment-success`,
    cancel_url: `${baseUrl}/payment-cancel`,
    notify_url: `${baseUrl}/api/payfast/notify`,
    name_first: displayName,
    email_address: email,
    m_payment_id: paymentRef,
    amount,
    item_name: itemName,
    payment_method: "cc",
    custom_str1: userId,
    custom_str2: workspaceId || "",
    custom_str3: plan,

    // Real PayFast subscription fields
    subscription_type: "1",
    billing_date: nextBillingDate,
    recurring_amount: amount,
    frequency: "3",
    cycles: "0",
  };

  const signature = createPayFastSignature(fields, passphrase);

  return {
    ok: true,
    actionUrl: getPayFastActionUrl(sandbox),
    fields: {
      ...fields,
      signature,
    },
  };
}

function buildAutoSubmitHtml(actionUrl: string, fields: Record<string, string>) {
  const inputs = Object.entries(fields)
    .map(
      ([key, value]) =>
        `<input type="hidden" name="${escapeHtml(key)}" value="${escapeHtml(
          String(value)
        )}" />`
    )
    .join("\n");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Redirecting to PayFast</title>
  </head>
  <body style="font-family: system-ui, sans-serif; background: #0b1220; color: #f8fafc; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 24px;">
    <div style="max-width: 520px; width: 100%; background: #111827; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 24px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.35);">
      <h1 style="margin: 0 0 12px; font-size: 28px;">Redirecting to PayFast</h1>
      <p style="margin: 0 0 18px; line-height: 1.7; color: #cbd5e1;">
        Please wait while we securely open PayFast and set up your monthly subscription.
      </p>

      <form id="payfast-form" method="POST" action="${escapeHtml(actionUrl)}">
        ${inputs}
        <noscript>
          <button
            type="submit"
            style="padding: 12px 18px; border-radius: 12px; border: 0; background: #2563eb; color: white; font-weight: 700; cursor: pointer;"
          >
            Continue to PayFast
          </button>
        </noscript>
      </form>
    </div>

    <script>
      document.getElementById("payfast-form")?.submit();
    </script>
  </body>
</html>`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const planParam = String(url.searchParams.get("plan") || "").toLowerCase();
  const plan =
    planParam === "pro" || planParam === "agency"
      ? (planParam as PayFastPlan)
      : null;

  if (!plan) {
    return NextResponse.redirect(new URL("/pricing", url.origin));
  }

  const result = await buildPayFastCheckout(plan);

  if (!result.ok) {
    if (result.status === 401) {
      return NextResponse.redirect(new URL(`/pricing?buy=${plan}`, url.origin));
    }

    return new NextResponse(
      `<!doctype html><html><body style="font-family:system-ui,sans-serif;padding:24px;"><h1>Payment Error</h1><p>${escapeHtml(
        result.error
      )}</p><p><a href="/pricing">Back to pricing</a></p></body></html>`,
      {
        status: result.status,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
        },
      }
    );
  }

  return new NextResponse(buildAutoSubmitHtml(result.actionUrl, result.fields), {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in before upgrading." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const planRaw = String(body.plan || "").toLowerCase();
    const plan =
      planRaw === "pro" || planRaw === "agency"
        ? (planRaw as PayFastPlan)
        : null;

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const result = await buildPayFastCheckout(plan, {
      email: String(body.email || ""),
      name: String(body.name || ""),
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      actionUrl: result.actionUrl,
      fields: result.fields,
    });
  } catch (error) {
    console.error("POST /api/payfast error:", error);
    return NextResponse.json({ error: "Payment failed." }, { status: 500 });
  }
}