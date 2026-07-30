import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

export const getCurrentAppUser = cache(async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: appUser } = await supabase
    .from("app_users")
    .select("id, organization_id, branch_id, full_name, email, role")
    .eq("auth_user_id", user.id)
    .is("deleted_at", null)
    .single();

  return appUser;
});

export async function requireAppUser() {
  const appUser = await getCurrentAppUser();
  if (!appUser) {
    redirect("/login");
  }
  return appUser;
}