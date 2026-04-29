import { logoutAction } from "@/app/app/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-foreground"
        type="submit"
      >
        Sair
      </button>
    </form>
  );
}
