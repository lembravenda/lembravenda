"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";
import { getAuthState } from "@/lib/auth/server";
import { setTestSession } from "@/lib/auth/test-mode";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  success?: string;
};

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      email,
      error: "Preencha e-mail e senha para continuar.",
      password
    };
  }

  if (password.length < 6) {
    return {
      email,
      error: "A senha precisa ter pelo menos 6 caracteres.",
      password
    };
  }

  return { email, password };
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const credentials = readCredentials(formData);

  if ("error" in credentials) {
    return { error: credentials.error };
  }

  if (isE2EAuthModeEnabled()) {
    await setTestSession({
      user: {
        email: credentials.email,
        id: randomUUID()
      }
    });

    redirect("/onboarding");
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para usar autenticação."
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return {
      error: "Não foi possível entrar. Confira e-mail e senha."
    };
  }

  const authState = await getAuthState();

  redirect(authState.isProfileComplete ? "/app/hoje" : "/onboarding");
}

export async function signupAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const credentials = readCredentials(formData);

  if ("error" in credentials) {
    return { error: credentials.error };
  }

  if (isE2EAuthModeEnabled()) {
    await setTestSession({
      user: {
        email: credentials.email,
        id: randomUUID()
      }
    });

    redirect("/onboarding");
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para usar autenticação."
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp(credentials);

  if (error) {
    return {
      error: "Não foi possível criar a conta. Tente usar outro e-mail."
    };
  }

  if (!data.session) {
    return {
      success:
        "Conta criada. Confirme seu e-mail para continuar o primeiro acesso."
    };
  }

  redirect("/onboarding");
}
