const PLACEHOLDER_URL = "https://seu-projeto.supabase.co";
const PLACEHOLDER_KEY = "sua-chave-anon-publica";

export function getSupabaseConfig() {
  return {
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL
  };
}

export function isSupabaseConfigured() {
  const { anonKey, url } = getSupabaseConfig();

  return Boolean(
    url &&
    anonKey &&
    url !== PLACEHOLDER_URL &&
    anonKey !== PLACEHOLDER_KEY &&
    url.startsWith("https://")
  );
}
