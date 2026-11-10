import { logout } from "../actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button className="-my-2 py-2 font-semibold text-ink/60 hover:text-ink">Log out</button>
    </form>
  );
}
