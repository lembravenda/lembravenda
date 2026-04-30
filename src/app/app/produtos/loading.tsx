import { AppShell } from "@/components/app-shell";

export default function ProdutosLoading() {
  return (
    <AppShell
      title="Produtos"
      description="Cadastre preços, recompra e status dos produtos do seu catálogo."
    >
      <section className="lv-card p-5">
        <p className="lv-eyebrow">Carregando</p>
        <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
          Buscando seus produtos
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Estamos preparando a listagem e os formulários desta área.
        </p>
      </section>
    </AppShell>
  );
}
