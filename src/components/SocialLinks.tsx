import { Linkedin, Instagram, Youtube, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackLinkClick } from "@/lib/analytics";

interface SocialLinksProps {
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  tiktok?: string;
  facebook?: string;
  bluesky?: string;
}

// lucide has no TikTok or Bluesky icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.6 2.6 0 0 1-2.6-2.6 2.6 2.6 0 0 1 3.36-2.49V9.66a5.69 5.69 0 0 0-.76-.05 5.68 5.68 0 0 0-5.68 5.69A5.68 5.68 0 0 0 9.86 21a5.68 5.68 0 0 0 5.68-5.69V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.3 4.3 0 0 1-3.24-1.48Z" />
    </svg>
  );
}

function BlueskyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M5.2 3.6c2.3 1.7 4.8 5.2 5.7 7.1.9-1.9 3.4-5.4 5.7-7.1 1.7-1.2 4.4-2.2 4.4.9 0 .6-.4 5.2-.6 5.9-.7 2.6-3.3 3.2-5.6 2.8 4 .7 5 3 2.8 5.2-4.2 4.3-6-1.1-6.5-2.5l-.2-.5-.2.5c-.5 1.4-2.3 6.8-6.5 2.5-2.2-2.2-1.2-4.5 2.8-5.2-2.3.4-4.9-.2-5.6-2.8-.2-.7-.6-5.3-.6-5.9 0-3.1 2.7-2.1 4.4-.9Z" />
    </svg>
  );
}

const socialIcons = {
  linkedin: { Icon: Linkedin, label: "LinkedIn" },
  instagram: { Icon: Instagram, label: "Instagram" },
  youtube: { Icon: Youtube, label: "YouTube" },
  twitter: { Icon: Twitter, label: "X (Twitter)" },
  tiktok: { Icon: TikTokIcon, label: "TikTok" },
  facebook: { Icon: Facebook, label: "Facebook" },
  bluesky: { Icon: BlueskyIcon, label: "Bluesky" },
};

export function SocialLinks({
  linkedin,
  instagram,
  youtube,
  twitter,
  tiktok,
  facebook,
  bluesky,
}: SocialLinksProps) {
  const links = [
    { platform: "linkedin" as const, url: linkedin },
    { platform: "instagram" as const, url: instagram },
    { platform: "youtube" as const, url: youtube },
    { platform: "twitter" as const, url: twitter },
    { platform: "tiktok" as const, url: tiktok },
    { platform: "facebook" as const, url: facebook },
    { platform: "bluesky" as const, url: bluesky },
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
