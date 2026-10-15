import type { Metadata } from "next";
import Link from "next/link";
import { getUser } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import { LanguagePicker } from "@/components/i18n/LanguagePicker";
import { findLang, LANG_COOKIE } from "@/lib/i18n/languages";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forklift Theory Online",
  description:
    "Learn and practise forklift theory for your LF High Risk Work Licence assessment. An independent study aid — not an RTO.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await getUser();
  const lang = findLang((await cookies()).get(LANG_COOKIE)?.value) ?? null;

  return (
    <html lang="en-AU">
      <body className="min-h-screen antialiased flex flex-col">
        <header className="bg-ink text-white">
          <div className="hazard-stripe h-1.5" />
          <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
            <Link href="/" className="font-display text-lg font-bold tracking-wide uppercase">
              Forklift<span className="text-hivis">Theory</span>
            </Link>
            <div className="flex items-center gap-3 text-sm sm:gap-4">
              <LanguagePicker current={lang?.code ?? null} />
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
          <div className="mx-auto max-w-5xl space-y-3 px-4 py-6 text-xs leading-relaxed text-muted">
            <p>
              <strong className="text-ink">Independent study aid.</strong> Forklift Theory is not a Registered Training
              Organisation (RTO) and is not affiliated with SafeWork, WorkSafe or any other regulator. We don&apos;t provide
              nationally recognised training, qualifications, statements of attainment or licences, and our practice
              questions are not the official assessment.
            </p>
            <p>
              To get a High Risk Work Licence (class LF) you must complete training and pass an assessment with an RTO and
              an accredited assessor, then apply to your state or territory regulator. The information here is general —
              always follow your workplace procedures, the manufacturer&apos;s instructions and your trainer.
            </p>
            <nav className="flex flex-wrap gap-x-4 gap-y-1 font-semibold text-ink">
              <Link href="/terms" className="hover:underline">Terms of use</Link>
              <Link href="/privacy" className="hover:underline">Privacy</Link>
              <Link href="/refunds" className="hover:underline">Refunds</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
