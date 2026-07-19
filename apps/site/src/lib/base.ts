// Prefixes a root-relative public asset path with Astro's configured base
// path, so links/images/video still resolve when deployed under a subpath
// (e.g. GitHub Pages project sites at <user>.github.io/<repo>/).
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return `${base}${path}`;
}
