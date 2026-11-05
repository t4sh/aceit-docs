---
title: Customize the theme
description: Tune the visual system without hunting through individual components.
permalink: /guides/theming/
eleventyNavigation:
  key: Customize the theme
  parent: Guides
  order: 3
---

## Presets and palettes

The Appearance menu offers **ten presets**: Aceit Warm, Press, Workshop, Relay, Tempo, Ledger, Bookleaf, Beacon, Foundry, and Linen. Aceit Warm preserves the starter's original colors. Press adapts a paper-and-signal system. Linen uses four quiet, warm neutrals. The other seven adapt distinct color directions and surface geometry for documentation.

Those seven docs presets can each use **three palettes**: Muted, Bright, and Rich. The palette changes pigment intensity and surface tint; the preset chooses hue and corner treatment. Aceit Warm, Press, and Linen keep fixed palettes, so the palette selector is disabled for them. All choices work in both light and dark modes and are remembered on this device.

`src/_data/themePresets.json` owns the picker labels and IDs. `src/assets/css/themes/docs-presets.css` owns the seven palette recipes, font pairings, and the fixed Press and Linen colors. The original Aceit Warm colors remain in `src/assets/css/themes/aceit-warm.css`. These are local styles: the template does not import assets or code from the reference project.

Linen uses Coconut White (`#F2F1EA`) for the navigation rails, Cream Veil (`#FCF6ED`) for the article panel, Linen (`#FAF0E6`) for cards, and Cloud Dancer (`#F0EEE9`) for muted surfaces. Its dark mode uses corresponding warm charcoal surfaces with pale text.

The styles use semantic roles: `--background` for the left navigation and right rail, `--content-surface` for the rounded article panel, and `--foreground`, `--muted-foreground`, `--border`, `--primary`, and `--link` for content and controls. Both modes use CSS `light-dark()` so components can share a single rule. The approach follows [shadcn/ui theming](https://ui.shadcn.com/docs/theming): describe what a color does, not just what it looks like.

To change the default, set `themeVariant` and `themePalette` in `src/_data/site.json`. To add another preset, add its label and ID to the JSON data, define its semantic colors and geometry in a local theme stylesheet, and include that stylesheet in `src/pages/assets/styles.11ty.js`. Keep the root attributes and the picker IDs in sync. Test both modes and the narrow layout after changing tokens.

## Corner radii

Each appearance sets `--radius-panel`. The shared scale derives small, medium, and large radii at one quarter, one half, and three quarters of that value. Navigation highlights, sidebar controls, search controls and results, cards, and code blocks use these tokens, so their corners change together when switching appearances. Status and outline markers use `--radius-round` to retain their circular shape.

## Typography and rhythm

The shared type scale in `src/assets/css/tokens.css` follows [Fluid Functionalism's typography system](https://www.fluidfunctionalism.com/docs/typography). It has five reading roles: display (28/34), title (16/22), subtitle (14/20), body (13/20), and caption (12/16). A micro role is reserved for keyboard hints. The paired numbers are font size and line height in pixels.

Every preset keeps those sizes, weights, and `--space-*` rhythm, while its font families change the character of the page:

| Preset | Headings | Body |
| --- | --- | --- |
| Aceit Warm | Inter Variable | Inter Variable |
| Press | Cooper Hewitt | Atkinson Hyperlegible, with Geist fallback |
| Workshop | IBM Plex Sans | IBM Plex Sans |
| Relay | Manrope | IBM Plex Sans |
| Tempo | Lora | Source Sans 3 |
| Ledger | Merriweather | IBM Plex Sans |
| Bookleaf | Fraunces | Source Sans 3 |
| Beacon | Geist | Geist |
| Foundry | Mozilla Headline | Geist |
| Linen | Georgia | Geist |

Docs presets and Press use IBM Plex Mono for code; Aceit Warm keeps the system monospace stack. Georgia uses the reader’s installed system font, with a generic serif fallback. Other font files are self-hosted in `src/assets/fonts/` and loaded only when the selected preset uses them. The open font license notices live in `src/assets/fonts/licenses/`.

Press uses the original [Atkinson Hyperlegible](https://fonts.google.com/specimen/Atkinson+Hyperlegible) family, with regular and bold weights and matching italics. Its local WOFF2 files cover Latin and Latin Extended; each subset loads only when the page needs its characters. Geist is the next fallback. Foundry uses Geist as its default body font. Both presets retain their heading fonts.

To add a font pairing, place an open-licensed WOFF2 and its notice in `src/assets/fonts/`, declare the face in `src/assets/css/fonts.css`, then set `--font-heading` and `--font-body` on the preset in `docs-presets.css`. The `--font-mono` token controls code and keyboard hints. Edit the shared scale once to change reading density across every preset.

### Optional Supreme installation

Supreme is not included in this template and is not required to build or run it. If you prefer Supreme for your own site:

1. Download it directly from [Fontshare](https://www.fontshare.com/fonts/supreme) and review the [ITF Free Font License](https://www.fontshare.com/licenses/itf-ffl). Each site owner obtains their own copy.
2. Create `src/assets/fonts/optional/` and copy the supplied variable WOFF2 files into it as `supreme-variable.woff2` and `supreme-variable-italic.woff2`. Keep the supplied license with your download. This optional folder is ignored by Git, but the existing font asset copy includes it in your site's build.
3. Add these declarations to `src/assets/css/fonts.css`:

```css title="src/assets/css/fonts.css"
@font-face {
  font-family: "Supreme";
  src: url("fonts/optional/supreme-variable.woff2") format("woff2");
  font-style: normal;
  font-weight: 100 800;
  font-display: swap;
}

@font-face {
  font-family: "Supreme";
  src: url("fonts/optional/supreme-variable-italic.woff2") format("woff2");
  font-style: italic;
  font-weight: 100 800;
  font-display: swap;
}
```

4. Append an override for the preset you want to change to `src/assets/css/themes/docs-presets.css`. For example, to use Supreme in Press:

```css title="src/assets/css/themes/docs-presets.css"
:root[data-theme-variant="docs-press"] {
  --font-body: "Supreme", "Atkinson Hyperlegible Docs", "Geist Docs", ui-sans-serif, sans-serif;
}
```

For Foundry, use `docs-foundry` and the stack `"Supreme", "Geist Docs", ui-sans-serif, sans-serif`. Rebuild the site after installation. Because the optional font files are not committed, provide your own downloaded copies to your deployment build as well. Self-hosting for your site is permitted; do not include these optional files in a shared template or source archive.

## Theme behavior

Preset, palette, and color mode are independent choices. On a first visit, the page follows the operating system's light or dark setting. The color mode button at the bottom of the left navigation cycles through system, light, and dark modes and remembers the choice in local storage. This follows the three-mode behavior in Aceit Kit Starter.

Click the theme button until it announces system mode to return to your operating system's setting.
