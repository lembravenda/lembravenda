import test from "node:test";
import assert from "node:assert/strict";
import {
  buildRepurchaseMessage,
  isRepurchaseEligible
} from "../../src/lib/repurchase/calc.ts";

const FIXED_NOW = new Date("2026-04-28T12:00:00.000Z");

test("produto sem repurchase_days não gera oportunidade", () => {
  assert.equal(
    isRepurchaseEligible({
      lastPurchaseAt: "2026-04-10T12:00:00.000Z",
      now: FIXED_NOW,
      orderCanceled: false,
      repurchaseIntervalDays: null
    }),
    false
  );
});

test("produto com repurchase_days ainda não vencido não gera oportunidade", () => {
  assert.equal(
    isRepurchaseEligible({
      lastPurchaseAt: "2026-04-25T12:00:00.000Z",
      now: FIXED_NOW,
      orderCanceled: false,
      repurchaseIntervalDays: 7
    }),
    false
  );
});

test("produto com repurchase_days vencido gera oportunidade", () => {
  assert.equal(
    isRepurchaseEligible({
      lastPurchaseAt: "2026-04-10T12:00:00.000Z",
      now: FIXED_NOW,
      orderCanceled: false,
      repurchaseIntervalDays: 7
    }),
    true
  );
});

test("pedido cancelado não gera oportunidade", () => {
  assert.equal(
    isRepurchaseEligible({
      lastPurchaseAt: "2026-04-10T12:00:00.000Z",
      now: FIXED_NOW,
      orderCanceled: true,
      repurchaseIntervalDays: 7
    }),
    false
  );
});

test("mensagem de recompra é gerada corretamente", () => {
  assert.equal(
    buildRepurchaseMessage({
      customerName: "Carla",
      productName: "Shampoo"
    }),
    "Oi, Carla! Tudo bem? Vi aqui que talvez seu Shampoo esteja acabando. Quer que eu já reserve outro para você nessa campanha?"
  );
});
