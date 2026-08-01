"use server";

import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export async function inviteStaff(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    redirect("/dashboard?error=" + encodeURIComponent("Insufficient permissions to invite staff."));
  }

  const email = formData.get("email") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as "owner" | "admin" | "technician" | "front_desk" | "staff";
  const branchId = formData.get("branchId") as string;

  if (!email || !fullName || !role) {
    redirect("/dashboard/staff?error=" + encodeURIComponent("Email, full name, and role are required."));
  }

  const validRoles = ["owner", "admin", "technician", "front_desk", "staff"] as const;
  if (!validRoles.includes(role)) {
    redirect("/dashboard/staff?error=" + encodeURIComponent("Invalid role."));
  }

  if (role === "owner") {
    redirect("/dashboard/staff?error=" + encodeURIComponent("Cannot invite another owner."));
  }

  const adminRestrictedRoles = ["owner", "admin"] as const;
  if (appUser.role === "admin" && adminRestrictedRoles.includes(role as typeof adminRestrictedRoles[number])) {
    redirect("/dashboard/staff?error=" + encodeURIComponent("Admins can only invite technician, front_desk, or staff roles."));
  }

  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.access_token;

  if (!accessToken) {
    redirect("/dashboard/staff?error=" + encodeURIComponent("No active session. Please sign in again."));
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/invite-staff`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        fullName,
        role,
        branchId: branchId || null,
        organizationId: appUser.organization_id,
      }),
    },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    redirect("/dashboard/staff?error=" + encodeURIComponent(body.error ?? "Failed to invite staff."));
  }

  redirect("/dashboard/staff?success=1");
}