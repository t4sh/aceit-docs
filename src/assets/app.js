const root = document.documentElement;
// Derived from this script so the site works from any folder.
const assetsUrl = new URL("./", document.currentScript.src);
const siteUrl = new URL("../", assetsUrl);
const themeButton = document.querySelector("[data-theme-toggle]");
const appearancePicker = document.querySelector("[data-appearance-picker]");
const presetSelect = document.querySelector("[data-preset-select]");
const paletteSelect = document.querySelector("[data-palette-select]");
const menuButton = document.querySelector("[data-menu-toggle]");
const menuCloseButtons = document.querySelectorAll("[data-menu-close]");
const dialog = document.querySelector("[data-search-dialog]");
const searchInput = document.querySelector("[data-search-input]");
const searchResults = document.querySelector("[data-search-results]");
const sidebar = document.querySelector("#sidebar");
const mainContent = document.querySelector("#main");
const mobileLayout = matchMedia("(max-width: 50rem)");
let searchPages;
let themePreference;
const nextTheme = { system: "light", light: "dark", dark: "system" };
try { themePreference = localStorage.getItem("theme-preference") || "system"; }
catch (error) { themePreference = "system"; }
if (!["light", "dark", "system"].includes(themePreference)) themePreference = "system";

function applyTheme() {
  if (themePreference === "system") delete root.dataset.theme;
  else root.dataset.theme = themePreference;
  const next = nextTheme[themePreference];
  const label = `Color theme: ${themePreference}. Switch to ${next} mode`;
  themeButton.setAttribute("aria-label", label);
  themeButton.title = label;
  themeButton.querySelector("[data-theme-label]").textContent = themePreference[0].toUpperCase() + themePreference.slice(1);
}

applyTheme();
function applyAppearance() {
  const preset = [...presetSelect.options].some((option) => option.value === root.dataset.themeVariant)
    ? root.dataset.themeVariant : presetSelect.options[0].value;
  const palette = [...paletteSelect.options].some((option) => option.value === root.dataset.palette)
    ? root.dataset.palette : paletteSelect.options[0].value;
  root.dataset.themeVariant = preset;
  root.dataset.palette = palette;
  presetSelect.value = preset;
  paletteSelect.value = palette;
  paletteSelect.disabled = ["aceit-warm", "docs-press", "docs-linen"].includes(preset);
  document.querySelector("[data-palette-help]").textContent = paletteSelect.disabled
    ? "This preset keeps its original palette." : "Palette changes apply to this preset.";
}
applyAppearance();
presetSelect.addEventListener("change", () => {
  root.dataset.themeVariant = presetSelect.value;
  try { localStorage.setItem("docs-preset", presetSelect.value); } catch (error) { /* Storage can be disabled. */ }
  applyAppearance();
});
paletteSelect.addEventListener("change", () => {
  root.dataset.palette = paletteSelect.value;
  try { localStorage.setItem("docs-palette", paletteSelect.value); } catch (error) { /* Storage can be disabled. */ }
  applyAppearance();
});
document.addEventListener("click", (event) => {
  if (appearancePicker.open && !appearancePicker.contains(event.target)) appearancePicker.open = false;
});
appearancePicker.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && appearancePicker.open) { event.preventDefault(); appearancePicker.open = false; appearancePicker.querySelector("summary").focus(); }
});
themeButton.addEventListener("click", () => {
  themePreference = nextTheme[themePreference];
  try { localStorage.setItem("theme-preference", themePreference); } catch (error) { /* Storage can be disabled. */ }
  applyTheme();
});

function closeMenu() {
  document.body.classList.remove("menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  sidebar.inert = mobileLayout.matches;
  sidebar.removeAttribute("role");
  sidebar.removeAttribute("aria-modal");
  mainContent.inert = false;
}

menuButton.addEventListener("click", () => {
  appearancePicker.open = false;
  const open = document.body.classList.toggle("menu-open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  sidebar.inert = !open;
  mainContent.inert = open;
  if (open) {
    sidebar.setAttribute("role", "dialog");
    sidebar.setAttribute("aria-modal", "true");
    sidebar.querySelector("[aria-current='page']")?.focus();
  }
  else menuButton.focus();
});
menuCloseButtons.forEach((button) => button.addEventListener("click", () => { closeMenu(); menuButton.focus(); }));
document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) return;
  if (event.key === "Escape" && document.body.classList.contains("menu-open")) { closeMenu(); menuButton.focus(); }
  if (event.key === "Tab" && document.body.classList.contains("menu-open")) {
    const controls = [...sidebar.querySelectorAll('a[href], button:not(:disabled), summary, select:not(:disabled)')]
      .filter((element) => element.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
mobileLayout.addEventListener("change", () => closeMenu());
closeMenu();

const docsNavigation = sidebar.querySelector("nav[aria-label='Documentation']");
if (docsNavigation) {
  const hoverSurface = document.createElement("span");
  hoverSurface.className = "nav-hover-surface";
  hoverSurface.setAttribute("aria-hidden", "true");
  docsNavigation.prepend(hoverSurface);
  docsNavigation.classList.add("has-magnetic-hover");
  let hoveredLink;

  function moveHoverSurface(link) {
    const navBox = docsNavigation.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    if (hoverSurface.classList.contains("is-visible")) hoverSurface.style.removeProperty("transition");
    else hoverSurface.style.transition = "opacity var(--motion-fast) ease-out";
    hoverSurface.style.width = `${linkBox.width}px`;
    hoverSurface.style.height = `${linkBox.height}px`;
    hoverSurface.style.transform = `translate3d(${linkBox.left - navBox.left}px, ${linkBox.top - navBox.top}px, 0)`;
    hoverSurface.classList.add("is-visible");
  }

  docsNavigation.addEventListener("pointerover", (event) => {
    if (event.pointerType === "touch") return;
    const link = event.target.closest(".nav-link");
    if (!link) { hoveredLink = null; hoverSurface.classList.remove("is-visible"); return; }
    if (link === hoveredLink) return;
    hoveredLink = link;
    moveHoverSurface(link);
  });
  docsNavigation.addEventListener("pointerleave", () => {
    hoveredLink = null;
    const focusedLink = docsNavigation.querySelector(".nav-link:focus-visible");
    if (focusedLink) moveHoverSurface(focusedLink);
    else hoverSurface.classList.remove("is-visible");
  });
  docsNavigation.addEventListener("focusin", (event) => {
    if (event.target.matches(".nav-link")) moveHoverSurface(event.target);
  });
  docsNavigation.addEventListener("focusout", (event) => {
    if (!docsNavigation.contains(event.relatedTarget)) {
      if (hoveredLink) moveHoverSurface(hoveredLink);
      else hoverSurface.classList.remove("is-visible");
    }
  });
  window.addEventListener("resize", () => {
    const link = docsNavigation.querySelector(".nav-link:focus-visible") || hoveredLink;
    if (link) moveHoverSurface(link);
  });
}

const toc = document.querySelector("#toc-list");
const headings = [...document.querySelectorAll("#article h2[id], #article h3[id]")];
const links = [...toc.querySelectorAll("a[href^='#']")];

if (headings.length && headings.length === links.length) {
  const svgNS = "http://www.w3.org/2000/svg";
  const rail = document.createElement("div");
  const trackSvg = document.createElementNS(svgNS, "svg");
  const activeSvg = document.createElementNS(svgNS, "svg");
  const track = document.createElementNS(svgNS, "path");
  const active = document.createElementNS(svgNS, "path");
  const dot = document.createElement("span");
  rail.classList.add("toc-rail");
  rail.setAttribute("aria-hidden", "true");
  activeSvg.classList.add("toc-rail-highlight");
  track.classList.add("toc-rail-track");
  active.classList.add("toc-rail-active");
  dot.classList.add("toc-rail-dot");
  trackSvg.append(track);
  activeSvg.append(active);
  rail.append(trackSvg, activeSvg, dot);
  toc.prepend(rail);

  let positions = [];
  let activeStart = 0;
  let activeEnd = 0;
  let movingDown = true;
  let currentRange;
  let pendingTarget;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const clip = (top, bottom) => `polygon(0 ${top}px, 100% ${top}px, 100% ${bottom}px, 0 ${bottom}px)`;

  function updateIndicator(animate = false) {
    const first = positions[activeStart];
    const last = positions[activeEnd];
    if (!first || !last) return;
    const nextRange = { top: first.top + 3, bottom: last.bottom - 3 };
    const fromClip = getComputedStyle(activeSvg).clipPath;
    const fromDot = getComputedStyle(dot).transform;
    const leadingEdge = movingDown ? nextRange.bottom : nextRange.top;
    const dotX = (movingDown ? last : first).nested ? 12 : 0;
    const targetDot = `translate(${dotX}px, ${leadingEdge - 2}px)`;
    activeSvg.getAnimations().forEach((animation) => animation.cancel());
    dot.getAnimations().forEach((animation) => animation.cancel());
    activeSvg.style.clipPath = clip(nextRange.top, nextRange.bottom);
    dot.style.transform = targetDot;
    if (animate && currentRange && !reducedMotion.matches) {
      const stretchTop = Math.min(currentRange.top, nextRange.top);
      const stretchBottom = Math.max(currentRange.bottom, nextRange.bottom);
      const timing = { duration: 380, easing: "cubic-bezier(.22, 1, .36, 1)" };
      activeSvg.animate([
        { clipPath: fromClip },
        { clipPath: clip(stretchTop, stretchBottom), offset: .55 },
        { clipPath: clip(nextRange.top, nextRange.bottom) },
      ], timing);
      dot.animate([
        { transform: fromDot },
        { transform: `translate(${dotX}px, ${(movingDown ? stretchBottom : stretchTop) - 2}px)`, offset: .55 },
        { transform: targetDot },
      ], timing);
    }
    currentRange = nextRange;
  }

  function drawRail() {
    if (!toc.getClientRects().length) { positions = []; return; }
    const tocTop = toc.getBoundingClientRect().top;
    positions = links.map((link) => {
      const box = link.getBoundingClientRect();
      return { top: box.top - tocTop, bottom: box.bottom - tocTop, nested: link.classList.contains("toc-sub") };
    });
    const height = toc.scrollHeight;
    rail.style.height = `${height}px`;
    for (const svg of [trackSvg, activeSvg]) svg.setAttribute("viewBox", `0 0 20 ${height}`);
    let path = "M 2 0";
    for (let index = 0; index < positions.length;) {
      if (!positions[index].nested) { index += 1; continue; }
      const first = positions[index];
      let last = first;
      while (index < positions.length && positions[index].nested) {
        last = positions[index];
        index += 1;
      }
      const enter = Math.max(0, first.top - 8);
      const exit = Math.min(height, last.bottom + 8);
      path += ` L 2 ${enter} Q 2 ${first.top} 14 ${first.top} L 14 ${last.bottom} Q 14 ${exit} 2 ${exit}`;
    }
    path += ` L 2 ${height}`;
    track.setAttribute("d", path);
    active.setAttribute("d", path);
    updateIndicator();
  }

  function setActiveRange(start, end) {
    if (start === activeStart && end === activeEnd && links[start].classList.contains("is-visible")) return;
    movingDown = start + end >= activeStart + activeEnd;
    activeStart = start;
    activeEnd = end;
    for (const [linkIndex, link] of links.entries()) {
      const current = linkIndex === start;
      link.classList.toggle("is-visible", linkIndex >= start && linkIndex <= end);
      if (current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
    updateIndicator(toc.classList.contains("is-ready"));
  }

  function syncActive() {
    const topBoundary = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
    if (pendingTarget) {
      const arrived = pendingTarget.getBoundingClientRect().top <= Math.min(window.innerHeight * .3, 220);
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (!arrived && !atEnd) return;
      pendingTarget = null;
    }
    let start = -1;
    let end = -1;
    let preceding = 0;
    for (const [headingIndex, heading] of headings.entries()) {
      const box = heading.getBoundingClientRect();
      if (box.top <= topBoundary) preceding = headingIndex;
      if (box.bottom <= topBoundary || box.top >= window.innerHeight - 8) continue;
      if (start < 0) start = headingIndex;
      end = headingIndex;
    }
    if (start < 0) start = end = preceding;
    setActiveRange(start, end);
  }

  let scrollFrame;
  window.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null;
      syncActive();
    });
  }, { passive: true });
  window.addEventListener("resize", () => { drawRail(); syncActive(); });
  for (const [index, link] of links.entries()) {
    link.addEventListener("click", () => {
      pendingTarget = headings[index];
      setActiveRange(index, index);
    });
  }
  window.addEventListener("wheel", () => { pendingTarget = null; }, { passive: true });
  window.addEventListener("touchstart", () => { pendingTarget = null; }, { passive: true });
  window.addEventListener("keydown", (event) => {
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) pendingTarget = null;
  });
  if ("ResizeObserver" in window) new ResizeObserver(drawRail).observe(toc);
  drawRail();
  syncActive();
  requestAnimationFrame(() => toc.classList.add("is-ready"));
}

// Disk has no server to resolve a folder to its index.html, so links must name it.
function pageHref(url) {
  if (url.protocol === "file:" && url.pathname.endsWith("/")) url.pathname += "index.html";
  return url.href;
}

if (location.protocol === "file:") {
  for (const link of document.querySelectorAll("a[href]")) link.href = pageHref(new URL(link.href));
}

function showMessage(message) {
  searchResults.replaceChildren();
  const paragraph = document.createElement("p");
  paragraph.textContent = message;
  searchResults.append(paragraph);
}

async function loadSearch() {
  if (searchPages) return searchPages;
  await new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = new URL("search-index.js", assetsUrl);
    script.onload = resolve;
    script.onerror = () => { script.remove(); reject(new Error("Search index unavailable")); };
    document.head.append(script);
  });
  searchPages = window.docsSearchIndex;
  return searchPages;
}

function renderResults(pages, query) {
  const words = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!words.length) { showMessage("Start typing to find a page."); return; }
  const ranked = pages.map((page) => {
    const title = page.title.toLocaleLowerCase();
    const description = page.description.toLocaleLowerCase();
    const text = page.text.toLocaleLowerCase();
    const score = words.reduce((sum, word) => sum + (title.includes(word) ? 8 : 0) + (description.includes(word) ? 3 : 0) + (text.includes(word) ? 1 : 0), 0);
    return { page, score };
  }).filter((item) => item.score && words.every((word) => `${item.page.title} ${item.page.description} ${item.page.text}`.toLocaleLowerCase().includes(word))).sort((a, b) => b.score - a.score).slice(0, 8);

  if (!ranked.length) { showMessage("No matching pages. Try a different term."); return; }
  searchResults.replaceChildren();
  for (const { page } of ranked) {
    const link = document.createElement("a");
    const title = document.createElement("strong");
    const description = document.createElement("span");
    link.className = "search-result";
    link.href = pageHref(new URL(page.url.slice(1), siteUrl));
    title.textContent = page.title;
    description.textContent = page.description;
    link.append(title, description);
    searchResults.append(link);
  }
}

async function openSearch() {
  if (document.body.classList.contains("menu-open")) { closeMenu(); menuButton.focus(); }
  dialog.showModal();
  searchInput.focus();
  if (!searchPages) showMessage("Loading search…");
  try {
    const pages = await loadSearch();
    renderResults(pages, searchInput.value);
  } catch (error) {
    showMessage("Search is unavailable. Try reloading the page.");
  }
}

document.querySelector("[data-search-open]").addEventListener("click", openSearch);
document.querySelector("[data-search-close]").addEventListener("click", () => dialog.close());
document.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    if (!dialog.open) openSearch();
  }
  if (event.key === "/" && !dialog.open && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName) && !document.activeElement.isContentEditable) {
    event.preventDefault();
    openSearch();
  }
});
searchInput.addEventListener("input", () => {
  if (searchPages) renderResults(searchPages, searchInput.value);
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
