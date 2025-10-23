import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for server-side
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  const { id } = req.query
  
  // Check if request is from a social media crawler
  const userAgent = req.headers['user-agent'] || ''
  const isCrawler = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegrambot|skypeuripreview/i.test(userAgent)
  
  try {
    // Get the news article from Supabase
    const { data: article, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .single()
    
    if (error || !article) {
      // If article not found, redirect to main site
      if (!isCrawler) {
        return res.redirect(302, '/')
      } else {
        return res.status(404).json({ error: 'Article not found' })
      }
    }

    // If it's a crawler, serve static HTML with meta tags
    if (isCrawler) {
      const html = generateStaticHTML(article)
      res.setHeader('Content-Type', 'text/html')
      return res.status(200).send(html)
    }
    
    // If it's a regular user, redirect to the React app
    res.redirect(302, `/#/news/${id}`)
    
  } catch (error) {
    console.error('Error fetching article:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

function generateStaticHTML(article) {
  // Create a truncated description (max 160 characters for SEO)
  const description = article.content 
    ? article.content.substring(0, 160).replace(/<[^>]*>/g, '') + '...'
    : 'Leggi le ultime notizie della Virtus Brindisi Basket'
  
  // Get image URL (use first image from content or fallback)
  const imageUrl = article.image_url || 'https://virtusbrindisi.it/assets/logo-b.png'
  
  return `<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Basic Meta Tags -->
  <title>${article.title} | Virtus Brindisi Basket</title>
  <meta name="description" content="${description}">
  
  <!-- Open Graph Meta Tags -->
  <meta property="og:title" content="${article.title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="https://virtusbrindisi.it/news/${article.id}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Virtus Brindisi Basket">
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${article.title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  
  <!-- WhatsApp Meta Tags -->
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/favicon.png">
  
  <!-- Auto-redirect to React app for human users -->
  <script>
    // Only redirect if this is not a crawler/bot
    if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
      window.location.replace('/#/news/${article.id}');
    }
  </script>
</head>
<body>
  <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
    <h1>${article.title}</h1>
    ${article.image_url ? `<img src="${article.image_url}" alt="${article.title}" style="max-width: 100%; height: auto;">` : ''}
    <p style="color: #666; font-size: 14px;">
      Pubblicato il ${new Date(article.created_at).toLocaleDateString('it-IT')}
    </p>
    <div>${article.content || ''}</div>
    
    <p style="margin-top: 40px; text-align: center;">
      <a href="/" style="color: #1e40af; text-decoration: none;">
        ← Torna al sito Virtus Brindisi Basket
      </a>
    </p>
  </div>
</body>
</html>`
}