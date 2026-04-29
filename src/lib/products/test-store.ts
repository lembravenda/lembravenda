import "server-only";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import type { Product } from "@/types/database";
import { isE2EAuthModeEnabled } from "@/lib/auth/e2e-mode";

const TEST_PRODUCTS_COOKIE = "agenda_test_products";

type TestProductDraft = Pick<
  Product,
  "category" | "is_active" | "name" | "price_cents" | "repurchase_interval_days"
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

async function getProductStore() {
  if (!isE2EAuthModeEnabled()) {
    return [];
  }

  const cookieStore = await cookies();

  return (
    parseCookieValue<Product[]>(cookieStore.get(TEST_PRODUCTS_COOKIE)?.value) ??
    []
  );
}

async function saveProductStore(products: Product[]) {
  if (!isE2EAuthModeEnabled()) {
    return;
  }

  const cookieStore = await cookies();

  cookieStore.set(TEST_PRODUCTS_COOKIE, JSON.stringify(products), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}

export async function listTestProducts(userId: string, search: string) {
  const normalizedSearch = search.trim().toLowerCase();
  const products = await getProductStore();

  return products
    .filter((product) => product.user_id === userId)
    .filter((product) => {
      if (!normalizedSearch) {
        return true;
      }

      return product.name.toLowerCase().includes(normalizedSearch);
    })
    .sort((left, right) => left.name.localeCompare(right.name, "pt-BR"));
}

export async function listActiveTestProducts(userId: string, search: string) {
  const products = await listTestProducts(userId, search);

  return products.filter((product) => product.is_active);
}

export async function getTestProductById(id: string, userId: string) {
  const products = await getProductStore();

  return (
    products.find(
      (product) => product.id === id && product.user_id === userId
    ) ?? null
  );
}

export async function createTestProduct(
  userId: string,
  draft: TestProductDraft
) {
  const products = await getProductStore();
  const timestamp = new Date().toISOString();

  const product: Product = {
    category: draft.category,
    created_at: timestamp,
    id: randomUUID(),
    is_active: draft.is_active,
    name: draft.name,
    price_cents: draft.price_cents,
    repurchase_interval_days: draft.repurchase_interval_days,
    updated_at: timestamp,
    user_id: userId
  };

  await saveProductStore([...products, product]);

  return product;
}

export async function updateTestProduct(
  id: string,
  userId: string,
  draft: TestProductDraft
) {
  const products = await getProductStore();
  const productIndex = products.findIndex(
    (product) => product.id === id && product.user_id === userId
  );

  if (productIndex < 0) {
    return null;
  }

  const nextProduct: Product = {
    ...products[productIndex],
    category: draft.category,
    is_active: draft.is_active,
    name: draft.name,
    price_cents: draft.price_cents,
    repurchase_interval_days: draft.repurchase_interval_days,
    updated_at: new Date().toISOString()
  };

  const nextProducts = [...products];
  nextProducts[productIndex] = nextProduct;
  await saveProductStore(nextProducts);

  return nextProduct;
}

export async function setTestProductActiveState(
  id: string,
  userId: string,
  isActive: boolean
) {
  const products = await getProductStore();
  const productIndex = products.findIndex(
    (product) => product.id === id && product.user_id === userId
  );

  if (productIndex < 0) {
    return null;
  }

  const nextProduct: Product = {
    ...products[productIndex],
    is_active: isActive,
    updated_at: new Date().toISOString()
  };

  const nextProducts = [...products];
  nextProducts[productIndex] = nextProduct;
  await saveProductStore(nextProducts);

  return nextProduct;
}
