import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProgressBar } from "@/components/ProgressBar";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  const [{ data: profile }, { data: enrollments }] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
    supabase.from("enrollments").select("course_id, created_at, courses(id, slug, title, summary)").eq("user_id", user.id),
  ]);

  const courseIds = (enrollments ?? []).map((e) => e.course_id);

  const [{ data: lessons }, { data: progress }, { data: attempts }] = await Promise.all([
    courseIds.length
      ? supabase.from("lessons").select("id, course_id").in("course_id", courseIds)
      : Promise.resolve({ data: [] as { id: string; course_id: string }[] }),
    supabase.from("lesson_progress").select("lesson_id").eq("user_id", user.id),
    supabase
      .from("quiz_attempts")
      .select("id, score, passed, created_at, quizzes(title, course_id)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const done = new Set((progress ?? []).map((p) => p.lesson_id));
  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase">
        {firstName ? `G'day, ${firstName}` : "My learning"}
      </h1>

      <section className="mt-8">
        <h2 className="text-lg font-bold">Your courses</h2>
        {(enrollments ?? []).length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-line bg-card p-8 text-center">
            <p className="text-muted">You&apos;re not enrolled in any courses yet.</p>
            <Link href="/#courses" className="mt-3 inline-block font-semibold underline decoration-hivis decoration-2">
              Browse courses
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {(enrollments ?? []).map((e) => {
              // Supabase types embedded rows loosely; normalise to a single object.
              const course = (Array.isArray(e.courses) ? e.courses[0] : e.courses) as
                | { id: string; slug: string; title: string; summary: string }
                | null;
              if (!course) return null;
              const courseLessons = (lessons ?? []).filter((l) => l.course_id === course.id);
              const completed = courseLessons.filter((l) => done.has(l.id)).length;
              const pct = courseLessons.length ? (completed / courseLessons.length) * 100 : 0;
              return (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="rounded-xl border border-line bg-card p-5 shadow-sm hover:shadow-md"
                >
                  <h3 className="font-bold">{course.title}</h3>
                  <p className="mt-1 mb-4 text-sm text-muted">
                    {completed} of {courseLessons.length} lessons complete
                  </p>
                  <ProgressBar value={pct} />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {(attempts ?? []).length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold">Recent quiz results</h2>
          <ul className="mt-4 divide-y divide-line rounded-xl border border-line bg-card">
            {(attempts ?? []).map((a) => {
              const quiz = (Array.isArray(a.quizzes) ? a.quizzes[0] : a.quizzes) as { title: string } | null;
              return (
                <li key={a.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="font-medium">{quiz?.title ?? "Quiz"}</span>
                  <span className="text-sm text-muted">
                    {new Date(a.created_at).toLocaleDateString("en-AU", { day: "numeric", month: "short" })}
                  </span>
                  <span
                    className={`ml-auto rounded px-2 py-0.5 text-sm font-semibold ${
                      a.passed ? "bg-green-50 text-go" : "bg-red-50 text-stop"
                    }`}
                  >
                    {a.score}% {a.passed ? "Pass" : "Not yet"}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
