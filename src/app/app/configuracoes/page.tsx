import { AppShell } from "@/components/app-shell";
import { LogoutButton } from "@/components/logout-button";
import { AppCard, buttonStyles } from "@/components/ui";

export default function ConfiguracoesPage() {
  return (
    <AppShell
      title="Configurações"
      description="Gerencie sua conta e deixe o LembraVenda do seu jeito."
    >
      <div className="grid gap-4">
        <AppCard className="p-6">
          <p className="lv-eyebrow">Perfil</p>
          <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-foreground">
            Dados do negócio
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Essas informações ajudam a personalizar mensagens e cobranças.
          </p>
          <span className={`mt-4 ${buttonStyles("ghost", false)}`}>
            Editar depois
          </span>
        </AppCard>

        <AppCard className="p-6">
          <p className="lv-eyebrow">Mensagens</p>
          <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-foreground">
            Mensagens prontas
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Use textos claros para cobrar clientes e lembrar recompras com mais
            facilidade. As mensagens são geradas automaticamente a partir dos
            seus dados.
          </p>
          <p className="mt-4 text-xs text-text-tertiary">
            Veja os exemplos na tela de cada pedido e recompra.
          </p>
        </AppCard>

        <AppCard className="p-6">
          <p className="lv-eyebrow">Feedback</p>
          <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-foreground">
            O que achou do LembraVenda?
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Sua opinião ajuda a melhorar o app. Leva menos de 2 minutos.
          </p>
          <a
            className={`mt-4 ${buttonStyles("secondary", false)}`}
            href="https://tally.so/r/lembravenda"
            rel="noreferrer"
            target="_blank"
          >
            Dar feedback
          </a>
        </AppCard>

        <AppCard className="p-6">
          <p className="lv-eyebrow">Conta</p>
          <h2 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-foreground">
            Acesso seguro
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
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
