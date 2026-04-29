"use client";

import { useMemo, useState } from "react";
import type { OrderItem } from "@/types/database";
import { buildPaymentMessage, buildWhatsAppLink } from "@/lib/orders/charge";

type OrderChargeCardProps = {
  customerName: string;
  customerPhone: string | null;
  items: Pick<OrderItem, "product_name_snapshot" | "quantity">[];
  pixKey: string | null;
  totalCents: number;
};

export function OrderChargeCard({
  customerName,
  customerPhone,
  items,
  pixKey,
  totalCents
}: OrderChargeCardProps) {
  const [copyStatus, setCopyStatus] = useState<"error" | "idle" | "success">(
    "idle"
  );
  const paymentMessage = useMemo(
    () =>
      buildPaymentMessage({
        customerName,
        items,
        pixKey,
        totalCents
      }),
    [customerName, items, pixKey, totalCents]
  );
  const whatsappLink = useMemo(
    () => buildWhatsAppLink(customerPhone, paymentMessage),
    [customerPhone, paymentMessage]
  );

  async function handleCopyMessage() {
    try {
      await navigator.clipboard.writeText(paymentMessage);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <section
      className="rounded-lg border border-border bg-white p-5 shadow-soft"
      id="cobranca-pedido"
    >
      <div>
        <p className="text-sm font-semibold text-primary">Cobrar cliente</p>
        <h2 className="mt-2 text-lg font-semibold tracking-normal text-foreground">
          Mensagem pronta para copiar
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Copie a mensagem ou abra o WhatsApp com tudo pronto para enviar.
        </p>
      </div>

      <label className="mt-4 block text-sm font-medium text-foreground">
        Mensagem de cobrança
        <textarea
          className="mt-2 min-h-32 w-full rounded-md border border-border bg-background px-3 py-3 text-sm leading-6 text-foreground outline-none"
          readOnly
          value={paymentMessage}
        />
      </label>

      <div className="mt-4 grid gap-3">
        <button
          className="rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          onClick={handleCopyMessage}
          type="button"
        >
          Copiar mensagem
        </button>

        {whatsappLink ? (
          <a
            className="inline-flex items-center justify-center rounded-md border border-border px-4 py-3 text-sm font-semibold text-foreground"
            href={whatsappLink}
            rel="noreferrer"
            target="_blank"
          >
            Abrir no WhatsApp
          </a>
        ) : (
          <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
            Cadastre um telefone válido da cliente para abrir essa cobrança no
            WhatsApp. Por enquanto, você ainda pode copiar a mensagem.
          </p>
        )}

        {!pixKey ? (
          <p className="rounded-md border border-dashed border-border bg-muted px-3 py-3 text-sm text-stone-700">
            Se você ainda não cadastrou uma chave Pix, a mensagem segue pronta
            para combinar outra forma de pagamento.
          </p>
        ) : null}

        {copyStatus === "success" ? (
          <p className="text-sm font-medium text-emerald-700">
            Mensagem copiada.
          </p>
        ) : null}

        {copyStatus === "error" ? (
          <p className="text-sm font-medium text-red-700">
            Não foi possível copiar agora. Tente novamente.
          </p>
        ) : null}
      </div>
    </section>
  );
}
