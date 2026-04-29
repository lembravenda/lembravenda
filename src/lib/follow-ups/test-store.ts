import "server-only";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { FollowUp } from "@/types/database";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";

const TEST_FOLLOW_UPS_COOKIE = "agenda_test_follow_ups";

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

async function getFollowUpsStore() {
  if (!isE2EAuthModeEnabled()) {
    return [];
  }

  const cookieStore = await cookies();

  return (
    parseCookieValue<FollowUp[]>(
      cookieStore.get(TEST_FOLLOW_UPS_COOKIE)?.value
    ) ?? []
  );
}

async function saveFollowUpsStore(followUps: FollowUp[]) {
  if (!isE2EAuthModeEnabled()) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set(TEST_FOLLOW_UPS_COOKIE, JSON.stringify(followUps), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function listTestFollowUps(
  userId: string,
  type?: FollowUp["type"]
) {
  const followUps = await getFollowUpsStore();

  return followUps.filter((followUp) => {
    if (followUp.user_id !== userId) {
      return false;
    }

    if (type && followUp.type !== type) {
      return false;
    }

    return true;
  });
}

export async function upsertTestRepurchaseFollowUp(input: {
  customer_id: string;
  due_date: string;
  message_snapshot: string;
  order_id: string;
  product_id: string;
  status: FollowUp["status"];
  user_id: string;
}) {
  const followUps = await getFollowUpsStore();
  const followUpIndex = followUps.findIndex(
    (followUp) =>
      followUp.user_id === input.user_id &&
      followUp.type === "repurchase" &&
      followUp.customer_id === input.customer_id &&
      followUp.product_id === input.product_id &&
      followUp.order_id === input.order_id
  );
  const timestamp = new Date().toISOString();

  if (followUpIndex >= 0) {
    const nextFollowUp: FollowUp = {
      ...followUps[followUpIndex],
      dismissed_at:
        input.status === "dismissed"
          ? (followUps[followUpIndex].dismissed_at ?? timestamp)
          : null,
      done_at:
        input.status === "done"
          ? (followUps[followUpIndex].done_at ?? timestamp)
          : null,
      due_date: input.due_date,
      message_snapshot: input.message_snapshot,
      status: input.status,
      updated_at: timestamp
    };

    const nextFollowUps = [...followUps];
    nextFollowUps[followUpIndex] = nextFollowUp;
    await saveFollowUpsStore(nextFollowUps);

    return nextFollowUp;
  }

  const followUp: FollowUp = {
    created_at: timestamp,
    customer_id: input.customer_id,
    dismissed_at: input.status === "dismissed" ? timestamp : null,
    done_at: input.status === "done" ? timestamp : null,
    due_date: input.due_date,
    id: randomUUID(),
    message_snapshot: input.message_snapshot,
    order_id: input.order_id,
    product_id: input.product_id,
    status: input.status,
    type: "repurchase",
    updated_at: timestamp,
    user_id: input.user_id
  };

  await saveFollowUpsStore([...followUps, followUp]);

  return followUp;
}
