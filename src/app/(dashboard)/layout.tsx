import { requireAppUser } from "@/src/lib/data/currentUser";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAppUser();
  return children;
}
