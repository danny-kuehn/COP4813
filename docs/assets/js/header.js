// header.js
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("header");
  if (!el) return;
  fetch("/header.html")
    .then((r) => r.text())
    .then((html) => {
      el.innerHTML = html;
      el.classList.remove("is-loading");
    })
    .catch((err) => console.error("header load failed:", err));
});

function highlightActiveLink() {
  const here = location.pathname.replace(/\/$/, ""); // strip trailing slash
  const links = document.querySelectorAll(".site-nav a[href]");

  links.forEach((a) => {
    let target = a.getAttribute("href").replace(/\/$/, "");
    if (here === target || (target !== "/" && here.startsWith(target))) {
      a.setAttribute("aria-current", "page");
      a.classList.add("active");
    }
  });
}
