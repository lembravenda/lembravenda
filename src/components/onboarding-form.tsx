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
      className="space-y-4 rounded-lg border border-border bg-white p-5 shadow-soft"
    >
      <div>
        <h2 className="text-lg font-semibold tracking-normal text-foreground">
          Complete seu perfil
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Vamos salvar apenas os dados essenciais para liberar sua área.
        </p>
      </div>

      {!profile ? (
        <p className="rounded-md border border-dashed border-border bg-muted px-3 py-3 text-sm text-stone-700">
          Preencha os campos abaixo para abrir sua área e começar a organizar
          suas vendas.
        </p>
      ) : null}

      <label className="block text-sm font-medium text-foreground">
        Nome da revendedora
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
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
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={profile?.brand_name ?? ""}
          name="brand_name"
          placeholder="Ex.: Bella Cosméticos"
          type="text"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Telefone
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={profile?.phone ?? ""}
          name="phone"
          placeholder="(11) 99999-9999"
          type="tel"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Chave Pix
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={profile?.pix_key ?? ""}
          name="pix_key"
          placeholder="CPF, e-mail, telefone ou chave aleatória"
          type="text"
        />
        <span className="mt-2 block text-xs text-stone-500">
          Opcional. O app apenas exibe essa chave nas mensagens.
        </span>
      </label>

      <label className="block text-sm font-medium text-foreground">
        Categoria principal
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={profile?.primary_category ?? ""}
          name="primary_category"
          placeholder="Ex.: Cosméticos, semijoias, roupas"
          required
          type="text"
        />
      </label>

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton pendingLabel="Salvando perfil...">
        Salvar e continuar
      </SubmitButton>
    </form>
  );
}
