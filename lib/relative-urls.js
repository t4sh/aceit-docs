import path from "node:path";

/**
 * Rewrites a site-root URL as a path relative to the page that links to it, so
 * the built site works from any folder. Other URLs are returned unchanged.
 */
export function relativeUrl(pageUrl, url) {
  if (!url.startsWith("/") || url.startsWith("//")) return url;

  const [, target, suffix] = url.match(/^([^?#]*)(.*)$/s);
  const pageFolder = pageUrl.endsWith("/") ? pageUrl : path.posix.dirname(pageUrl);
  const relative = path.posix.relative(pageFolder, target);
  if (!relative) return `./${suffix}`;
  return `${relative}${target.endsWith("/") ? "/" : ""}${suffix}`;
}
