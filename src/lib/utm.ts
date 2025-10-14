/**
 * Add UTM parameters to external links
 * Default: ?utm_source=linktree-transvias&utm_medium=microsite&utm_campaign=perfil
 */
export function addUtmParams(
  url: string,
  source = 'linktree-transvias',
  medium = 'microsite',
  campaign = 'perfil'
): string {
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.set('utm_source', source);
    urlObj.searchParams.set('utm_medium', medium);
    urlObj.searchParams.set('utm_campaign', campaign);
    return urlObj.toString();
  } catch (error) {
    // If URL is invalid, return as is
    console.warn('Invalid URL for UTM params:', url);
    return url;
  }
}
