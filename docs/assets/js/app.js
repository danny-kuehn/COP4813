import { injectFragments } from "./fragments/injectFragments.js";
import { initTouchMenus } from "./ui/touchMenus.js";
import { domReady } from "./utils/domReady.js";

(async () => {
  await domReady();

  try {
    // Kick off both requests in parallel (preload will help if present)
    await injectFragments({
      header: { selector: "#header", url: "/header.html" },
      footer: { selector: "#footer", url: "/footer.html" },
      revealClass: { remove: "hf-wait", add: "hf-ready" },
    });

    // Progressive enhancement after fragments exist
    initTouchMenus();
  } catch (err) {
    console.error("[fragments] load failed:", err);
    // Still reveal the page even if fragments fail
    document.documentElement.classList.remove("hf-wait");
  }
})();
