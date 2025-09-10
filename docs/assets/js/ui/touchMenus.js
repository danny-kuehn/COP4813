export function initTouchMenus() {
  if (!matchMedia("(hover: none), (pointer: coarse)").matches) return;

  document.querySelectorAll(".has-submenu > a").forEach((link) => {
    const menu = link.nextElementSibling;
    if (!menu) return;

    link.addEventListener("click", (e) => {
      if (link.getAttribute("aria-expanded") !== "true") {
        e.preventDefault();
        menu.style.display = "flex";
        link.setAttribute("aria-expanded", "true");

        const close = (evt) => {
          if (!menu.contains(evt.target) && evt.target !== link) {
            menu.style.display = "";
            link.setAttribute("aria-expanded", "false");
            document.removeEventListener("click", close, true);
          }
        };
        document.addEventListener("click", close, true);
      }
      // second tap → normal navigation
    });
  });
}
