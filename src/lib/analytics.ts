export function trackLinkClick(category: string, label: string, value?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'click', {
      event_category: category,
      event_label: label,
      value,
    });
  }
}
