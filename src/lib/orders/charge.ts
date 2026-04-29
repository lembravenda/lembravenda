import type { OrderItem } from "@/types/database";

type BuildPaymentMessageInput = {
  customerName: string;
  items: Pick<OrderItem, "product_name_snapshot" | "quantity">[];
  pixKey: string | null;
  totalCents: number;
};

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function formatChargeTotalCents(totalCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency"
  }).format(totalCents / 100);
}

export function summarizeOrderItemsForMessage(
  items: Pick<OrderItem, "product_name_snapshot" | "quantity">[]
) {
  if (items.length === 0) {
    return "seu pedido";
  }

  const [firstItem, ...otherItems] = items;
  const firstLabel = `${firstItem.product_name_snapshot} x${firstItem.quantity}`;

  if (otherItems.length === 0) {
    return `seu pedido de ${firstLabel}`;
  }

  return `seu pedido com ${firstLabel} e mais ${otherItems.length} item(ns)`;
}

export function buildPaymentMessage({
  customerName,
  items,
  pixKey,
  totalCents
}: BuildPaymentMessageInput) {
  const orderSummary = summarizeOrderItemsForMessage(items);
  const totalLabel = formatChargeTotalCents(totalCents);
  const safeCustomerName = normalizeWhitespace(customerName) || "cliente";
  const safePixKey = pixKey ? normalizeWhitespace(pixKey) : "";

  const paymentSnippet = safePixKey
    ? `Pode fazer pelo Pix: ${safePixKey}. `
    : "";

  return (
    `Oi, ${safeCustomerName}! Tudo bem? ` +
    `Passando para lembrar do pagamento do ${orderSummary} no valor de ${totalLabel}. ` +
    paymentSnippet +
    "Assim que fizer, me avisa por aqui que eu já separo para entrega."
  );
}

export function normalizeBrazilPhoneForWhatsApp(phone: string | null) {
  if (!phone) {
    return null;
  }

  const digits = phone.replace(/\D/g, "").replace(/^0+/, "");

  if (!digits) {
    return null;
  }

  if (digits.startsWith("55")) {
    const localNumber = digits.slice(2);

    if (localNumber.length === 10 || localNumber.length === 11) {
      return `55${localNumber}`;
    }

    return null;
  }

  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return null;
}

export function buildWhatsAppLink(phone: string | null, message: string) {
  const normalizedPhone = normalizeBrazilPhoneForWhatsApp(phone);

  if (!normalizedPhone) {
    return null;
  }

  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}
