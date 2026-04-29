import { AppShell } from "@/components/app-shell";
import { PlaceholderState } from "@/components/placeholder-state";

export default function ConfiguracoesPage() {
  return (
    <AppShell
      title="Configurações"
      description="Perfil, preferências e limites claros do MVP."
    >
      <PlaceholderState
        title="Configurações"
        description="Neste piloto, o perfil principal é preenchido no onboarding. Esta tela existe para reforçar os limites do MVP: sem WhatsApp API, checkout, split, emissão fiscal, marketplace, app nativo ou intermediação financeira."
      />
    </AppShell>
  );
}
