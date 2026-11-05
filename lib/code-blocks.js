import markdownItContainer from "markdown-it-container";
import shikiMarkdownIt from "@shikijs/markdown-it";
import { bundledLanguages, bundledLanguagesAlias } from "shiki";
import { transformerMetaHighlight, transformerNotationDiff } from "@shikijs/transformers";
import { icon } from "./icons.js";

const copyButton = `<button class="code-copy" type="button" data-code-copy aria-label="Copy code" title="Copy code" hidden>${icon("copy", "code-copy-icon")}${icon("check", "code-copied-icon")}</button>`;

function escapeAttribute(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function metadata(info) {
  const title = info.match(/title\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s]+))/);
  const label = info.match(/\[([^\]]+)\]/);
  const highlight = info.match(/\{([\d, -]+)\}/)?.[1];
  return {
    title: title ? title.slice(1).find(Boolean) : (label?.[1] || ""),
    highlight,
    wrap: /(?:^|\s)wrap(?:$|\s)/.test(info),
    lineNumbers: /(?:^|\s)line-numbers(?:$|\s)/.test(info),
  };
}

export async function createCodeBlocksPlugin() {
  const highlightPlugin = await shikiMarkdownIt({
    themes: { light: "github-light-high-contrast", dark: "github-dark-default" },
    defaultColor: false,
    fallbackLanguage: "text",
    transformers: [transformerMetaHighlight(), transformerNotationDiff()],
  });

  return function codeBlocks(markdown) {
    markdown.use(highlightPlugin);
    const warnedLanguages = new Set();
    markdown.core.ruler.push("code_group_metadata", (state) => {
      let group;
      let groupNumber = 0;
      let panelNumber = 0;
      for (const token of state.tokens) {
        if (token.type === "container_code-group_open") {
          if (group) throw new Error("Code groups cannot be nested.");
          group = { open: token, values: [] };
          token.meta = { id: `code-group-${++groupNumber}` };
        } else if (token.type === "container_code-group_close") {
          if (!group || !group.values.length) throw new Error("A code group must contain fenced code blocks.");
          if (new Set(group.values).size !== group.values.length) throw new Error("Code group tab labels must be unique.");
          group.open.meta.labels = group.values;
          group = undefined;
        } else if (group) {
          if (token.type !== "fence") throw new Error("Code groups may contain fenced code blocks only.");
          const info = token.info.trim();
          const lang = info.split(/[\s[{]/, 1)[0] || "text";
          const value = metadata(info).title || lang;
          token.meta = { panelId: `code-panel-${++panelNumber}`, groupId: group.open.meta.id, value };
          group.values.push(value);
        } else if (token.type === "fence") token.meta = { panelId: `code-panel-${++panelNumber}` };
      }
      if (group) throw new Error("Unclosed code group.");
    });
    markdown.use(markdownItContainer, "code-group", {
      validate(params) { return /^code-group(?:\s|$)/.test(params.trim()); },
      render(tokens, index, options, env) {
        const token = tokens[index];
        if (token.nesting === 1) {
          const sync = token.info.match(/\bsync=["']([^"']+)["']/)?.[1];
          const id = token.meta.id;
          const tabs = token.meta.labels.map((label) => `<button type="button" data-code-tab data-value="${escapeAttribute(label)}"><span>${escapeAttribute(label)}</span><span class="code-tab-reserve" aria-hidden="true">${escapeAttribute(label)}</span></button>`).join("");
          token.attrSet("class", "code-block code-block-group");
          token.attrSet("data-code-group", "");
          token.attrSet("data-code-group-id", id);
          if (sync) token.attrSet("data-code-sync", sync);
          return `${markdown.renderer.renderToken(tokens, index, options)}<div class="code-header"><div class="code-tabs" data-code-tabs hidden>${tabs}</div>${copyButton}<span class="code-status" data-code-status aria-live="polite"></span></div>\n`;
        }
        return markdown.renderer.renderToken(tokens, index, options);
      },
    });

    const originalFence = markdown.renderer.rules.fence;
    markdown.renderer.rules.fence = (tokens, index, options, env, renderer) => {
      const token = tokens[index];
      const info = token.info.trim();
      const language = info.split(/[\s[{]/, 1)[0] || "text";
      const meta = metadata(info);
      let html = originalFence(tokens, index, options, env, renderer);
      if (meta.lineNumbers) {
        let lineNumber = 0;
        html = html.replace('<pre ', '<pre data-code-line-numbers ')
          .replace(/<span class="line([^\"]*)">/g, (_match, classes) =>
            `<span class="line${classes}" data-line="${++lineNumber}">`);
      }
      const source = `<template data-code-source>${markdown.utils.escapeHtml(token.content)}</template>`;
      const label = meta.title || language;
      const groupId = token.meta?.groupId;
      const id = token.meta?.panelId;
      const value = token.meta?.value || meta.title || language;
      const knownLanguage = bundledLanguages[language] || bundledLanguagesAlias[language]
        || ["text", "plaintext", "txt", "ansi"].includes(language);
      if (!knownLanguage && !warnedLanguages.has(language)) {
        warnedLanguages.add(language);
        console.warn(`[code blocks] Unknown language "${language}"; rendering as plain text.`);
      }
      const panelAttrs = ` class="code-panel" data-code-panel data-value="${escapeAttribute(value)}" id="${id}"${meta.wrap ? " data-code-wrap" : ""}${meta.highlight ? ` data-code-highlight="${escapeAttribute(meta.highlight)}"` : ""}`;
      const title = meta.title ? `<span class="code-title">${escapeAttribute(meta.title)}</span>` : `<span class="code-language">${escapeAttribute(language)}</span>`;
      const heading = `<span class="code-panel-label">${escapeAttribute(label)}</span>`;
      if (groupId) return `<section${panelAttrs}>${heading}${html}${source}</section>\n`;
      return `<div class="code-block"><div class="code-header">${title}${copyButton}<span class="code-status" data-code-status aria-live="polite"></span></div><section${panelAttrs}>${heading}${html}${source}</section></div>\n`;
    };
  };
}
