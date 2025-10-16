import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Block private IP ranges and cloud metadata endpoints
const BLOCKED_IPS = [
  /^10\./,                          // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.0.0/12
  /^192\.168\./,                     // 192.168.0.0/16
  /^127\./,                          // 127.0.0.0/8
  /^0\./,                            // 0.0.0.0/8
  /^169\.254\./,                     // 169.254.0.0/16 (AWS metadata)
  /^224\./,                          // Multicast
  /^240\./,                          // Reserved
  /^::1$/,                           // IPv6 localhost
  /^fe80:/,                          // IPv6 link-local
];

const BLOCKED_HOSTS = [
  'localhost',
  '[::]',
  '[::1]',
  'metadata.google.internal',  // GCP metadata
];

function validateUrl(urlString: string): { valid: boolean; error?: string } {
  let parsed: URL;
  try {
    parsed = new URL(urlString);
  } catch {
    return { valid: false, error: 'URL inválida' };
  }

  // Only allow HTTP/HTTPS
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return { valid: false, error: 'Apenas HTTP/HTTPS permitidos' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Block localhost variants
  if (BLOCKED_HOSTS.includes(hostname)) {
    return { valid: false, error: 'Localhost não permitido' };
  }

  // Block private IPs
  if (BLOCKED_IPS.some(pattern => pattern.test(hostname))) {
    return { valid: false, error: 'IPs privados não permitidos' };
  }

  // Block non-standard ports
  if (parsed.port && !['80', '443', ''].includes(parsed.port)) {
    return { valid: false, error: 'Apenas portas 80 e 443 permitidas' };
  }

  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL é obrigatória' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate URL to prevent SSRF attacks
    const validation = validateUrl(url);
    if (!validation.valid) {
      console.error('URL validation failed:', validation.error, 'for URL:', url);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Fetching metadata for:', url)

    // Fetch the URL content with timeout and size limits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);  // 10s timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkBot/1.0)',
      },
    })
    
    clearTimeout(timeoutId);

    // Check content length
    const contentLength = response.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 5 * 1024 * 1024) {
      throw new Error('Resposta muito grande (máx 5MB)');
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`)
    }

    const html = await response.text()
    
    // Extract Open Graph metadata
    const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i) ||
                      html.match(/<title>([^<]+)<\/title>/i)
    const descriptionMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i) ||
                            html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)
    const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)

    const metadata = {
      title: titleMatch ? titleMatch[1].trim() : '',
      description: descriptionMatch ? descriptionMatch[1].trim() : '',
      image: imageMatch ? imageMatch[1].trim() : '',
    }

    console.log('Extracted metadata:', metadata)

    return new Response(
      JSON.stringify(metadata),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching metadata:', error)
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: 'Timeout ao buscar URL (máx 10s)' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 408 }
        )
      }
      
      return new Response(
        JSON.stringify({ error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    return new Response(
      JSON.stringify({ error: 'Erro desconhecido' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
