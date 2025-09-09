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
  const [headerHTML, footerHTML] = await Promise.all([
    header ? fetchHTML(header.url) : Promise.resolve(""),
    footer ? fetchHTML(footer.url) : Promise.resolve(""),
  ]);

  if (header?.selector) {
    const el = document.querySelector(header.selector);
    if (el) el.innerHTML = headerHTML;
  }
  if (footer?.selector) {
    const el = document.querySelector(footer.selector);
    if (el) el.innerHTML = footerHTML;
  }

  // Reveal after injection
  if (revealClass?.remove)
    document.documentElement.classList.remove(revealClass.remove);
  if (revealClass?.add) document.documentElement.classList.add(revealClass.add);
}
