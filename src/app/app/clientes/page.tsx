import Link from "next/link";
import { ListPageAnalyticsTracker } from "@/components/analytics-tracker";
import { AppShell } from "@/components/app-shell";
import { CustomerDeleteForm } from "@/components/customer-delete-form";
import { CustomerForm } from "@/components/customer-form";
import {
  AppCard,
  EmptyState,
  SectionHeader,
  StatusBadge,
  buttonStyles
} from "@/components/ui";
import { deleteCustomerAction } from "@/app/app/clientes/actions";
import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/auth/server";
import { getCustomerById, listCustomers } from "@/lib/customers/server";

type ClientesPageProps = {
  searchParams?: Promise<{
    created?: string;
    edit?: string;
    mode?: string;
    q?: string;
  }>;
};

function formatBirthday(value: string | null) {
  if (!value) {
    redirect("/login");
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit"
  }).format(new Date(`${value}T00:00:00`));
}

export default async function ClientesPage({
  searchParams
}: ClientesPageProps) {
  const authState = await getAuthState();
  const params = (await searchParams) ?? {};
  const query = params.q?.trim() ?? "";
  const currentUserId = authState.user?.id;

  if (!currentUserId) {
    redirect("/login");
  }

  const [customers, editingCustomer] = await Promise.all([
    listCustomers(currentUserId, query),
    params.edit
      ? getCustomerById(params.edit, currentUserId)
      : Promise.resolve(null)
  ]);

  const isCreating = params.mode === "new" || customers.length === 0;
  const hasSearch = query.length > 0;
  const createdState = params.created;

  return (
    <AppShell
      action={
        <Link
          className={buttonStyles("primary", false)}
          href="/app/clientes?mode=new#novo-cliente"
        >
          Adicionar
        </Link>
      }
      title="Clientes"
      description="Cadastre, encontre e atualize sua base de clientes pelo celular."
    >
      <ListPageAnalyticsTracker type="customer" />
      <section className="space-y-4">
        {createdState === "customer-product" ? (
          <AppCard className="border-success/30 bg-primary-lighter p-6">
            <p className="lv-eyebrow">Cliente salvo</p>
            <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
              Agora cadastre seu primeiro produto.
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Com cliente e produto, você já consegue criar sua primeira venda.
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                className={buttonStyles("primary")}
                href="/app/produtos?mode=new#novo-produto"
              >
                Cadastrar produto
              </Link>
              <Link
                className={buttonStyles("secondary")}
                href="/app/clientes?mode=new#novo-cliente"
              >
                Adicionar outro cliente
              </Link>
            </div>
          </AppCard>
        ) : null}

        {createdState === "customer-order" ? (
          <AppCard className="border-success/30 bg-primary-lighter p-6">
            <p className="lv-eyebrow">Cliente salvo</p>
            <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
              Agora você pode criar um pedido.
            </h2>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              Sua base já está pronta para registrar a primeira venda.
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                className={buttonStyles("primary")}
                href="/app/pedidos?mode=new#novo-pedido"
              >
                Criar pedido
              </Link>
            </div>
          </AppCard>
        ) : null}

        <form action="/app/clientes" className="lv-card p-5">
          <label className="block text-sm font-medium text-foreground">
            Buscar cliente
            <input
              className="lv-input"
              defaultValue={query}
              name="q"
              placeholder="Busque por nome ou telefone"
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
                href="/app/clientes"
              >
                Limpar busca
              </Link>
            ) : (
              <Link
                className={buttonStyles("secondary", false)}
                href="/app/clientes?mode=new"
              >
                Adicionar cliente
              </Link>
            )}
          </div>
        </form>

        {isCreating ? <CustomerForm mode="create" /> : null}

        {editingCustomer ? (
          <CustomerForm customer={editingCustomer} mode="edit" />
        ) : null}

        {customers.length === 0 ? (
          <EmptyState
            action={
              !hasSearch ? (
                <Link
                  className={buttonStyles("primary")}
                  href="/app/clientes?mode=new#novo-cliente"
                >
                  Adicionar primeiro cliente
                </Link>
              ) : undefined
            }
            description={
              hasSearch
                ? "Tente outro nome ou telefone para encontrar o cliente."
                : "Assim você começa a organizar contatos, pedidos e cobranças."
            }
            eyebrow={hasSearch ? "Busca" : "Primeiro passo"}
            title={
              hasSearch
                ? "Nenhum cliente encontrado"
                : "Cadastre seu primeiro cliente"
            }
          />
        ) : (
          <section className="space-y-3">
            <SectionHeader
              description="Sua base fica mais clara quando cada cliente tem telefone, grupos e observações."
              title="Clientes cadastrados"
            />
            {customers.map((customer) => (
              <AppCard className="p-4" key={customer.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="lv-item-title">
                      {customer.name}
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary">
                      {customer.phone || "Sem telefone cadastrado"}
                    </p>
                  </div>
                  <Link
                    className={buttonStyles("secondary", false)}
                    href={`/app/clientes?edit=${customer.id}`}
                  >
                    Editar
                  </Link>
                </div>

                <dl className="mt-4 space-y-2 text-sm text-text-secondary">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-foreground">Aniversário</dt>
                    <dd>
                      {formatBirthday(customer.birthday) ?? "Não informado"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-foreground">
                      Grupos do cliente
                    </dt>
                    <dd className="text-right">
                      {customer.tags.length > 0 ? (
                        <div className="flex flex-wrap justify-end gap-2">
                          {customer.tags.map((tag) => (
                            <StatusBadge key={tag} tone="neutral">
                              {tag}
                            </StatusBadge>
                          ))}
                        </div>
                      ) : (
                        "Sem grupos"
                      )}
                    </dd>
                  </div>
                </dl>

                {customer.notes ? (
                  <p className="mt-4 rounded-[10px] bg-muted px-4 py-3 text-sm leading-6 text-text-secondary">
                    {customer.notes}
                  </p>
                ) : null}

                <div className="mt-4 flex items-center justify-end">
                  <CustomerDeleteForm
                    action={deleteCustomerAction}
                    customerId={customer.id}
                    customerName={customer.name}
                  />
                </div>
              </AppCard>
            ))}
          </section>
        )}
      </section>
    </AppShell>
  );
}
