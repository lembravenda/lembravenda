import { AppShell } from "@/components/app-shell";
import { LogoutButton } from "@/components/logout-button";
import { AppCard } from "@/components/ui";

export default function ConfiguracoesPage() {
  return (
    <AppShell
      title="Configurações"
      description="Gerencie sua conta e deixe o LembraVenda do seu jeito."
    >
      <div className="grid gap-4">
        <AppCard className="p-6">
          <p className="lv-section-label">Perfil</p>
          <h2 className="mt-3 text-lg font-semibold tracking-normal text-foreground">
            Dados do negócio
          </h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            Essas informações ajudam a personalizar mensagens e cobranças.
          </p>
          <span className="mt-4 inline-flex min-h-11 items-center justify-center rounded-[0.95rem] bg-primary-light px-4 py-2 text-sm font-semibold text-primary">
            Editar depois
          </span>
        </AppCard>

        <AppCard className="p-6">
          <p className="lv-section-label">Mensagens</p>
          <h2 className="mt-3 text-lg font-semibold tracking-normal text-foreground">
            Mensagens prontas
          </h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            Use textos claros para cobrar clientes e lembrar recompras com mais
            facilidade. As mensagens são geradas automaticamente a partir dos
            seus dados.
          </p>
          <p className="mt-4 text-xs text-text-secondary">
            Veja os exemplos na tela de cada pedido e recompra.
          </p>
        </AppCard>

        <AppCard className="p-6">
          <p className="lv-section-label">Conta</p>
          <h2 className="mt-3 text-lg font-semibold tracking-normal text-foreground">
            Acesso seguro
          </h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            Saia da conta com segurança quando terminar de usar.
          </p>
          <div className="mt-4">
            <LogoutButton />
          </div>
        </AppCard>
      </div>
    </AppShell>
  );
}
