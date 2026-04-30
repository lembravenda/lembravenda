import { logoutAction } from "@/app/app/actions";
import { buttonStyles } from "@/components/ui";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className={buttonStyles("secondary", false)} type="submit">
        Sair
      </button>
    </form>
  );
}
