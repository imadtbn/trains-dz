// Shared SNTF data source. dz_portal is canonical; local JSON is a resilient fallback.
const ROOTS = Object.freeze([
  new URL("https://imadtbn.github.io/dz_portal/assets/data/sntf/"),
  new URL("../../data/sntf/", import.meta.url)
]);

export async function readSntfData(name, key) {
  const failures = [];
  for (const root of ROOTS) {
    try {
      const response = await fetch(new URL(encodeURIComponent(name) + ".json", root), {
        cache: "no-cache"
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const data = await response.json();
      if (!Array.isArray(data[key])) throw new Error("Invalid data shape for " + name);
      return data;
    } catch (error) {
      failures.push(String(error?.message || error));
    }
  }
  throw new Error("تعذر تحميل بيانات SNTF المشتركة (" + name + "): " + failures.join("؛ "));
}
