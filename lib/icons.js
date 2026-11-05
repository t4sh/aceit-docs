import ArrowDown01Icon from "@hugeicons/core-free-icons/ArrowDown01Icon";
import ArrowLeft02Icon from "@hugeicons/core-free-icons/ArrowLeft02Icon";
import ArrowRight01Icon from "@hugeicons/core-free-icons/ArrowRight01Icon";
import ArrowRight02Icon from "@hugeicons/core-free-icons/ArrowRight02Icon";
import ArrowUpRight01Icon from "@hugeicons/core-free-icons/ArrowUpRight01Icon";
import Cancel01Icon from "@hugeicons/core-free-icons/Cancel01Icon";
import BookOpen01Icon from "@hugeicons/core-free-icons/BookOpen01Icon";
import CommandIcon from "@hugeicons/core-free-icons/CommandIcon";
import ComputerIcon from "@hugeicons/core-free-icons/ComputerIcon";
import Copy01Icon from "@hugeicons/core-free-icons/Copy01Icon";
import LeftToRightListBulletIcon from "@hugeicons/core-free-icons/LeftToRightListBulletIcon";
import Link01Icon from "@hugeicons/core-free-icons/Link01Icon";
import Menu01Icon from "@hugeicons/core-free-icons/Menu01Icon";
import Moon02Icon from "@hugeicons/core-free-icons/Moon02Icon";
import PaintBoardIcon from "@hugeicons/core-free-icons/PaintBoardIcon";
import Search01Icon from "@hugeicons/core-free-icons/Search01Icon";
import SourceCodeIcon from "@hugeicons/core-free-icons/SourceCodeIcon";
import Sun01Icon from "@hugeicons/core-free-icons/Sun01Icon";
import Tick02Icon from "@hugeicons/core-free-icons/Tick02Icon";

const icons = {
  "chevron-down": ArrowDown01Icon,
  "arrow-left": ArrowLeft02Icon,
  "arrow-right": ArrowRight02Icon,
  "chevron-right": ArrowRight01Icon,
  "external-link": ArrowUpRight01Icon,
  close: Cancel01Icon,
  book: BookOpen01Icon,
  command: CommandIcon,
  code: SourceCodeIcon,
  system: ComputerIcon,
  copy: Copy01Icon,
  contents: LeftToRightListBulletIcon,
  link: Link01Icon,
  menu: Menu01Icon,
  moon: Moon02Icon,
  appearance: PaintBoardIcon,
  search: Search01Icon,
  sun: Sun01Icon,
  check: Tick02Icon,
};

function escapeAttribute(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

// Emit only the selected SVG at build time; no icon library is sent to the browser.
// Decorative icons inherit their accessible name from the surrounding control.
export function icon(name, className = "") {
  if (!Object.hasOwn(icons, name)) throw new Error(`Unknown icon: ${name}`);
  const shapes = icons[name].map(([tag, attributes]) => {
    const attrs = Object.entries(attributes).filter(([key]) => key !== "key")
      .map(([key, value]) => `${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}="${escapeAttribute(value)}"`)
      .join(" ");
    return `<${tag} ${attrs}></${tag}>`;
  }).join("");
  return `<svg class="hugeicon${className ? ` ${escapeAttribute(className)}` : ""}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">${shapes}</svg>`;
}

// CSS masks let native disclosure and search controls use the same icon source.
export function iconDataUrl(name) {
  return `url("data:image/svg+xml,${encodeURIComponent(icon(name))}")`;
}
