import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({
        signedIn: false,
        name: "",
        email: "",
      });
    }

    const user = await currentUser();

    const firstName = user?.firstName || "";
    const lastName = user?.lastName || "";
    const name = `${firstName} ${lastName}`.trim();

    const email =
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      "";

    return NextResponse.json({
      signedIn: true,
      name,
      email,
    });
  } catch (error) {
    console.error("GET /api/feedback error:", error);
    return NextResponse.json(
      { error: "Failed to load feedback profile" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please sign in before sending feedback." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const name = body.name?.trim() || "";
    const email = body.email?.trim() || "";
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("feedback")
      .insert({
        user_id: userId,
        name,
        email,
        subject,
        message,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase feedback insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ feedback: data });
  } catch (error) {
    console.error("POST /api/feedback error:", error);
    return NextResponse.json(
      { error: "Failed to send feedback" },
      { status: 500 }
    );
  }
}