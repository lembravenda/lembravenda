"use client";

import { useFormStatus } from "react-dom";

function DeactivateButtonInner() {
  const { pending } = useFormStatus();

  return (
    <button
      className="inline-flex min-h-11 items-center justify-center rounded-[0.95rem] border border-amber-200 bg-accent-light px-4 py-3 text-sm font-semibold text-amber-800 transition disabled:cursor-not-allowed disabled:opacity-70"
      disabled={pending}
      type="submit"
    >
      {pending ? "Inativando..." : "Inativar"}
    </button>
  );
}

type ProductDeactivateFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  productId: string;
  productName: string;
};

export function ProductDeactivateForm({
  action,
  productId,
  productName
}: ProductDeactivateFormProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Inativar ${productName}? O histórico será preservado.`
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input name="product_id" type="hidden" value={productId} />
      <DeactivateButtonInner />
    </form>
  );
}
