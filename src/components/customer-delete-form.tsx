"use client";

import { useFormStatus } from "react-dom";

function DeleteButtonInner() {
  const { pending } = useFormStatus();

  return (
    <button
      className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? "Excluindo..." : "Excluir"}
    </button>
  );
}

type CustomerDeleteFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  customerId: string;
  customerName: string;
};

export function CustomerDeleteForm({
  action,
  customerId,
  customerName
}: CustomerDeleteFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Excluir ${customerName}? Essa ação não pode ser desfeita.`
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input name="customer_id" type="hidden" value={customerId} />
      <DeleteButtonInner />
    </form>
  );
}
