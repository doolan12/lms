"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ModuleVideo } from "@/content/videos/types";
import { SlideVisual } from "./SlideVisual";
import type { Lang } from "@/lib/i18n/languages";

const RATES = [0.85, 1, 1.15];

/** Pick the most natural-sounding English voice the device offers, preferring Australian. */
function pickVoice(voices: SpeechSynthesisVoice[]) {
  const en = voices.filter((v) => v.lang?.toLowerCase().startsWith("en"));
  const score = (v: SpeechSynthesisVoice) => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    let s = 0;
    if (lang === "en-au") s += 30;
    else if (lang === "en-gb" || lang === "en-nz") s += 20;
    else if (lang === "en-us") s += 10;
    if (/natural|neural|premium|enhanced|online/.test(name)) s += 15;
    if (/google|siri|karen|lee|catherine|samantha|daniel/.test(name)) s += 5;
    if (v.localService) s += 1;
    return s;
  };
  return en.sort((a, b) => score(b) - score(a))[0] ?? null;
}

/** Reading time for a caption when there's no voice (≈ 2.6 words a second). */
const readMs = (text: string) => Math.max(2500, (text.split(/\s+/).length / 2.6) * 1000);

export function VideoPlayer({
  video,
  lessonsHref,
  quizHref,
  audio,
  lang,
  translated,
  translatedAudio,
  voiceLabel,
}: {
  video: ModuleVideo;
  lessonsHref: string;
  quizHref?: string;
  /** Recorded narration per slide and segment (null where a line has no recording yet). */
  audio?: (string | null)[][];
  /** Learner's translation language, and each line's translation (null where missing). */
  lang?: Lang;
  translated?: (string | null)[][];
  /** Recorded narration in the learner's language (null where a line isn't recorded). */
  translatedAudio?: (string | null)[][];
  /** Name of that language, for the voice switch. */
  voiceLabel?: string;
}) {
  const slides = video.slides;
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [rate, setRate] = useState(1);
  const [speechOk, setSpeechOk] = useState(true);
  const [voiceFailed, setVoiceFailed] = useState(false);
  const [voiceLang, setVoiceLang] = useState<"en" | "tr">(translatedAudio ? "tr" : "en");

  const token = useRef(0);
  const resumeSeg = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  // One reused <audio> element: once a tap has unlocked it, phones let it keep playing.
  const player = useRef<HTMLAudioElement | null>(null);
  const hasRecording = useMemo(() => !!audio?.some((s) => s.some(Boolean)), [audio]);
  const settings = useRef({ soundOn, rate, voiceLang });
  settings.current = { soundOn, rate, voiceLang };

  const totalSegments = useMemo(() => slides.reduce((n, s) => n + s.say.length, 0), [slides]);
  const segmentsBefore = useMemo(() => {
    const out: number[] = [];
    let n = 0;
    for (const s of slides) {
      out.push(n);
      n += s.say.length;
    }
    return out;
  }, [slides]);

  // Load voices (they arrive asynchronously in most browsers)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (!hasRecording) {
        setSpeechOk(false);
        setSoundOn(false);
      }
      return;
    }
    const load = () => {
      voice.current = pickVoice(window.speechSynthesis.getVoices());
    };
    load();
    window.speechSynthesis.addEventListener?.("voiceschanged", load);
    return () => {
      window.speechSynthesis.removeEventListener?.("voiceschanged", load);
      window.speechSynthesis.cancel();
    };
  }, [hasRecording]);

  const stopAll = useCallback(() => {
    token.current++;
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    const a = player.current;
    if (a) {
      a.onended = a.onerror = null;
      a.pause();
    }
  }, []);

  useEffect(() => stopAll, [stopAll]);

  const runSegment = useCallback(
    (si: number, seg: number) => {
      const my = token.current;
      setIndex(si);
      setStep(seg);
      const text = slides[si].say[seg];

      const advance = (delay: number) => {
        if (token.current !== my) return;
        timer.current = setTimeout(() => {
          if (token.current !== my) return;
          if (seg + 1 < slides[si].say.length) runSegment(si, seg + 1);
          else if (si + 1 < slides.length) runSegment(si + 1, 0);
          else {
            setPlaying(false);
            setFinished(true);
          }
        }, delay);
      };

      const { soundOn: sound, rate: r, voiceLang: vl } = settings.current;
      const src = (vl === "tr" ? translatedAudio?.[si]?.[seg] : null) ?? audio?.[si]?.[seg];
      const gap = seg + 1 < slides[si].say.length ? 250 : 700;
      if (sound && src) {
        // Recorded human-sounding narration
        const a = (player.current ??= new Audio());
        a.preload = "auto";
        let done = false;
        const finish = (delay: number) => {
          if (done || token.current !== my) return;
          done = true;
          advance(delay);
        };
        a.onended = () => finish(gap);
        a.onerror = () => finish(readMs(text) / r); // file missing: keep the captions going
        a.src = src;
        a.playbackRate = r;
        a.play().catch(() => finish(readMs(text) / r));
        // Preload the next line so there's no pause between lines
        const pick = (a: number, b: number) => (vl === "tr" ? translatedAudio?.[a]?.[b] : null) ?? audio?.[a]?.[b];
        const nextSrc = pick(si, seg + 1) ?? pick(si + 1, 0);
        if (nextSrc) {
          const l = document.createElement("link");
          l.rel = "prefetch";
          l.as = "audio";
          l.href = nextSrc;
          document.head.appendChild(l);
          setTimeout(() => l.remove(), 30000);
        }
      } else if (sound && "speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance(text);
        if (voice.current) u.voice = voice.current;
        u.lang = voice.current?.lang ?? "en-AU";
        u.rate = r;
        let done = false;
        let started = false;
        u.onstart = () => {
          started = true;
        };
        u.onend = () => {
          if (done) return;
          done = true;
          advance(gap);
        };
        u.onerror = (e) => {
          if (done || e.error === "interrupted" || e.error === "canceled") return;
          done = true;
          // Voice failed — fall back to timed captions for this segment
          advance(readMs(text) / r);
        };
        window.speechSynthesis.speak(u);

        // Watchdogs: some devices never start speaking, or never report the end.
        setTimeout(() => {
          if (token.current !== my || done || started) return;
          done = true;
          window.speechSynthesis.cancel();
          setVoiceFailed(true);
          setSoundOn(false);
          settings.current.soundOn = false;
          advance(readMs(text) / r);
        }, 2500);
        setTimeout(() => {
          if (token.current !== my || done) return;
          done = true;
          advance(0);
        }, (readMs(text) / r) * 2.5 + 4000);
      } else {
        advance(readMs(text) / r);
      }
    },
    [slides, audio, translatedAudio],
  );

  const play = useCallback(() => {
    stopAll();
    setPlaying(true);
    if (finished) {
      setFinished(false);
      runSegment(0, 0);
    } else {
      runSegment(index, Math.min(resumeSeg.current, slides[index].say.length - 1));
    }
  }, [finished, index, slides, runSegment, stopAll]);

  const pause = useCallback(() => {
    stopAll();
    resumeSeg.current = step;
    setPlaying(false);
  }, [stopAll, step]);

  const goTo = useCallback(
    (i: number) => {
      if (i < 0 || i >= slides.length) return;
      stopAll();
      setFinished(false);
      if (playing) runSegment(i, 0);
      else {
        resumeSeg.current = 0;
        setIndex(i);
        setStep(slides[i].say.length - 1); // browsing: show the whole slide
      }
    },
    [playing, slides, runSegment, stopAll],
  );

  // Keyboard: space = play/pause, arrows = prev/next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || tag === "BUTTON") return;
      if (e.key === " ") {
        e.preventDefault();
        if (playing) pause();
        else play();
      } else if (e.key === "ArrowRight") goTo(index + 1);
      else if (e.key === "ArrowLeft") goTo(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing, play, pause, goTo, index]);

  // Restart the current segment when sound or speed changes mid-play
  const changeSetting = (fn: () => void) => {
    fn();
    if (playing) {
      stopAll();
      setTimeout(() => runSegment(index, step), 0);
    }
  };

  const slide = slides[index];
  const position = segmentsBefore[index] + step + (finished ? 1 : 0);
  const caption = playing ? slide.say[step] : slide.say.join(" ");
  const trLines = translated?.[index] ?? [];
  const trCaption = playing ? trLines[step] : trLines.filter(Boolean).join(" ");
  const started = playing || finished || index > 0 || step > 0;

  return (
    <div>
      {/* Stage */}
      <div
        className="relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-paper shadow-sm"
        style={{ containerType: "inline-size" }}
      >
        <SlideVisual key={index} visual={slide.visual} step={playing ? step : slide.say.length - 1} sayCount={slide.say.length} />

        {!started && (
          <button
            onClick={play}
            className="absolute inset-0 flex items-center justify-center bg-ink/35 transition hover:bg-ink/25"
            aria-label="Play video"
          >
            <span className="flex items-center justify-center rounded-full bg-hivis shadow-lg" style={{ width: "13cqw", height: "13cqw" }}>
              <svg viewBox="0 0 24 24" style={{ width: "6cqw", height: "6cqw" }} fill="#16181d" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}

        {finished && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[2cqw] bg-ink/85 text-white">
            <p className="font-display font-bold uppercase" style={{ fontSize: "4.5cqw" }}>
              Module {video.module} video complete
            </p>
            <div className="flex flex-wrap justify-center gap-[1.5cqw]" style={{ fontSize: "2.4cqw" }}>
              <button onClick={play} className="rounded-md border border-white/60 px-[2.5cqw] py-[1.2cqw] font-semibold hover:bg-white/10">
                ↺ Watch again
              </button>
              <Link href={lessonsHref} className="rounded-md bg-white px-[2.5cqw] py-[1.2cqw] font-semibold text-ink hover:bg-paper">
                Read the lessons
              </Link>
              {quizHref && (
                <Link href={quizHref} className="rounded-md bg-hivis px-[2.5cqw] py-[1.2cqw] font-semibold text-ink hover:bg-hivis-dark">
                  Take the quiz →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-line" aria-hidden>
        <div className="h-full bg-hivis transition-all duration-500" style={{ width: `${(position / totalSegments) * 100}%` }} />
      </div>

      {/* Controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold disabled:opacity-40"
          aria-label="Previous slide"
        >
          ◀
        </button>
        <button
          onClick={playing ? pause : play}
          className="min-w-28 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-soft"
        >
          {playing ? "❚❚ Pause" : finished ? "↺ Replay" : started ? "▶ Resume" : "▶ Play"}
        </button>
        <button
          onClick={() => goTo(index + 1)}
          disabled={index === slides.length - 1}
          className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold disabled:opacity-40"
          aria-label="Next slide"
        >
          ▶
        </button>
        <span className="text-sm tabular-nums text-muted">
          {index + 1} / {slides.length}
        </span>

        <div className="ml-auto flex items-center gap-2">
          {speechOk && (
            <button
              onClick={() => changeSetting(() => setSoundOn((v) => !v))}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold"
              aria-pressed={soundOn}
            >
              {soundOn ? "🔊 Voice on" : "🔇 Voice off"}
            </button>
          )}
          {translatedAudio && voiceLabel && (
            <label className="flex items-center gap-1 text-sm">
              <span className="sr-only">Narration language</span>
              <select
                value={voiceLang}
                onChange={(e) => {
                  const v = e.target.value as "en" | "tr";
                  settings.current.voiceLang = v;
                  changeSetting(() => setVoiceLang(v));
                }}
                className="rounded-md border border-line bg-white px-2 py-2 text-sm font-semibold"
              >
                <option value="tr">🗣 {voiceLabel}</option>
                <option value="en">🗣 English</option>
              </select>
            </label>
          )}
          <label className="flex items-center gap-1 text-sm">
            <span className="sr-only">Speed</span>
            <select
              value={rate}
              onChange={(e) => {
                const r = Number(e.target.value);
                changeSetting(() => setRate(r));
              }}
              className="rounded-md border border-line bg-white px-2 py-2 text-sm font-semibold"
            >
              {RATES.map((r) => (
                <option key={r} value={r}>
                  {r === 1 ? "Normal speed" : r < 1 ? "Slower" : "Faster"}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Captions */}
      <p className="mt-4 min-h-[4.5rem] rounded-lg bg-ink px-4 py-3 text-lg leading-snug text-white" aria-live="polite">
        {caption}
      </p>
      {lang && trCaption && (
        <p
          lang={lang.code}
          dir={lang.dir}
          className="mt-1 rounded-lg border-hivis bg-[#fffbea] px-4 py-2 text-base leading-snug text-ink"
          aria-live="polite"
        >
          {trCaption}
        </p>
      )}
      {voiceFailed && !hasRecording && (
        <p className="mt-2 text-sm text-muted">
          The voice didn&apos;t start on this device, so the captions are playing on their own. Turn the voice back on to
          try again.
        </p>
      )}
      {!speechOk && (
        <p className="mt-2 text-sm text-muted">This browser can&apos;t read aloud, so the captions will play on their own.</p>
      )}

      <details className="mt-6 rounded-lg border border-line bg-white p-4">
        <summary className="cursor-pointer font-semibold">Full transcript</summary>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm leading-relaxed text-ink-soft">
          {slides.map((s, i) => (
            <li key={i}>
              <button onClick={() => goTo(i)} className="text-left hover:underline">
                {s.say.join(" ")}
              </button>
              {lang && translated?.[i]?.some(Boolean) && (
                <span lang={lang.code} dir={lang.dir} className="mt-1 block text-ink">
                  {translated[i].filter(Boolean).join(" ")}
                </span>
              )}
            </li>
          ))}
        </ol>
      </details>
    </div>
  );
}
