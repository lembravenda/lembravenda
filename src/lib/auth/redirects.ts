export const PRODUCTION_APP_URL = "https://lembravenda.vercel.app";
export const LOCAL_APP_URL = "http://localhost:3000";

export function getAuthCallbackUrl() {
  const appUrl =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
      ? PRODUCTION_APP_URL
      : LOCAL_APP_URL;

  return `${appUrl}/auth/callback`;
}
