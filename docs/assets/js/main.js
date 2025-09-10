import { domReady } from "./utils/domReady.js";
import { injectFragments } from "./utils/injectFragments.js";
import { initTouchMenus } from "./ui/touchMenus.js";
import { highlightCurrentNavLink } from "./ui/navActive.js";

(async () => {
  await domReady();
  try {
    await injectFragments([
      { selector: "#header", url: "/header.html" },
      { selector: "#footer", url: "/footer.html" },
    ]);
  } finally {
    const root = document.documentElement;
    root.classList.remove("hf-wait");
    root.classList.add("hf-ready");
    initTouchMenus();
    highlightCurrentNavLink();
  }
})();
