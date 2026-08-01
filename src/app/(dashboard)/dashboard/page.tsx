import { getCurrentAppUser } from "@/src/lib/data/currentUser";
import { logout } from "@/src/features/auth/actions";

export default async function DashboardPage() {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const roleLabels: Record<string, string> = {
    owner: "Owner",
    admin: "Admin",
    front_desk: "Front Desk",
    technician: "Technician",
    staff: "Staff",
  };

  const role = roleLabels[appUser.role] ?? appUser.role;

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p>Repair Shop Management Platform</p>
        </div>
        <form action={logout}>
          <button type="submit" className="btn btn-ghost">
            Sign out
          </button>
        </form>
      </header>

      <section className="dashboard-grid">
        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </span>
            <h2>Account</h2>
          </header>
          <dl className="card-fields">
            <div>
              <dt>Full Name</dt>
              <dd>{appUser.full_name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{appUser.email}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>
                <span className={`role-badge role-${appUser.role}`}>{role}</span>
              </dd>
            </div>
          </dl>
        </article>

        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5a4.5 4.5 0 0 1-3.237 4.402A8.28 8.28 0 0 1 12 21c-2.318 0-4.472-.737-6.263-1.921.407-2.582 2.105-4.755 4.425-5.7-5.495M3.75 16.5a4.5 4.5 0 0 1 3.237-4.402A8.293 8.293 0 0 1 12 3c2.318 0 4.472.737 6.263 1.921-.407 2.582-2.105 4.755-4.427 5.495m-12 0a8.28 8.28 0 0 0 8.5 0" />
              </svg>
            </span>
            <h2>Organization</h2>
          </header>
          <dl className="card-fields">
            <div>
              <dt>Organization ID</dt>
              <dd>{appUser.organization_id}</dd>
            </div>
          </dl>
        </article>

        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m-16.5 0a2.25 2.25 0 0 1 2.25-2.25H19.5A2.25 2.25 0 0 1 21.75 5.25V12m-18 0v4.5m0 0H6.75m13.5-4.5H18a2.25 2.25 0 0 0-2.25 2.25v3.375m-1.5 3.75h.008v.008H12v-.008h-.008V16.5h-.008v-.008H8.25v.008H8.242v.008H5.25" />
              </svg>
            </span>
            <h2>Branch</h2>
          </header>
          <dl className="card-fields">
            <div>
              <dt>Branch ID</dt>
              <dd>
                {appUser.branch_id ?? <span className="muted">(org-wide role)</span>}
              </dd>
            </div>
          </dl>
        </article>

        <article className="dashboard-card">
          <header className="card-header">
            <span className="card-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm10.585-1.965a9.005 9.005 0 0 1-1.851 1.26 9 9 0 0 0-7.465 1.647c-.357.068-.72-.142-.914-.52a.75.75 0 0 1 0-1.06c.512-.955 1.24-1.791 2.115-2.115a.75.75 0 1 1 1.06 0c.194.194.557.376.914.52a9 9 0 0 0 7.465-1.647 9.005 9.005 0 0 1 1.851-1.26.75.75 0 1 1 .97.25Z" />
              </svg>
            </span>
            <h2>Auth User</h2>
          </header>
          <dl className="card-fields">
            <div>
              <dt>Auth User ID</dt>
              <dd>{appUser.id}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="dashboard-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="btn btn-secondary" disabled>Create Repair Ticket</button>
          <button className="btn btn-secondary" disabled>Manage Inventory</button>
          <button className="btn btn-secondary" disabled>View Invoices</button>
          <button className="btn btn-secondary" disabled>Settings</button>
        </div>
      </section>
    </main>
  );
}