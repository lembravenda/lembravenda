"use client";

import { useFormStatus } from "react-dom";

function DeleteButtonInner() {
  const { pending } = useFormStatus();

  return (
    <button
      className="lv-button-danger"
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
