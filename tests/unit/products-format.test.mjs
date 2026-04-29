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

  assert.deepEqual(parsePriceInput("49.90"), {
    priceCents: 4990
  });

  assert.deepEqual(parsePriceInput("49"), {
    priceCents: 4900
  });

  assert.deepEqual(parsePriceInput("49,9"), {
    priceCents: 4990
  });

  assert.deepEqual(parsePriceInput("49.9"), {
    priceCents: 4990
  });

  assert.deepEqual(parsePriceInput("1.234,56"), {
    priceCents: 123456
  });

  assert.deepEqual(parsePriceInput("1234.56"), {
    priceCents: 123456
  });
});

test("rejeita preco invalido", () => {
  assert.deepEqual(parsePriceInput(""), {
    error: "Informe o preço do produto."
  });

  assert.deepEqual(parsePriceInput("-10"), {
    error: "O preço do produto deve ser maior que zero."
  });

  assert.deepEqual(parsePriceInput("12,345"), {
    error: "Use um preço válido. Ex.: 49,90"
  });

  assert.deepEqual(parsePriceInput("0"), {
    error: "O preço do produto deve ser maior que zero."
  });

  assert.deepEqual(parsePriceInput("abc"), {
    error: "Use um preço válido. Ex.: 49,90"
  });
});
