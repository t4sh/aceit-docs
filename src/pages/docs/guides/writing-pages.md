---
title: Write a page
description: Add content and place it in the sidebar with front matter.
permalink: /guides/writing-pages/
eleventyNavigation:
  key: Write a page
  parent: Guides
  order: 1
---

## Add a Markdown file

Create a file under `src/pages/docs/`. The directory data file automatically applies the documentation layout and adds the page to the `docs` collection.

```yaml
---
title: Your page title
description: A short summary for readers and search.
permalink: /guides/your-page/
eleventyNavigation:
  key: Your page title
  parent: Guides
  order: 4
---
```

The `key` must be unique. `parent` points to another page's key. `order` controls the position among siblings. Leave out `parent` to make a top-level item.

## Write content

Use headings, lists, links, tables, and fenced code blocks. Second- and third-level headings receive stable IDs and appear in the page outline.

### Add code examples

Use a language name after the opening fence. Optional metadata adds a filename, highlighted lines, line numbers, or wrapping:

````markdown
```js title="settings.js" {2} line-numbers
export const settings = {
  theme: "system",
};
```
````

Use `wrap` for long text and logs. Leave it out for horizontally scrollable source code. Languages without a supported grammar remain readable as plain text and produce a build warning. Fences without a language use plain text.

For alternatives, put labelled fences in a code group:

````markdown
::: code-group sync="package-manager"

```sh [npm]
npm install zod
```

```sh [pnpm]
pnpm add zod
```

:::
````

Add `yarn` and `bun` tabs in the same way. Supply each command explicitly. Only groups with the same `sync` value share a saved selection; omit it for independent examples. Each group must contain only fenced blocks with distinct labels. Without JavaScript, every example remains visible under its label.

Use `// [!code ++]` and `// [!code --]` to mark added or removed lines. Copy preserves the original fence content, including annotation comments and its final newline. Use a separate final example when readers should copy only the completed change.

Markdown content is not evaluated as Nunjucks, so `{{ expressions }}` and `{% tags %}` are preserved in examples. Nunjucks still renders the surrounding layouts. Use a `.njk` page when the page itself needs template logic.

See [Components](/guides/components/#code-blocks) for rendered examples.

Write internal links from the site root, as in that link. The build rewrites them as relative paths, so the finished site works from any folder.

### Use trusted HTML sparingly

Raw HTML is enabled for small components in trusted, repository-authored docs. For a complex component, create a Nunjucks page or include under `src/_includes/`. Do not use untrusted Markdown as a template source.

## Keep links clear

Prefer descriptive link text. For example, write “Read the [theme guide](/guides/theming/)” instead of “click here.”
