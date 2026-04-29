import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { isProfileComplete } from "@/lib/auth/profile";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";

function buildRedirect(request: NextRequest, path: string, message?: string) {
  const url = new URL(path, request.url);

  if (message) {
    url.searchParams.set("message", message);
  }

  return url;
}

export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      buildRedirect(
        request,
        "/login",
        "Não foi possível confirmar seu acesso agora."
      )
    );
  }

  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      buildRedirect(
        request,
        "/login",
        "O link de confirmação está incompleto ou já expirou."
      )
    );
  }

  let response = NextResponse.next({
    request
  });
  const { anonKey, url } = getSupabaseConfig();

  const supabase = createServerClient<Database>(url!, anonKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }

        response = NextResponse.next({
          request
        });

        for (const { name, options, value } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      }
    }
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      buildRedirect(
        request,
        "/login",
        "Não foi possível confirmar seu e-mail. Tente entrar novamente."
      )
    );
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      buildRedirect(
        request,
        "/login",
        "Sua confirmação foi feita, mas não conseguimos abrir sua conta agora."
      )
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  const destination = isProfileComplete(profile) ? "/app/hoje" : "/onboarding";
  const redirectResponse = NextResponse.redirect(
    new URL(destination, request.url)
  );

  for (const cookie of response.cookies.getAll()) {
    redirectResponse.cookies.set(cookie);
  }

  return redirectResponse;
}
