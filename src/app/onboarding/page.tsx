import { redirect } from "next/navigation";
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
      <section className="mb-5 rounded-lg border border-border bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold text-primary">Vamos começar</p>
        <h1 className="mt-3 text-2xl font-semibold tracking-normal text-foreground">
          Complete seu perfil de revendedora
        </h1>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Essas informações ajudam a montar suas mensagens e organizar seus
          próximos passos no LembraVenda.
        </p>
      </section>
      <OnboardingForm profile={authState.profile} />
    </main>
  );
}
