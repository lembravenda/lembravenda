"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/ui";

const navigationItems = [
  {
    href: "/app/hoje",
    label: "Hoje",
    icon: (
      <svg
        aria-hidden="true"
        className="h-[18px] w-[18px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 4.5 4.5 10v8a1.5 1.5 0 0 0 1.5 1.5h12A1.5 1.5 0 0 0 19.5 18v-8L12 4.5Z"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M9.5 19.5v-5h5v5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
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
        className="h-[18px] w-[18px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M8.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM4 19a4.5 4.5 0 0 1 9 0M16.5 10a2.5 2.5 0 1 0 0-5M15.5 19a3.5 3.5 0 0 1 4.5 0"
          stroke="currentColor"
          strokeLinecap="round"
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
        className="h-[18px] w-[18px]"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <path
          d="M8.5 9.5h7M8.5 13h7M8.5 16.5H13"
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
        className="h-[18px] w-[18px]"
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
        className="h-[18px] w-[18px]"
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
] as const;

type AppShellProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
};

export function AppShell({ title, action, children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
      <AppHeader action={action} title={title} />
      <main className="flex-1 px-4 py-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 border-t border-border bg-surface/98 backdrop-blur"
      >
        <div className="mx-auto grid h-16 max-w-md grid-cols-5 items-stretch px-1 pb-[env(safe-area-inset-bottom)]">
          {navigationItems.map((item) => {
            const isActive =
              item.href === "/app/hoje"
                ? pathname === item.href
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);

            return (
              <Link
                className={`flex min-h-16 flex-col items-center justify-center gap-1 px-1 text-center transition ${
                  isActive
                    ? "text-primary"
                    : "text-text-tertiary hover:text-primary"
                }`}
                href={item.href}
                key={item.href}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full ${
                    isActive ? "bg-primary-light" : ""
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-[10px] font-semibold leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
