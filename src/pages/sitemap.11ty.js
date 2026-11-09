import markdownIt from "markdown-it";

const { escapeHtml } = markdownIt().utils;

export default class Sitemap {
  data() {
    return {
      permalink: "/sitemap.xml",
      eleventyExcludeFromCollections: true,
    };
  }

  render({ collections, publishing }) {
    // An offline rebuild replaces any hosted sitemap already in the output folder.
    const locations = publishing.baseUrl
      ? collections.docs.filter(({ url }) => url).map(({ url }) =>
        `  <url><loc>${escapeHtml(publishing.baseUrl + url)}</loc></url>`,
      )
      : [];
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...locations,
      "</urlset>",
      "",
    ].join("\n");
  }
}
