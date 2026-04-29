"use client";

import { useFormStatus } from "react-dom";

function StatusButtonInner({
  idleLabel,
  pendingLabel
}: {
  idleLabel: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}

type OrderStatusActionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  confirmMessage: string;
  idleLabel: string;
  orderId: string;
  pendingLabel: string;
  redirectTo?: string;
};

export function OrderStatusActionForm({
  action,
  confirmMessage,
  idleLabel,
  orderId,
  pendingLabel,
  redirectTo
}: OrderStatusActionFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input name="order_id" type="hidden" value={orderId} />
      {redirectTo ? (
        <input name="redirect_to" type="hidden" value={redirectTo} />
      ) : null}
      <StatusButtonInner idleLabel={idleLabel} pendingLabel={pendingLabel} />
    </form>
  );
}
