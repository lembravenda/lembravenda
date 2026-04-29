"use client";

import { useActionState } from "react";
import type { ProductActionState } from "@/app/app/produtos/actions";
import {
  createProductAction,
  updateProductAction
} from "@/app/app/produtos/actions";
import { SubmitButton } from "@/components/submit-button";
import { formatPriceCents } from "@/lib/products/format";
import type { Product } from "@/types/database";

const initialState: ProductActionState = {};

type ProductFormProps = {
  mode: "create" | "edit";
  product?: Product | null;
};

function formatPriceForInput(priceCents: number | undefined) {
  if (priceCents === undefined) {
    return "";
  }

  return (priceCents / 100).toFixed(2).replace(".", ",");
}

export function ProductForm({ mode, product }: ProductFormProps) {
  const action = mode === "create" ? createProductAction : updateProductAction;
  const pendingLabel =
    mode === "create" ? "Salvando produto..." : "Atualizando produto...";
  const buttonLabel =
    mode === "create" ? "Salvar produto" : "Salvar alterações";
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-border bg-white p-5 shadow-soft"
      id={mode === "create" ? "novo-produto" : undefined}
    >
      <div>
        <h2 className="text-lg font-semibold tracking-normal text-foreground">
          {mode === "create" ? "Novo produto" : "Editar produto"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          {mode === "create"
            ? "Cadastre os produtos principais para montar pedidos depois."
            : "Atualize preço, categoria, recompra e status sem mexer no histórico."}
        </p>
      </div>

      {mode === "edit" && product ? (
        <input name="product_id" type="hidden" value={product.id} />
      ) : null}

      <label className="block text-sm font-medium text-foreground">
        Nome
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={product?.name ?? ""}
          name="name"
          placeholder="Nome do produto"
          required
          type="text"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Preço
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={formatPriceForInput(product?.price_cents)}
          inputMode="decimal"
          name="price"
          placeholder="0,00"
          required
          type="text"
        />
        {product ? (
          <span className="mt-2 block text-xs text-stone-500">
            Valor atual: {formatPriceCents(product.price_cents)}
          </span>
        ) : null}
      </label>

      <label className="block text-sm font-medium text-foreground">
        Categoria
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={product?.category ?? ""}
          name="category"
          placeholder="Ex.: batom, bolsa, kit presente"
          type="text"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Dias para recompra
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={product?.repurchase_interval_days ?? ""}
          inputMode="numeric"
          min={1}
          name="repurchase_interval_days"
          placeholder="Ex.: 30"
          type="number"
        />
      </label>

      <label className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-3 text-sm font-medium text-foreground">
        <input
          className="h-4 w-4"
          defaultChecked={product?.is_active ?? true}
          name="is_active"
          type="checkbox"
        />
        Produto ativo
      </label>

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton pendingLabel={pendingLabel}>{buttonLabel}</SubmitButton>
    </form>
  );
}
