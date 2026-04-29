import { AppShell } from "@/components/app-shell";
import { LogoutButton } from "@/components/logout-button";

export default function ConfiguracoesPage() {
  return (
    <AppShell
      title="Configurações"
      description="Ajuste informações da sua conta e preferências do LembraVenda."
    >
      <div className="grid gap-4">
        <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-primary">Perfil</p>
          <h2 className="mt-3 text-lg font-semibold tracking-normal text-foreground">
            Dados do seu negócio
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Confira os dados do seu negócio usados nas mensagens e cobranças.
          </p>
          <p className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-border px-4 py-3 text-sm font-semibold text-foreground">
            Editar depois
          </p>
        </section>

        <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-primary">Mensagens</p>
          <h2 className="mt-3 text-lg font-semibold tracking-normal text-foreground">
            Textos prontos para enviar
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            As mensagens de cobrança e recompra são geradas prontas para copiar
            e enviar.
          </p>
        </section>

        <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-primary">Conta</p>
          <h2 className="mt-3 text-lg font-semibold tracking-normal text-foreground">
            Acesso seguro
          </h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Você pode sair da sua conta com segurança quando quiser.
          </p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
