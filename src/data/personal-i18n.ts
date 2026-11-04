/** Japanese remains the default; English pages reuse the same page components. */
export type Locale = 'ja' | 'en';

export const translator = (locale: Locale) => (ja: string, en: string): string => locale === 'en' ? en : ja;

/** Keep internal navigation in the visitor's selected language. */
export function localizedPath(path: string, locale: Locale): string {
  // Do not rewrite external destinations, anchors, or mail links.
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  const suffixAt = path.search(/[?#]/);
  const suffix = suffixAt < 0 ? '' : path.slice(suffixAt);
  let pathname = suffixAt < 0 ? path : path.slice(0, suffixAt);
  pathname = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  if (!pathname.endsWith('/') && !/\.[^/]+$/.test(pathname)) pathname += '/';

  if (/^\/hatha-yoga(?:\/|$)/.test(pathname)) {
    const rest = pathname.replace(/^\/hatha-yoga\/?(?:(?:ja|en)(?:\/|$))?/, '');
    return `/hatha-yoga/${locale}/${rest}${suffix}`;
  }
  for (const section of ['satorin', 'shop']) {
    if (pathname.startsWith(`/${section}/`)) {
      const rest = pathname.slice(section.length + 2).replace(/^en(?:\/|$)/, '');
      return `/${section}/${locale === 'en' ? 'en/' : ''}${rest}${suffix}`;
    }
  }
  return `${locale === 'en' ? '/en' : ''}${pathname}${suffix}`;
}

/** The language switch always goes to the corresponding page. */
export function alternatePaths(pathname: string): { ja: string; en: string } {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  const ja = path.replace(/^\/en(?=\/)/, '') || '/';
  return { ja, en: `/en${ja}` };
}
