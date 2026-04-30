import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { LogoutButton } from "@/components/logout-button";
import { AppHeader } from "@/components/ui";

const navigationItems = [
  {
    href: "/app/hoje",
    label: "Hoje",
    icon: (
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M5 12h14M12 5v14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    )
  },
  {
    href: "/app/clientes",
    label: "Clientes",
    icon: (
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M8.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM4 19a4.5 4.5 0 0 1 9 0M16.5 10a2.5 2.5 0 1 0 0-5M15 19a3.5 3.5 0 0 1 5 0"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    )
  },
  {
    href: "/app/produtos",
    label: "Produtos",
    icon: (
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M6 8.5h12M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
      </svg>
    )
  },
  {
    href: "/app/pedidos",
    label: "Pedidos",
    icon: (
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M8 4v4M16 4v4M6 8h12M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM9 12h6M9 16h4"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    )
  },
  {
    href: "/app/recompra",
    label: "Recompra",
    icon: (
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M5 12a7 7 0 1 1 2.05 4.95M5 12V7m0 5h5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      </svg>
    )
  },
  {
    href: "/app/configuracoes",
    label: "Ajustes",
    icon: (
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm7 2.5-.95-.55.1-1.1a1 1 0 0 0-.63-1l-1.08-.42-.42-1.08a1 1 0 0 0-1-.63l-1.1.1L12 6l-1.92.32-1.1-.1a1 1 0 0 0-1 .63l-.42 1.08-1.08.42a1 1 0 0 0-.63 1l.1 1.1L5 12l.55.95-.1 1.1a1 1 0 0 0 .63 1l1.08.42.42 1.08a1 1 0 0 0 1 .63l1.1-.1L12 18l1.92-.32 1.1.1a1 1 0 0 0 1-.63l.42-1.08 1.08-.42a1 1 0 0 0 .63-1l-.1-1.1L19 12Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.6"
        />
      </svg>
    )
  }
];

type AppShellProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function AppShell({ title, description, children }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <AppHeader
        action={<LogoutButton />}
        description={description}
        eyebrow="LembraVenda"
        title={title}
      />
      <main className="flex-1 px-5 py-5 pb-[calc(12.5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 bg-transparent px-3 pb-[calc(0.85rem+env(safe-area-inset-bottom))] pt-3"
      >
        <div className="mx-auto max-w-md rounded-[1.75rem] border border-border/90 bg-surface/95 p-2 shadow-lift backdrop-blur">
          <div className="mb-2 flex items-center justify-between px-2">
            <BrandLogo href="/app/hoje" size="sm" />
            <span className="text-xs font-medium text-text-secondary">
              Sua agenda do dia
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {navigationItems.map((item) => (
              <Link
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-center text-[11px] font-semibold leading-tight text-text-secondary transition hover:bg-primary-light hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href={item.href}
                key={item.href}
              >
                <span className="text-primary">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
}
