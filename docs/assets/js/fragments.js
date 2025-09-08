// /assets/js/fragments.js
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
  } catch (err) {
    console.error("Fragment load failed:", err);
  } finally {
    // Reveal the page only after injection
    document.documentElement.classList.remove("hf-wait");
  }
})();
