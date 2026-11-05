import { readFileSync } from "node:fs";
import { iconDataUrl } from "../../../lib/icons.js";

const fonts = new URL("../../assets/css/fonts.css", import.meta.url);
const tokens = new URL("../../assets/css/tokens.css", import.meta.url);
const theme = new URL("../../assets/css/themes/aceit-warm.css", import.meta.url);
const presets = new URL("../../assets/css/themes/docs-presets.css", import.meta.url);
const docs = new URL("../../assets/css/docs.css", import.meta.url);
const codeBlocks = new URL("../../assets/css/code-blocks.css", import.meta.url);
const timeline = new URL("../../assets/css/timeline.css", import.meta.url);

export default class Stylesheet {
  data() {
    return {
      permalink: "/assets/styles.css",
      eleventyExcludeFromCollections: true,
    };
  }

  render() {
    const iconMasks = `:root { --icon-chevron-right: ${iconDataUrl("chevron-right")}; --icon-close: ${iconDataUrl("close")}; }`;
    return `${readFileSync(fonts, "utf8")}\n${readFileSync(tokens, "utf8")}\n${readFileSync(theme, "utf8")}\n${readFileSync(presets, "utf8")}\n${iconMasks}\n${readFileSync(docs, "utf8")}\n${readFileSync(codeBlocks, "utf8")}\n${readFileSync(timeline, "utf8")}`;
  }
}
