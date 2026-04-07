import "server-only";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function getWorkspaceId(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("team_members")
    .select("owner_user_id")
    .eq("member_user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("getWorkspaceId error:", error);
    return userId;
  }

  if (data?.owner_user_id) {
    return data.owner_user_id;
  }

  return userId;
}
