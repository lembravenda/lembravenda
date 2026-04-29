import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthState } from "@/lib/auth/server";

export default async function HomePage() {
  const authState = await getAuthState();

  if (authState.user) {
    redirect(authState.isProfileComplete ? "/app/hoje" : "/onboarding");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-between bg-background px-5 py-8">
      <section>
        <p className="text-sm font-medium text-primary">
          Agenda Inteligente para Revendedoras
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-normal text-foreground">
          Organize o dia de venda pelo celular.
        </h1>
        <p className="mt-4 text-base leading-7 text-stone-600">
          Base técnica do MVP para clientes, produtos, pedidos, cobranças
          manuais e recompra. Sem WhatsApp API, sem checkout e sem intermediar
          dinheiro.
        </p>
      </section>

      <section className="mt-10 rounded-lg border border-border bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold tracking-normal">Próximo passo</h2>
        <p className="mt-2 text-sm leading-6 text-stone-600">
          Implementar autenticação e perfil depois que Supabase e RLS forem
          configurados.
        </p>
        <div className="mt-5 flex flex-col gap-3">
          <Link
            className="rounded-md bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
            href="/login"
          >
            Entrar ou criar conta
          </Link>
          <Link
            className="rounded-md border border-border px-4 py-3 text-center text-sm font-semibold text-foreground"
            href="/app/hoje"
          >
            Ver área do app
          </Link>
        </div>
      </section>
    </main>
  );
}
