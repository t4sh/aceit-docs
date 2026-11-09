# Inspiration and references

Aceit Docs is a reusable Eleventy and Nunjucks starter. These links record the examples considered while building it and the specific ideas to revisit. They are references, not dependencies or a request to copy another project's stack.

## Foundations in this workspace

| Project | What Aceit Docs takes from it |
| --- | --- |
| [Aceit Kit Starter](https://github.com/t4sh/aceit-kit-starter) | Eleventy project structure, Nunjucks layout chain, token-driven styling, and theme preference pattern. |
| Aceit Demo Kit | Warm semantic palette, crisp geometry, and compact offset shadows, adapted for long-form documentation. This repository is private. |

## Documentation templates and products

| Reference | Why it was considered |
| --- | --- |
| [Fumadocs](https://www.fumadocs.dev/) | Main benchmark for a polished documentation experience: navigation, readable articles, search, and useful content components. The goal here is a simpler static HTML interpretation. |
| [Eleventy Docs Template by johnrcd](https://github.com/johnrcd/eleventy-docs-template) | A simpler Eleventy documentation template for comparison. Link retained as originally supplied; its repository page could not be verified during this review. |
| [Spacebook](https://github.com/broeker/spacebook) | An earlier Eleventy documentation starter to compare content structure and navigation. |
| [Neat Starter](https://github.com/surjithctly/neat-starter) | An earlier Eleventy starter to compare authoring structure and lightweight frontend patterns. |
| [VitePress](https://vitepress.dev/) | A reference for clear documentation navigation and Markdown-first authoring. |
| [Starlight](https://starlight.astro.build/) | A reference for a complete docs experience, especially sidebar navigation, search, readable type, and theme controls. |
| [Nextra Docs Template](https://github.com/shuding/nextra-docs-template) | A Next.js documentation template for comparing page layout and navigation conventions. |

## Starter comparison

| Starter reference | Idea applied in Aceit Docs |
| --- | --- |
| [Eleventy Base Blog](https://demo-base-blog.11ty.dev/) and [One Starter](https://starter.buildawesome.one/) | Put the first editable file on the homepage and show the main content folders in the README. |
| [Eleventy Notes](https://eleventy-notes.sandroroth.com/) | Show search and appearance controls on the live docs site so visitors can try them. |
| [Elva](https://elva.scott.ee/) | Give the homepage a stronger typographic identity and demonstrate features with working links. |
| [ZeroPoint](https://getzeropoint.com/) | Link the primary demo action directly to GitHub's template creation flow. |
| [Eleventy Excellent](https://github.com/madrilene/eleventy-excellent) | Publish canonical URLs, a sitemap, and a share image with the static output. |

The [Build Awesome One comparison](https://buildawesome.one/starters/) lists these starters. The [official Eleventy directory](https://www.11ty.dev/docs/starter/) and the [11ty Bundle](https://11tybundle.dev/starters/) describe their own listing and selection methods.

## Visual system

| Reference | What to study |
| --- | --- |
| [shadcn/ui theming](https://ui.shadcn.com/docs/theming) | Semantic color roles and paired light/dark tokens for components. |
| [Tailwind CSS theme variables](https://tailwindcss.com/docs/theme) | Token naming and consistent color, type, and spacing scales. This is a design reference; Aceit Docs does not require Tailwind in the browser. |
| [Fluid Functionalism source](https://github.com/mickadesign/fluid-functionalism) | How translucent surfaces and related hues are constructed from one palette. |
| [Fluid Functionalism site](https://www.fluidfunctionalism.com/) | Heading treatment, typographic rhythm, and spacing in the rendered site. |

## “On this page” outline

| Reference | What to study |
| --- | --- |
| [Generative A11y getting started](https://generativea11y.com/docs/getting-started) | Nested headings and the shaped, rubber-band style indicator rail. |
| [OpenPost docs](https://openpo.st/docs/) | Immediate outline rendering, a small heading icon, smooth indicator movement, and an active rail covering every heading currently visible in the viewport. The indicator dot leads its direction of movement. |

## Decisions from visual review

- Keep tables minimal: a neutral grey header at 50% opacity, subtle neutral borders, and no colored tints in the body rows.
- Keep the previous and next cards balanced, with a left arrow for previous and a complementary right arrow for next.
- Keep the page outline nested and responsive to scroll. When multiple headings are visible, highlight all of them rather than only one.
## Content authoring references

- [VitePress Markdown extensions](https://vitepress.dev/guide/markdown): named code examples, grouped alternatives, highlights, and line numbers.
- [Starlight authoring content](https://starlight.astro.build/guides/authoring-content/): heading structure, quotations, images, asides, and native details.
- Apply these patterns through the existing Markdown renderer and small semantic HTML components. The component guide demonstrates quotations with attribution, keyboard keys, and a reusable release timeline; it does not require a client framework.
