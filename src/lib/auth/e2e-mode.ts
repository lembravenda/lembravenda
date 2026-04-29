export function isE2EAuthModeEnabled() {
  return (
    process.env.E2E_AUTH_MODE === "enabled" &&
    process.env.NODE_ENV !== "production"
  );
}
