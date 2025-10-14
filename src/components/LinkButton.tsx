import * as Icons from "lucide-react";
import { addUtmParams } from "@/lib/utm";
import { cn } from "@/lib/utils";

interface LinkButtonProps {
  label: string;
  href: string;
  icon: string;
  description?: string;
  className?: string;
}

export function LinkButton({
  label,
  href,
  icon,
  description,
  className,
}: LinkButtonProps) {
  const IconComponent = (Icons as any)[icon] || Icons.Link;

  const handleClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'link',
        event_label: label,
        value: href,
      });
    }
  };

  return (
    <a
      href={addUtmParams(href)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border border-border bg-card p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
    >
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <IconComponent className="h-6 w-6" aria-hidden="true" />
      </div>
      
      <div className="flex-1 text-left">
        <h3 className="font-semibold text-card-foreground transition-colors group-hover:text-primary">
          {label}
        </h3>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      <Icons.ChevronRight
        className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
        aria-hidden="true"
      />
    </a>
  );
}
