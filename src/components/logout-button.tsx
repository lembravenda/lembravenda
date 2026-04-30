import { logoutAction } from "@/app/app/actions";
import { buttonStyles } from "@/components/ui";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className={buttonStyles("danger", false)} type="submit">
        Sair
      </button>
    </form>
  );
}
