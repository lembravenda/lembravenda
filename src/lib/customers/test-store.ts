import "server-only";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { Customer } from "@/types/database";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";

const TEST_CUSTOMERS_COOKIE = "agenda_test_customers";

type TestCustomerDraft = Pick<
  Customer,
  "birthday" | "name" | "notes" | "phone" | "tags"
>;

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

async function getCustomerStore() {
  if (!isE2EAuthModeEnabled()) {
    return [];
  }

  const cookieStore = await cookies();

  return (
    parseCookieValue<Customer[]>(
      cookieStore.get(TEST_CUSTOMERS_COOKIE)?.value
    ) ?? []
  );
}

async function saveCustomerStore(customers: Customer[]) {
  if (!isE2EAuthModeEnabled()) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set(TEST_CUSTOMERS_COOKIE, JSON.stringify(customers), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function listTestCustomers(userId: string, search: string) {
  const normalizedSearch = search.trim().toLowerCase();
  const customers = await getCustomerStore();

  return customers
    .filter((customer) => customer.user_id === userId)
    .filter((customer) => {
      if (!normalizedSearch) {
        return true;
      }

      return [customer.name, customer.phone ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    })
    .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}

export async function getTestCustomerById(id: string, userId: string) {
  const customers = await getCustomerStore();

  return (
    customers.find(
      (customer) => customer.id === id && customer.user_id === userId
    ) ?? null
  );
}

export async function createTestCustomer(
  userId: string,
  draft: TestCustomerDraft
) {
  const customers = await getCustomerStore();
  const timestamp = new Date().toISOString();

  const customer: Customer = {
    birthday: draft.birthday,
    created_at: timestamp,
    id: randomUUID(),
    name: draft.name,
    notes: draft.notes,
    phone: draft.phone,
    tags: draft.tags,
    updated_at: timestamp,
    user_id: userId
  };

  await saveCustomerStore([...customers, customer]);

  return customer;
}

export async function updateTestCustomer(
  id: string,
  userId: string,
  draft: TestCustomerDraft
) {
  const customers = await getCustomerStore();
  const customerIndex = customers.findIndex(
    (customer) => customer.id === id && customer.user_id === userId
  );

  if (customerIndex < 0) {
    return null;
  }

  const nextCustomer: Customer = {
    ...customers[customerIndex],
    birthday: draft.birthday,
    name: draft.name,
    notes: draft.notes,
    phone: draft.phone,
    tags: draft.tags,
    updated_at: new Date().toISOString()
  };

  const nextCustomers = [...customers];
  nextCustomers[customerIndex] = nextCustomer;
  await saveCustomerStore(nextCustomers);

  return nextCustomer;
}

export async function deleteTestCustomer(id: string, userId: string) {
  const customers = await getCustomerStore();
  const nextCustomers = customers.filter(
    (customer) => !(customer.id === id && customer.user_id === userId)
  );

  if (nextCustomers.length === customers.length) {
    return false;
  }

  await saveCustomerStore(nextCustomers);

  return true;
}
