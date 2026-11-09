export default class Robots {
  data() {
    return {
      permalink: "/robots.txt",
      eleventyExcludeFromCollections: true,
    };
  }

  render({ publishing }) {
    const sitemap = publishing.baseUrl ? `Sitemap: ${publishing.baseUrl}/sitemap.xml\n` : "";
    return `User-agent: *\nAllow: /\n${sitemap}`;
  }
}
