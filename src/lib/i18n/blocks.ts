// Splits lesson markdown into blocks so each one can be shown with its translation underneath.
// Used both when extracting text for translation and when rendering, so the keys always line up.
// List items become their own blocks (keeping their marker, so numbering is preserved).

const LIST_ITEM = /^(\s*)([-*]|\d+\.)\s+/;

export function splitBlocks(md: string): string[] {
  const chunks = md
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((c) => c.replace(/^\n+|\n+$/g, ""))
    .filter((c) => c.trim().length > 0);
  const out: string[] = [];
  for (const chunk of chunks) {
    const lines = chunk.split("\n");
    if (LIST_ITEM.test(lines[0]) && !lines[0].startsWith(" ")) {
      // Top-level list: one block per item (continuation/nested lines stay with their item).
      let cur: string[] = [];
      for (const line of lines) {
        if (LIST_ITEM.test(line) && !/^\s/.test(line)) {
          if (cur.length) out.push(cur.join("\n"));
          cur = [line];
        } else cur.push(line);
      }
      if (cur.length) out.push(cur.join("\n"));
    } else {
      out.push(chunk);
    }
  }
  return out;
}

/** True for blocks that are only formatting (e.g. a table divider) — nothing to translate. */
export function isTranslatable(block: string) {
  return /[A-Za-z]/.test(block);
}
