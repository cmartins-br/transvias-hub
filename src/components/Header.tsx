import { Button } from "@/components/ui/button";
import { addUtmParams } from "@/lib/utm";
import { trackLinkClick } from "@/lib/analytics";

interface HeaderProps {
  logoUrl: string;
  tagline: string;
}

export function Header({ logoUrl, tagline }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt="Transvias"
            className="h-8 w-auto"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
          <span className="hidden text-sm text-muted-foreground sm:inline-block sm:max-w-xs">
            {tagline}
          </span>
        </div>
        
        <Button asChild size="sm" className="font-medium">
          <a
            href={addUtmParams('https://www.transvias.com.br/rotas', 'topo-rotas')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackLinkClick('header', 'Consultar Rotas')}
          >
            Consultar Rotas
          </a>
        </Button>
      </div>
    </header>
  );
}
