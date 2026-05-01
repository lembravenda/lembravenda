export function getPaymentStatusLabel(status: string) {
  if (status === "paid") return "Pago";
  if (status === "canceled") return "Cancelado";
  return "Pendente";
}

export function getDeliveryStatusLabel(status: string) {
  if (status === "prepared") return "Preparado";
  if (status === "delivered") return "Entregue";
  if (status === "canceled") return "Cancelado";
  return "A preparar";
}

export function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit"
  }).format(new Date(value));
}

export function formatDaysOverdue(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return `${diffDays} dias atrás`;
}
