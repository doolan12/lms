import Link from "next/link";
import { notFound } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { getCourseOutline, isEnrolled } from "@/lib/courses";
import { FREE_PREVIEW_VIDEO_MODULES, MODULE_VIDEOS, videoMinutes } from "@/content/videos";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { narrationAudio } from "@/content/videos/audio";
import { illustration } from "@/content/illustrations";
import { getTranslator } from "@/lib/i18n/server";
import { Translation, TranslationNotice } from "@/components/i18n/Translation";

type Props = { params: Promise<{ slug: string; position: string }> };

export default async function WatchModulePage({ params }: Props) {
  const { slug, position } = await params;
  const pos = Number(position);
  const base = MODULE_VIDEOS[pos];
  if (!base) notFound();
  const art = illustration(`m${pos}`);
  const video = {
    ...base,
    slides: base.slides.map((s, i) =>
      i === 0 && s.visual.kind === "title" && art ? { ...s, visual: { ...s.visual, image: art } } : s,
    ),
  };

  const outline = await getCourseOutline(slug);
  if (!outline) notFound();
  const mod = outline.modules.find((m) => m.position === pos);
  if (!mod) notFound();

  const user = await getUser();
  const enrolled = user ? await isEnrolled(user.id, outline.course.id) : false;
  const canWatch = enrolled || FREE_PREVIEW_VIDEO_MODULES.has(pos);

  const firstLesson = mod.lessons[0];
  const lessonsHref = firstLesson ? `/courses/${slug}/lessons/${firstLesson.slug}` : `/courses/${slug}`;
  const quizHref = enrolled && mod.quiz ? `/courses/${slug}/quizzes/${mod.quiz.id}` : undefined;
  const tr = await getTranslator();
  const translated = tr ? base.slides.map((s, si) => s.say.map((t, k) => tr.t(`V:${pos}:${si}:${k}`, t))) : undefined;
  const prev = MODULE_VIDEOS[pos - 1] ? pos - 1 : null;
  const next = MODULE_VIDEOS[pos + 1] ? pos + 1 : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="text-sm text-muted">
        <Link href={`/courses/${slug}`} className="hover:text-ink">
          {outline.course.title}
        </Link>{" "}
        / Module {pos}
      </nav>
      <h1 className="mt-3 font-display text-3xl font-bold uppercase md:text-4xl">
        ▶ {mod.title}
      </h1>
      {tr && <Translation lang={tr.lang} text={tr.t(`M:${pos}`, mod.title)} markdown={false} className="mt-2 font-semibold" />}
      <p className="mt-1 text-sm text-muted">
        Module {pos} video · about {videoMinutes(video)} min · narrated with captions
      </p>

      <div className="mt-6">
        {canWatch ? (
          // Only the slide data for this module is sent to the browser, and only to students who can watch it.
          <>
            {tr && (
              <div className="mb-4">
                <TranslationNotice lang={tr.lang} />
              </div>
            )}
            <VideoPlayer
              video={video}
              lessonsHref={lessonsHref}
              quizHref={quizHref}
              audio={narrationAudio(video)}
              lang={tr?.lang}
              translated={translated}
            />
          </>
        ) : (
          <div className="rounded-xl border border-line bg-card p-8 text-center">
            <p className="text-lg font-semibold">This video is part of the full course.</p>
            <p className="mt-2 text-muted">Get full access to unlock every video, lesson, quiz and the final practice exam.</p>
            <Link
              href={`/courses/${slug}`}
              className="mt-5 inline-block rounded-md bg-hivis px-5 py-3 font-semibold text-ink hover:bg-hivis-dark"
            >
              See course options
            </Link>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted">
        On a phone, check the silent switch is off and the volume is up. Tip: press space to play or pause, and the
        arrow keys to skip.
      </p>

      <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-line pt-6 text-sm font-medium">
        {prev ? (
          <Link href={`/courses/${slug}/modules/${prev}/watch`} className="hover:underline">
            ← Module {prev} video
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/courses/${slug}/modules/${next}/watch`} className="hover:underline">
            Module {next} video →
          </Link>
        )}
      </div>
    </div>
  );
}
