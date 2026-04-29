import { AppShell } from "@/components/app-shell";
import { PlaceholderState } from "@/components/placeholder-state";

export default function ConfiguracoesLoading() {
  return (
    <AppShell
      title="Configurações"
      description="Perfil, preferências e limites claros do MVP."
    >
      <PlaceholderState
        title="Carregando configurações"
        description="Estamos preparando os dados básicos desta área."
      />
    </AppShell>
  );
}
