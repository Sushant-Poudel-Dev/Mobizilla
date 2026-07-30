import { login } from "@/src/features/auth/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main>
      <h1>Log in</h1>
      {error && <p>{error}</p>}
      <form action={login}>
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
            />
          </label>
        </div>
        <button type='submit'>Log in</button>
      </form>
    </main>
  );
}
