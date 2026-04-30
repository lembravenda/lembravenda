import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { ProductDeactivateForm } from "@/components/product-deactivate-form";
import { ProductForm } from "@/components/product-form";
import {
  AppCard,
  EmptyState,
  SectionHeader,
  StatusBadge,
  buttonStyles
} from "@/components/ui";
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
      action={
        <Link
          className={buttonStyles("primary", false)}
          href="/app/produtos?mode=new#novo-produto"
        >
          Adicionar
        </Link>
      }
      title="Produtos"
      description="Cadastre preços, recompra e status dos produtos do seu catálogo."
    >
      <section className="space-y-4">
        {createdState === "product-order" ? (
          <AppCard className="border-emerald-200 p-6">
            <p className="lv-section-label">Produto salvo</p>
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
              Agora crie seu primeiro pedido.
            </h2>
            <p className="mt-2 text-sm leading-7 text-text-secondary">
              Você já tem cliente e produto. Falta só registrar a venda.
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                className={buttonStyles("primary")}
                href="/app/pedidos?mode=new#novo-pedido"
              >
                Criar pedido
              </Link>
              <Link
                className={buttonStyles("secondary")}
                href="/app/produtos?mode=new#novo-produto"
              >
                Adicionar outro produto
              </Link>
            </div>
          </AppCard>
        ) : null}

        <form action="/app/produtos" className="lv-card p-5">
          <label className="block text-sm font-medium text-foreground">
            Buscar produto
            <input
              className="lv-input"
              defaultValue={query}
              name="q"
              placeholder="Busque por nome"
              type="search"
            />
          </label>
          <div className="mt-3 flex gap-3">
            <button className={buttonStyles("primary", false)} type="submit">
              Buscar
            </button>
            {hasSearch ? (
              <Link
                className={buttonStyles("secondary", false)}
                href="/app/produtos"
              >
                Limpar busca
              </Link>
            ) : (
              <Link
                className={buttonStyles("secondary", false)}
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
          <EmptyState
            action={
              !hasSearch ? (
                <Link
                  className={buttonStyles("primary")}
                  href="/app/produtos?mode=new#novo-produto"
                >
                  Adicionar primeiro produto
                </Link>
              ) : undefined
            }
            description={
              hasSearch
                ? "Tente outro nome para encontrar o produto."
                : "Produtos ajudam a criar pedidos mais rápido e lembrar quando vender de novo."
            }
            eyebrow={hasSearch ? "Busca" : "Catálogo"}
            title={
              hasSearch
                ? "Nenhum produto encontrado"
                : "Cadastre seu primeiro produto"
            }
          />
        ) : (
          <section className="space-y-3">
            <SectionHeader
              description="Mantenha seus preços e prazos de recompra organizados para vender com mais segurança."
              title="Produtos cadastrados"
            />
            {products.map((product) => (
              <AppCard className="p-4" key={product.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-semibold text-foreground">
                        {product.name}
                      </h2>
                      <StatusBadge
                        tone={product.is_active ? "success" : "neutral"}
                      >
                        {product.is_active ? "Ativo" : "Inativo"}
                      </StatusBadge>
                    </div>
                    <p className="mt-2 text-lg font-semibold text-foreground">
                      {formatPriceCents(product.price_cents)}
                    </p>
                  </div>
                  <Link
                    className={buttonStyles("secondary", false)}
                    href={`/app/produtos?edit=${product.id}`}
                  >
                    Editar
                  </Link>
                </div>

                <dl className="mt-4 space-y-2 text-sm text-stone-700">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-foreground">Categoria</dt>
                    <dd className="text-right">
                      {product.category || "Do seu jeito"}
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
              </AppCard>
            ))}
          </section>
        )}
      </section>
    </AppShell>
  );
}
