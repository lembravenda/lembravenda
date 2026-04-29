"use client";

import { useActionState, useState } from "react";
import type { ProductActionState } from "@/app/app/produtos/actions";
import {
  createProductAction,
  updateProductAction
} from "@/app/app/produtos/actions";
import { SubmitButton } from "@/components/submit-button";
import { formatPriceCents } from "@/lib/products/format";
import type { Product } from "@/types/database";

const initialState: ProductActionState = {};
const categorySuggestions = [
  "Cosmético",
  "Roupa",
  "Acessório",
  "Semijoia",
  "Casa",
  "Alimento",
  "Outro"
] as const;
const repurchaseSuggestions = [15, 30, 45, 60] as const;

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
  const [categoryValue, setCategoryValue] = useState(product?.category ?? "");
  const [repurchaseValue, setRepurchaseValue] = useState(
    product?.repurchase_interval_days
      ? String(product.repurchase_interval_days)
      : ""
  );

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
          name="category"
          onChange={(event) => setCategoryValue(event.target.value)}
          placeholder="Ex.: hidratante, kit presente, bolsa"
          type="text"
          value={categoryValue}
        />
        <span className="mt-2 block text-xs text-stone-500">
          Use para organizar seus produtos. Você pode escrever do seu jeito.
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {categorySuggestions.map((suggestion) => (
            <button
              className={`rounded-full border px-3 py-2 text-sm ${
                categoryValue === suggestion
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-white text-foreground"
              }`}
              key={suggestion}
              onClick={() => setCategoryValue(suggestion)}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </label>

      <label className="block text-sm font-medium text-foreground">
        Quando lembrar de vender de novo?
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          inputMode="numeric"
          min={1}
          name="repurchase_interval_days"
          onChange={(event) => setRepurchaseValue(event.target.value)}
          placeholder="Outro prazo em dias"
          type="number"
          value={repurchaseValue}
        />
        <span className="mt-2 block text-xs text-stone-500">
          Ex: se o produto costuma acabar em 30 dias, o LembraVenda te lembra de
          chamar a cliente.
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {repurchaseSuggestions.map((suggestion) => (
            <button
              className={`rounded-full border px-3 py-2 text-sm ${
                repurchaseValue === String(suggestion)
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-white text-foreground"
              }`}
              key={suggestion}
              onClick={() => setRepurchaseValue(String(suggestion))}
              type="button"
            >
              {suggestion} dias
            </button>
          ))}
          <button
            className={`rounded-full border px-3 py-2 text-sm ${
              repurchaseValue === ""
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-white text-foreground"
            }`}
            onClick={() => setRepurchaseValue("")}
            type="button"
          >
            Não lembrar
          </button>
        </div>
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
