import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { LinkButton } from "@/components/LinkButton";
import { BlogSection } from "@/components/BlogSection";
import { SocialLinks } from "@/components/SocialLinks";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { trackLinkClick } from "@/lib/analytics";
import { ExternalLink } from "lucide-react";

interface Config {
  logoUrl: string;
  tagline: string;
  highlightedLinks?: Array<{
    label: string;
    href: string;
    icon: string;
    description?: string;
  }>;
  featuredLinks: Array<{
    label: string;
    href: string;
    icon: string;
    description?: string;
  }>;
  blogRestUrl: string;
  blogRssUrl: string;
  social: {
    linkedin?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  about: {
    text: string;
    link: string;
  };
  footer: {
    email: string;
    privacyLink: string;
  };
}

const Index = () => {
  const [config, setConfig] = useState<Config | null>(null);
  const [highlightedLinks, setHighlightedLinks] = useState<any[]>([]);

  useEffect(() => {
    fetch('/config.json')
      .then((res) => res.json())
      .then((data) => setConfig(data))
      .catch((error) => console.error('Failed to load config:', error));

    // Load highlighted links from database
    loadHighlightedLinks();
  }, []);

  const loadHighlightedLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('highlighted_links')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
        .limit(4);

      if (error) throw error;
      setHighlightedLinks(data || []);
    } catch (error) {
      console.error('Failed to load highlighted links:', error);
    }
  };

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header logoUrl={config.logoUrl} tagline={config.tagline} />

      <main className="container mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Hero Section */}
        <section className="mb-12 text-center animate-fade-in">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Portal de Links Transvias
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Acesse rotas, cotações, guia e notícias do transporte de cargas.
            Conectando embarcadores e transportadoras desde 1951.
          </p>
        </section>

        {/* Highlighted Links (from database) */}
        {highlightedLinks.length > 0 && (
          <section className="mb-8 animate-slide-up" aria-labelledby="highlighted-heading">
            <h2 id="highlighted-heading" className="mb-4 text-xl font-bold text-center">
              Destaques
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {highlightedLinks.map((link) => (
                <LinkButton 
                  key={link.id} 
                  label={link.title}
                  href={link.url}
                  icon={link.icon}
                  description={link.subtitle}
                  className="border-primary/30 bg-primary/5"
                />
              ))}
            </div>
          </section>
        )}

        {/* Featured Links */}
        <section className="mb-16 animate-slide-up" aria-labelledby="links-heading">
          <h2 id="links-heading" className="sr-only">
            Links principais
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {config.featuredLinks.map((link) => (
              <LinkButton key={link.href} {...link} />
            ))}
          </div>
        </section>

        {/* About Section */}
        <section className="mb-12 rounded-xl border border-border bg-card/50 p-8 shadow-soft" aria-labelledby="about-heading">
          <h2 id="about-heading" className="mb-4 text-2xl font-bold">
            Sobre o Transvias
          </h2>
          <p className="mb-4 text-muted-foreground leading-relaxed">
            {config.about.text}
          </p>
          <a
            href={config.about.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => trackLinkClick('about', 'Saiba mais', config.about.link)}
          >
            Saiba mais
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </section>
      </main>

      {/* Blog Section */}
      <BlogSection
        restUrl={config.blogRestUrl}
        rssUrl={config.blogRssUrl}
      />

      {/* Social Links */}
      <SocialLinks {...config.social} />

      {/* Footer */}
      <Footer {...config.footer} />
    </div>
  );
};

export default Index;
