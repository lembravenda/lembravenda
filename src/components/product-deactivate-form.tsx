"use client";

import { useFormStatus } from "react-dom";

function DeactivateButtonInner() {
  const { pending } = useFormStatus();

  return (
    <button
      className="lv-button-danger"
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
