# Transvias — Portal de Links

Microsite "link-in-bio" oficial da Transvias para centralizar acesso a rotas, cotações, notícias e conteúdo sobre transporte de cargas.

## 🚀 Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build e dev server)
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** (animações)
- **Lucide React** (ícones)
- **WordPress REST API** (feed de notícias com fallback RSS)

## 📋 Funcionalidades

- ✅ Header fixo com logo e CTA principal
- ✅ 6 botões de links principais com ícones e descrições
- ✅ UTM tracking automático em todos os links externos
- ✅ Seção "Últimas do Blog" (WordPress REST API + fallback RSS)
- ✅ Cache de 30 minutos nos posts do blog
- ✅ Seção "Sobre o Transvias"
- ✅ Links para redes sociais
- ✅ Footer completo com copyright e políticas
- ✅ Dark mode automático
- ✅ SEO otimizado (meta tags, Open Graph, Schema.org)
- ✅ Totalmente responsivo e acessível (WCAG 2.1)
- ✅ Google Analytics 4 e Meta Pixel integrados
- ✅ Animações suaves e loading states

## 🎨 Design System

O projeto usa um design system completo definido em `src/index.css` e `tailwind.config.ts`:

- **Paleta de cores**: Neutros + azul corporativo (`#0066CC`)
- **Sombras**: `shadow-soft`, `shadow-medium`, `shadow-hover`
- **Animações**: `fade-in`, `slide-up`
- **Bordas**: `rounded-xl` (12px)
- **Tipografia**: Sistema (Inter/Segoe UI/Roboto)

## ⚙️ Configuração

### 1. Variáveis de ambiente (opcional)

Crie um arquivo `.env` na raiz do projeto:

```env
# Google Analytics 4 (opcional)
VITE_GA_ID=G-XXXXXXXXXX

# Meta Pixel (opcional)
VITE_META_PIXEL_ID=123456789
```

### 2. Arquivo de configuração (`public/config.json`)

Edite o arquivo `public/config.json` para personalizar:

```json
{
  "logoUrl": "https://www.transvias.com.br/wp-content/uploads/2023/01/logo-transvias.svg",
  "tagline": "Encontre rotas, cotações e notícias do transporte de cargas",
  "primaryColor": "#0066CC",
  "featuredLinks": [
    {
      "label": "Consultar Rotas",
      "href": "https://www.transvias.com.br/rotas",
      "icon": "Route",
      "description": "Encontre transportadoras por rota"
    }
    // ... mais links
  ],
  "blogRestUrl": "https://noticias.transvias.com.br/wp-json/wp/v2/posts?_embed&per_page=6",
  "blogRssUrl": "https://noticias.transvias.com.br/feed/",
  "social": {
    "linkedin": "https://www.linkedin.com/company/transvias",
    "instagram": "https://www.instagram.com/transvias",
    "youtube": "https://www.youtube.com/@transvias"
  },
  "about": {
    "text": "Desde 1951, o Transvias conecta embarcadores e transportadoras...",
    "link": "https://www.transvias.com.br/sobre"
  },
  "footer": {
    "email": "redessociais@transvias.com.br",
    "privacyLink": "https://www.transvias.com.br/politica-de-privacidade"
  }
}
```

### 3. Ícones disponíveis (Lucide React)

Os ícones são importados de `lucide-react`. Exemplos:
- `Route`, `Calculator`, `BookOpen`, `Newspaper`
- `Megaphone`, `MessageSquare`, `Mail`, `ExternalLink`
- [Ver todos os ícones](https://lucide.dev/icons/)

## 🛠️ Instalação e Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## 📊 UTM Tracking

Todos os links externos recebem automaticamente os seguintes parâmetros UTM:
- `utm_source=linktree-transvias`
- `utm_medium=microsite`
- `utm_campaign=perfil`

Para customizar, edite o arquivo `src/lib/utm.ts`.

## 📰 Integração com WordPress

### REST API (preferencial)

Endpoint: `https://noticias.transvias.com.br/wp-json/wp/v2/posts?_embed&per_page=6`

**Campos extraídos:**
- `title.rendered` → Título
- `link` → URL do post
- `date` → Data de publicação
- `excerpt.rendered` → Resumo (truncado ~180 caracteres)
- `_embedded['wp:featuredmedia'][0].source_url` → Imagem destacada
- `_embedded['wp:term'][0][].name` → Categorias

### RSS Feed (fallback)

Endpoint: `https://noticias.transvias.com.br/feed/`

Usado automaticamente se a REST API falhar.

### Cache

Os posts são cacheados por **30 minutos** para evitar chamadas excessivas à API.

## 🔍 SEO

O microsite implementa:

- ✅ Meta tags completas (title, description, author)
- ✅ Open Graph (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Schema.org JSON-LD (Organization)
- ✅ Canonical URL
- ✅ Robots.txt otimizado
- ✅ Sitemap (adicionar manualmente se necessário)
- ✅ Semântica HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`)
- ✅ Alt text em todas as imagens
- ✅ ARIA labels para acessibilidade

## 📈 Analytics

### Google Analytics 4

1. Adicione o ID no `.env`: `VITE_GA_ID=G-XXXXXXXXXX`
2. Inclua o script no `index.html`:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Meta Pixel

1. Adicione o ID no `.env`: `VITE_META_PIXEL_ID=123456789`
2. Inclua o script no `index.html`:

```html
<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '123456789');
  fbq('track', 'PageView');
</script>
```

### Eventos rastreados

- **Clique em link principal**: `event_category: 'link'`
- **Clique em post do blog**: `event_category: 'blog_post'`

## 🚀 Deploy

### Vercel (recomendado)

1. Conecte o repositório Git no [Vercel](https://vercel.com)
2. Configure as variáveis de ambiente (se necessário)
3. Deploy automático a cada push

### Netlify

1. Conecte o repositório no [Netlify](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `dist`

### Outras plataformas

O build gera arquivos estáticos em `dist/` que podem ser servidos por qualquer servidor web.

## 🎯 Performance

- ✅ Lazy loading de imagens
- ✅ Cache de API (30 min)
- ✅ Componentes otimizados
- ✅ CSS utilitário (Tailwind)
- ✅ Tree-shaking automático (Vite)
- ✅ Prefers-reduced-motion respeitado

**Meta:** Lighthouse 95+ em todas as categorias.

## ♿ Acessibilidade

- ✅ Foco visível em todos os elementos interativos
- ✅ ARIA labels e roles
- ✅ Semântica HTML correta
- ✅ Contraste de cores adequado (WCAG AA)
- ✅ Texto alternativo em imagens
- ✅ Navegação por teclado

## 📝 Licença

© 2025 Transvias. Todos os direitos reservados.

---

**Dúvidas ou suporte?**  
📧 redessociais@transvias.com.br
