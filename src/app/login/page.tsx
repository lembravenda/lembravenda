import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { BrandLogo } from "@/components/brand-logo";
import { AppCard } from "@/components/ui";
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
      <section className="mb-5">
        <BrandLogo href="/" showTagline />
      </section>
      <AppCard className="mb-5 overflow-hidden bg-surface p-6">
        <p className="lv-eyebrow">Entrar ou criar conta</p>
        <h1 className="mt-3 text-2xl font-bold tracking-[-0.025em] text-foreground">
          Organize sua rotina de vendas em poucos minutos.
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Entre para acompanhar pedidos, cobranças e recompra com mais clareza
          no dia a dia.
        </p>
      </AppCard>
      <AuthForm
        isConfigured={authState.isConfigured}
        message={params.message}
      />
    </main>
  );
}
