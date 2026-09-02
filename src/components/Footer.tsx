import { Mail } from "lucide-react";
import { trackLinkClick } from "@/lib/analytics";

interface FooterProps {
  email: string;
  privacyLink: string;
}

export function Footer({ email, privacyLink }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-muted/30 py-8">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 text-center text-sm text-muted-foreground">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span>© {currentYear} Transvias</span>
            <span className="hidden sm:inline">•</span>
            <a
              href={privacyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => trackLinkClick('footer', 'Política de Privacidade', privacyLink)}
            >
              Política de Privacidade
            </a>
            <span className="hidden sm:inline">•</span>
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={() => trackLinkClick('footer', 'E-mail', email)}
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              {email}
            </a>
          </div>
          
          <p className="max-w-md text-xs">
            Portal oficial de links do Transvias - Conectando o transporte de cargas brasileiro desde 1951
          </p>
        </div>
      </div>
    </footer>
  );
}
