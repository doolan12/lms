"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { allLessonsComplete } from "@/lib/enrollment";

/**
 * Grades a quiz on the server. The browser never sees which options are
 * correct — only this action (using the service role) does.
 */
export async function submitQuiz(formData: FormData) {
  const quizId = String(formData.get("quizId") ?? "");
  const slug = String(formData.get("slug") ?? "");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();

  const { data: quiz } = await admin
    .from("quizzes")
    .select("id, course_id, pass_mark, is_final")
    .eq("id", quizId)
    .maybeSingle();
  if (!quiz) redirect(`/courses/${slug}`);

  const { data: enrollment } = await admin
    .from("enrollments")
    .select("course_id")
    .eq("user_id", user.id)
    .eq("course_id", quiz.course_id)
    .maybeSingle();
  if (!enrollment) redirect(`/courses/${slug}`);

  if (quiz.is_final && !(await allLessonsComplete(user.id, quiz.course_id))) {
    redirect(`/courses/${slug}`);
  }

  const { data: questions, error } = await admin
    .from("questions")
    .select("id, options(id, is_correct)")
    .eq("quiz_id", quizId);
  if (error || !questions?.length) throw new Error("Could not load quiz questions");

  const answers: Record<string, string | null> = {};
  let correct = 0;
  for (const q of questions) {
    const chosen = formData.get(`q_${q.id}`);
    const chosenId = typeof chosen === "string" ? chosen : null;
    answers[q.id] = chosenId;
    if (q.options.some((o) => o.id === chosenId && o.is_correct)) correct++;
  }

  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= quiz.pass_mark;

  const { data: attempt, error: insertError } = await admin
    .from("quiz_attempts")
    .insert({ user_id: user.id, quiz_id: quizId, score, passed, answers })
    .select("id")
    .single();
  if (insertError) throw insertError;

  revalidatePath(`/courses/${slug}`);
  revalidatePath("/dashboard");
  redirect(`/courses/${slug}/quizzes/${quizId}?attempt=${attempt.id}`);
}
