type RepurchaseEligibilityInput = {
  lastPurchaseAt: string;
  now?: Date;
  orderCanceled: boolean;
  repurchaseIntervalDays: number | null;
};

type RepurchaseMessageInput = {
  customerName: string;
  productName: string;
};

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

export function calculateRepurchaseDueDate(
  lastPurchaseAt: string,
  repurchaseIntervalDays: number
) {
  const dueDate = new Date(lastPurchaseAt);
  dueDate.setHours(0, 0, 0, 0);
  dueDate.setDate(dueDate.getDate() + repurchaseIntervalDays);
  return dueDate;
}

export function calculateDaysSincePurchase(
  lastPurchaseAt: string,
  now = new Date()
) {
  const lastPurchaseDate = startOfDay(new Date(lastPurchaseAt));
  const today = startOfDay(now);

  return Math.max(
    0,
    Math.floor((today.getTime() - lastPurchaseDate.getTime()) / DAY_IN_MS)
  );
}

export function isRepurchaseEligible({
  lastPurchaseAt,
  now = new Date(),
  orderCanceled,
  repurchaseIntervalDays
}: RepurchaseEligibilityInput) {
  if (!repurchaseIntervalDays || repurchaseIntervalDays <= 0 || orderCanceled) {
    return false;
  }

  const dueDate = calculateRepurchaseDueDate(
    lastPurchaseAt,
    repurchaseIntervalDays
  );

  return dueDate.getTime() <= startOfDay(now).getTime();
}

export function buildRepurchaseMessage({
  customerName,
  productName
}: RepurchaseMessageInput) {
  return `Oi, ${customerName}! Tudo bem? Vi aqui que talvez seu ${productName} esteja acabando. Quer que eu já reserve outro para você nessa campanha?`;
}
