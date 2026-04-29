import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";
import type { Database } from "@/types/database";

const PLACEHOLDER_KEY = "sua-chave-anon-publica";
const PLACEHOLDER_URL = "https://seu-projeto.supabase.co";

function isSupabaseConfigured() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return Boolean(
    url &&
    key &&
    url !== PLACEHOLDER_URL &&
    key !== PLACEHOLDER_KEY &&
    url.startsWith("https://")
  );
}

export async function middleware(request: NextRequest) {
  if (isE2EAuthModeEnabled() || !isSupabaseConfigured()) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
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
    }
  );

  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
