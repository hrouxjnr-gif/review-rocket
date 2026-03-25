import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

function emptySettings() {
  return {
    business_name: "",
    review_link: "",
    currency: "R",
    business_email: "",
    business_phone: "",
    business_address: "",
  };
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from("settings")
      .select(
        "business_name, review_link, currency, business_email, business_phone, business_address"
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("GET /api/settings error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: data || emptySettings(),
    });
  } catch (error) {
    console.error("GET /api/settings unexpected error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const payload = {
      user_id: userId,
      business_name: String(body.businessName || "").trim(),
      review_link: String(body.reviewLink || "").trim(),
      currency: String(body.currency || "R").trim(),
      business_email: String(body.businessEmail || "").trim(),
      business_phone: String(body.businessPhone || "").trim(),
      business_address: String(body.businessAddress || "").trim(),
    };

    const { data, error } = await supabase
      .from("settings")
      .upsert(payload, { onConflict: "user_id" })
      .select(
        "business_name, review_link, currency, business_email, business_phone, business_address"
      )
      .single();

    if (error) {
      console.error("POST /api/settings error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: data,
    });
  } catch (error) {
    console.error("POST /api/settings unexpected error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}