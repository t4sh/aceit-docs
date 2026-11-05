import assert from "node:assert/strict";
import test from "node:test";
import MarkdownIt from "markdown-it";
import { createCodeBlocksPlugin } from "../lib/code-blocks.js";

const plugin = await createCodeBlocksPlugin();

function render(source) {
  return new MarkdownIt().use(plugin).render(source);
}

test("code blocks preserve raw source and escape it in a copy template", () => {
  const source = "const value = `{{ user.name }}`;\n";
  const html = render(`\`\`\`js title=\"example.js\"\n${source}\`\`\``);
  assert.match(html, /class="code-title">example\.js/);
  assert.ok(html.includes(`<template data-code-source>${MarkdownIt().utils.escapeHtml(source)}</template>`));
  assert.match(html, /--shiki-light:/);
  assert.match(html, /--shiki-dark:/);
});

test("code groups expose labeled panels and a shared package manager preference", () => {
  const html = render([
    '::: code-group sync="package-manager"',
    "",
    "```sh [npm]",
    "npm install example",
    "```",
    "",
    "```sh [pnpm]",
    "pnpm add example",
    "```",
    "",
    ":::",
  ].join("\n"));
  assert.match(html, /data-code-group="" data-code-group-id="code-group-\d+" data-code-sync="package-manager"/);
  assert.match(html, /data-value="npm"/);
  assert.match(html, /data-value="pnpm"/);
  assert.match(html, /data-code-panel/);
});

test("unknown languages render as readable plain text", () => {
  const html = render("```an-obscure-language\nhello <world>\n```");
  assert.match(html, /hello &lt;world&gt;/);
  assert.match(html, /language-text/);
});

test("highlights selected lines and preserves dangerous closing tags as copyable text", () => {
  const source = "const sample = '</template>';\nconsole.log(sample);\n";
  const html = render(`\`\`\`js {2} wrap\n${source}\`\`\``);
  assert.match(html, /class="line highlighted"/);
  assert.match(html, /data-code-wrap/);
  assert.ok(html.includes(MarkdownIt().utils.escapeHtml(source)));
});

test("line numbers count highlighted and diff lines", () => {
  const html = render("```js line-numbers {3}\na\nb\nc // [!code ++]\nd\n```");
  assert.match(html, /class="line highlighted diff add" data-line="3"/);
  assert.match(html, /class="line" data-line="4"/);
});

test("plaintext aliases are recognized languages", () => {
  const warnings = [];
  const originalWarn = console.warn;
  console.warn = (message) => warnings.push(message);
  try {
    render("```plaintext\nhello\n```");
    render("```txt\nhello\n```");
  } finally {
    console.warn = originalWarn;
  }
  assert.equal(warnings.length, 0);
});

test("group labels with spaces are safe and identifiers restart for each render", () => {
  const source = [
    "::: code-group",
    "",
    "```js [JavaScript example]",
    "console.log(1)",
    "```",
    "",
    "```ts [TypeScript example]",
    "console.log(1)",
    "```",
    "",
    ":::",
  ].join("\n");
  const first = render(source);
  const second = render(source);
  assert.match(first, /<span>JavaScript example<\/span>/);
  assert.match(first, /data-value="TypeScript example"/);
  assert.match(first, /id="code-group-1"/);
  assert.equal(first.match(/id="code-group-1"/g)?.length, second.match(/id="code-group-1"/g)?.length);
  assert.match(first, /id="code-panel-1"/);
});

test("empty, duplicate, and nested groups are rejected", () => {
  assert.throws(() => render("::: code-group\n:::\n"), /fenced code blocks/);
  assert.throws(() => render("::: code-group\n\n```js [same]\na\n```\n\n```ts [same]\nb\n```\n\n:::"), /unique/);
  assert.throws(() => render("::: code-group\n\n::: code-group\n\n```js\na\n```\n\n:::\n\n:::"), /nested/);
});
