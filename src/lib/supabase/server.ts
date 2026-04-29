import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para usar autenticação."
    );
  }

  const cookieStore = await cookies();
  const { anonKey, url } = getSupabaseConfig();

  return createServerClient<Database>(url!, anonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, options, value } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components podem ler cookies mesmo sem permissão de escrita.
        }
      }
    }
  });
}
