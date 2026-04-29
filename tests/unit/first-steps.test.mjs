import test from "node:test";
import assert from "node:assert/strict";
import { buildFirstStepsState } from "../../src/lib/onboarding/first-steps.ts";

test("primeiros passos começam pela cliente", () => {
  const state = buildFirstStepsState({
    hasCustomer: false,
    hasOrder: false,
    hasProduct: false
  });

  assert.equal(state.allDone, false);
  assert.equal(state.intro, "Comece cadastrando sua primeira cliente.");
  assert.equal(state.steps[0].done, false);
  assert.equal(state.steps[0].ctaLabel, "Adicionar cliente");
});

test("primeiros passos avançam para produto depois da cliente", () => {
  const state = buildFirstStepsState({
    hasCustomer: true,
    hasOrder: false,
    hasProduct: false
  });

  assert.equal(state.steps[0].done, true);
  assert.equal(state.steps[1].done, false);
  assert.equal(state.intro, "Boa. Agora cadastre seu primeiro produto.");
});

test("primeiros passos ficam completos após primeiro pedido", () => {
  const state = buildFirstStepsState({
    hasCustomer: true,
    hasOrder: true,
    hasProduct: true
  });

  assert.equal(state.allDone, true);
  assert.equal(
    state.intro,
    "Seu começo já está montado. Agora esta tela vai te ajudar no dia."
  );
  assert.equal(
    state.steps.every((step) => step.done),
    true
  );
});
