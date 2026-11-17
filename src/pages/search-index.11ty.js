import { decodeEntities, docHeadingMatches } from "../../lib/doc-headings.js";

function visibleText(html) {
  return html.replace(/\s+/g, " ")
    .split(/<\/(?:p|li|pre|tr)>/i)
    .map((block) => decodeEntities(block.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}

function indexPage(item) {
  const html = (item.templateContent || "")
    .replace(/<(template|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const headings = [...docHeadingMatches(html)].filter(({ title }) => title);
  return {
    title: item.data.title,
    description: item.data.description || "",
    url: item.url,
    text: visibleText(html.slice(0, headings[0]?.start ?? html.length)),
    sections: headings.map(({ id, title, end }, index) => ({
      id: decodeEntities(id),
      title,
      text: visibleText(html.slice(end, headings[index + 1]?.start)),
    })),
  };
}

export default class SearchIndex {
  data() {
    return {
      // A script rather than JSON, because browsers block fetch() on file:// pages.
      permalink: "/assets/search-index.js",
      eleventyExcludeFromCollections: true,
    };
  }

  render({ collections }) {
    return `window.docsSearchIndex = ${JSON.stringify(
      collections.docs.map(indexPage),
    )};\n`;
  }
}
