import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Lang } from "@/lib/i18n/languages";

/** A translated passage, shown under its English original. */
export function Translation({
  lang,
  text,
  markdown = true,
  className = "",
}: {
  lang: Lang;
  text: string | null;
  markdown?: boolean;
  className?: string;
}) {
  if (!text) return null;
  return (
    <div
      lang={lang.code}
      dir={lang.dir}
      className={`translation border-hivis bg-[#fffbea] text-[0.95em] text-ink-soft ${
        lang.dir === "rtl" ? "border-r-4 pr-3 pl-2" : "border-l-4 pl-3 pr-2"
      } py-1.5 ${className}`}
    >
      {markdown ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown> : text}
    </div>
  );
}

/** Reminder that the English version is the official one. */
export function TranslationNotice({ lang }: { lang: Lang }) {
  return (
    <div className="rounded-md border border-hivis bg-[#fffbea] px-3 py-2 text-sm">
      <p lang={lang.code} dir={lang.dir} className="font-semibold">
        🌐 {lang.notice}
      </p>
      <p className="mt-1 text-xs text-muted">
        Translations help you learn. The English version is the official one — your assessment will be in English.
      </p>
    </div>
  );
}
