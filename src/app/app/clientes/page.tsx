import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { CustomerDeleteForm } from "@/components/customer-delete-form";
import { CustomerForm } from "@/components/customer-form";
import { deleteCustomerAction } from "@/app/app/clientes/actions";
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
    return null;
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
    return null;
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
      title="Clientes"
      description="Cadastre, encontre e atualize sua base de clientes pelo celular."
    >
      <section className="space-y-4">
        {createdState === "customer-product" ? (
          <section className="rounded-lg border border-emerald-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-primary">Cliente salva</p>
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
              Agora cadastre seu primeiro produto.
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Com cliente e produto, você já consegue criar sua primeira venda.
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                className="min-h-12 rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                href="/app/produtos?mode=new#novo-produto"
              >
                Cadastrar produto
              </Link>
              <Link
                className="min-h-12 rounded-md border border-border px-4 py-3 text-center text-sm font-semibold text-foreground"
                href="/app/clientes?mode=new#nova-cliente"
              >
                Adicionar outra cliente
              </Link>
            </div>
          </section>
        ) : null}

        {createdState === "customer-order" ? (
          <section className="rounded-lg border border-emerald-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-primary">Cliente salva</p>
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
              Agora você pode criar um pedido.
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Sua base já está pronta para registrar a primeira venda.
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                className="min-h-12 rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
                href="/app/pedidos?mode=new#novo-pedido"
              >
                Criar pedido
              </Link>
            </div>
          </section>
        ) : null}

        <form
          action="/app/clientes"
          className="rounded-lg border border-border bg-white p-4 shadow-soft"
        >
          <label className="block text-sm font-medium text-foreground">
            Buscar cliente
            <input
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
              defaultValue={query}
              name="q"
              placeholder="Busque por nome ou telefone"
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
                href="/app/clientes"
              >
                Limpar busca
              </Link>
            ) : (
              <Link
                className="rounded-md border border-border px-4 py-3 text-sm font-semibold text-foreground"
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
          <section className="rounded-lg border border-dashed border-border bg-white p-5 text-center shadow-soft">
            <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
              {hasSearch
                ? "Nenhuma cliente encontrada"
                : "Cadastre sua primeira cliente"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {hasSearch
                ? "Tente outro nome ou telefone para encontrar a cliente."
                : "Assim você começa a organizar contatos, pedidos e cobranças."}
            </p>
            {!hasSearch ? (
              <Link
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
                href="/app/clientes?mode=new#nova-cliente"
              >
                Adicionar primeira cliente
              </Link>
            ) : null}
          </section>
        ) : (
          <section className="space-y-3">
            {customers.map((customer) => (
              <article
                className="rounded-lg border border-border bg-white p-4 shadow-soft"
                key={customer.id}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-foreground">
                      {customer.name}
                    </h2>
                    <p className="mt-1 text-sm text-stone-600">
                      {customer.phone || "Sem telefone cadastrado"}
                    </p>
                  </div>
                  <Link
                    className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground"
                    href={`/app/clientes?edit=${customer.id}`}
                  >
                    Editar
                  </Link>
                </div>

                <dl className="mt-4 space-y-2 text-sm text-stone-700">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-foreground">Aniversário</dt>
                    <dd>
                      {formatBirthday(customer.birthday) ?? "Não informado"}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-medium text-foreground">
                      Grupos da cliente
                    </dt>
                    <dd className="text-right">
                      {customer.tags.length > 0
                        ? customer.tags.join(", ")
                        : "Sem grupos"}
                    </dd>
                  </div>
                </dl>

                {customer.notes ? (
                  <p className="mt-4 rounded-md bg-muted px-3 py-3 text-sm leading-6 text-stone-700">
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
              </article>
            ))}
          </section>
        )}
      </section>
    </AppShell>
  );
}
