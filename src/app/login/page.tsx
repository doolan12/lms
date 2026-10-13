import Link from "next/link";
import { signIn, signUp } from "./actions";

type Props = {
  searchParams: Promise<{ mode?: string; error?: string; message?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { mode, error, message, next = "/dashboard" } = await searchParams;
  const isSignup = mode === "signup";

  const input =
    "w-full rounded-md border border-line bg-white px-3 py-2.5 outline-none focus:border-ink focus:ring-2 focus:ring-hivis";

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="font-display text-3xl font-bold uppercase">{isSignup ? "Create your account" : "Sign in"}</h1>
      <p className="mt-2 text-muted">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link
          href={`/login?${isSignup ? "" : "mode=signup&"}next=${encodeURIComponent(next)}`}
          className="font-semibold text-ink underline decoration-hivis decoration-2 underline-offset-4"
        >
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>

      {error && <p className="mt-6 rounded-md bg-red-50 px-3 py-2 text-sm text-stop">{error}</p>}
      {message && <p className="mt-6 rounded-md bg-green-50 px-3 py-2 text-sm text-go">{message}</p>}

      <form action={isSignup ? signUp : signIn} className="mt-6 space-y-4">
        <input type="hidden" name="next" value={next} />
        {isSignup && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Full name</span>
            <input name="full_name" required autoComplete="name" className={input} />
          </label>
        )}
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input name="email" type="email" required autoComplete="email" className={input} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={isSignup ? "new-password" : "current-password"}
            className={input}
          />
        </label>
        <button className="w-full rounded-md bg-ink py-3 font-semibold text-white hover:bg-ink-soft">
          {isSignup ? "Create account" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
