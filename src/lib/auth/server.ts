import "server-only";

import type { Profile } from "@/types/database";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";
import { isProfileComplete } from "@/lib/auth/profile";
import { getTestProfile, getTestSession } from "@/lib/auth/test-mode";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthenticatedUser = {
  email: string | null;
  id: string;
};

export type AuthState = {
  isConfigured: boolean;
  isProfileComplete: boolean;
  profile: Profile | null;
  user: AuthenticatedUser | null;
};

export async function getAuthState(): Promise<AuthState> {
  if (isE2EAuthModeEnabled()) {
    const session = await getTestSession();
    const profileCookie = await getTestProfile();

    if (!session) {
      return {
        isConfigured: true,
        isProfileComplete: false,
        profile: null,
        user: null
      };
    }

    const profile = profileCookie
      ? ({
          brand_name: profileCookie.brand_name,
          created_at: new Date().toISOString(),
          full_name: profileCookie.full_name,
          id: session.user.id,
          phone: profileCookie.phone,
          pix_key: profileCookie.pix_key,
          primary_category: profileCookie.primary_category,
          updated_at: new Date().toISOString(),
          user_id: session.user.id
        } satisfies Profile)
      : null;

    return {
      isConfigured: true,
      isProfileComplete: isProfileComplete(profile),
      profile,
      user: session.user
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      isConfigured: false,
      isProfileComplete: false,
      profile: null,
      user: null
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();

  // "Auth session missing!" is normal for unauthenticated users — not an actual error
  if (authError && authError.message !== "Auth session missing!") {
    throw new Error(authError.message);
  }

  if (authError || !user) {

    return {
      isConfigured: true,
      isProfileComplete: false,
      profile: null,
      user: null
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  return {
    isConfigured: true,
    isProfileComplete: isProfileComplete(profile),
    profile,
    user: {
      email: user.email ?? null,
      id: user.id
    }
  };
}
