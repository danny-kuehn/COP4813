export function domReady() {
  if (document.readyState === "loading") {
    return new Promise((resolve) =>
      document.addEventListener("DOMContentLoaded", resolve, { once: true }),
    );
  }
  return Promise.resolve();
}
