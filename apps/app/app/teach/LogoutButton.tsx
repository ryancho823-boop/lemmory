import { LogOut } from "lucide-react";
import { logout } from "@/app/teach/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-ink/50 hover:bg-ink/5 hover:text-ink">
        <LogOut size={15} /> Log out
      </button>
    </form>
  );
}
