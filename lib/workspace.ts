import { supabase } from "@/lib/supabase";

export async function getWorkspaceId(userId: string) {
  const { data } = await supabase
    .from("team_members")
    .select("owner_user_id")
    .eq("member_user_id", userId)
    .maybeSingle();

  if (data?.owner_user_id) {
    return data.owner_user_id;
  }

  return userId;
}