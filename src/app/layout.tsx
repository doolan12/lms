import type { Metadata } from "next";
import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forklift Theory Online",
  description: "Prepare for your forklift High Risk Work Licence theory assessment online.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUser();

  return (
    <html lang="en-AU">
      <body className="min-h-screen antialiased flex flex-col">
        <header className="bg-ink text-white">
          <div className="hazard-stripe h-1.5" />
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="font-display text-lg font-bold tracking-wide uppercase">
              Forklift<span className="text-hivis">Theory</span>
            </Link>
            <div className="flex items-center gap-4 text-sm">
              {user ? (
                <>
                  <Link href="/dashboard" className="hover:text-hivis">
                    My learning
                  </Link>
                  <form action={signOut}>
                    <button className="text-white/70 hover:text-white">Sign out</button>
                  </form>
                </>
              ) : (
                <Link
                  href="/login"
                  className="rounded-md bg-hivis px-3 py-1.5 font-semibold text-ink hover:bg-hivis-dark"
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-line bg-white">
          <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-muted leading-relaxed">
            This course is theory preparation only. A High Risk Work Licence (class LF) is issued by your state or
            territory WHS regulator after you pass an assessment with an accredited assessor through a Registered
            Training Organisation.
          </div>
        </footer>
      </body>
    </html>
  );
}
