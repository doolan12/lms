import "server-only";
import { createClient } from "@/lib/supabase/server";

export type Course = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  price_cents: number;
  currency: string;
};

export type Lesson = {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  position: number;
  duration_minutes: number;
  is_preview: boolean;
};

export type Quiz = {
  id: string;
  module_id: string | null;
  title: string;
  pass_mark: number;
  is_final: boolean;
};

export type ModuleWithLessons = {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
  quiz: Quiz | null;
};

export type CourseOutline = {
  course: Course;
  modules: ModuleWithLessons[];
  finalQuiz: Quiz | null;
  /** All lessons in course order — handy for prev/next navigation. */
  lessons: Lesson[];
};

const COURSE_COLUMNS = "id, slug, title, summary, description, price_cents, currency";

export async function listCourses(): Promise<Course[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("courses")
    .select(COURSE_COLUMNS)
    .order("created_at");
  if (error) throw error;
  return data ?? [];
}

export async function getCourseOutline(slug: string): Promise<CourseOutline | null> {
  const supabase = await createClient();
  const { data: course, error } = await supabase
    .from("courses")
    .select(COURSE_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!course) return null;

  const [modulesRes, lessonsRes, quizzesRes] = await Promise.all([
    supabase.from("modules").select("id, title, position").eq("course_id", course.id).order("position"),
    supabase
      .from("lessons")
      .select("id, module_id, slug, title, position, duration_minutes, is_preview")
      .eq("course_id", course.id)
      .order("position"),
    supabase.from("quizzes").select("id, module_id, title, pass_mark, is_final").eq("course_id", course.id),
  ]);
  if (modulesRes.error) throw modulesRes.error;
  if (lessonsRes.error) throw lessonsRes.error;
  if (quizzesRes.error) throw quizzesRes.error;

  const quizzes = quizzesRes.data ?? [];
  const modules: ModuleWithLessons[] = (modulesRes.data ?? []).map((m) => ({
    ...m,
    lessons: (lessonsRes.data ?? []).filter((l) => l.module_id === m.id),
    quiz: quizzes.find((q) => q.module_id === m.id && !q.is_final) ?? null,
  }));

  return {
    course,
    modules,
    finalQuiz: quizzes.find((q) => q.is_final) ?? null,
    lessons: modules.flatMap((m) => m.lessons),
  };
}

export async function isEnrolled(userId: string, courseId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("enrollments")
    .select("course_id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .maybeSingle();
  return Boolean(data);
}

/** Lesson ids the user has completed. */
export async function getCompletedLessonIds(userId: string, lessonIds: string[]): Promise<Set<string>> {
  if (lessonIds.length === 0) return new Set();
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .in("lesson_id", lessonIds);
  return new Set((data ?? []).map((r) => r.lesson_id));
}

/** Best score per quiz for the user. */
export async function getBestScores(
  userId: string,
  quizIds: string[],
): Promise<Map<string, { score: number; passed: boolean }>> {
  const best = new Map<string, { score: number; passed: boolean }>();
  if (quizIds.length === 0) return best;
  const supabase = await createClient();
  const { data } = await supabase
    .from("quiz_attempts")
    .select("quiz_id, score, passed")
    .eq("user_id", userId)
    .in("quiz_id", quizIds);
  for (const a of data ?? []) {
    const prev = best.get(a.quiz_id);
    if (!prev || a.score > prev.score) best.set(a.quiz_id, { score: a.score, passed: a.passed });
  }
  return best;
}

export function formatPrice(cents: number, currency = "aud") {
  if (cents === 0) return "Free";
  return new Intl.NumberFormat("en-AU", { style: "currency", currency: currency.toUpperCase() }).format(
    cents / 100,
  );
}
