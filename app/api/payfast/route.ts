import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { getWorkspaceId } from "@/lib/workspace";
import crypto from "crypto";

type PayFastPlan = "pro" | "agency";
type OrderedField = [string, string];

type CheckoutBuildResult =
  | {
      ok: true;
      actionUrl: string;
      orderedFields: OrderedField[];
      fields: Record<string, string>;
    }
  | {
      ok: false;
      status: number;
      error: string;
    };

const PAYFAST_FIELD_ORDER = [
  "merchant_id",
  "merchant_key",
  "return_url",
  "cancel_url",
  "notify_url",
  "name_first",
  "name_last",
  "email_address",
  "cell_number",
  "m_payment_id",
  "amount",
  "item_name",
  "item_description",
  "custom_int1",
  "custom_int2",
  "custom_int3",
  "custom_int4",
  "custom_int5",
  "custom_str1",
  "custom_str2",
  "custom_str3",
  "custom_str4",
  "custom_str5",
  "email_confirmation",
  "confirmation_address",
  "payment_method",
] as const;

function getPayFastActionUrl(sandbox: boolean) {
  return sandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";
}

function sanitizeBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function encodePayFastValue(value: string) {
  return encodeURIComponent(value.trim())
    .replace(/%20/g, "+")
    .replace(/[!'()*]/g, (char) =>
      `%${char.charCodeAt(0).toString(16).toUpperCase()}`
    )
    .replace(/%[0-9a-f]{2}/gi, (match) => match.toUpperCase());
}

function toOrderedFields(rawFields: Record<string, string>): OrderedField[] {
  const ordered: OrderedField[] = [];

  for (const key of PAYFAST_FIELD_ORDER) {
    const value = String(rawFields[key] ?? "").trim();

    if (value !== "") {
      ordered.push([key, value]);
    }
  }

  return ordered;
}

function buildSignatureString(
  orderedFields: OrderedField[],
  passphrase?: string
) {
  const parts = orderedFields.map(
    ([key, value]) => `${key}=${encodePayFastValue(value)}`
  );

  if (passphrase && passphrase.trim() !== "") {
    parts.push(`passphrase=${encodePayFastValue(passphrase.trim())}`);
  }

  return parts.join("&");
}

function createPayFastSignature(
  orderedFields: OrderedField[],
  passphrase?: string
) {
  const dataToSign = buildSignatureString(orderedFields, passphrase);
  return crypto.createHash("md5").update(dataToSign).digest("hex");
}

function getPlanDetails(plan: PayFastPlan) {
  if (plan === "agency") {
    return {
      amount: "1199.00",
      itemName: "Agency Plan",
      itemDescription: "Roux Review Rocket Agency once-off test payment",
    };
  }

  return {
    amount: "349.00",
    itemName: "Pro Plan",
    itemDescription: "Roux Review Rocket Pro once-off test payment",
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

function orderedFieldsToObject(
  orderedFields: OrderedField[],
  signature: string
): Record<string, string> {
  return Object.fromEntries([...orderedFields, ["signature", signature]]);
}

async function buildPayFastCheckout(
  plan: PayFastPlan
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

  const email =
    user?.emailAddresses?.find((entry) => entry.id === user.primaryEmailAddressId)
      ?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";

  const firstName =
    user?.firstName?.trim() ||
    user?.fullName?.trim().split(" ")[0] ||
    "Customer";

  const lastName =
    user?.lastName?.trim() ||
    user?.fullName?.trim().split(" ").slice(1).join(" ") ||
    "";

  if (!email) {
    return {
      ok: false,
      status: 400,
      error: "A valid account email is required before payment.",
    };
  }

  const workspaceId = await getWorkspaceId(userId);
  const { amount, itemName, itemDescription } = getPlanDetails(plan);

  const merchantId = String(process.env.PAYFAST_MERCHANT_ID || "").trim();
  const merchantKey = String(process.env.PAYFAST_MERCHANT_KEY || "").trim();
  const passphrase = String(process.env.PAYFAST_PASSPHRASE || "").trim();
  const baseUrlRaw = String(process.env.NEXT_PUBLIC_BASE_URL || "").trim();
  const sandbox = String(process.env.PAYFAST_SANDBOX || "").trim() === "true";

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

  const { error: paymentInsertError } = await supabaseAdmin
    .from("payments")
    .insert({
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

  const rawFields: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${baseUrl}/payment-success`,
    cancel_url: `${baseUrl}/payment-cancel`,
    notify_url: `${baseUrl}/api/payfast/notify`,
    name_first: firstName,
    name_last: lastName,
    email_address: email,
    m_payment_id: paymentRef,
    amount,
    item_name: itemName,
    item_description: itemDescription,
    custom_str1: userId,
    custom_str2: workspaceId || "",
    custom_str3: plan,
    payment_method: "cc",
  };

  const orderedFields = toOrderedFields(rawFields);
  const signature = createPayFastSignature(orderedFields, passphrase);

  return {
    ok: true,
    actionUrl: getPayFastActionUrl(sandbox),
    orderedFields,
    fields: orderedFieldsToObject(orderedFields, signature),
  };
}

function buildAutoSubmitHtml(
  actionUrl: string,
  orderedFields: OrderedField[],
  signature: string
) {
  const inputs = [...orderedFields, ["signature", signature] as OrderedField]
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
        Please wait while we securely open PayFast for a one-time test payment.
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

  const signature = result.fields.signature;

  return new NextResponse(
    buildAutoSubmitHtml(result.actionUrl, result.orderedFields, signature),
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const planRaw = String(body.plan || "").toLowerCase();
    const plan =
      planRaw === "pro" || planRaw === "agency"
        ? (planRaw as PayFastPlan)
        : null;

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan." }, { status: 400 });
    }

    const result = await buildPayFastCheckout(plan);

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