"use server";

import { createClient } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const businessName = formData.get("businessName") as string;
  const branchName = formData.get("branchName") as string;
  const currency = formData.get("currency") as string;

  if (!email || !password || !fullName || !businessName || !branchName || !currency) {
    redirect("/signup?error=" + encodeURIComponent("All fields are required."));
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.session) {
    redirect(
      "/signup?error=" +
        encodeURIComponent(
          error?.message ??
            "No session returned after signup — check that 'Confirm email' is turned off in Supabase Auth settings for now.",
        ),
    );
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/onboard-organization`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessName, currency, branchName, fullName, email }),
    },
  );

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    redirect("/signup?error=" + encodeURIComponent(body.error ?? "Onboarding failed."));
  }

  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    redirect("/login?error=" + encodeURIComponent("Email and password are required."));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/login?error=" + encodeURIComponent(error.message));
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}