import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateItemSubtotalCents,
  calculateOrderTotalCents,
  formatOrderTotalCents
} from "../../src/lib/orders/calc.ts";

test("calcula subtotal por item", () => {
  assert.equal(
    calculateItemSubtotalCents({
      quantity: 3,
      unit_price_cents: 2590
    }),
    7770
  );
});

test("calcula total do pedido", () => {
  assert.equal(
    calculateOrderTotalCents([
      {
        quantity: 2,
        unit_price_cents: 1500
      },
      {
        quantity: 1,
        unit_price_cents: 2990
      }
    ]),
    5990
  );
});

test("formata total do pedido", () => {
  assert.equal(formatOrderTotalCents(5990), "R$\u00a059,90");
});
