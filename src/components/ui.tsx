import type { ComponentPropsWithoutRef, ReactNode } from "react";

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function buttonStyles(
  variant: "ghost" | "primary" | "secondary" = "primary",
  fullWidth = true
) {
  return joinClasses(
    variant === "primary" && "lv-button-primary",
    variant === "secondary" && "lv-button-secondary",
    variant === "ghost" && "lv-button-ghost",
    fullWidth && "w-full"
  );
}

type AppCardProps = ComponentPropsWithoutRef<"section"> & {
  children: ReactNode;
};

export function AppCard({ children, className, ...props }: AppCardProps) {
  return (
    <section className={joinClasses("lv-card p-5", className)} {...props}>
      {children}
    </section>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
};

export function EmptyState({
  title,
  description,
  action,
  eyebrow = "Tudo pronto para seguir"
}: EmptyStateProps) {
  return (
    <AppCard className="border-dashed border-border/90 text-center">
      <p className="lv-section-label text-center">{eyebrow}</p>
      <h2 className="mt-3 text-xl font-semibold tracking-normal text-foreground">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
        {description}
      </p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </AppCard>
  );
}

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeader({
  title,
  description,
  action
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h2 className="text-base font-semibold tracking-[-0.01em] text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm leading-5 text-text-secondary">
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

type StatusBadgeProps = {
  children: ReactNode;
  tone?: "danger" | "neutral" | "success" | "urgent" | "warning";
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  const toneMap = {
    success: {
      className: "bg-emerald-50 text-emerald-800",
      icon: "✓"
    },
    warning: {
      className: "bg-accent-light text-[color:#8A4D16]",
      icon: "!"
    },
    urgent: {
      className: "bg-[color:#FCE9DB] text-[color:#9C4515]",
      icon: "•"
    },
    danger: {
      className: "bg-red-50 text-red-700",
      icon: "×"
    },
    neutral: {
      className: "bg-muted text-text-secondary",
      icon: "•"
    }
  } as const;

  const currentTone = toneMap[tone] ?? toneMap.neutral;

  return (
    <span
      className={joinClasses(
        "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
        currentTone.className
      )}
    >
      <span aria-hidden="true" className="text-[11px] leading-none">
        {currentTone.icon}
      </span>
      {children}
    </span>
  );
}

type StepCardProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  done?: boolean;
  step: string;
};

export function StepCard({
  title,
  description,
  action,
  done = false,
  step
}: StepCardProps) {
  return (
    <article
      className={joinClasses(
        "rounded-2xl border p-4",
        done ? "border-emerald-200 bg-emerald-50" : "border-border bg-surface"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {step}
          </p>
          <h3 className="mt-2 text-base font-semibold text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              {description}
            </p>
          ) : null}
          <p
            className={joinClasses(
              "mt-3 text-sm font-medium",
              done ? "text-emerald-700" : "text-text-secondary"
            )}
          >
            {done ? "Concluído" : "Próximo passo"}
          </p>
        </div>
        {action}
      </div>
    </article>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
};

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <article className="lv-card p-5">
      <div className="flex items-start gap-4">
        {icon ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light text-primary">
            {icon}
          </div>
        ) : null}
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

type AppHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function AppHeader({ title, description, action }: AppHeaderProps) {
  return (
    <header className="border-b border-border bg-background/95 px-4 pb-3 pt-4 backdrop-blur">
      <div className="mx-auto max-w-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[1.5rem] font-semibold tracking-[-0.02em] text-foreground">
              {title}
            </h1>
            <p className="mt-1 max-w-sm text-sm leading-5 text-text-secondary">
              {description}
            </p>
          </div>
          {action}
        </div>
      </div>
    </header>
  );
}
