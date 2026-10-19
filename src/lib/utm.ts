/**
 * UTM on links from the hub to Transvias sites.
 * The hub passes along the UTM the visitor arrived with (each bio link carries
 * ?utm_source=<rede>&utm_medium=social&utm_campaign=bio), so the article or page
 * credits the same network. utm_content says which button or article was clicked.
 * Links outside the Transvias sites (WhatsApp, social profiles) get no UTM.
 */
const DEFAULT_UTM = { utm_source: 'hub', utm_medium: 'link-na-bio', utm_campaign: 'hub' };

function getVisitorUtm(): Record<string, string> {
  const utm = { ...DEFAULT_UTM };
  if (typeof window === 'undefined') return utm;
  const params = new URLSearchParams(window.location.search);
  for (const key of Object.keys(utm) as (keyof typeof DEFAULT_UTM)[]) {
    const value = params.get(key);
    if (value && /^[\w-]{1,60}$/.test(value)) utm[key] = value.toLowerCase();
  }
  return utm;
}

function isTransviasSite(hostname: string): boolean {
  return hostname === 'transvias.com.br' || hostname.endsWith('.transvias.com.br');
}

export function addUtmParams(url: string, content?: string): string {
  try {
    const urlObj = new URL(url);
    if (!isTransviasSite(urlObj.hostname)) return url;
    for (const [key, value] of Object.entries(getVisitorUtm())) {
      urlObj.searchParams.set(key, value);
    }
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
