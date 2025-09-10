export function highlightCurrentNavLink() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const normalize = (p) =>
    p
      .replace(/\/index\.html?$/i, "/") // collapse index.html
      .replace(/\/+$/, "") || "/"; // trim trailing slash, ensure root

  const pagePath = normalize(location.pathname);

  nav.querySelectorAll("a[href]").forEach((link) => {
    const linkPath = normalize(new URL(link.href, location.origin).pathname);

    if (
      linkPath === pagePath ||
      (linkPath !== "/" && pagePath.startsWith(linkPath + "/"))
    ) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
      link.closest(".has-submenu")?.classList.add("active");
    }
  });
}
