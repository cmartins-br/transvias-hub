import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Fetching metadata for:', url)

    // Fetch the URL content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkBot/1.0)',
      },
    })

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
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
