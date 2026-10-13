import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { allLessonsComplete } from "@/lib/enrollment";
import { QuestionPrompt } from "@/components/QuestionPrompt";
import { submitQuiz } from "./actions";

type Props = {
  params: Promise<{ slug: string; quizId: string }>;
  searchParams: Promise<{ attempt?: string }>;
};

type Option = { id: string; text: string; position: number; is_correct?: boolean };
type Question = {
  id: string;
  prompt: string;
  position: number;
  explanation?: string;
  is_calculation?: boolean;
  options: Option[];
};

const byPosition = <T extends { position: number }>(a: T, b: T) => a.position - b.position;

export default async function QuizPage({ params, searchParams }: Props) {
  const { slug, quizId } = await params;
  const { attempt: attemptId } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/courses/${slug}/quizzes/${quizId}`)}`);

  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, title, pass_mark, is_final, course_id")
    .eq("id", quizId)
    .maybeSingle();
  if (!quiz) notFound();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("user_id", user.id)
    .eq("course_id", quiz.course_id)
    .maybeSingle();
  if (!enrollment) redirect(`/courses/${slug}`);
  if (quiz.is_final && !(await allLessonsComplete(user.id, quiz.course_id))) redirect(`/courses/${slug}`);

  const header = (
    <>
      <Link href={`/courses/${slug}`} className="text-sm text-muted hover:text-ink">
        ← Back to course
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold uppercase">{quiz.title}</h1>
      <p className="mt-1 text-sm text-muted">Pass mark {quiz.pass_mark}%</p>
    </>
  );

  // ── Results view ─────────────────────────────────────────────
  if (attemptId) {
    const { data: attempt } = await supabase
      .from("quiz_attempts")
      .select("id, score, passed, answers")
      .eq("id", attemptId)
      .eq("user_id", user.id)
      .maybeSingle();
    if (!attempt) notFound();

    // Correct answers + explanations are server-only; read them with the service role.
    const admin = createAdminClient();
    const { data: questions } = await admin
      .from("questions")
      .select("id, prompt, position, explanation, options(id, text, position, is_correct)")
      .eq("quiz_id", quizId);
    const answers = attempt.answers as Record<string, string | null>;
    const sorted = ((questions ?? []) as Question[]).sort(byPosition);

    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        {header}
        <div
          className={`mt-6 rounded-xl p-6 text-center ${
            attempt.passed ? "bg-go text-white" : "border-2 border-stop bg-red-50 text-stop"
          }`}
        >
          <p className="text-5xl font-bold">{attempt.score}%</p>
          <p className="mt-2 font-semibold">
            {attempt.passed ? "Passed — nice work." : `Not yet — you need ${quiz.pass_mark}% to pass. Review and try again.`}
          </p>
        </div>

        <ol className="mt-8 space-y-5">
          {sorted.map((q, i) => {
            const chosen = answers[q.id];
            const correctOpt = q.options.find((o) => o.is_correct);
            const right = chosen === correctOpt?.id;
            return (
              <li key={q.id} className="rounded-xl border border-line bg-card p-5">
                <QuestionPrompt number={i + 1} text={q.prompt} />
                <ul className="mt-3 space-y-1.5 text-sm">
                  {q.options.sort(byPosition).map((o) => (
                    <li
                      key={o.id}
                      className={`rounded px-3 py-2 ${
                        o.is_correct
                          ? "bg-green-50 font-semibold text-go"
                          : o.id === chosen
                            ? "bg-red-50 text-stop line-through"
                            : "text-muted"
                      }`}
                    >
                      {o.is_correct ? "✓ " : o.id === chosen ? "✗ " : ""}
                      {o.text}
                    </li>
                  ))}
                </ul>
                {!right && q.explanation && (
                  <p className="mt-3 border-l-4 border-hivis bg-[#fff8e1] px-3 py-2 text-sm">{q.explanation}</p>
                )}
              </li>
            );
          })}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/courses/${slug}/quizzes/${quizId}`}
            className="rounded-md border border-ink px-5 py-3 font-semibold hover:bg-white"
          >
            Retake quiz
          </Link>
          <Link href={`/courses/${slug}`} className="rounded-md bg-ink px-5 py-3 font-semibold text-white hover:bg-ink-soft">
            Back to course
          </Link>
        </div>
      </div>
    );
  }

  // ── Take-the-quiz view ───────────────────────────────────────
  const { data: questions } = await supabase
    .from("questions")
    .select("id, prompt, position, is_calculation, options(id, text, position)")
    .eq("quiz_id", quizId);
  const sorted = ((questions ?? []) as Question[]).sort(byPosition);
  const calcCount = sorted.filter((q) => q.is_calculation).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {header}
      {calcCount > 0 && (
        <p className="mt-4 rounded-md border-l-4 border-hivis bg-[#fff8e1] px-3 py-2 text-sm">
          🧮 {calcCount} {calcCount === 1 ? "question needs" : "questions need"} a calculation — have a calculator and
          paper ready, and show your working like you would in the assessment.
        </p>
      )}
      <form action={submitQuiz} className="mt-8 space-y-5">
        <input type="hidden" name="quizId" value={quizId} />
        <input type="hidden" name="slug" value={slug} />
        {sorted.map((q, i) => (
          <fieldset key={q.id} className="rounded-xl border border-line bg-card p-5">
            <legend className="sr-only">Question {i + 1}</legend>
            <QuestionPrompt number={i + 1} text={q.prompt} />
            <div className="mt-3 space-y-2">
              {q.options.sort(byPosition).map((o) => (
                <label
                  key={o.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-line px-3 py-2.5 hover:border-ink has-[:checked]:border-ink has-[:checked]:bg-hivis/15"
                >
                  <input type="radio" name={`q_${q.id}`} value={o.id} required className="mt-1 accent-ink" />
                  <span>{o.text}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <button className="w-full rounded-md bg-hivis py-3.5 font-semibold text-ink hover:bg-hivis-dark">
          Submit answers
        </button>
      </form>
    </div>
  );
}
