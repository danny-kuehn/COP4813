(async function () {
  try {
    // Kick off both requests in parallel (uses preload cache if available)
    const [hdrRes, ftrRes] = await Promise.all([
      fetch("/header.html"),
      fetch("/footer.html"),
    ]);
    const [hdr, ftr] = await Promise.all([hdrRes.text(), ftrRes.text()]);

    const headerEl = document.getElementById("header");
    const footerEl = document.getElementById("footer");

    if (headerEl) headerEl.innerHTML = hdr;
    if (footerEl) footerEl.innerHTML = ftr;

    initTouchMenus();
  } catch (err) {
    console.error("Fragment load failed:", err);
  } finally {
    // Reveal the page only after injection
    document.documentElement.classList.remove("hf-wait");
  }
})();

function initTouchMenus() {
  // Only enable the “first tap opens” behavior on touch-first devices
  const isTouchPrimary =
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(pointer: coarse)").matches;

  if (!isTouchPrimary) return; // desktop/laptop: do nothing (single-click navigates)

  // For each parent with a submenu
  document.querySelectorAll(".has-submenu > a").forEach((link) => {
    const submenu = link.nextElementSibling;
    if (!submenu) return;

    let opened = false;

    link.addEventListener(
      "click",
      (e) => {
        // First tap: open submenu, don’t navigate
        if (!opened) {
          e.preventDefault();
          submenu.style.display = "flex";
          link.setAttribute("aria-expanded", "true");
          opened = true;

          // Close when tapping outside
          const onDocClick = (evt) => {
            if (!submenu.contains(evt.target) && !link.contains(evt.target)) {
              submenu.style.display = "";
              link.setAttribute("aria-expanded", "false");
              opened = false;
              document.removeEventListener("click", onDocClick, true);
            }
          };
          document.addEventListener("click", onDocClick, true);
        }
        // Second tap: no preventDefault → browser follows the link
      },
      { passive: false },
    );
  });
}
