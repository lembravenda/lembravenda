import test from "node:test";
import assert from "node:assert/strict";
import {
  formatPriceCents,
  parsePriceInput
} from "../../src/lib/products/format.ts";

test("formata centavos em real brasileiro", () => {
  assert.equal(formatPriceCents(2590), "R$\u00a025,90");
  assert.equal(formatPriceCents(0), "R$\u00a00,00");
});

test("valida e converte preco para centavos", () => {
  assert.deepEqual(parsePriceInput("19,90"), {
    priceCents: 1990
  });

  assert.deepEqual(parsePriceInput("R$ 149,99"), {
    priceCents: 14999
  });
});

test("rejeita preco invalido", () => {
  assert.deepEqual(parsePriceInput(""), {
    error: "Informe o preco do produto."
  });

  assert.deepEqual(parsePriceInput("-10"), {
    error: "Informe um preco valido."
  });

  assert.deepEqual(parsePriceInput("12,345"), {
    error: "Informe um preco valido."
  });
});
