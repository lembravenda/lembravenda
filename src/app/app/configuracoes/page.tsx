import { AppShell } from "@/components/app-shell";
import { LogoutButton } from "@/components/logout-button";

export default function ConfiguracoesPage() {
  return (
    <AppShell
      title="Configurações"
      description="Gerencie sua conta e deixe o LembraVenda do seu jeito."
    >
      <div className="grid gap-4">
        <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-primary">Perfil</p>
          <h2 className="mt-3 text-lg font-semibold tracking-normal text-foreground">
            Dados do negócio
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Essas informações ajudam a personalizar mensagens e cobranças.
          </p>
          <p className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 py-2 text-sm font-medium text-stone-400">
            Em breve
          </p>
        </section>

        <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-primary">Mensagens</p>
          <h2 className="mt-3 text-lg font-semibold tracking-normal text-foreground">
            Mensagens prontas
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Use textos claros para cobrar clientes e lembrar recompras com mais
            facilidade. As mensagens são geradas automaticamente a partir dos
            seus dados.
          </p>
          <p className="mt-4 text-xs text-stone-400">
            Veja os exemplos na tela de cada pedido e recompra.
          </p>
        </section>

        <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-primary">Conta</p>
          <h2 className="mt-3 text-lg font-semibold tracking-normal text-foreground">
            Acesso seguro
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Saia da conta com segurança quando terminar de usar.
          </p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
