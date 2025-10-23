/**
 * Utility functions to update meta tags dynamically for social sharing
 */

export function updateMetaTags({ 
  title, 
  description, 
  image, 
  url,
  type = 'article' 
}) {
  // Update document title
  document.title = title ? `${title} | Virtus Brindisi Basket` : 'Virtus Brindisi Basket'
  
  // Update or create meta tags
  updateMetaTag('description', description)
  
  // Open Graph tags
  updateMetaTag('og:title', title || 'Virtus Brindisi Basket', 'property')
  updateMetaTag('og:description', description, 'property')
  updateMetaTag('og:image', image || 'https://virtusbrindisi.it/logo-b.png', 'property')
  updateMetaTag('og:url', url || window.location.href, 'property')
  updateMetaTag('og:type', type, 'property')
  
  // Twitter Card tags
  updateMetaTag('twitter:title', title || 'Virtus Brindisi Basket')
  updateMetaTag('twitter:description', description)
  updateMetaTag('twitter:image', image || 'https://virtusbrindisi.it/logo-b.png')
}

function updateMetaTag(name, content, attribute = 'name') {
  if (!content) return
  
  // Find existing meta tag
  let metaTag = document.querySelector(`meta[${attribute}="${name}"]`)
  
  if (metaTag) {
    // Update existing tag
    metaTag.setAttribute('content', content)
  } else {
    // Create new tag
    metaTag = document.createElement('meta')
    metaTag.setAttribute(attribute, name)
    metaTag.setAttribute('content', content)
    document.head.appendChild(metaTag)
  }
}

export function resetMetaTags() {
  updateMetaTags({
    title: '',
    description: 'Virtus Brindisi Basket - Notizie, risultati, calendario e tutto sulla squadra di basket di Brindisi',
    image: 'https://virtusbrindisi.it/logo-b.png',
    url: 'https://virtusbrindisi.it',
    type: 'website'
  })
}