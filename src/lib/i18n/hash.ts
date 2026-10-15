import { createHash } from "node:crypto";

/** Short fingerprint of an English segment; a translation is only shown if it matches. */
export const segHash = (text: string) => createHash("sha1").update(text.trim()).digest("hex").slice(0, 10);
