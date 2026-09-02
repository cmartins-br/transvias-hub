import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackLinkClick } from "@/lib/analytics";
import { CSSProperties } from "react";

interface PostCardProps {
  title: string;
  link: string;
  date: string;
  excerpt: string;
  image?: string;
  categories: string[];
  className?: string;
  style?: CSSProperties;
}

export function PostCard({
  title,
  link,
  date,
  excerpt,
  image,
  categories,
  className,
  style,
}: PostCardProps) {
  const handleClick = () => {
    trackLinkClick('blog_post', title, link);
  };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      style={style}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      {image && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      
      <div className="flex flex-1 flex-col p-5">
        {categories.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {categories.slice(0, 2).map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
        )}

        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-card-foreground transition-colors group-hover:text-primary">
          {title}
        </h3>

        <p className="mb-3 line-clamp-3 flex-1 text-sm text-muted-foreground">
          {excerpt}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
          <time dateTime={date}>{date}</time>
        </div>
      </div>
    </a>
  );
}
