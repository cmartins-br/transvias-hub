import { ArrowRight, Calendar } from "lucide-react";
import { BlogPost } from "@/lib/wordpress";
import { trackLinkClick } from "@/lib/analytics";
import { addUtmParams, slugFromUrl } from "@/lib/utm";

interface LatestPostProps {
  post: BlogPost;
}

// Newest article on top: people arriving from a social post's "link na bio" want that article first
export function LatestPost({ post }: LatestPostProps) {
  const href = addUtmParams(post.link, undefined, undefined, 'artigo-do-dia', slugFromUrl(post.link));

  return (
    <section className="mb-10 animate-fade-in" aria-labelledby="latest-heading">
      <h2 id="latest-heading" className="mb-4 text-center text-xl font-bold">
        Leia o artigo de hoje
      </h2>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackLinkClick('latest_post', post.title, post.link)}
        className="group flex flex-col overflow-hidden rounded-xl border-2 border-primary/40 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex-row"
      >
        {post.image && (
          <div className="aspect-video w-full overflow-hidden bg-muted sm:w-1/2">
            <img
              src={post.image}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-center gap-3 p-5 sm:p-6">
          <h3 className="text-xl font-bold leading-snug text-card-foreground transition-colors group-hover:text-primary sm:text-2xl">
            {post.title}
          </h3>
          <p className="line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
              Ler agora
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </div>
      </a>
    </section>
  );
}
