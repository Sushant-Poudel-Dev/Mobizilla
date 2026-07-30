import { signup, signInWithGoogle } from "@/src/features/auth/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">Mobizilla</div>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Set up your organization and start managing repairs</p>
        </header>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form action={signup}>
          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              name="fullName"
              required
              autoComplete="name"
              className="form-input"
              placeholder="John Doe"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="form-input"
              placeholder="you@shop.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              autoComplete="new-password"
              className="form-input"
              placeholder="At least 6 characters"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="businessName">Business name</label>
            <input
              id="businessName"
              name="businessName"
              required
              className="form-input"
              placeholder="Joe's Phone Repair"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="branchName">Branch name</label>
              <input
                id="branchName"
                name="branchName"
                required
                defaultValue="Main Branch"
                className="form-input"
                placeholder="Main Branch"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="currency">Currency</label>
              <input
                id="currency"
                name="currency"
                required
                defaultValue="PHP"
                maxLength={3}
                className="form-input"
                placeholder="PHP"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-6">
            Create account
          </button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <form action={signInWithGoogle}>
          <button type="submit" className="btn btn-secondary btn-google">
            <svg className="google-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Continue with Google</span>
          </button>
        </form>

        <footer className="auth-footer">
          <p>Already have an account? <a href="/login">Sign in</a></p>
        </footer>
      </div>
    </main>
  );
}