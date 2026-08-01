import { getStaff, getBranches } from "@/src/features/staff/queries";
import { inviteStaff } from "@/src/features/staff/actions";
import { redirect } from "next/navigation";

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

  const roleLabels: Record<string, string> = {
    owner: "Owner",
    admin: "Admin",
    technician: "Technician",
    front_desk: "Front Desk",
    staff: "Staff",
  };

  return (
    <main className="dashboard-content">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Staff Management</h1>
          <p>Manage team members and their roles</p>
        </div>
      </header>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="success-message" role="status">
          Staff member invited successfully. They will receive an email to set their password.
        </div>
      )}

      <section className="dashboard-grid">
        <article className="dashboard-card staff-table-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.5a3.75 3.75 0 0 1-7.5 0M9 9a3.75 3.75 0 0 1 7.5 0M9 15.75a3.75 3.75 0 0 1 7.5 0" />
              </svg>
            </span>
            <h2>Staff Members</h2>
          </header>
          <div className="table-wrapper">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Branch</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member.id}>
                    <td>{member.full_name}</td>
                    <td>{member.email}</td>
                    <td>
                      <span className={`role-badge role-${member.role}`}>
                        {roleLabels[member.role] ?? member.role}
                      </span>
                    </td>
                    <td>
                      {branches.find((b) => b.id === member.branch_id)?.branch_name ?? "—"}
                    </td>
                    <td>{new Date(member.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="dashboard-card invite-form-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 10.5v-3m3.75-13.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM3.75 18.75a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM3.75 4.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm18 9a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM18 19.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0ZM18 4.5a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </span>
            <h2>Invite New Staff</h2>
          </header>
          <form action={inviteStaff} className="invite-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="form-input"
                placeholder="colleague@shop.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                required
                autoComplete="name"
                className="form-input"
                placeholder="Jane Smith"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                required
                className="form-input form-select"
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="technician">Technician</option>
                <option value="front_desk">Front Desk</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="branchId">Branch (optional)</label>
              <select
                id="branchId"
                name="branchId"
                className="form-input form-select"
              >
                <option value="">— No branch assigned —</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.branch_name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              Send Invitation
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}