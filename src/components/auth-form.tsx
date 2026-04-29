"use client";

import { useActionState } from "react";
import {
  loginAction,
  signupAction,
  type AuthActionState
} from "@/app/login/actions";
import { SubmitButton } from "@/components/submit-button";

const initialState: AuthActionState = {};

export function AuthForm({
  isConfigured,
  message
}: {
  isConfigured: boolean;
  message?: string;
}) {
  const [loginState, loginFormAction] = useActionState(
    loginAction,
    initialState
  );
  const [signupState, signupFormAction] = useActionState(
    signupAction,
    initialState
  );

  return (
    <div className="space-y-5">
      {message ? (
        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-soft">
          {message}
        </section>
      ) : null}

      <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold tracking-normal text-foreground">
          Entrar
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Use seu e-mail e sua senha para continuar.
        </p>
        <form action={loginFormAction} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-foreground">
            E-mail
            <input
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
              name="email"
              placeholder="voce@exemplo.com"
              required
              type="email"
            />
          </label>
          <label className="block text-sm font-medium text-foreground">
            Senha
            <input
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
              minLength={6}
              name="password"
              placeholder="Sua senha"
              required
              type="password"
            />
          </label>
          {!isConfigured ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-amber-800">
              Configure as variáveis públicas do ambiente para usar autenticação
              fora do modo de teste.
            </p>
          ) : null}
          {loginState.error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
              {loginState.error}
            </p>
          ) : null}
          <SubmitButton pendingLabel="Entrando...">Entrar</SubmitButton>
        </form>
      </section>

      <section className="rounded-lg border border-border bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold tracking-normal text-foreground">
          Criar conta
        </h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Crie sua conta para começar a organizar suas vendas.
        </p>
        <form action={signupFormAction} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-foreground">
            E-mail
            <input
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
              name="email"
              placeholder="voce@exemplo.com"
              required
              type="email"
            />
          </label>
          <label className="block text-sm font-medium text-foreground">
            Senha
            <input
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-3 outline-none placeholder:text-stone-400"
              minLength={6}
              name="password"
              placeholder="Crie uma senha"
              required
              type="password"
            />
          </label>
          {signupState.error ? (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700">
              {signupState.error}
            </p>
          ) : null}
          {signupState.success ? (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
              {signupState.success}
            </p>
          ) : null}
          <SubmitButton pendingLabel="Criando conta..." variant="secondary">
            Criar conta
          </SubmitButton>
        </form>
      </section>
    </div>
  );
}
