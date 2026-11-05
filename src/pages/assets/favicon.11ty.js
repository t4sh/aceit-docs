import { icon } from "../../../lib/icons.js";

export default class Favicon {
  data() {
    return { permalink: "/assets/favicon.svg", eleventyExcludeFromCollections: true };
  }

  render() {
    const book = icon("book").replace("<svg ", '<svg x="6" y="6" width="20" height="20" ');
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" color="#25201b"><rect x="1" y="1" width="30" height="30" rx="2" fill="#ed9d4a" stroke="currentColor" stroke-width="2"/>${book}</svg>`;
  }
}
