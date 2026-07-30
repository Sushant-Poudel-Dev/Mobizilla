// supabase/functions/invite-staff/index.ts
//
// Deploy with:  supabase functions deploy invite-staff
// Called from the server action after auth verification.
// Uses service_role key to create Auth user + AppUser row atomically.
//
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "Missing Authorization header." }, 401);
    }

    const body = await req.json();
    const { email, fullName, role, branchId, organizationId } = body ?? {};

    if (!email || !fullName || !role || !organizationId) {
      return jsonResponse(
        { error: "email, fullName, role, and organizationId are required." },
        400,
      );
    }

    const validRoles = ["owner", "admin", "technician", "front_desk", "staff"];
    if (!validRoles.includes(role)) {
      return jsonResponse({ error: "Invalid role." }, 400);
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } },
    );

    // 1. Verify caller is owner/admin of this organization
    const callerJwt = authHeader.replace("Bearer ", "");
    const {
      data: { user: caller },
      error: callerError,
    } = await supabaseAdmin.auth.getUser(callerJwt);

    if (callerError || !caller) {
      return jsonResponse({ error: "Invalid or expired token." }, 401);
    }

    const { data: callerAppUser, error: callerAppUserError } = await supabaseAdmin
      .from("app_users")
      .select("role, organization_id")
      .eq("auth_user_id", caller.id)
      .is("deleted_at", null)
      .single();

    if (callerAppUserError || !callerAppUser) {
      return jsonResponse({ error: "Caller not found in organization." }, 403);
    }

    if (callerAppUser.organization_id !== organizationId) {
      return jsonResponse({ error: "Caller not in target organization." }, 403);
    }

    if (callerAppUser.role !== "owner" && callerAppUser.role !== "admin") {
      return jsonResponse({ error: "Insufficient permissions." }, 403);
    }

    // Admin cannot create owner/admin
    if (callerAppUser.role === "admin" && (role === "owner" || role === "admin")) {
      return jsonResponse(
        { error: "Admins can only invite technician, front_desk, or staff roles." },
        403,
      );
    }

    // 2. Create Auth user with temporary password (they'll set their own via email)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: crypto.randomUUID(), // random temp password
      email_confirm: true, // skip confirmation email
      user_metadata: { full_name: fullName },
    });

    if (authError || !authData.user) {
      return jsonResponse({ error: authError?.message ?? "Failed to create auth user." }, 400);
    }

    const newAuthUserId = authData.user.id;

    // 3. Create AppUser row
    const { error: appUserError } = await supabaseAdmin.from("app_users").insert({
      auth_user_id: newAuthUserId,
      organization_id: organizationId,
      branch_id: branchId || null,
      full_name: fullName,
      email,
      role,
    });

    if (appUserError) {
      // Rollback auth user on failure
      await supabaseAdmin.auth.admin.deleteUser(newAuthUserId);
      return jsonResponse({ error: appUserError.message }, 400);
    }

    // 4. Send password reset email so they can set their password
    const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: { redirectTo: `${Deno.env.get("NEXT_PUBLIC_SITE_URL")}/auth/callback` },
    });

    if (resetError) {
      console.warn("Failed to send password reset email:", resetError.message);
    }

    return jsonResponse({ success: true, userId: newAuthUserId });
  } catch (err) {
    console.error("Invite staff error:", err);
    return jsonResponse({ error: "Internal server error." }, 500);
  }
});

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}