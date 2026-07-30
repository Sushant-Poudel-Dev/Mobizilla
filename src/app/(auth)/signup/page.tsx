import { signup } from "@/src/features/auth/actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main>
      <h1>Sign up</h1>
      {error && <p>{error}</p>}
      <form action={signup}>
        <div>
          <label>
            Full name{" "}
            <input
              name='fullName'
              required
            />
          </label>
        </div>
        <div>
          <label>
            Email{" "}
            <input
              name='email'
              type='email'
              required
            />
          </label>
        </div>
        <div>
          <label>
            Password{" "}
            <input
              name='password'
              type='password'
              required
              minLength={6}
            />
          </label>
        </div>
        <div>
          <label>
            Business name{" "}
            <input
              name='businessName'
              required
            />
          </label>
        </div>
        <div>
          <label>
            Branch name{" "}
            <input
              name='branchName'
              required
              defaultValue='Main Branch'
            />
          </label>
        </div>
        <div>
          <label>
            Currency{" "}
            <input
              name='currency'
              required
              defaultValue='PHP'
              maxLength={3}
            />
          </label>
        </div>
        <button type='submit'>Create account</button>
      </form>
    </main>
  );
}
