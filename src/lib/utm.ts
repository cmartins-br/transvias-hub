/**
 * Add UTM parameters to external links.
 * utm_source is the network the visitor came from (the hub URL in each bio carries
 * ?utm_source=instagram, ?utm_source=tiktok...), or "hub" when it has none.
 * Default: ?utm_source=<origem|hub>&utm_medium=link-na-bio&utm_campaign=perfil
 */
export function getVisitorSource(): string {
  if (typeof window === 'undefined') return 'hub';
  const source = new URLSearchParams(window.location.search).get('utm_source');
  return source && /^[\w-]{1,40}$/.test(source) ? source.toLowerCase() : 'hub';
}

export function addUtmParams(
  url: string,
  source = getVisitorSource(),
  medium = 'link-na-bio',
  campaign = 'perfil',
  content?: string
): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('utm_source', source);
    urlObj.searchParams.set('utm_medium', medium);
    urlObj.searchParams.set('utm_campaign', campaign);
    if (content) urlObj.searchParams.set('utm_content', content);
    return urlObj.toString();
  } catch (error) {
    // If URL is invalid, return as is
    console.warn('Invalid URL for UTM params:', url);
    return url;
  }
}

/** Last path segment of an article URL, used as utm_content. */
export function slugFromUrl(url: string): string | undefined {
  try {
    return new URL(url).pathname.split('/').filter(Boolean).pop();
  } catch {
    return undefined;
  }
}
