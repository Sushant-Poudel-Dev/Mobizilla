// supabase/functions/onboard-organization/index.ts
//
// Deploy with:  supabase functions deploy onboard-organization
// Call from the client right after supabase.auth.signUp() succeeds and the
// user has an active session (access token) — pass that token as a Bearer
// header, NOT the anon key alone, so we can identify who is calling.
//
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically into
// every Edge Function's environment by Supabase — no need to set them yourself.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // tighten to your app's origin before going live
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
    const {
      businessName,
      currency,
      branchName,
      fullName,
      email,
      address,
      phoneNumber,
    } = body ?? {};

    if (!businessName || !currency || !branchName || !fullName || !email) {
      return jsonResponse(
        { error: "businessName, currency, branchName, fullName, and email are required." },
        400
      );
    }

    // 1. Identify the caller from their own access token (anon-key client).
    //    We never trust a client-supplied auth_user_id — only what the
    //    verified JWT says, so no one can onboard a user other than themselves.
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userError } = await anonClient.auth.getUser();
    if (userError || !userData?.user) {
      return jsonResponse({ error: "Invalid or expired session." }, 401);
    }
    const authUserId = userData.user.id;

    // 2. Do the actual work with the service_role client, which is the only
    //    role allowed to execute onboard_organization (see the SQL grant).
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data, error } = await serviceClient.rpc("onboard_organization", {
      p_auth_user_id: authUserId,
      p_business_name: businessName,
      p_currency: currency,
      p_branch_name: branchName,
      p_full_name: fullName,
      p_email: email,
      p_address: address ?? null,
      p_phone_number: phoneNumber ?? null,
    });

    if (error) {
      // e.g. "This user already belongs to an organization." from the SQL function
      return jsonResponse({ error: error.message }, 409);
    }

    return jsonResponse({ success: true, ...data?.[0] }, 201);
  } catch (err) {
    console.error(err);
    return jsonResponse({ error: "Unexpected server error." }, 500);
  }
});

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
