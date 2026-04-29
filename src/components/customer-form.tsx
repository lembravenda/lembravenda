"use client";

import { useActionState } from "react";
import type { CustomerActionState } from "@/app/app/clientes/actions";
import {
  createCustomerAction,
  updateCustomerAction
} from "@/app/app/clientes/actions";
import { SubmitButton } from "@/components/submit-button";
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

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-border bg-white p-5 shadow-soft"
      id={mode === "create" ? "nova-cliente" : undefined}
    >
      <div>
        <h2 className="text-lg font-semibold tracking-normal text-foreground">
          {mode === "create" ? "Nova cliente" : "Editar cliente"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
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
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={customer?.name ?? ""}
          name="name"
          placeholder="Nome da cliente"
          required
          type="text"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Telefone
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={customer?.phone ?? ""}
          name="phone"
          placeholder="(11) 99999-9999"
          type="tel"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Aniversário
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={customer?.birthday ?? ""}
          name="birthday"
          type="date"
        />
      </label>

      <label className="block text-sm font-medium text-foreground">
        Tags
        <input
          className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={customer ? formatTags(customer.tags) : ""}
          name="tags"
          placeholder="vip, atacado, recorrente"
          type="text"
        />
        <span className="mt-2 block text-xs text-stone-500">
          Separe as tags por vírgula.
        </span>
      </label>

      <label className="block text-sm font-medium text-foreground">
        Observações
        <textarea
          className="mt-2 min-h-28 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
          defaultValue={customer?.notes ?? ""}
          name="notes"
          placeholder="Preferências, histórico manual ou contexto útil."
        />
      </label>

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton pendingLabel={pendingLabel}>{buttonLabel}</SubmitButton>
    </form>
  );
}
