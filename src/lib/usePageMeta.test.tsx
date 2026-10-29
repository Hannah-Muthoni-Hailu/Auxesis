import { render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { defaultDescription, defaultTitle } from '@/config/seo'
import { usePageMeta } from './usePageMeta'

function Page(props: Parameters<typeof usePageMeta>[0]) {
  usePageMeta(props)
  return null
}

const meta = (name: string) =>
  document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)?.content ?? null

describe('usePageMeta', () => {
  afterEach(() => {
    document.head.querySelectorAll('meta').forEach((m) => m.remove())
  })

  it('sets the tab title and description for a page', () => {
    render(<Page title="Our produce" description="All our crops." />)
    expect(document.title).toBe('Our produce | Auxesis Fresh Produce')
    expect(meta('description')).toBe('All our crops.')
    expect(meta('robots')).toBeNull()
  })

  it('falls back to the home page text', () => {
    render(<Page />)
    expect(document.title).toBe(defaultTitle)
    expect(meta('description')).toBe(defaultDescription)
  })

  it('asks search engines to skip private pages, and stops when the page closes', () => {
    const { unmount } = render(<Page title="Sign in" noindex />)
    expect(meta('robots')).toBe('noindex, nofollow')
    unmount()
    expect(meta('robots')).toBeNull()
  })
})
