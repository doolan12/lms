"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LANGUAGES, LANG_COOKIE } from "@/lib/i18n/languages";

/** Header control: pick a language to show translations under the English. */
export function LanguagePicker({ current }: { current: string | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <label className="flex items-center gap-1 text-sm" title="Show translations in another language">
      <span aria-hidden className="hidden sm:inline">🌐</span>
      <span className="sr-only">Show translations in</span>
      <select
        value={current ?? ""}
        disabled={pending}
        onChange={(e) => {
          const v = e.target.value;
          document.cookie = v
            ? `${LANG_COOKIE}=${encodeURIComponent(v)}; path=/; max-age=31536000; samesite=lax`
            : `${LANG_COOKIE}=; path=/; max-age=0; samesite=lax`;
          start(() => router.refresh());
        }}
        className="max-w-[6.5rem] rounded-md border border-white/30 bg-ink px-1 py-1 text-white sm:max-w-none sm:px-1.5"
      >
        <option value="">🌐 English</option>
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.native}
          </option>
        ))}
      </select>
    </label>
  );
}
