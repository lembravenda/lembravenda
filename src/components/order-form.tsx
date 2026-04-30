"use client";

import { useActionState, useMemo, useState } from "react";
import {
  createOrderAction,
  type OrderActionState
} from "@/app/app/pedidos/actions";
import { SubmitButton } from "@/components/submit-button";
import { formatPriceCents } from "@/lib/products/format";
import {
  calculateItemSubtotalCents,
  calculateOrderTotalCents
} from "@/lib/orders/calc";
import type { Customer, Product } from "@/types/database";

const initialState: OrderActionState = {};

type SelectedOrderItem = {
  product_id: string;
  quantity: number;
};

type OrderFormProps = {
  customers: Customer[];
  products: Product[];
};

export function OrderForm({ customers, products }: OrderFormProps) {
  const [state, formAction] = useActionState(createOrderAction, initialState);
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [productSearch, setProductSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<SelectedOrderItem[]>([]);

  const activeProducts = useMemo(
    () => products.filter((product) => product.is_active),
    [products]
  );
  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );
  const selectedProductIds = new Set(
    selectedItems.map((item) => item.product_id)
  );

  const filteredProducts = activeProducts
    .filter((product) => {
      if (selectedProductIds.has(product.id)) {
        return false;
      }

      if (!productSearch.trim()) {
        return true;
      }

      return product.name
        .toLowerCase()
        .includes(productSearch.trim().toLowerCase());
    })
    .slice(0, 8);

  const selectedItemsWithProduct = selectedItems.reduce<
    Array<{
      product: Product;
      quantity: number;
      subtotal_cents: number;
    }>
  >((items, item) => {
    const product = productMap.get(item.product_id);

    if (!product) {
      return items;
    }

    items.push({
      product,
      quantity: item.quantity,
      subtotal_cents: calculateItemSubtotalCents({
        quantity: item.quantity,
        unit_price_cents: product.price_cents
      })
    });

    return items;
  }, []);

  const totalCents = calculateOrderTotalCents(
    selectedItemsWithProduct.map((item) => ({
      quantity: item.quantity,
      unit_price_cents: item.product.price_cents
    }))
  );

  if (customers.length === 0 || activeProducts.length === 0) {
    return (
      <section
        className="space-y-4 rounded-2xl border border-border bg-white p-6 shadow-card"
        id="novo-pedido"
      >
        <div>
          <p className="lv-section-label">Novo pedido</p>
          <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
            Novo pedido
          </h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            Para criar um pedido, você precisa ter pelo menos uma cliente e um
            produto ativo cadastrados.
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-border bg-muted px-4 py-4 text-sm leading-6 text-foreground">
          {customers.length === 0
            ? "Cadastre uma cliente antes de registrar sua primeira venda."
            : "Cadastre um produto ativo para começar a montar pedidos."}
        </div>
      </section>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-card"
      id="novo-pedido"
    >
      <div>
        <p className="lv-section-label">Novo pedido</p>
        <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          Novo pedido
        </h2>
        <p className="mt-2 text-sm leading-7 text-text-secondary">
          Escolha a cliente, adicione produtos ativos e confira o total antes de
          salvar.
        </p>
      </div>

      <label className="block text-sm font-medium text-foreground">
        Cliente
        <select
          className="lv-select"
          name="customer_id"
          onChange={(event) => setCustomerId(event.target.value)}
          value={customerId}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </label>

      <section className="space-y-4 rounded-2xl border border-border bg-muted p-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Produtos ativos
          </h3>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Busque por nome e toque para adicionar ao pedido.
          </p>
        </div>

        <label className="block text-sm font-medium text-foreground">
          Buscar produto
          <input
            className="lv-input bg-surface"
            onChange={(event) => setProductSearch(event.target.value)}
            placeholder="Digite o nome do produto"
            type="search"
            value={productSearch}
          />
        </label>

        <div className="space-y-2">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <button
                className="flex w-full items-center justify-between rounded-2xl border border-border bg-surface px-4 py-4 text-left shadow-soft"
                key={product.id}
                onClick={() => {
                  setSelectedItems((currentItems) => [
                    ...currentItems,
                    {
                      product_id: product.id,
                      quantity: 1
                    }
                  ]);
                  setProductSearch("");
                }}
                type="button"
              >
                <span>
                  <span className="block text-sm font-medium text-foreground">
                    {product.name}
                  </span>
                  <span className="block text-sm text-stone-600">
                    {formatPriceCents(product.price_cents)}
                  </span>
                </span>
                <span className="text-sm font-semibold text-primary">
                  Adicionar
                </span>
              </button>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-border bg-surface px-4 py-4 text-sm text-text-secondary">
              Nenhum produto ativo encontrado para essa busca.
            </p>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Itens do pedido
          </h3>
          <p className="mt-1 text-sm leading-6 text-stone-600">
            Ajuste as quantidades e acompanhe o subtotal de cada item.
          </p>
        </div>

        {selectedItemsWithProduct.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-muted px-4 py-4 text-sm text-foreground">
            Nenhum produto adicionado ainda.
          </p>
        ) : (
          selectedItemsWithProduct.map((item) => (
            <article
              className="rounded-2xl border border-border bg-surface p-4 shadow-soft"
              key={item.product.id}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {item.product.name}
                  </h4>
                  <p className="mt-1 text-sm text-stone-600">
                    {formatPriceCents(item.product.price_cents)}
                  </p>
                </div>
                <button
                  className="inline-flex min-h-11 items-center justify-center rounded-[0.95rem] border border-red-200 px-4 py-3 text-sm font-semibold text-red-700"
                  onClick={() => {
                    setSelectedItems((currentItems) =>
                      currentItems.filter(
                        (currentItem) =>
                          currentItem.product_id !== item.product.id
                      )
                    );
                  }}
                  type="button"
                >
                  Remover
                </button>
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <label className="block flex-1 text-sm font-medium text-foreground">
                  Quantidade
                  <input
                    className="lv-input"
                    inputMode="numeric"
                    min={1}
                    onChange={(event) => {
                      const nextQuantity = Math.max(
                        1,
                        Number.parseInt(event.target.value || "1", 10) || 1
                      );

                      setSelectedItems((currentItems) =>
                        currentItems.map((currentItem) =>
                          currentItem.product_id === item.product.id
                            ? {
                                ...currentItem,
                                quantity: nextQuantity
                              }
                            : currentItem
                        )
                      );
                    }}
                    type="number"
                    value={item.quantity}
                  />
                </label>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">
                    Subtotal
                  </p>
                  <p className="mt-2 text-sm text-stone-700">
                    {formatPriceCents(item.subtotal_cents)}
                  </p>
                </div>
              </div>
            </article>
          ))
        )}
      </section>

      <input
        name="items_payload"
        type="hidden"
        value={JSON.stringify(selectedItems)}
      />

      <section className="rounded-2xl bg-primary px-4 py-4 text-primary-foreground">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm font-medium text-primary-foreground">
            Total do pedido
          </p>
          <p className="text-base font-semibold text-primary-foreground">
            {formatPriceCents(totalCents)}
          </p>
        </div>
      </section>

      {state.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton
        disabled={!customerId || selectedItemsWithProduct.length === 0}
        pendingLabel="Salvando pedido..."
      >
        Salvar pedido
      </SubmitButton>
    </form>
  );
}
