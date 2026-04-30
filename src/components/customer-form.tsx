"use client";

import { useActionState, useState } from "react";
import type { CustomerActionState } from "@/app/app/clientes/actions";
import {
  createCustomerAction,
  updateCustomerAction
} from "@/app/app/clientes/actions";
import { SubmitButton } from "@/components/submit-button";
import { validatePhone } from "@/lib/customers/phone";
import type { Customer } from "@/types/database";

const initialState: CustomerActionState = {};

type CustomerFormProps = {
  customer?: Customer | null;
  mode: "create" | "edit";
};

function formatTags(tags: string[]) {
  return tags.join(", ");
}

export function CustomerForm({ customer, mode }: CustomerFormProps) {
  const action =
    mode === "create" ? createCustomerAction : updateCustomerAction;
  const pendingLabel =
    mode === "create" ? "Salvando cliente..." : "Atualizando cliente...";
  const buttonLabel =
    mode === "create" ? "Salvar cliente" : "Salvar alterações";
  const [state, formAction] = useActionState(action, initialState);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  function handlePhoneBlur(e: React.FocusEvent<HTMLInputElement>) {
    const val = e.currentTarget.value;
    if (!val) {
      setPhoneError(null);
      return;
    }
    const result = validatePhone(val);
    setPhoneError(
      result === "invalid" ? "Digite um telefone válido com DDD." : null
    );
  }

  return (
    <form
      action={formAction}
      className="lv-card space-y-5 p-6"
      id={mode === "create" ? "novo-cliente" : undefined}
    >
      <div>
        <p className="lv-eyebrow">
          {mode === "create" ? "Nova cliente" : "Editar cliente"}
        </p>
        <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
          {mode === "create" ? "Nova cliente" : "Editar cliente"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
          {mode === "create"
            ? "Salve os dados essenciais para organizar contatos e pedidos depois."
            : "Atualize as informações da cliente sem perder o histórico."}
        </p>
      </div>

      {mode === "edit" && customer ? (
        <input name="customer_id" type="hidden" value={customer.id} />
      ) : null}

      <label className="block text-sm font-medium text-foreground">
        Nome
        <input
          className="lv-input"
          defaultValue={customer?.name ?? ""}
          name="name"
          placeholder="Nome da cliente"
          required
          type="text"
        />
      </label>

      <div>
        <label className="block text-sm font-medium text-foreground">
          Telefone
          <input
            className="lv-input"
            defaultValue={customer?.phone ?? ""}
            inputMode="numeric"
            name="phone"
            onBlur={handlePhoneBlur}
            placeholder="Ex.: 21987654321"
            type="tel"
          />
        </label>
        <span className="mt-2 block text-xs text-text-secondary">
          Use DDD + número. Ex.: 21987654321
        </span>
        {phoneError ? (
          <span className="mt-1 block text-xs text-red-600">{phoneError}</span>
        ) : null}
      </div>

      <label className="block text-sm font-medium text-foreground">
        Aniversário
        <input
          className="lv-input"
          defaultValue={customer?.birthday ?? ""}
          name="birthday"
          type="date"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Grupos da cliente
        <input
          className="lv-input"
          defaultValue={customer ? formatTags(customer.tags) : ""}
          name="tags"
          placeholder="VIP, compra todo mês, atacado"
          type="text"
        />
        <span className="mt-2 block text-xs text-text-secondary">
          Ex: VIP, compra todo mês, atacado. Separe por vírgula.
        </span>
      </label>

      <div>
        <label className="block text-sm font-medium text-foreground">
          Observações da cliente
          <textarea
            className="lv-textarea"
            defaultValue={customer?.notes ?? ""}
            name="notes"
            placeholder="Ex.: prefere receber à noite, costuma pagar por Pix, gosta de kits, endereço do trabalho."
          />
        </label>
        <span className="mt-2 block text-xs text-text-secondary">
          Anote preferências, forma de pagamento, endereço, horário ideal para
          contato ou qualquer detalhe importante para o atendimento.
        </span>
      </div>

      {state.error ? (
        <p className="rounded-[10px] border border-danger/30 bg-[#FEF2F2] px-4 py-3 text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      <SubmitButton pendingLabel={pendingLabel}>{buttonLabel}</SubmitButton>
    </form>
  );
}
