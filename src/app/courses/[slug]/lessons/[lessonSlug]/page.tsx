import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient, getUser } from "@/lib/supabase/server";
import { getCompletedLessonIds, getCourseOutline, isEnrolled } from "@/lib/courses";
import { setLessonComplete } from "../../actions";
import { FREE_PREVIEW_VIDEO_MODULES, MODULE_VIDEOS, videoMinutes } from "@/content/videos";

type Props = { params: Promise<{ slug: string; lessonSlug: string }> };

export default async function LessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params;
  const outline = await getCourseOutline(slug);
  if (!outline) notFound();

  const { course, modules, lessons } = outline;
  const index = lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) notFound();
  const lesson = lessons[index];
  const mod = modules.find((m) => m.id === lesson.module_id)!;
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const isLastInModule = mod.lessons[mod.lessons.length - 1]?.id === lesson.id;

  const user = await getUser();
  const enrolled = user ? await isEnrolled(user.id, course.id) : false;

  // RLS only returns content for preview lessons or enrolled students.
  const supabase = await createClient();
  const { data: content } = await supabase
    .from("lesson_content")
    .select("body_md, video_url")
    .eq("lesson_id", lesson.id)
    .maybeSingle();

  const done = user && enrolled ? (await getCompletedLessonIds(user.id, [lesson.id])).has(lesson.id) : false;
  const path = `/courses/${slug}/lessons/${lesson.slug}`;
  // After the last lesson of a module, send the student to that module's quiz.
  const afterComplete =
    isLastInModule && mod.quiz
      ? `/courses/${slug}/quizzes/${mod.quiz.id}`
      : next
        ? `/courses/${slug}/lessons/${next.slug}`
        : `/courses/${slug}`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-muted">
        <Link href={`/courses/${slug}`} className="hover:text-ink">
          {course.title}
        </Link>{" "}
        / Module {mod.position}: {mod.title}
      </nav>

      <h1 className="mt-3 font-display text-3xl font-bold uppercase md:text-4xl">{lesson.title}</h1>
      <p className="mt-2 text-sm text-muted">
        Lesson {index + 1} of {lessons.length} · {lesson.duration_minutes} min
      </p>

      {MODULE_VIDEOS[mod.position] && (enrolled || FREE_PREVIEW_VIDEO_MODULES.has(mod.position)) && (
        <Link
          href={`/courses/${slug}/modules/${mod.position}/watch`}
          className="mt-4 flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 hover:border-ink"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hivis text-ink">▶</span>
          <span>
            <span className="block font-semibold">Prefer to watch?</span>
            <span className="block text-sm text-muted">
              Module {mod.position} video with pictures and narration · about {videoMinutes(MODULE_VIDEOS[mod.position])} min
            </span>
          </span>
        </Link>
      )}

      {!content ? (
        <div className="mt-8 rounded-xl border border-line bg-card p-8 text-center">
          <p className="text-lg font-semibold">This lesson is part of the full course.</p>
          <p className="mt-2 text-muted">Get full access to unlock every lesson, quiz and the final practice exam.</p>
          <Link
            href={`/courses/${slug}`}
            className="mt-5 inline-block rounded-md bg-hivis px-5 py-3 font-semibold text-ink hover:bg-hivis-dark"
          >
            See course options
          </Link>
        </div>
      ) : (
        <>
          {content.video_url && (
            <div className="mt-6 aspect-video overflow-hidden rounded-xl bg-ink">
              <iframe
                src={content.video_url}
                title={lesson.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          )}
          <article className="prose-lesson mt-6">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.body_md}</ReactMarkdown>
          </article>
        </>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-6">
        {prev ? (
          <Link href={`/courses/${slug}/lessons/${prev.slug}`} className="text-sm font-medium hover:underline">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}

        <div className="ml-auto flex items-center gap-3">
          {enrolled && content && (
            <>
              {done && (
                <form action={setLessonComplete}>
                  <input type="hidden" name="lessonId" value={lesson.id} />
                  <input type="hidden" name="complete" value="false" />
                  <input type="hidden" name="path" value={path} />
                  <button className="text-sm text-muted hover:text-ink">Mark as not done</button>
                </form>
              )}
              <form action={setLessonComplete}>
                <input type="hidden" name="lessonId" value={lesson.id} />
                <input type="hidden" name="complete" value="true" />
                <input type="hidden" name="path" value={path} />
                <input type="hidden" name="goTo" value={afterComplete} />
                <button className="rounded-md bg-ink px-5 py-3 font-semibold text-white hover:bg-ink-soft">
                  {done ? "Next →" : isLastInModule && mod.quiz ? "Complete & take quiz →" : "Complete & continue →"}
                </button>
              </form>
            </>
          )}
          {!enrolled && next && (
            <Link href={`/courses/${slug}/lessons/${next.slug}`} className="text-sm font-medium hover:underline">
              {next.title} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
