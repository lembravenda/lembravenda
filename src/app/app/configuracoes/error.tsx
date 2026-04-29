"use client";

import { AppShell } from "@/components/app-shell";
import { PlaceholderState } from "@/components/placeholder-state";

export default function ConfiguracoesError() {
  return (
    <AppShell
      title="Configurações"
      description="Ajuste informações da sua conta e preferências do LembraVenda."
    >
      <PlaceholderState
        title="Não foi possível abrir configurações"
        description="Tente novamente em instantes para continuar ajustando sua conta."
      />
    </AppShell>
  );
}
