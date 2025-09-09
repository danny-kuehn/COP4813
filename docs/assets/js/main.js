import { injectFragments } from "./fragments/injectFragments.js";
import { highlightCurrentNavLink } from "./ui/navActive.js";
import { initTouchMenus } from "./ui/touchMenus.js";
import { domReady } from "./utils/domReady.js";

(async () => {
  await domReady();

  try {
    await injectFragments({
      header: { selector: "#header", url: "/header.html" },
      footer: { selector: "#footer", url: "/footer.html" },
      revealClass: { remove: "hf-wait", add: "hf-ready" },
    });
  } catch (err) {
    console.error("[fragments] load failed:", err);
    // Ensure the page is revealed even if fragments fail
    document.documentElement.classList.remove("hf-wait");
    document.documentElement.classList.add("hf-ready");
  } finally {
    initTouchMenus();
    highlightCurrentNavLink();
  }
})();
