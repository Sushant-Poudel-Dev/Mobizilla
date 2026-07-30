import { createClient } from "@/src/lib/supabase/server";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export async function getStaff() {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("app_users")
    .select("id, email, full_name, role, branch_id, created_at")
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching staff:", error);
    return [];
  }

  return data ?? [];
}

export async function getBranches() {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("branches")
    .select("id, branch_name")
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("branch_name", { ascending: true });

  if (error) {
    console.error("Error fetching branches:", error);
    return [];
  }

  return data ?? [];
}