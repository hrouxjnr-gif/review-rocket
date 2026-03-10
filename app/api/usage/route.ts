import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const count = data?.length || 0;

    return NextResponse.json({
      used: count,
      limit: 10,
      remaining: Math.max(0, 10 - count),
    });
  } catch (err) {
    console.error("Usage API error:", err);

    return NextResponse.json(
      { error: "Usage API crashed" },
      { status: 500 }
    );
  }
}