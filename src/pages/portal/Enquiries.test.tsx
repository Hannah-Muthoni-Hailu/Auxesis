import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeDb, type FakeDb } from '@/test/fakeDb'
import { renderWithProviders } from '@/test/render'
import Enquiries from './Enquiries'

const holder = vi.hoisted(() => ({ db: null as unknown as FakeDb }))
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: (table: string) => holder.db.from(table),
    rpc: (name: string, args: unknown) => holder.db.rpc(name, args),
  },
}))

const row = (over: Record<string, unknown> = {}) => ({
  id: 'e1',
  name: 'Jane Wanjiru',
  phone: '0712 345 678',
  email: null,
  crop: 'Broccoli',
  quantity: '500kg a week',
  delivery_point: 'Gikomba',
  message: 'Need weekly supply',
  created_at: '2026-10-29T08:00:00Z',
  ...over,
})

describe('Enquiries (staff)', () => {
  beforeEach(() => {
    holder.db = createFakeDb({ enquiries: [row()] })
  })

  it('lists enquiries with call and WhatsApp links', async () => {
    renderWithProviders(<Enquiries />)

    expect(await screen.findByText('Jane Wanjiru')).toBeInTheDocument()
    expect(screen.getByText('500kg a week')).toBeInTheDocument()
    expect(screen.getByText('Need weekly supply')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Call/ })).toHaveAttribute('href', 'tel:+254712345678')
    expect(screen.getByRole('link', { name: /WhatsApp/ }).getAttribute('href')).toContain(
      'wa.me/254712345678',
    )
  })

  it('shows a friendly message when there are none', async () => {
    holder.db = createFakeDb({ enquiries: [] })
    renderWithProviders(<Enquiries />)
    expect(await screen.findByText('No enquiries yet.')).toBeInTheDocument()
  })

  it('deletes an enquiry after confirmation', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const user = userEvent.setup()
    renderWithProviders(<Enquiries />)

    await user.click(await screen.findByRole('button', { name: /Delete/ }))

    await waitFor(() => {
      const del = holder.db.calls.find((c) => c.op === 'delete')
      expect(del?.table).toBe('enquiries')
      expect(del?.filters).toEqual({ id: 'e1' })
    })
    confirm.mockRestore()
  })

  it('does not delete when staff cancel', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const user = userEvent.setup()
    renderWithProviders(<Enquiries />)

    await user.click(await screen.findByRole('button', { name: /Delete/ }))
    expect(holder.db.calls.some((c) => c.op === 'delete')).toBe(false)
    confirm.mockRestore()
  })
})
