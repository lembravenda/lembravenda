import test from "node:test";
import assert from "node:assert/strict";
import {
  buildPaymentMessage,
  buildWhatsAppLink,
  normalizeBrazilPhoneForWhatsApp
} from "../../src/lib/orders/charge.ts";

test("gera mensagem de cobrança com Pix", () => {
  const message = buildPaymentMessage({
    customerName: "Ana",
    items: [
      {
        product_name_snapshot: "Base Liquida",
        quantity: 2
      }
    ],
    pixKey: "ana@pix.com",
    totalCents: 9980
  });

  assert.match(message, /Oi, Ana! Tudo bem\?/);
  assert.match(message, /Passando para lembrar do pagamento do seu pedido:/);
  assert.match(message, /Base Liquida x2/);
  assert.match(message, /R\$\s99,80/);
  assert.match(message, /Pode fazer pelo Pix:\nana@pix\.com/);
  assert.match(
    message,
    /Assim que fizer, me avisa por aqui que eu já separo para entrega 😊/
  );
});

test("gera mensagem de cobrança sem Pix", () => {
  const message = buildPaymentMessage({
    customerName: "Bia",
    items: [],
    pixKey: null,
    totalCents: 2990
  });

  assert.match(message, /Oi, Bia! Tudo bem\?/);
  assert.match(message, /R\$\s29,90/);
  assert.doesNotMatch(message, /Pode fazer pelo Pix:/);
  assert.match(
    message,
    /Me avisa por aqui que combinamos a melhor forma de pagamento\./
  );
});

test("gera link wa.me com telefone valido", () => {
  const link = buildWhatsAppLink(
    "(11) 99888-7766",
    "Oi!\nPode me responder por aqui?"
  );

  assert.equal(
    link,
    "https://wa.me/5511998887766?text=Oi!%0APode%20me%20responder%20por%20aqui%3F"
  );
});

test("retorna nulo quando telefone está ausente", () => {
  assert.equal(buildWhatsAppLink(null, "Oi"), null);
  assert.equal(normalizeBrazilPhoneForWhatsApp(null), null);
});

test("retorna nulo quando telefone é inválido", () => {
  assert.equal(normalizeBrazilPhoneForWhatsApp("1234"), null);
  assert.equal(buildWhatsAppLink("1234", "Oi"), null);
});
