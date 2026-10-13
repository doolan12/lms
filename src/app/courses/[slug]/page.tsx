import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import {
  formatPrice,
  getBestScores,
  getCompletedLessonIds,
  getCourseOutline,
  isEnrolled,
} from "@/lib/courses";
import { fulfillCheckoutById } from "@/lib/enrollment";
import { ProgressBar } from "@/components/ProgressBar";
import { startEnrollment } from "./actions";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ session_id?: string; checkout?: string }>;
};

export default async function CoursePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { session_id, checkout } = await searchParams;

  const outline = await getCourseOutline(slug);
  if (!outline) notFound();
  const { course, modules, finalQuiz, lessons } = outline;

  const user = await getUser();

  // Returning from Stripe: grant access straight away (the webhook does this too).
  if (user && session_id) await fulfillCheckoutById(session_id, user.id);

  const enrolled = user ? await isEnrolled(user.id, course.id) : false;
  const completed = user && enrolled ? await getCompletedLessonIds(user.id, lessons.map((l) => l.id)) : new Set<string>();
  const quizIds = [...modules.flatMap((m) => (m.quiz ? [m.quiz.id] : [])), ...(finalQuiz ? [finalQuiz.id] : [])];
  const scores = user && enrolled ? await getBestScores(user.id, quizIds) : new Map();

  const pct = lessons.length ? (completed.size / lessons.length) * 100 : 0;
  const allLessonsDone = lessons.length > 0 && completed.size === lessons.length;
  const finalPassed = finalQuiz ? scores.get(finalQuiz.id)?.passed : false;
  const nextLesson = lessons.find((l) => !completed.has(l.id)) ?? lessons[0];
  const totalMinutes = lessons.reduce((sum, l) => sum + l.duration_minutes, 0);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← All courses
      </Link>

      <div className="mt-4 grid gap-8 md:grid-cols-[1fr_300px]">
        <div>
          <h1 className="font-display text-3xl font-bold uppercase md:text-4xl">{course.title}</h1>
          <p className="mt-4 text-lg text-ink-soft">{course.description}</p>
          <p className="mt-3 text-sm text-muted">
            {modules.length} modules · {lessons.length} lessons · about {Math.round(totalMinutes / 5) * 5} minutes of
            reading · {quizIds.length} quizzes
          </p>
        </div>

        <aside className="h-fit rounded-xl border border-line bg-card p-5 shadow-sm">
          {checkout === "cancelled" && (
            <p className="mb-4 rounded-md bg-amber-50 px-3 py-2 text-sm">Checkout cancelled — you haven&apos;t been charged.</p>
          )}
          {enrolled ? (
            <>
              <ProgressBar value={pct} label="Your progress" />
              {finalPassed && allLessonsDone ? (
                <p className="mt-4 rounded-md bg-green-50 px-3 py-2 text-sm font-semibold text-go">
                  Theory complete — you&apos;re ready for your practical assessment.
                </p>
              ) : null}
              {nextLesson && (
                <Link
                  href={`/courses/${slug}/lessons/${nextLesson.slug}`}
                  className="mt-4 block rounded-md bg-ink py-3 text-center font-semibold text-white hover:bg-ink-soft"
                >
                  {completed.size === 0 ? "Start course" : allLessonsDone ? "Review lessons" : "Continue"}
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="text-3xl font-bold">{formatPrice(course.price_cents, course.currency)}</p>
              <p className="mt-1 text-sm text-muted">One-off payment · lifetime access</p>
              <form action={startEnrollment} className="mt-4">
                <input type="hidden" name="slug" value={slug} />
                <button className="w-full rounded-md bg-hivis py-3 font-semibold text-ink hover:bg-hivis-dark">
                  {course.price_cents === 0 ? "Enrol for free" : "Buy course"}
                </button>
              </form>
              {!user && <p className="mt-2 text-center text-xs text-muted">You&apos;ll create an account first.</p>}
            </>
          )}
        </aside>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-bold uppercase">Course outline</h2>
        <ol className="mt-4 space-y-4">
          {modules.map((m) => {
            const best = m.quiz ? scores.get(m.quiz.id) : undefined;
            return (
              <li key={m.id} className="overflow-hidden rounded-xl border border-line bg-card">
                <div className="flex items-center gap-3 border-b border-line bg-[#f4f1e8] px-5 py-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-ink text-sm font-bold text-hivis">
                    {m.position}
                  </span>
                  <h3 className="font-bold">{m.title}</h3>
                </div>
                <ul className="divide-y divide-line">
                  {m.lessons.map((l) => {
                    const canOpen = enrolled || l.is_preview;
                    const done = completed.has(l.id);
                    const row = (
                      <div className="flex items-center gap-3 px-5 py-3">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                            done ? "border-go bg-go text-white" : "border-line"
                          }`}
                          aria-label={done ? "Completed" : "Not completed"}
                        >
                          {done ? "✓" : ""}
                        </span>
                        <span className={canOpen ? "font-medium" : "text-muted"}>{l.title}</span>
                        {l.is_preview && !enrolled && (
                          <span className="rounded bg-hivis/20 px-2 py-0.5 text-xs font-semibold">Free preview</span>
                        )}
                        <span className="ml-auto text-sm text-muted">{l.duration_minutes} min</span>
                      </div>
                    );
                    return (
                      <li key={l.id}>
                        {canOpen ? (
                          <Link href={`/courses/${slug}/lessons/${l.slug}`} className="block hover:bg-paper">
                            {row}
                          </Link>
                        ) : (
                          row
                        )}
                      </li>
                    );
                  })}
                  {m.quiz && (
                    <li>
                      <QuizRow slug={slug} quizId={m.quiz.id} title={m.quiz.title} enrolled={enrolled} best={best} />
                    </li>
                  )}
                </ul>
              </li>
            );
          })}
        </ol>

        {finalQuiz && (
          <div className="mt-6 overflow-hidden rounded-xl border-2 border-ink bg-card">
            <div className="hazard-stripe h-2" />
            <div className="flex flex-wrap items-center gap-3 px-5 py-4">
              <div>
                <h3 className="font-bold">{finalQuiz.title}</h3>
                <p className="text-sm text-muted">
                  Pass mark {finalQuiz.pass_mark}% · unlocks when you&apos;ve completed every lesson
                </p>
              </div>
              <div className="ml-auto">
                {enrolled && allLessonsDone ? (
                  <Link
                    href={`/courses/${slug}/quizzes/${finalQuiz.id}`}
                    className="rounded-md bg-ink px-4 py-2 font-semibold text-white hover:bg-ink-soft"
                  >
                    {scores.get(finalQuiz.id) ? `Best ${scores.get(finalQuiz.id)!.score}% · Retake` : "Start exam"}
                  </Link>
                ) : (
                  <span className="text-sm text-muted">🔒 Locked</span>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function QuizRow({
  slug,
  quizId,
  title,
  enrolled,
  best,
}: {
  slug: string;
  quizId: string;
  title: string;
  enrolled: boolean;
  best?: { score: number; passed: boolean };
}) {
  const content = (
    <div className="flex items-center gap-3 px-5 py-3">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-sm">📝</span>
      <span className={enrolled ? "font-medium" : "text-muted"}>{title}</span>
      {best && (
        <span
          className={`ml-auto rounded px-2 py-0.5 text-xs font-semibold ${
            best.passed ? "bg-green-50 text-go" : "bg-red-50 text-stop"
          }`}
        >
          Best {best.score}%
        </span>
      )}
    </div>
  );
  return enrolled ? (
    <Link href={`/courses/${slug}/quizzes/${quizId}`} className="block hover:bg-paper">
      {content}
    </Link>
  ) : (
    content
  );
}
