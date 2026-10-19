import { PostCard } from "./PostCard";
import { PostCardSkeleton } from "./PostCardSkeleton";
import { BlogPost } from "@/lib/wordpress";
import { trackLinkClick } from "@/lib/analytics";
import { addUtmParams } from "@/lib/utm";
import { ExternalLink } from "lucide-react";

interface BlogSectionProps {
  posts: BlogPost[];
  loading: boolean;
}

export function BlogSection({ posts, loading }: BlogSectionProps) {

  return (
    <section className="w-full py-12" aria-labelledby="blog-heading">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 id="blog-heading" className="mb-2 text-3xl font-bold">
              Últimas do Blog
            </h2>
            <p className="text-muted-foreground">
              Fique por dentro das novidades do transporte de cargas
            </p>
          </div>
          
          <a
            href={addUtmParams('https://noticias.transvias.com.br', 'ver-todas')}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline sm:flex"
            onClick={() => trackLinkClick('blog_post', 'Ver todas', 'https://noticias.transvias.com.br')}
          >
            Ver todas
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </a>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-soft">
            <p className="text-muted-foreground">
              Não foi possível carregar as notícias no momento.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <PostCard
                key={post.link}
                {...post}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
