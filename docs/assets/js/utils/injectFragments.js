export async function injectFragments(pairs) {
  await Promise.allSettled(
    pairs.map(async ({ selector, url }) => {
      const el = document.querySelector(selector);
      if (!el) return;
      try {
        const res = await fetch(url, {
          headers: { Accept: "text/html" },
          cache: "no-cache",
        });
        if (res.ok) el.innerHTML = await res.text();
      } catch (e) {
        console.warn("[fragments] failed:", url, e);
      }
    }),
  );
}
