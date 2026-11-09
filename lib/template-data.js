// JSON embedded in script text must not terminate the enclosing HTML element.
export function jsonScript(value) {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (character) =>
    `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
}

export function githubEditUrl(inputPath, repository, branch) {
  if (!inputPath || typeof repository !== "string" || typeof branch !== "string") return "";

  const repo = repository.trim();
  const ref = branch.trim();
  if (!/^[a-z\d-]+\/[\w.-]+$/i.test(repo) || !ref) return "";

  const sourcePath = inputPath.replace(/^\.\//, "");
  const editPath = `${ref}/${sourcePath}`.split("/").map(encodeURIComponent).join("/");
  return `https://github.com/${repo}/edit/${editPath}`;
}
