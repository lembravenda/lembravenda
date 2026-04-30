"use client";

import { useActionState } from "react";
import { saveOnboardingAction } from "@/app/onboarding/actions";
import { SubmitButton } from "@/components/submit-button";
import type { Profile } from "@/types/database";

type OnboardingActionState = {
  error?: string;
};

const initialState: OnboardingActionState = {};

export function OnboardingForm({ profile }: { profile: Profile | null }) {
  const [state, formAction] = useActionState(
    saveOnboardingAction,
    initialState
  );

  return (
    <form
      action={formAction}
      className="lv-card space-y-5 p-6"
    >
      <div>
        <p className="lv-eyebrow">Seu perfil</p>
        <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
          Complete seu perfil
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          Vamos salvar apenas os dados essenciais para liberar sua área.
        </p>
      </div>

      {!profile ? (
        <p className="rounded-[10px] border border-dashed border-border bg-muted px-4 py-3 text-sm leading-6 text-foreground">
          Preencha os campos abaixo para abrir sua área e começar a organizar
          suas vendas.
        </p>
      ) : null}

      <label className="block text-sm font-medium text-foreground">
        Nome da revendedora
        <input
          className="lv-input"
          defaultValue={profile?.full_name ?? ""}
          name="full_name"
          placeholder="Seu nome"
          required
          type="text"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Nome do negócio
        <input
          className="lv-input"
          defaultValue={profile?.brand_name ?? ""}
          name="brand_name"
          placeholder="Ex.: Bella Cosméticos"
          type="text"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Telefone
        <input
          className="lv-input"
          defaultValue={profile?.phone ?? ""}
          name="phone"
          placeholder="(11) 99999-9999"
          type="tel"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Chave Pix
        <input
          className="lv-input"
          defaultValue={profile?.pix_key ?? ""}
          name="pix_key"
          placeholder="CPF, e-mail, telefone ou chave aleatória"
          type="text"
        />
        <span className="mt-2 block text-xs text-text-secondary">
          Opcional. O app apenas exibe essa chave nas mensagens.
        </span>
      </label>

      <label className="block text-sm font-medium text-foreground">
        Categoria principal
        <input
          className="lv-input"
          defaultValue={profile?.primary_category ?? ""}
          name="primary_category"
          placeholder="Ex.: Cosméticos, semijoias, roupas"
          required
          type="text"
        />
      </label>

      {state.error ? (
        <p className="rounded-[10px] border border-danger/30 bg-[#FEF2F2] px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <SubmitButton pendingLabel="Salvando perfil...">
        Salvar e continuar
      </SubmitButton>
    </form>
  );
}
