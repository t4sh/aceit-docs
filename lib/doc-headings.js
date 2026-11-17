import markdownIt from "markdown-it";

const { unescapeAll } = markdownIt().utils;

export function decodeEntities(text) {
  return text.replace(/&(?:#x[\da-f]+|#\d+|[a-z][\da-z]+);/gi, (entity) => unescapeAll(entity));
}

export function* docHeadingMatches(html) {
  for (const match of html.matchAll(/<h([23])(?=[\s>])((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/h\1>/gi)) {
    const attributes = match[2].matchAll(/\s+id\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))|"[^"]*"|'[^']*'/gi);
    const id = Array.from(attributes).find((attribute) => attribute[1] || attribute[2] || attribute[3]);
    if (!id) continue;
    const title = decodeEntities(
      match[3].replace(/<a\b[^>]*class="header-anchor"[^>]*>[\s\S]*?<\/a>/g, "")
        .replace(/<[^>]+>/g, "").trim(),
    );
    yield {
      id: id[1] || id[2] || id[3],
      title,
      level: Number(match[1]),
      start: match.index,
      end: match.index + match[0].length,
    };
  }
}
