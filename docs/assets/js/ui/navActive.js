export function highlightCurrentNavLink() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const normalize = (p) => {
    let n = p.replace(/\/+$/, "");
    return n === "" ? "/" : n;
  };

  const pagePath = normalize(window.location.pathname);
  const links = nav.querySelectorAll("a[href]");
  let best = null;

  links.forEach((link) => {
    const linkPath = normalize(
      new URL(link.getAttribute("href"), window.location.origin).pathname,
    );
    const exact =
      linkPath === pagePath ||
      (pagePath === "/" && (linkPath === "/" || linkPath === "/index.html"));
    const section =
      !exact &&
      linkPath !== "/" &&
      (pagePath === linkPath || pagePath.startsWith(linkPath + "/"));

    if (exact && !best) best = link;
    if (section && !best) best = link;
  });

  if (best) {
    best.classList.add("active");
    best.setAttribute("aria-current", "page");

    const parent = best.closest(".has-submenu");
    if (parent) parent.classList.add("active");
  }
}
