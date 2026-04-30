import { AppShell } from "@/components/app-shell";

export default function HojeLoading() {
  return (
    <AppShell
      title="Hoje"
      description="Comece pelo que pede ação agora: cobrar, entregar e acompanhar os pedidos mais recentes."
    >
      <section className="lv-card p-5">
        <p className="lv-eyebrow">Carregando</p>
        <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
          Organizando sua rotina de hoje
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Estamos separando cobranças, entregas e pedidos recentes.
        </p>
      </section>
    </AppShell>
  );
}
