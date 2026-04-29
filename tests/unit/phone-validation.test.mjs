import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  normalizePhone,
  validatePhone,
  stripNonDigits
} from "../../src/lib/customers/phone.ts";

describe("stripNonDigits", () => {
  it("remove letras", () => {
    assert.equal(stripNonDigits("abc123"), "123");
  });
  it("remove parênteses, traços e espaços", () => {
    assert.equal(stripNonDigits("(21) 98765-4321"), "21987654321");
  });
  it("mantém só dígitos", () => {
    assert.equal(stripNonDigits("21987654321"), "21987654321");
  });
});

describe("normalizePhone", () => {
  it("remove máscara", () => {
    assert.equal(normalizePhone("(21) 98765-4321"), "21987654321");
  });
  it("remove DDI 55 quando número tem 13 dígitos", () => {
    assert.equal(normalizePhone("5521987654321"), "21987654321");
  });
  it("retorna vazio para string vazia", () => {
    assert.equal(normalizePhone(""), "");
  });
  it("mantém 10 dígitos fixo", () => {
    assert.equal(normalizePhone("2132654321"), "2132654321");
  });
});

describe("validatePhone", () => {
  it("vazio é empty (campo opcional)", () => {
    assert.equal(validatePhone(""), "empty");
  });
  it("letras puras sem dígitos é empty após normalização", () => {
    assert.equal(validatePhone("abc"), "empty");
  });
  it("11 dígitos é valid", () => {
    assert.equal(validatePhone("21987654321"), "valid");
  });
  it("10 dígitos é valid", () => {
    assert.equal(validatePhone("2132654321"), "valid");
  });
  it("com máscara e 11 dígitos é valid", () => {
    assert.equal(validatePhone("(21) 98765-4321"), "valid");
  });
  it("com espaços é normalizado e validado", () => {
    assert.equal(validatePhone("21 98765 4321"), "valid");
  });
  it("9 dígitos é invalid", () => {
    assert.equal(validatePhone("219876543"), "invalid");
  });
  it("12 dígitos sem DDI é invalid", () => {
    assert.equal(validatePhone("219876543210"), "invalid");
  });
  it("DDI 55 + 11 dígitos é valid (normalizado)", () => {
    assert.equal(validatePhone("5521987654321"), "valid");
  });
});
