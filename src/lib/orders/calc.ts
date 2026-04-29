export type OrderCalculationItem = {
  quantity: number;
  unit_price_cents: number;
};

export function calculateItemSubtotalCents({
  quantity,
  unit_price_cents
}: OrderCalculationItem) {
  return unit_price_cents * quantity;
}

export function calculateOrderTotalCents(items: OrderCalculationItem[]) {
  return items.reduce(
    (total, item) => total + calculateItemSubtotalCents(item),
    0
  );
}

export function formatOrderTotalCents(totalCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency"
  }).format(totalCents / 100);
}
