import { useEffect } from 'react'
import { defaultDescription, pageTitle } from '@/config/seo'

interface PageMeta {
  /** Short page name, for example "Our produce". Leave out on the home page. */
  title?: string
  description?: string
  /** Ask search engines to leave this page out (sign-in and portal pages). */
  noindex?: boolean
}

function metaTag(attr: 'name' | 'property', key: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  return el
}

// Sets the browser tab title and the search-result description for the current page.
export function usePageMeta({ title, description = defaultDescription, noindex = false }: PageMeta) {
  useEffect(() => {
    const full = pageTitle(title)
    document.title = full
    metaTag('name', 'description').content = description
    metaTag('property', 'og:title').content = full
    metaTag('property', 'og:description').content = description

    let robots: HTMLMetaElement | null = null
    if (noindex) {
      robots = metaTag('name', 'robots')
      robots.content = 'noindex, nofollow'
    }
    return () => robots?.remove()
  }, [title, description, noindex])
}
