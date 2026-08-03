import { requireAppUser } from "@/src/lib/data/currentUser";
import { DashboardLayoutClient } from "./DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appUser = await requireAppUser();
  return <DashboardLayoutClient appUser={appUser}>{children}</DashboardLayoutClient>;
}