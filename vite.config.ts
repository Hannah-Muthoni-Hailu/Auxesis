import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import { site } from './src/config/site.ts'

const publicPages = ['/', '/produce', '/traceability', '/about', '/contact', '/quote']

// Fills in the website address (VITE_SITE_URL) where search engines and social previews need it,
// and writes robots.txt and sitemap.xml into the build.
function seoPlugin(siteUrl: string): Plugin {
  const jsonLd = siteUrl
    ? `<script type="application/ld+json">${JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: `${site.name} ${site.tagline}`,
        url: `${siteUrl}/`,
        image: `${siteUrl}/og-image.png`,
        telephone: site.phone,
        email: site.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.stall,
          addressLocality: 'Nairobi',
          addressCountry: 'KE',
        },
        openingHours: 'Mo-Sa 04:00-18:00',
      }).replaceAll('<', '\\u003c')}</script>`
    : ''

  return {
    name: 'auxesis-seo',
    transformIndexHtml: (html) =>
      html.replaceAll('__SITE_URL__', siteUrl).replace('<!--JSON_LD-->', jsonLd),
    generateBundle() {
      const robots = [
        'User-agent: *',
        'Disallow: /auth',
        'Disallow: /portal',
        ...(siteUrl ? [`Sitemap: ${siteUrl}/sitemap.xml`] : []),
      ]
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots.join('\n') + '\n' })

      if (siteUrl) {
        const urls = publicPages.map((p) => `  <url><loc>${siteUrl}${p === '/' ? '/' : p}</loc></url>`)
        const xml =
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls.join('\n') +
          '\n</urlset>\n'
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml })
      }
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')
  const siteUrl = (env.VITE_SITE_URL ?? '').trim().replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss(), seoPlugin(siteUrl)],
    resolve: { alias: { '@': path.resolve(import.meta.dirname, 'src') } },
    test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], css: false },
  }
})
