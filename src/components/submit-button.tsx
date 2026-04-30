"use client";

import { useFormStatus } from "react-dom";
import { buttonStyles } from "@/components/ui";

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

  return (
    <button
      className={buttonStyles(variant === "primary" ? "primary" : "secondary")}
      disabled={pending || disabled}
      type="submit"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
