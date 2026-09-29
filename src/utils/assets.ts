/**
 * Resolve a public/ asset against the deploy base path so the site
 * works both at the domain root and under a project sub-path
 * (e.g. GitHub Pages: /2nd3d-website/).
 */
export const asset = (path: string): string =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
