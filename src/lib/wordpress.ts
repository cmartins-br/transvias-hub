import Parser from 'rss-parser';

export interface BlogPost {
  title: string;
  link: string;
  date: string;
  excerpt: string;
  image?: string;
  categories: string[];
}

const parser = new Parser();

// Simple cache to avoid excessive API calls
const cache = new Map<string, { data: BlogPost[]; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}

function truncateText(text: string, maxLength: number = 200): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export async function fetchBlogPosts(
  restUrl: string,
  rssUrl: string
): Promise<BlogPost[]> {
  // Check cache first
  const cached = cache.get(restUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Try REST API first (preferred)
  try {
    const response = await fetch(restUrl);

    if (!response.ok) throw new Error('REST API failed');

    const data = await response.json();

    const posts = data.map((post: any) => ({
      title: stripHtml(post.title.rendered),
      link: post.link,
      date: formatDate(post.date),
      excerpt: truncateText(stripHtml(post.excerpt.rendered), 180),
      image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      categories:
        post._embedded?.['wp:term']?.[0]?.map((term: any) => term.name) || [],
    }));

    // Update cache
    cache.set(restUrl, { data: posts, timestamp: Date.now() });

    return posts;
  } catch (restError) {
    console.warn('REST API failed, falling back to RSS:', restError);

    // Fallback to RSS
    try {
      const feed = await parser.parseURL(rssUrl);

      const posts =
        feed.items.slice(0, 6).map((item) => ({
          title: item.title || '',
          link: item.link || '',
          date: item.pubDate ? formatDate(item.pubDate) : '',
          excerpt: truncateText(
            stripHtml(item.contentSnippet || item.content || ''),
            180
          ),
          image: undefined,
          categories: item.categories || [],
        })) || [];

      // Update cache
      cache.set(restUrl, { data: posts, timestamp: Date.now() });

      return posts;
    } catch (rssError) {
      console.error('Both REST and RSS failed:', rssError);
      return [];
    }
  }
}
