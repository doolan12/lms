import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="font-display text-6xl font-bold text-hivis">404</p>
      <h1 className="mt-2 text-xl font-bold">Page not found</h1>
      <Link href="/" className="mt-6 inline-block font-semibold underline decoration-hivis decoration-2">
        Back to home
      </Link>
    </div>
  );
}
