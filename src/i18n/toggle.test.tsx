import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '@/App'
import { formatDate } from '@/lib/batches'
import { renderWithProviders } from '@/test/render'
import { LangProvider } from './index'

describe('language switch', () => {
  beforeEach(() => localStorage.clear())

  it('starts in English, switches to Swahili, remembers it and sets <html lang>', async () => {
    const user = userEvent.setup()
    const { unmount } = renderWithProviders(<LangProvider><App /></LangProvider>, '/work-with-us')
    expect(await screen.findByRole('heading', { name: 'Buyers and farmers, one market link' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('en')

    await user.click(screen.getByRole('button', { name: 'Kiswahili' }))
    expect(await screen.findByRole('heading', { name: 'Wanunuzi na wakulima, kiungo kimoja cha soko' })).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('sw')
    expect(localStorage.getItem('auxesis-lang')).toBe('sw')
    unmount()

    renderWithProviders(<LangProvider><App /></LangProvider>, '/work-with-us')
    expect(await screen.findByRole('heading', { name: 'Wanunuzi na wakulima, kiungo kimoja cha soko' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'English' }))
    expect(await screen.findByRole('heading', { name: 'Buyers and farmers, one market link' })).toBeInTheDocument()
  })

  it('formats dates with Swahili month names', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LangProvider initial="sw"><App /></LangProvider>, '/')
    await user.click(await screen.findByRole('button', { name: 'English' }))
    expect(formatDate('2026-08-01')).toMatch(/Aug/)
    await user.click(screen.getByRole('button', { name: 'Kiswahili' }))
    expect(formatDate('2026-08-01')).toMatch(/1 Ago 2026/)
  })
})
