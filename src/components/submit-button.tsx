"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  pendingLabel: string;
  variant?: "primary" | "secondary";
};

export function SubmitButton({
  children,
  disabled = false,
  pendingLabel,
  variant = "primary"
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  const baseStyles =
    "w-full rounded-md px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70";
  const variantStyles =
    variant === "primary"
      ? "bg-primary text-primary-foreground"
      : "border border-border bg-white text-foreground";

  return (
    <button
      className={`${baseStyles} ${variantStyles}`}
      disabled={pending || disabled}
      type="submit"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
