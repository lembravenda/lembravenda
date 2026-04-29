"use server";

import { redirect } from "next/navigation";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";
import { clearTestSession } from "@/lib/auth/test-mode";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function logoutAction() {
  if (isE2EAuthModeEnabled()) {
    await clearTestSession();
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();

  await supabase.auth.signOut();

  redirect("/login");
}
