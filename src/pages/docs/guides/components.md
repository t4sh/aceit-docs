---
title: Components
description: Small content patterns that keep long pages easy to scan.
permalink: /guides/components/
eleventyNavigation:
  key: Components
  parent: Guides
  order: 2
---

## Callouts

Markdown blockquotes work as calm, readable notes:

> **Good to know:** Keep callouts short. If a note needs several paragraphs, give it a section of its own.

For a more prominent message, use a small HTML component in trusted documentation files:

<aside class="callout" aria-label="Important note">
  <strong>Important</strong>
  <p>Check both themes when adding a new color or surface.</p>
</aside>

## Quotations and captions

Use a blockquote for quoted material and a figure caption for its attribution. Keep distinct paragraphs when the quotation contains more than one thought.

<figure>
  <blockquote>
    <p>Write the instruction where the reader needs it.</p>
    <p>Give each section one job, and each example enough context to be useful.</p>
  </blockquote>
  <figcaption>Example editorial guideline</figcaption>
</figure>

Figures also support images: use an `<img>` with descriptive `alt` text and explicit `width` and `height`, followed by a `<figcaption>`. Images shrink to fit the reading column and inherit the appearance's corner radius.

## Headings and keyboard keys

The page title is its only level-one heading. Use `##` for sections and `###` for topics within a section; both appear in the page outline. Keep heading levels in sequence.

Use `<kbd>` for actual keys: press <kbd>Ctrl</kbd> + <kbd>K</kbd> (or <kbd>Command</kbd> + <kbd>K</kbd> on macOS) to open search. Use inline code for identifiers such as `themeVariant`.

## Code blocks

Code examples follow your light or dark appearance. Copy a complete example with the button in its header, or select just the lines you need.

```js title="eleventy.config.js" {2-4}
export default function (eleventyConfig) {
  eleventyConfig.addCollection("docs", (api) =>
    api.getFilteredByTag("docs")
  );
}
```

### Package managers

Choose your package manager once. Matching groups on this site remember your selection.

::: code-group sync="package-manager"

```sh [npm]
npm install zod
```

```sh [pnpm]
pnpm add zod
```

```sh [yarn]
yarn add zod
```

```sh [bun]
bun add zod
```

:::

The selection also applies to this second group:

::: code-group sync="package-manager"

```sh [npm]
npm run dev
```

```sh [pnpm]
pnpm dev
```

```sh [yarn]
yarn dev
```

```sh [bun]
bun run dev
```

:::

### Different languages

Use independent tabs for alternative implementations. These examples read a local JSON file.

::: code-group

```js [JavaScript]
import { readFile } from "node:fs/promises";

const content = await readFile("settings.json", "utf8");
const settings = JSON.parse(content);
console.log(settings.theme);
```

```python [Python]
import json
from pathlib import Path

content = Path("settings.json").read_text(encoding="utf-8")
settings = json.loads(content)
print(settings["theme"])
```

:::

### Line numbers and changes

Add line numbers when the surrounding explanation refers to specific lines. Here, line 3 sets the public path.

```json title="settings.json" line-numbers {3}
{
  "name": "Documentation",
  "basePath": "/docs/",
  "search": true
}
```

Mark changes to make a migration easier to follow:

```js title="settings.js"
export const settings = {
  theme: "light", // [!code --]
  theme: "system", // [!code ++]
};
```

### Literal template examples

Template syntax is displayed exactly as written, including braces and tags:

```liquid title="welcome.liquid"
{% if user %}
  <h1>Hello, {{ user.name }}!</h1>
{% endif %}
```

### Long text

Code scrolls horizontally by default. Opt into wrapping for logs or long text that should fit the page.

```text title="build.log" wrap
Build complete: generated documentation, search index, stylesheets, and local fonts. The output is ready to serve from any static web host, with all code examples highlighted ahead of time.
```

## Tables

| Element | Best use |
| --- | --- |
| Heading | Name a topic or task |
| List | Show a sequence or related choices |
| Table | Compare the same fields across items |
| Callout | Highlight a useful exception |

## Links and buttons

Use links to move between pages. Use buttons for actions such as opening search or switching themes. Keeping those roles separate makes the interface easier to understand with a keyboard or screen reader.

## Disclosure

Use native disclosure for optional detail. It works without JavaScript.

<details class="disclosure">
  <summary>When should I use this?</summary>
  <p>For supporting information that most readers can safely skip. Keep essential instructions visible.</p>
</details>

## Release timeline

The [release-notes page](/release-notes/) demonstrates a reusable, responsive timeline. Its dates and versions are sample content, not the template's release history.

Use a `.njk` page to call the timeline macro. Keep entries newest first, give each an individual anchor, and use an ISO date for the machine-readable value. Each entry can contain paragraphs, lists, links, and headings. Write breaking changes and migration instructions explicitly when they apply.

```jinja title="src/pages/docs/release-notes.njk"
{% import "macros/timeline.njk" as timeline %}
<ol class="release-timeline" role="list">
  {% call timeline.entry("version-1-0", "v1.0.0", "2026-04-16", "16 April 2026", "The first chapter") %}
    <p>Describe what changed and what readers need to do.</p>
  {% endcall %}
</ol>
```
