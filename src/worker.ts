import { BLOG_POSTS } from './data/blogPosts';

const botRegex = /googlebot|bingbot|yandex|baiduspider|twitterbot|facebookexternalhit|linkedinbot|embedly|pinterest|slackbot|vkShare|Facebot|outbrain|W3C_Validator|whatsapp|discordbot|telegrambot/i;

export interface Env {
  ASSETS: { fetch: typeof fetch };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const userAgent = request.headers.get('User-Agent') || '';
    
    // If not a bot, let Cloudflare Pages serve the static assets normally
    if (!botRegex.test(userAgent)) {
      return env.ASSETS.fetch(request);
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Fetch the index.html fallback
    const indexResponse = await env.ASSETS.fetch(new Request(url.origin, request));
    if (!indexResponse.ok) {
      return indexResponse;
    }
    const html = await indexResponse.text();

    let metaTitle = 'Atrix Explorer | Mobile Web Browser for Manhwa & Novel Readers';
    let metaDescription = 'A mobile web browser built for reading manhwa and novels. Automatically tracks your progress, blocks ads, and saves your library on your device.';
    let metaImage = `${url.origin}/hero-preview.webp`;

    let schemaInject = '';

    if (path === '/features') {
      metaTitle = 'Features | Atrix Explorer Browser';
      metaDescription = 'Explore all features built for reading comfort: auto-save progress, popup blocking, auto-scroll, customizable library, and optional cloud backups.';
    } else if (path === '/blog') {
      metaTitle = 'The Catalog | Curated Manhwa & Manhua Recommendations';
      metaDescription = 'Discover the best Manhwa and Manhua recommendations. Expertly curated lists of badass OP MCs, cultivation, and non-cliché storylines.';
    } else if (path === '/download') {
      metaTitle = 'Download Atrix Explorer | Releases & Version History';
      metaDescription = 'Download the latest version of Atrix Explorer. Get the current Android APK (v1.2.0), view full release notes, changelogs, and download history.';
    } else if (path === '/privacy') {
      metaTitle = 'Privacy Policy | Atrix Explorer';
      metaDescription = "Atrix Explorer's privacy policy. Local-first by design — your library data stays on your device. Cloud sync is optional and fully opt-in.";
    } else if (path === '/terms') {
      metaTitle = 'Terms of Service | Atrix Explorer';
      metaDescription = 'Atrix Explorer terms of service. No copyrighted content is hosted. Your data belongs to you. Read our usage terms and user responsibilities.';
    } else if (path === '/freedom') {
      metaTitle = 'Freedom Policy | Atrix Explorer';
      metaDescription = "Atrix Explorer's Freedom Policy — track any media, export your data anytime, no vendor lock-in. Your library, your rules.";
    } else if (path.startsWith('/blog/')) {
      const postId = path.split('/blog/')[1];
      const post = BLOG_POSTS.find(p => p.id === postId);
      if (post) {
        metaTitle = `${post.title} | Atrix Explorer Archive`;
        metaDescription = post.excerpt;
        metaImage = post.image;
        
        // Generate AI-friendly Schema Markup
        const articleSchema = {
          "@context": "https://schema.org",
          "@type": "NewsArticle",
          "headline": post.title,
          "image": [post.image],
          "author": [{
            "@type": "Organization",
            "name": post.author
          }],
          "description": post.excerpt
        };
        schemaInject = `\n    <script type="application/ld+json">${JSON.stringify(articleSchema)}</script>\n  `;
      }
    }

    const modifiedHtml = html
      .replace(/<title>.*?<\/title>/i, `<title>${metaTitle}</title>`)
      .replace(/<meta name="description" content=".*?"\s*\/>/i, `<meta name="description" content="${metaDescription}" />`)
      .replace(/<meta property="og:title" content=".*?"\s*\/>/i, `<meta property="og:title" content="${metaTitle}" />`)
      .replace(/<meta property="og:description" content=".*?"\s*\/>/i, `<meta property="og:description" content="${metaDescription}" />`)
      .replace(/<meta property="og:image" content=".*?"\s*\/>/i, `<meta property="og:image" content="${metaImage}" />`)
      .replace(/<meta name="twitter:title" content=".*?"\s*\/>/i, `<meta name="twitter:title" content="${metaTitle}" />`)
      .replace(/<meta name="twitter:description" content=".*?"\s*\/>/i, `<meta name="twitter:description" content="${metaDescription}" />`)
      .replace(/<meta name="twitter:image" content=".*?"\s*\/>/i, `<meta name="twitter:image" content="${metaImage}" />`)
      .replace(/<meta property="og:url" content=".*?"\s*\/>/i, `<meta property="og:url" content="${url.href}" />`)
      .replace(/<\/head>/i, `${schemaInject}</head>`);

    return new Response(modifiedHtml, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' },
    });
  }
};
