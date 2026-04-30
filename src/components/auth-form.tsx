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
        <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-soft">
          {message}
        </section>
      ) : null}

      <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <p className="lv-section-label">Acessar conta</p>
        <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          Entrar
        </h2>
        <p className="mt-2 text-sm leading-7 text-text-secondary">
          Use seu e-mail e sua senha para continuar.
        </p>
        <form action={loginFormAction} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-foreground">
            E-mail
            <input
              className="lv-input"
              name="email"
              placeholder="voce@exemplo.com"
              required
              type="email"
            />
          </label>
          <label className="block text-sm font-medium text-foreground">
            Senha
            <input
              className="lv-input"
              minLength={6}
              name="password"
              placeholder="Sua senha"
              required
              type="password"
            />
          </label>
          {!isConfigured ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              O acesso por e-mail ainda não está disponível neste ambiente.
            </p>
          ) : null}
          {loginState.error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {loginState.error}
            </p>
          ) : null}
          <SubmitButton pendingLabel="Entrando...">Entrar</SubmitButton>
        </form>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-card">
        <p className="lv-section-label">Primeiro acesso</p>
        <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
          Criar conta
        </h2>
        <p className="mt-2 text-sm leading-7 text-text-secondary">
          Crie sua conta para começar a organizar suas vendas.
        </p>
        <form action={signupFormAction} className="mt-5 space-y-4">
          <label className="block text-sm font-medium text-foreground">
            E-mail
            <input
              className="lv-input"
              name="email"
              placeholder="voce@exemplo.com"
              required
              type="email"
            />
          </label>
          <label className="block text-sm font-medium text-foreground">
            Senha
            <input
              className="lv-input"
              minLength={6}
              name="password"
              placeholder="Crie uma senha"
              required
              type="password"
            />
          </label>
          {signupState.error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {signupState.error}
            </p>
          ) : null}
          {signupState.success ? (
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {signupState.success}
            </p>
          ) : null}
          <SubmitButton pendingLabel="Criando conta...">
            Criar conta
          </SubmitButton>
        </form>
      </section>
    </div>
  );
}
