async function fetchHTML(url) {
  const res = await fetch(url, {
    headers: { Accept: "text/html" },
    cache: "no-cache",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

export async function injectFragments({
  header,
  footer,
  revealClass, // { remove?: string, add?: string }
}) {
  const parts = [
    ["header", header],
    ["footer", footer],
  ].filter(([, cfg]) => !!cfg);

  // Fetch in parallel; continue even if one fails
  const results = await Promise.allSettled(
    parts.map(([, cfg]) => fetchHTML(cfg.url)),
  );

  results.forEach((result, i) => {
    const [, cfg] = parts[i];
    const el = cfg?.selector ? document.querySelector(cfg.selector) : null;
    if (!el) return;

    if (result.status === "fulfilled") {
      el.innerHTML = result.value;
    } else {
      console.warn("[fragments] failed:", cfg.url, result.reason);
    }
  });

  if (revealClass?.remove) {
    document.documentElement.classList.remove(revealClass.remove);
  }
  if (revealClass?.add) {
    document.documentElement.classList.add(revealClass.add);
  }
}
