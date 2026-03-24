import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getWorkspaceId } from "@/lib/workspace";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workspaceId = await getWorkspaceId(userId);

    const { data: latestPayment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("workspace_id", workspaceId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (paymentError) {
      return NextResponse.json({ error: paymentError.message }, { status: 500 });
    }

    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", workspaceId)
      .maybeSingle();

    if (subError) {
      return NextResponse.json({ error: subError.message }, { status: 500 });
    }

    return NextResponse.json({
      latestPayment: latestPayment || null,
      subscription: subscription || null,
    });
  } catch (error) {
    console.error("GET /api/payment-status error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}