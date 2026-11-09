export default function () {
  const vercelHost = process.env.VERCEL_ENV === "production"
    ? process.env.VERCEL_PROJECT_PRODUCTION_URL
    : "";
  const publicUrl = process.env.SITE_BASE_URL?.trim() || (vercelHost ? `https://${vercelHost}` : "");
  if (!publicUrl) return { baseUrl: "" };

  const url = new URL(publicUrl);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
    throw new Error("SITE_BASE_URL must be a public HTTP(S) URL without credentials, a query, or a fragment.");
  }

  const baseUrl = url.origin + url.pathname.replace(/\/+$/, "");
  return {
    baseUrl,
    githubUrl: baseUrl === "https://aceit-docs.vercel.app" ? "https://github.com/t4sh/aceit-docs" : "",
  };
}
