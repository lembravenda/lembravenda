"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { AppCard, StatusBadge, buttonStyles } from "@/components/ui";
import type { RepurchaseOpportunity } from "@/lib/repurchase/server";
import { buildWhatsAppLink } from "@/lib/orders/charge";

function ContactedButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className={buttonStyles("secondary")}
      disabled={pending}
      type="submit"
    >
      {pending ? "Salvando..." : "Marcar contatada"}
    </button>
  );
}

type RepurchaseOpportunityCardProps = {
  action: (formData: FormData) => void | Promise<void>;
  formatDate: (value: string) => string;
  formatPrice: (value: number) => string;
  opportunity: RepurchaseOpportunity;
};

export function RepurchaseOpportunityCard({
  action,
  formatDate,
  formatPrice,
  opportunity
}: RepurchaseOpportunityCardProps) {
  const [copyStatus, setCopyStatus] = useState<"error" | "idle" | "success">(
    "idle"
  );
  const whatsappLink = buildWhatsAppLink(
    opportunity.customer_phone,
    opportunity.message
  );

  async function handleCopyMessage() {
    try {
      await navigator.clipboard.writeText(opportunity.message);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <AppCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="lv-section-label">Recompra</p>
            <StatusBadge tone="urgent">Hora de chamar</StatusBadge>
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {opportunity.customer_name}
          </h3>
          <p className="mt-1 text-sm text-stone-600">
            {opportunity.product_name}
          </p>
        </div>
        <p className="text-sm font-medium text-foreground">
          {formatPrice(opportunity.last_item_total_cents)}
        </p>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-stone-700">
        <div className="flex items-start justify-between gap-4">
          <dt className="font-medium text-foreground">Última compra</dt>
          <dd>{formatDate(opportunity.last_purchase_at)}</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="font-medium text-foreground">Dias desde a compra</dt>
          <dd>{opportunity.days_since_purchase} dias</dd>
        </div>
        <div className="flex items-start justify-between gap-4">
          <dt className="font-medium text-foreground">Telefone</dt>
          <dd className="text-right">
            {opportunity.customer_phone || "Não informado"}
          </dd>
        </div>
      </dl>

      <label className="mt-4 block text-sm font-medium text-foreground">
        Mensagem de recompra
        <textarea
          className="lv-textarea min-h-36 bg-muted"
          readOnly
          value={opportunity.message}
        />
      </label>

      <div className="mt-4 grid gap-3">
        <button
          className={buttonStyles("primary")}
          onClick={handleCopyMessage}
          type="button"
        >
          Copiar mensagem
        </button>

        {whatsappLink ? (
          <a
            className={buttonStyles("secondary")}
            href={whatsappLink}
            rel="noreferrer"
            target="_blank"
          >
            Abrir no WhatsApp
          </a>
        ) : (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm leading-6 text-amber-800">
            Cadastre um telefone válido da cliente para abrir a conversa no
            WhatsApp. Por enquanto, você ainda pode copiar a mensagem.
          </p>
        )}

        <form action={action} className="grid gap-3">
          <input
            name="customer_id"
            type="hidden"
            value={opportunity.customer_id}
          />
          <input name="due_date" type="hidden" value={opportunity.due_date} />
          <input
            name="message_snapshot"
            type="hidden"
            value={opportunity.message}
          />
          <input name="order_id" type="hidden" value={opportunity.order_id} />
          <input
            name="product_id"
            type="hidden"
            value={opportunity.product_id}
          />
          <ContactedButton />
        </form>

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
    </AppCard>
  );
}
