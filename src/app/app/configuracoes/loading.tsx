import { AppShell } from "@/components/app-shell";
import { PlaceholderState } from "@/components/placeholder-state";

export default function ConfiguracoesLoading() {
  return (
    <AppShell
      title="Configurações"
      description="Ajuste informações da sua conta e preferências do LembraVenda."
    >
      <PlaceholderState
        title="Carregando configurações"
        description="Estamos preparando esta área para você."
      />
    </AppShell>
  );
}
