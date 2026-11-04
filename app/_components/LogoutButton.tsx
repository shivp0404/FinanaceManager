import { logoutAction } from "@/actions/auth.actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="w-full text-left"
      >
        Logout
      </button>
    </form>
  );
}