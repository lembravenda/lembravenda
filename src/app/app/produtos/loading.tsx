import { AppShell } from "@/components/app-shell";

export default function ProdutosLoading() {
  return (
    <AppShell
      title="Produtos"
      description="Cadastre preços, recompra e status dos produtos do seu catálogo."
    >
      <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-primary">Carregando</p>
        <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          Buscando seus produtos
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Estamos preparando a listagem e os formulários desta área.
        </p>
      </section>
    </AppShell>
  );
}
