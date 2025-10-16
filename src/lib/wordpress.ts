export interface BlogPost {
  title: string;
  link: string;
  date: string;
  excerpt: string;
  image?: string;
  categories: string[];
}

// Simple cache to avoid excessive API calls
const cache = new Map<string, { data: BlogPost[]; timestamp: number }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// Check if current time is within allowed hours (10:00 - 19:00)
function isWithinAllowedHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 10 && hour < 19;
}

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

async function parseRssFeed(rssUrl: string): Promise<BlogPost[]> {
  try {
    const response = await fetch(rssUrl);
    const text = await response.text();
    
    // Parse XML using DOMParser (browser native)
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('XML parsing error');
    }
    
    // Get all items
    const items = xmlDoc.querySelectorAll('item');
    const posts: BlogPost[] = [];
    
    items.forEach((item, index) => {
      if (index >= 6) return; // Limit to 6 posts
      
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      
      // Extract categories
      const categoryNodes = item.querySelectorAll('category');
      const categories: string[] = [];
      categoryNodes.forEach((cat) => {
        const catText = cat.textContent;
        if (catText) categories.push(catText);
      });
      
      posts.push({
        title: stripHtml(title),
        link,
        date: pubDate ? formatDate(pubDate) : '',
        excerpt: truncateText(stripHtml(description), 180),
        image: undefined,
        categories,
      });
    });
    
    return posts;
  } catch (error) {
    console.error('RSS parsing failed:', error);
    return [];
  }
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

  // If outside allowed hours, return cached data or empty array
  if (!isWithinAllowedHours()) {
    console.log('Outside allowed hours (10:00-19:00), using cached data');
    return cached?.data || [];
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

    // Fallback to RSS using native browser DOMParser
    const posts = await parseRssFeed(rssUrl);
    
    if (posts.length > 0) {
      // Update cache
      cache.set(restUrl, { data: posts, timestamp: Date.now() });
    }

    return posts;
  }
}
