import { defineConfig, devices } from "@playwright/test";

const host = process.env.PLAYWRIGHT_HOST ?? "127.0.0.1";
const port = Number.parseInt(process.env.PLAYWRIGHT_PORT ?? "3200", 10);
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL ?? `http://${host}:${String(port)}`;
const shouldManageWebServer = process.env.PLAYWRIGHT_SKIP_WEBSERVER !== "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  webServer: shouldManageWebServer
    ? {
        command: [
          `E2E_AUTH_MODE=enabled`,
          `NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co`,
          `NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica`,
          `next dev --hostname ${host} --port ${String(port)}`
        ].join(" "),
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000
      }
    : undefined,
  projects: [
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] }
    }
  ]
});
