import eleventyNavigationPlugin from "@11ty/eleventy-navigation";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { createCodeBlocksPlugin } from "./lib/code-blocks.js";
import { icon } from "./lib/icons.js";
import { relativeUrl } from "./lib/relative-urls.js";
import { githubEditUrl, jsonScript } from "./lib/template-data.js";

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addShortcode("icon", icon);
  eleventyConfig.addFilter("jsonScript", jsonScript);
  eleventyConfig.addFilter("githubEditUrl", githubEditUrl);

  // Relative links let the built site run from any folder or straight from disk.
  eleventyConfig.htmlTransformer.addUrlTransform("html", function (url) {
    return relativeUrl(this.page.url, url);
  });

  // Docs files are trusted, repository-authored content; this enables HTML components.
  const markdown = markdownIt({ html: true, linkify: true, typographer: true })
    .use(markdownItAnchor, {
      permalink(slug, options, state, index) {
        const title = markdownItAnchor.defaults.getTokensText(state.tokens[index + 1].children);
        markdownItAnchor.permalink.linkInsideHeader({
          placement: "after",
          symbol: icon("link"),
          renderAttrs: () => ({ "aria-label": `Link to ${title}` }),
        })(slug, options, state, index);
      },
    })
    .use(await createCodeBlocksPlugin());
  eleventyConfig.setLibrary("md", markdown);

  eleventyConfig.addCollection("docs", (collectionApi) =>
    collectionApi.getFilteredByTag("docs"),
  );

  eleventyConfig.addFilter("flattenNav", function flattenNav(nodes) {
    return nodes.flatMap((node) => [
      node,
      ...flattenNav(node.children || []),
    ]);
  });

  eleventyConfig.addFilter("neighbor", (nodes, currentUrl, offset) => {
    const index = nodes.findIndex((node) => node.url === currentUrl);
    return index < 0 ? null : nodes[index + offset] || null;
  });

  eleventyConfig.addFilter("docHeadings", (html) => {
    const groups = [];
    for (const match of String(html).matchAll(/<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/g)) {
      const id = match[2].match(/\bid="([^"]+)"/);
      if (!id) continue;
      const title = markdown.utils.unescapeAll(
        match[3].replace(/<a\b[^>]*class="header-anchor"[^>]*>[\s\S]*?<\/a>/g, "")
          .replace(/<[^>]+>/g, "").trim(),
      );
      const heading = { id: id[1], title, level: Number(match[1]), children: [] };
      if (heading.level === 3 && groups.at(-1)?.level === 2) groups.at(-1).children.push(heading);
      else groups.push(heading);
    }
    return groups;
  });

  eleventyConfig.addPassthroughCopy({ "src/assets/app.js": "assets/app.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/code-blocks.js": "assets/code-blocks.js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/social-preview.png": "assets/social-preview.png" });
  eleventyConfig.addPassthroughCopy({ "node_modules/@hugeicons/core-free-icons/LICENSE.md": "assets/licenses/hugeicons-MIT.txt" });
  eleventyConfig.addPassthroughCopy({ "node_modules/@fontsource-variable/inter/files/inter-latin-standard-normal.woff2": "assets/fonts/inter-latin-variable.woff2" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addWatchTarget("src/assets/");

  return {
    dir: { input: "src/pages", includes: "../_includes", data: "../_data", output: "out" },
    templateFormats: ["md", "njk", "11ty.js"],
    // Documentation examples must preserve {{ expressions }} and {% tags %} literally.
    // Nunjucks layouts still render the resulting HTML.
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
