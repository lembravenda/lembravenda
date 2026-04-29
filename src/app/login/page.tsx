import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { getAuthState } from "@/lib/auth/server";

type LoginPageProps = {
  searchParams?: Promise<{
    message?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const authState = await getAuthState();
  const params = (await searchParams) ?? {};

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
          Entre ou crie sua conta para começar a organizar suas vendas.
        </p>
      </section>
      <AuthForm
        isConfigured={authState.isConfigured}
        message={params.message}
      />
    </main>
  );
}
