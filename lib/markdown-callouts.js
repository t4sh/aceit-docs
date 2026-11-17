export function markdownCallouts(markdown) {
  markdown.core.ruler.before("inline", "callouts", ({ tokens }) => {
    for (const [index, open] of tokens.entries()) {
      if (open.type !== "blockquote_open") continue;
      const paragraph = tokens[index + 1];
      if (paragraph?.type !== "paragraph_open") continue;
      const inline = tokens[index + 2];
      const marker = inline.content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(?:\n|$)/i);
      if (!marker) continue;

      const close = tokens.slice(index + 1).find((token) =>
        token.type === "blockquote_close" && token.level === open.level);
      open.type = "callout_open";
      open.tag = close.tag = "div";
      open.attrSet("class", "callout");
      open.meta = { label: marker[1][0].toUpperCase() + marker[1].slice(1).toLowerCase() };
      inline.content = inline.content.slice(marker[0].length);
      if (!inline.content) paragraph.hidden = tokens[index + 3].hidden = true;
    }
  });

  markdown.renderer.rules.callout_open = (tokens, index, options, env, renderer) =>
    `${renderer.renderToken(tokens, index, options)}<strong>${tokens[index].meta.label}</strong>\n`;
}
