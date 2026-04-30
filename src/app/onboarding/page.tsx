import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/brand-logo";
import { AppCard } from "@/components/ui";
import { OnboardingForm } from "@/components/onboarding-form";
import { getAuthState } from "@/lib/auth/server";

export default async function OnboardingPage() {
  const authState = await getAuthState();

  if (!authState.user) {
    redirect("/login");
  }

  if (authState.isProfileComplete) {
    redirect("/app/hoje");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-md bg-background px-5 py-8">
      <section className="mb-5">
        <BrandLogo href="/" showTagline />
      </section>
      <AppCard className="mb-5 overflow-hidden bg-surface p-6">
        <p className="lv-eyebrow">Vamos começar</p>
        <h1 className="mt-3 text-2xl font-bold tracking-[-0.025em] text-foreground">
          Complete seu perfil
        </h1>
        <p className="mt-3 text-sm leading-6 text-text-secondary">
          Essas informações ajudam a montar suas mensagens e organizar seus
          próximos passos no LembraVenda.
        </p>
      </AppCard>
      <OnboardingForm profile={authState.profile} />
    </main>
  );
}
