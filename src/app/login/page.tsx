import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getAuthState } from "@/lib/auth/server";

export default async function LoginPage() {
  const authState = await getAuthState();

  if (authState.user) {
    redirect(authState.isProfileComplete ? "/app/hoje" : "/onboarding");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-background px-5 py-8">
      <section className="mb-5 rounded-lg border border-border bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-primary">Acesso</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-normal text-foreground">
          Entre na sua agenda
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Faça login ou crie uma conta para configurar seu perfil de
          revendedora.
        </p>
      </section>
      <AuthForm isConfigured={authState.isConfigured} />
    </main>
  );
}
