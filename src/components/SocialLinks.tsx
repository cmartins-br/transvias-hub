import { Linkedin, Instagram, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackLinkClick } from "@/lib/analytics";

interface SocialLinksProps {
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
}

const socialIcons = {
  linkedin: { Icon: Linkedin, label: "LinkedIn" },
  instagram: { Icon: Instagram, label: "Instagram" },
  youtube: { Icon: Youtube, label: "YouTube" },
  twitter: { Icon: Twitter, label: "X (Twitter)" },
};

export function SocialLinks({
  linkedin,
  instagram,
  youtube,
  twitter,
}: SocialLinksProps) {
  const links = [
    { platform: "linkedin" as const, url: linkedin },
    { platform: "instagram" as const, url: instagram },
    { platform: "youtube" as const, url: youtube },
    { platform: "twitter" as const, url: twitter },
  ].filter((link) => link.url);

  if (links.length === 0) return null;

  return (
    <section className="w-full py-12" aria-labelledby="social-heading">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <h2 id="social-heading" className="mb-6 text-center text-2xl font-bold">
          Siga o Transvias
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4">
          {links.map(({ platform, url }) => {
            const { Icon, label } = socialIcons[platform];
            
            return (
              <Button
                key={platform}
                asChild
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Seguir no ${label}`}
                  onClick={() => trackLinkClick('social', label, url)}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{label}</span>
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
