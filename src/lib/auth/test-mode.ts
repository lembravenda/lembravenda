import "server-only";

import { cookies } from "next/headers";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";

const TEST_PROFILE_COOKIE = "agenda_test_profile";
const TEST_SESSION_COOKIE = "agenda_test_session";

type TestSession = {
  user: {
    email: string;
    id: string;
  };
};

type TestProfileCookie = {
  brand_name: string | null;
  full_name: string;
  phone: string | null;
  pix_key: string | null;
  primary_category: string;
};

function parseCookieValue<T>(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function getTestSession() {
  if (!isE2EAuthModeEnabled()) {
    return null;
  }

  const cookieStore = await cookies();

  return parseCookieValue<TestSession>(
    cookieStore.get(TEST_SESSION_COOKIE)?.value
  );
}

export async function setTestSession(session: TestSession) {
  if (!isE2EAuthModeEnabled()) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set(TEST_SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function clearTestSession() {
  if (!isE2EAuthModeEnabled()) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.delete(TEST_SESSION_COOKIE);
  cookieStore.delete(TEST_PROFILE_COOKIE);
}

export async function getTestProfile() {
  if (!isE2EAuthModeEnabled()) {
    return null;
  }

  const cookieStore = await cookies();

  return parseCookieValue<TestProfileCookie>(
    cookieStore.get(TEST_PROFILE_COOKIE)?.value
  );
}

export async function setTestProfile(profile: TestProfileCookie) {
  if (!isE2EAuthModeEnabled()) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set(TEST_PROFILE_COOKIE, JSON.stringify(profile), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}
