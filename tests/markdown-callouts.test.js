import assert from "node:assert/strict";
import test from "node:test";
import MarkdownIt from "markdown-it";
import { markdownCallouts } from "../lib/markdown-callouts.js";

test("callouts render Markdown content and leave regular quotations alone", () => {
  const html = new MarkdownIt().use(markdownCallouts).render([
    "> [!TIP]",
    "> Follow the **guide**.",
    ">",
    "> - First step",
    "",
    "> [!WARNING]",
    ">",
    "> Back up your data.",
    "",
    "> A regular quotation.",
  ].join("\n"));
  assert.match(html, /<div class="callout">\s*<strong>Tip<\/strong>\s*<p>Follow the <strong>guide<\/strong>\.<\/p>\s*<ul>/);
  assert.match(html, /<div class="callout">\s*<strong>Warning<\/strong>\s*<p>Back up your data\.<\/p>\s*<\/div>/);
  assert.match(html, /<blockquote>\s*<p>A regular quotation\.<\/p>\s*<\/blockquote>/);
});
