export function initTouchMenus() {
  // Only enable the “first tap opens” behavior on touch-first devices
  const isTouchPrimary =
    matchMedia("(hover: none)").matches ||
    matchMedia("(pointer: coarse)").matches;

  if (!isTouchPrimary) return; // Desktop/laptop: default behavior

  document.querySelectorAll(".has-submenu > a").forEach((link) => {
    const submenu = link.nextElementSibling;
    if (!submenu) return;

    let opened = false;

    link.addEventListener(
      "click",
      (e) => {
        if (!opened) {
          e.preventDefault();
          submenu.style.display = "flex";
          link.setAttribute("aria-expanded", "true");
          opened = true;

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
        // Second tap: allow normal navigation
      },
      { passive: false },
    );
  });
}
