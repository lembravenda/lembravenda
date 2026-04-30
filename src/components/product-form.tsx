"use client";

import { useMemo } from "react";
import { useActionState, useState } from "react";
import type { ProductActionState } from "@/app/app/produtos/actions";
import {
  createProductAction,
  updateProductAction
} from "@/app/app/produtos/actions";
import { SubmitButton } from "@/components/submit-button";
import { formatPriceCents, parsePriceInput } from "@/lib/products/format";
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
  const [priceValue, setPriceValue] = useState(
    formatPriceForInput(product?.price_cents)
  );
  const [repurchaseValue, setRepurchaseValue] = useState(
    product?.repurchase_interval_days
      ? String(product.repurchase_interval_days)
      : ""
  );
  const parsedPrice = useMemo(() => {
    if (!priceValue.trim()) {
      return null;
    }

    return parsePriceInput(priceValue);
  }, [priceValue]);

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-card"
      id={mode === "create" ? "novo-produto" : undefined}
    >
      <div>
        <p className="lv-section-label">
          {mode === "create" ? "Novo produto" : "Editar produto"}
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          {mode === "create" ? "Novo produto" : "Editar produto"}
        </h2>
        <p className="mt-2 text-sm leading-7 text-text-secondary">
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
          className="lv-input"
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
          className="lv-input"
          inputMode="decimal"
          name="price"
          onChange={(event) => setPriceValue(event.target.value)}
          placeholder="0,00"
          required
          type="text"
          value={priceValue}
        />
        <span className="mt-2 block text-xs text-text-secondary">
          Use vírgula ou ponto para centavos. Ex.: 49,90
        </span>
        {parsedPrice && "error" in parsedPrice ? (
          <span className="mt-2 block text-xs font-medium text-red-700">
            {parsedPrice.error}
          </span>
        ) : null}
        {parsedPrice &&
        "priceCents" in parsedPrice &&
        typeof parsedPrice.priceCents === "number" ? (
          <span className="mt-2 block text-xs font-medium text-emerald-700">
            Será salvo como {formatPriceCents(parsedPrice.priceCents)}.
          </span>
        ) : null}
        {product ? (
          <span className="mt-2 block text-xs text-text-secondary">
            Valor atual: {formatPriceCents(product.price_cents)}
          </span>
        ) : null}
      </label>

      <label className="block text-sm font-medium text-foreground">
        Categoria
        <input
          className="lv-input"
          name="category"
          onChange={(event) => setCategoryValue(event.target.value)}
          placeholder="Ex.: hidratante, kit presente, bolsa"
          type="text"
          value={categoryValue}
        />
        <span className="mt-2 block text-xs text-text-secondary">
          Use para organizar seus produtos. Você pode escrever do seu jeito.
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {categorySuggestions.map((suggestion) => (
            <button
              className={`lv-chip ${
                categoryValue === suggestion
                  ? "border-primary bg-primary/10 text-primary"
                  : ""
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
          className="lv-input"
          inputMode="numeric"
          min={1}
          name="repurchase_interval_days"
          onChange={(event) => setRepurchaseValue(event.target.value)}
          placeholder="Outro prazo em dias"
          type="number"
          value={repurchaseValue}
        />
        <span className="mt-2 block text-xs text-text-secondary">
          Ex: se o produto costuma acabar em 30 dias, o LembraVenda te lembra de
          chamar a cliente.
        </span>
        <div className="mt-3 flex flex-wrap gap-2">
          {repurchaseSuggestions.map((suggestion) => (
            <button
              className={`lv-chip ${
                repurchaseValue === String(suggestion)
                  ? "border-primary bg-primary/10 text-primary"
                  : ""
              }`}
              key={suggestion}
              onClick={() => setRepurchaseValue(String(suggestion))}
              type="button"
            >
              {suggestion} dias
            </button>
          ))}
          <button
            className={`lv-chip ${
              repurchaseValue === ""
                ? "border-primary bg-primary/10 text-primary"
                : ""
            }`}
            onClick={() => setRepurchaseValue("")}
            type="button"
          >
            Não lembrar
          </button>
        </div>
      </label>

      <label className="flex items-center gap-3 rounded-2xl border border-border bg-muted px-4 py-4 text-sm font-medium text-foreground">
        <input
          className="h-4 w-4"
          defaultChecked={product?.is_active ?? true}
          name="is_active"
          type="checkbox"
        />
        Produto ativo
      </label>

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton pendingLabel={pendingLabel}>{buttonLabel}</SubmitButton>
    </form>
  );
}
