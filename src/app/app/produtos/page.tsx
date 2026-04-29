import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProductDeactivateForm } from "@/components/product-deactivate-form";
import { ProductForm } from "@/components/product-form";
import { deactivateProductAction } from "@/app/app/produtos/actions";
import { getAuthState } from "@/lib/auth/server";
import { formatPriceCents } from "@/lib/products/format";
import { getProductById, listProducts } from "@/lib/products/server";

type ProdutosPageProps = {
  searchParams?: Promise<{
    created?: string;
    edit?: string;
    mode?: string;
    q?: string;
  }>;
};

export default async function ProdutosPage({
  searchParams
}: ProdutosPageProps) {
  const authState = await getAuthState();
  const params = (await searchParams) ?? {};
  const query = params.q?.trim() ?? "";
  const currentUserId = authState.user?.id;

  if (!currentUserId) {
    return null;
  }

  const [products, editingProduct] = await Promise.all([
    listProducts(currentUserId, query),
    params.edit
      ? getProductById(params.edit, currentUserId)
      : Promise.resolve(null)
  ]);

  const isCreating = params.mode === "new" || products.length === 0;
  const hasSearch = query.length > 0;
  const createdState = params.created;

  return (
    <AppShell
      title="Produtos"
      description="Cadastre preços, recompra e status dos produtos do seu catálogo."
    >
      <section className="space-y-4">
        {createdState === "product-order" ? (
          <section className="rounded-lg border border-emerald-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-primary">Produto salvo</p>
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
              Agora crie seu primeiro pedido.
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Você já tem cliente e produto. Falta só registrar a venda.
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                className="min-h-12 rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                href="/app/pedidos?mode=new#novo-pedido"
              >
                Criar pedido
              </Link>
              <Link
                className="min-h-12 rounded-md border border-border px-4 py-3 text-center text-sm font-semibold text-foreground"
                href="/app/produtos?mode=new#novo-produto"
              >
                Adicionar outro produto
              </Link>
            </div>
          </section>
        ) : null}

        <form
          action="/app/produtos"
          className="rounded-lg border border-border bg-white p-4 shadow-soft"
        >
          <label className="block text-sm font-medium text-foreground">
            Buscar produto
            <input
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
              defaultValue={query}
              name="q"
              placeholder="Busque por nome"
              type="search"
            />
          </label>
          <div className="mt-3 flex gap-3">
            <button
              className="rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              type="submit"
            >
              Buscar
            </button>
            {hasSearch ? (
              <Link
                className="rounded-md border border-border px-4 py-3 text-sm font-semibold text-foreground"
                href="/app/produtos"
              >
                Limpar busca
              </Link>
            ) : (
              <Link
                className="rounded-md border border-border px-4 py-3 text-sm font-semibold text-foreground"
                href="/app/produtos?mode=new"
              >
                Adicionar produto
              </Link>
            )}
          </div>
        </form>

        {isCreating ? <ProductForm mode="create" /> : null}

        {editingProduct ? (
          <ProductForm mode="edit" product={editingProduct} />
        ) : null}

        {products.length === 0 ? (
          <section className="rounded-lg border border-dashed border-border bg-white p-5 text-center shadow-soft">
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
              {hasSearch
                ? "Nenhum produto encontrado"
                : "Cadastre seu primeiro produto"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {hasSearch
                ? "Tente outro nome para encontrar o produto."
                : "Produtos ajudam a criar pedidos mais rápido e lembrar quando vender de novo."}
            </p>
            {!hasSearch ? (
              <Link
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                href="/app/produtos?mode=new#novo-produto"
              >
                Adicionar primeiro produto
              </Link>
            ) : null}
          </section>
        ) : (
          <section className="space-y-3">
            {products.map((product) => (
              <article
                className="rounded-lg border border-border bg-white p-4 shadow-soft"
                key={product.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-foreground">
                        {product.name}
                      </h2>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          product.is_active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {product.is_active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-stone-600">
                      {formatPriceCents(product.price_cents)}
                    </p>
                  </div>
                  <Link
                    className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground"
                    href={`/app/produtos?edit=${product.id}`}
                  >
                    Editar
                  </Link>
                </div>

                <dl className="mt-4 space-y-2 text-sm text-stone-700">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-foreground">Categoria</dt>
                    <dd className="text-right">
                      {product.category || "Não informada"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-foreground">Recompra em</dt>
                    <dd>
                      {product.repurchase_interval_days
                        ? `${product.repurchase_interval_days} dias`
                        : "Não lembrar"}
                    </dd>
                  </div>
                </dl>

                {product.is_active ? (
                  <div className="mt-4 flex items-center justify-end">
                    <ProductDeactivateForm
                      action={deactivateProductAction}
                      productId={product.id}
                      productName={product.name}
                    />
                  </div>
                ) : null}
              </article>
            ))}
          </section>
        )}
      </section>
    </AppShell>
  );
}
