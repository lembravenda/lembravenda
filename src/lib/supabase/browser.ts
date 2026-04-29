"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY para usar autenticação."
    );
  }

  if (!browserClient) {
    const { anonKey, url } = getSupabaseConfig();

    browserClient = createBrowserClient<Database>(url!, anonKey!);
  }

  return browserClient;
}
