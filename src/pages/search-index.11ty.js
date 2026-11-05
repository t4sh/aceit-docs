import markdownIt from "markdown-it";

const { unescapeAll } = markdownIt().utils;

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
      collections.docs.map((item) => ({
        title: item.data.title,
        description: item.data.description || "",
        url: item.url,
        text: (item.templateContent || "")
          .replace(/<template\b[^>]*>[\s\S]*?<\/template>/g, "")
          .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
          .replace(/<[^>]*>/g, " ")
          .replace(/&(?:#x[\da-f]+|#\d+|[a-z][\da-z]+);/gi, (entity) => unescapeAll(entity))
          .replace(/\s+/g, " ")
          .trim(),
      })),
    )};\n`;
  }
}
