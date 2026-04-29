"use server";

import { redirect } from "next/navigation";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";
import { getAuthState } from "@/lib/auth/server";
import { setTestProfile } from "@/lib/auth/test-mode";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type OnboardingActionState = {
  error?: string;
};

function optionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

export async function saveOnboardingAction(
  _prevState: OnboardingActionState,
  formData: FormData
): Promise<OnboardingActionState> {
  const authState = await getAuthState();

  if (!authState.user) {
    return { error: "Sua sessão expirou. Entre novamente para continuar." };
  }

  const fullName = String(formData.get("full_name") ?? "").trim();
  const primaryCategory = String(formData.get("primary_category") ?? "").trim();

  if (!fullName) {
    return { error: "Informe o nome da revendedora." };
  }

  if (!primaryCategory) {
    return { error: "Informe a categoria principal." };
  }

  const payload = {
    brand_name: optionalText(formData, "brand_name"),
    full_name: fullName,
    phone: optionalText(formData, "phone"),
    pix_key: optionalText(formData, "pix_key"),
    primary_category: primaryCategory
  };

  if (isE2EAuthModeEnabled()) {
    await setTestProfile(payload);
    redirect("/app/hoje");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      ...payload,
      id: authState.user.id,
      user_id: authState.user.id
    },
    {
      onConflict: "id"
    }
  );

  if (error) {
    return { error: "Não foi possível salvar seu perfil agora." };
  }

  redirect("/app/hoje");
}
