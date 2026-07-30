import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { logout } from "@/src/features/auth/actions";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>
        Logged in as {appUser.full_name} — role: {appUser.role}
      </p>
      <p>Organization ID: {appUser.organization_id}</p>
      <p>Branch ID: {appUser.branch_id ?? "none (org-wide role)"}</p>
      <form action={logout}>
        <button type='submit'>Log out</button>
      </form>
    </main>
  );
}
