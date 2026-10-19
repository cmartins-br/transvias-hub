# Portal de Links Transvias

Portal de links (link-in-bio) profissional para a Transvias com admin integrado, atualização automática do blog e sistema de links destacados.

## 🚀 Funcionalidades

- **Links Configuráveis**: Sistema de links principais gerenciado via `config.json`
- **Admin Completo**: Interface de administração para gerenciar links destacados temporários
- **Links Destacados**: Até 4 links que podem ser ativados/desativados no topo da página
- **Upload de Thumbnails**: Sistema de upload de imagens para os links
- **Busca Automática de Metadados**: Extrai título, descrição e imagem de qualquer URL
- **Blog Integrado**: Atualização automática do blog via WordPress REST API
- **SEO Otimizado**: Meta tags, Open Graph, Schema.org
- **Dark Mode**: Tema escuro automático
- **Responsivo**: Design mobile-first
- **UTM Tracking**: links para os sites Transvias repassam a UTM de origem do visitante (ex.: `?utm_source=instagram` na bio); links externos saem sem UTM
- **Analytics**: Suporte para GA4 e Meta Pixel

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Lovable Cloud (Supabase)
- **Autenticação**: Email/Senha com auto-confirm
- **Storage**: Bucket para thumbnails
- **Animations**: Framer Motion

## 📋 Configuração Inicial

### 1. Criar Primeira Conta Admin

Acesse `/auth` e crie sua primeira conta:
- Email: seu@email.com
- Senha: mínimo 6 caracteres

A primeira conta criada será o administrador.

### 2. Acessar o Admin

Após login, acesse `/admin` para gerenciar os links destacados.

## 🔧 Configuração de Links

### Links Principais (config.json)

Edite `public/config.json` para configurar:

```json
{
  "logoUrl": "https://www.transvias.com.br/wp-content/uploads/2023/01/logo-transvias.svg",
  "tagline": "Encontre rotas, cotações e notícias do transporte de cargas",
  "primaryColor": "#0066CC",
  "featuredLinks": [
    {
      "label": "Consultar Rotas",
      "href": "https://www.transvias.com.br/rotas",
      "icon": "Truck",
      "description": "Encontre transportadoras que atendem sua rota"
    }
  ],
  "blogRestUrl": "https://noticias.transvias.com.br/wp-json/wp/v2/posts?_embed&per_page=6",
  "blogRssUrl": "https://noticias.transvias.com.br/feed/",
  "social": {
    "linkedin": "https://www.linkedin.com/company/editora-transvias",
    "instagram": "https://www.instagram.com/transvias_br",
    "youtube": "https://www.youtube.com/@transvias",
    "twitter": "https://x.com/transvias"
  }
}
```

## 📱 Admin - Links Destacados

### Acessar Admin

1. Acesse `https://seu-site.com/admin`
2. Faça login com suas credenciais
3. Gerencie links destacados

### Criar Link Destacado

1. Clique em "Novo Link"
2. Cole a URL do destino
3. Clique no ícone de download para buscar metadados automaticamente
4. Edite título, subtítulo conforme necessário
5. Faça upload de thumbnail (opcional) ou use a imagem extraída
6. Escolha um ícone do Lucide (ex: Star, Sparkles, Gift)
7. Defina a ordem de exibição
8. Ative o link
9. Clique em "Criar"

### Gerenciar Links

- **Ativar/Desativar**: Clique no ícone de olho
- **Editar**: Clique no ícone de lápis
- **Excluir**: Clique no ícone de lixeira
- **Reordenar**: Altere o campo "Ordem de Exibição"

### Busca Automática de Metadados

O sistema extrai automaticamente:
- **Título**: Tag `<title>` ou Open Graph `og:title`
- **Descrição**: Meta description ou `og:description`
- **Imagem**: Open Graph `og:image`

### Upload de Thumbnails

- Formatos: JPG, PNG, WEBP, GIF
- Tamanho máximo: 5MB
- As imagens são armazenadas no bucket público `link-thumbnails`

## 🎨 Personalização

### Ícones Disponíveis

Todos os ícones do [Lucide](https://lucide.dev/icons/) podem ser usados:
- `Link`, `Star`, `Heart`, `Gift`, `Sparkles`
- `Truck`, `Package`, `Factory`, `Briefcase`
- `MessageSquare`, `Newspaper`, etc.

### Ordem dos Links

Os links destacados aparecem:
1. **Topo**: Links destacados ativos (do banco de dados)
2. **Meio**: Links principais (do config.json)
3. **Abaixo**: Blog, sobre, redes sociais

## 🔒 Segurança

- **Autenticação**: Email/senha obrigatório para admin
- **RLS Policies**: Políticas de segurança no banco de dados
- **Storage Seguro**: Upload apenas para usuários autenticados
- **Auto-confirm**: Emails confirmados automaticamente (desenvolvimento)

## 📊 Analytics

### Google Analytics 4

Adicione em `.env`:
```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Meta Pixel

Adicione em `.env`:
```env
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXX
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório
2. Configure as variáveis de ambiente
3. Deploy automático

O Lovable Cloud (backend) é provisionado automaticamente.

## 📝 Estrutura do Projeto

```
├── public/
│   ├── config.json          # Configuração de links principais
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   └── LinkForm.tsx # Formulário de links destacados
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── LinkButton.tsx
│   │   ├── BlogSection.tsx
│   │   └── SocialLinks.tsx
│   ├── pages/
│   │   ├── Index.tsx        # Página principal
│   │   ├── Auth.tsx         # Login/Cadastro
│   │   └── Admin.tsx        # Painel admin
│   ├── lib/
│   │   ├── wordpress.ts     # Integração WordPress
│   │   └── utm.ts           # UTM tracking
│   └── integrations/
│       └── supabase/        # Cliente Supabase (auto-gerado)
├── supabase/
│   └── functions/
│       └── fetch-url-metadata/ # Edge function para metadados
└── README.md
```

## 🔗 Links Úteis

- [Documentação Lovable](https://docs.lovable.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev/icons)
- [Tailwind CSS](https://tailwindcss.com)

## 📞 Suporte

Para dúvidas sobre o admin ou configuração, consulte a [documentação do Lovable Cloud](https://docs.lovable.dev/features/cloud).

---

Desenvolvido com ❤️ para Transvias
