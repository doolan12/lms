import { SITE } from "@/lib/site";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold uppercase md:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-muted">
        Last updated {SITE.updated}
        {SITE.abn && <> · {SITE.name} · ABN {SITE.abn}</>}
      </p>
      <div className="mt-8 space-y-5 leading-relaxed [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1">
        {children}
      </div>
    </article>
  );
}
