import type { APIContext } from 'astro';

export function GET(context: APIContext) {
  const sitemapURL = new URL('sitemap-index.xml', context.site);
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapURL.href}\n`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
