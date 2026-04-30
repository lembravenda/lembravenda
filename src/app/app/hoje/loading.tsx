import { AppShell } from "@/components/app-shell";

export default function HojeLoading() {
  return (
    <AppShell
      title="Hoje"
      description="Comece pelo que pede ação agora: cobrar, entregar e acompanhar os pedidos mais recentes."
    >
      <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-primary">Carregando</p>
        <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          Organizando sua rotina de hoje
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Estamos separando cobranças, entregas e pedidos recentes.
        </p>
      </section>
    </AppShell>
  );
}
