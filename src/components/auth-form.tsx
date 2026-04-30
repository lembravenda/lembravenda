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
        <section className="rounded-[14px] border border-success/30 bg-primary-lighter p-4 text-sm text-[#15803D]">
          {message}
        </section>
      ) : null}

      <section className="lv-card p-6">
        <p className="lv-eyebrow">Acessar conta</p>
        <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
          Entrar
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
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
            <p className="rounded-[10px] border border-warning/30 bg-[#FEF9EE] px-4 py-3 text-sm text-warning">
              O acesso por e-mail ainda não está disponível neste ambiente.
            </p>
          ) : null}
          {loginState.error ? (
            <p className="rounded-[10px] border border-danger/30 bg-[#FEF2F2] px-4 py-3 text-sm text-danger">
              {loginState.error}
            </p>
          ) : null}
          <SubmitButton pendingLabel="Entrando...">Entrar</SubmitButton>
        </form>
      </section>

      <section className="lv-card p-6">
        <p className="lv-eyebrow">Primeiro acesso</p>
        <h2 className="mt-3 text-xl font-bold tracking-[-0.025em] text-foreground">
          Criar conta
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-secondary">
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
            <p className="rounded-[10px] border border-danger/30 bg-[#FEF2F2] px-4 py-3 text-sm text-danger">
              {signupState.error}
            </p>
          ) : null}
          {signupState.success ? (
            <p className="rounded-[10px] border border-success/30 bg-primary-lighter px-4 py-3 text-sm text-[#15803D]">
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
