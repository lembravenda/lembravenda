import type { ComponentPropsWithoutRef, ReactNode } from "react";

function joinClasses(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function buttonStyles(
  variant: "danger" | "ghost" | "primary" | "secondary" = "primary",
  fullWidth = true
) {
  return joinClasses(
    variant === "danger" && "lv-button-danger",
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
    <section
      className={joinClasses(
        "rounded-xl border border-border bg-surface shadow-sm",
        "p-5",
        className
      )}
      {...props}
    >
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
      <h2 className="mt-3 text-xl font-semibold tracking-[-0.01em] text-foreground">
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
        <h2 className="text-[0.9375rem] font-semibold tracking-[-0.015em] text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-0.5 text-sm leading-5 text-text-secondary">
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
      className: "bg-primary-lighter text-success",
      dotClass: "bg-success"
    },
    warning: {
      className: "bg-accent-subtle text-warning",
      dotClass: "bg-warning"
    },
    urgent: {
      className: "bg-accent-subtle text-urgent",
      dotClass: "bg-accent"
    },
    danger: {
      className: "bg-red-50 text-danger",
      dotClass: "bg-danger"
    },
    neutral: {
      className: "bg-muted text-text-secondary",
      dotClass: "bg-neutral"
    }
  } as const;

  const currentTone = toneMap[tone] ?? toneMap.neutral;

  return (
    <span
      className={joinClasses(
        "inline-flex min-h-7 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        currentTone.className
      )}
    >
      <span
        aria-hidden="true"
        className={joinClasses(
          "inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full",
          currentTone.dotClass
        )}
      />
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
        done
          ? "border-success/25 bg-primary-lighter"
          : "border-border bg-surface"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {step}
          </p>
          <h3 className="mt-2 text-[0.9375rem] font-semibold tracking-[-0.01em] text-foreground">
            {title}
          </h3>
          {description ? (
            <p className="mt-1.5 text-sm leading-6 text-text-secondary">
              {description}
            </p>
          ) : null}
          <p
            className={joinClasses(
              "mt-2.5 text-sm font-medium",
              done ? "text-success" : "text-text-secondary"
            )}
          >
            {done ? "✓ Concluído" : "Próximo passo"}
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
    <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start gap-4">
        {icon ? (
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[0.875rem] bg-primary-light text-primary">
            {icon}
          </div>
        ) : null}
        <div>
          <h3 className="text-[0.9375rem] font-semibold tracking-[-0.01em] text-foreground">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-6 text-text-secondary">
            {description}
          </p>
        </div>
      </div>
    </article>
  );
}

type AppHeaderProps = {
  title: string;
  action?: ReactNode;
};

export function AppHeader({ title, action }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/95 px-4 pb-3 pt-4 backdrop-blur-md">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-[1.25rem] font-semibold tracking-[-0.025em] text-foreground">
            {title}
          </h1>
          {action}
        </div>
      </div>
    </header>
  );
}
