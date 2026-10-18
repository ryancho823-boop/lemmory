import { logout } from "../actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button className="underline">Log out</button>
    </form>
  );
}
