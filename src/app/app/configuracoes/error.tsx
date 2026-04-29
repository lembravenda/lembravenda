"use client";

import { AppShell } from "@/components/app-shell";
import { PlaceholderState } from "@/components/placeholder-state";

export default function ConfiguracoesError() {
  return (
    <AppShell
      title="Configurações"
      description="Perfil, preferências e limites claros do MVP."
    >
      <PlaceholderState
        title="Não foi possível abrir configurações"
        description="Tente novamente em instantes para revisar os limites desta área."
      />
    </AppShell>
  );
}
