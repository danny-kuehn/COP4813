// footer.js
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("footer");
  if (!el) return;
  fetch("/footer.html")
    .then((r) => r.text())
    .then((html) => {
      el.innerHTML = html;
      el.classList.remove("is-loading");
    })
    .catch((err) => console.error("footer load failed:", err));
});
