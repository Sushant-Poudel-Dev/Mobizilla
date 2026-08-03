import { getStaff, getBranches } from "@/src/features/staff/queries";
import { inviteStaff } from "@/src/features/staff/actions";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { redirect } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Table,
  Input,
  Select,
  Button,
  Badge,
} from "@/src/components/ui";
import { formatDate } from "@/src/lib/format";
import { type SelectOption } from "@/src/components/ui/Select";

const roleLabels: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  technician: "Technician",
  front_desk: "Front Desk",
  staff: "Staff",
};

const roleBadges: Record<string, "default" | "success" | "warning" | "danger" | "accent" | "info"> = {
  owner: "accent",
  admin: "default",
  front_desk: "success",
  technician: "warning",
  staff: "info",
};

export default async function StaffPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const [staff, branches] = await Promise.all([getStaff(), getBranches()]);

  if (!staff.length && !branches.length) {
    redirect("/login");
  }

  const appUser = await getCurrentAppUser();
  const canInvite = appUser?.role === "owner" || appUser?.role === "admin";

  const columns = [
    {
      key: "full_name",
      header: "Name",
      render: (member: typeof staff[0]) => member.full_name,
    },
    {
      key: "email",
      header: "Email",
      render: (member: typeof staff[0]) => member.email,
    },
    {
      key: "role",
      header: "Role",
      render: (member: typeof staff[0]) => (
        <Badge variant={roleBadges[member.role] ?? "default"} size="sm">
          {roleLabels[member.role] ?? member.role}
        </Badge>
      ),
    },
    {
      key: "branch",
      header: "Branch",
      render: (member: typeof staff[0]) =>
        branches.find((b) => b.id === member.branch_id)?.branch_name ?? "—",
    },
    {
      key: "created_at",
      header: "Joined",
      render: (member: typeof staff[0]) => formatDate(member.created_at),
    },
  ];

  const roleOptions: SelectOption[] = [
    { value: "", label: "Select role" },
    { value: "admin", label: "Admin" },
    { value: "technician", label: "Technician" },
    { value: "front_desk", label: "Front Desk" },
    { value: "staff", label: "Staff" },
  ];

  const branchOptions: SelectOption[] = [
    { value: "", label: "— No branch assigned —" },
    ...branches.map((branch) => ({ value: branch.id, label: branch.branch_name })),
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-fg">Staff Management</h1>
        <p className="text-fg-secondary mt-1">Manage team members and their roles</p>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-6 p-4 bg-error-light border border-error/20 rounded-md text-error text-sm" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-success-light border border-success/20 rounded-md text-success text-sm" role="status">
          Staff member invited successfully. They will receive an email to set their password.
        </div>
      )}

      {/* Staff Table + Invite Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Staff Table - 2/3 width */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <CardHeader className="pb-4">
              <CardTitle>Staff Members</CardTitle>
              <CardDescription>Team members and their roles</CardDescription>
            </CardHeader>
            <Table
              columns={columns}
              data={staff}
              keyExtractor={(member) => member.id}
              emptyState={
                <div className="text-center py-12">
                  <svg className="w-12 h-12 mx-auto text-fg-tertiary/50 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5a3.75 3.75 0 01-7.5 0M9 9a3.75 3.75 0 017.5 0M9 15.75a3.75 3.75 0 017.5 0" />
                  </svg>
                  <p className="text-fg-secondary">No staff members yet.</p>
                  {canInvite && <p className="text-fg-tertiary text-sm mt-1">Invite your first team member using the form.</p>}
                </div>
              }
            />
          </Card>
        </div>

        {/* Invite Form - 1/3 width */}
        {canInvite && (
          <Card padding="md">
            <CardHeader>
              <CardTitle>Invite New Staff</CardTitle>
              <CardDescription>Send an invitation to join the team</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={inviteStaff} className="space-y-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  required
                  placeholder="colleague@shop.com"
                  autoComplete="email"
                />

                <Input
                  label="Full name"
                  name="fullName"
                  required
                  placeholder="Jane Smith"
                  autoComplete="name"
                />

                <Select
                  label="Role"
                  name="role"
                  required
                  options={roleOptions}
                />

                <Select
                  label="Branch (optional)"
                  name="branchId"
                  options={branchOptions}
                />

                <Button type="submit" variant="primary" className="w-full">
                  Send Invitation
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}