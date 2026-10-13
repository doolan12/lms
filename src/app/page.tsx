import Link from "next/link";
import { formatPrice, listCourses } from "@/lib/courses";

export default async function HomePage() {
  const courses = await listCourses();

  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-hivis">Australia · Licence class LF</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold uppercase leading-[1.05] md:text-6xl">
            Walk into your forklift assessment knowing the theory cold.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/75">
            Short lessons, module quizzes and a final practice exam covering WHS law, pre-start checks, load charts,
            stability and safe operation. Study on your phone, at your own pace.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#courses"
              className="rounded-md bg-hivis px-5 py-3 font-semibold text-ink hover:bg-hivis-dark"
            >
              View courses
            </a>
          </div>
        </div>
      </section>

      <section id="courses" className="mx-auto max-w-5xl px-4 py-14">
        <h2 className="font-display text-2xl font-bold uppercase">Courses</h2>
        {courses.length === 0 ? (
          <p className="mt-4 text-muted">No courses published yet. Run the seed SQL to add the sample course.</p>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {courses.map((c) => (
              <Link
                key={c.id}
                href={`/courses/${c.slug}`}
                className="group overflow-hidden rounded-xl border border-line bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="hazard-stripe h-2" />
                <div className="p-6">
                  <h3 className="text-xl font-bold group-hover:underline decoration-hivis decoration-2 underline-offset-4">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-muted">{c.summary}</p>
                  <p className="mt-4 text-lg font-bold">{formatPrice(c.price_cents, c.currency)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
