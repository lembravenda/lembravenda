import test from "node:test";
import assert from "node:assert/strict";
import nextConfig, { SECURITY_HEADERS } from "../../next.config.ts";

test("expõe headers básicos de segurança", async () => {
  assert.ok(Array.isArray(SECURITY_HEADERS));

  const routes = await nextConfig.headers();
  assert.equal(routes.length, 1);
  assert.equal(routes[0].source, "/(.*)");

  const headers = Object.fromEntries(
    routes[0].headers.map((header) => [header.key, header.value])
  );

  assert.equal(headers["X-Frame-Options"], "DENY");
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.equal(
    headers["Permissions-Policy"],
    "camera=(), microphone=(), geolocation=()"
  );
  assert.equal(
    headers["Strict-Transport-Security"],
    "max-age=63072000; includeSubDomains; preload"
  );
});
