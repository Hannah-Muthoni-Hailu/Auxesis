import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithProviders } from '@/test/render'
import WorkWithUs from './WorkWithUs'

vi.mock('@/lib/supabase', () => ({ isSupabaseConfigured: true, supabase: {} }))

describe('Work with us', () => {
  it('sends buyers to the quote form and shows the farmer form inline', () => {
    renderWithProviders(<WorkWithUs />)
    expect(screen.getByRole('link', { name: /Request a quote/ })).toHaveAttribute('href', '/quote')
    expect(screen.getByRole('button', { name: 'Register my farm' })).toBeInTheDocument()
  })
})
