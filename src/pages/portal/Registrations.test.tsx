import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeDb, type FakeDb } from '@/test/fakeDb'
import { renderWithProviders } from '@/test/render'
import Registrations from './Registrations'

const holder = vi.hoisted(() => ({ db: null as unknown as FakeDb }))
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: { from: (table: string) => holder.db.from(table) },
}))

const row = (over: Record<string, unknown> = {}) => ({
  id: 'r1',
  name: 'Wanjiku Kamau',
  phone: '0712 345 678',
  county: 'Kirinyaga',
  crops: 'Cucumbers, chillies',
  volume: '500kg a week',
  message: 'Greenhouse ready in March',
  created_at: '2026-10-29T08:00:00Z',
  ...over,
})

describe('Farmer registrations (staff)', () => {
  beforeEach(() => {
    holder.db = createFakeDb({ farmer_registrations: [row()] })
  })

  it('lists registrations with call and WhatsApp links', async () => {
    renderWithProviders(<Registrations />)
    expect(await screen.findByText('Wanjiku Kamau')).toBeInTheDocument()
    expect(screen.getByText('Cucumbers, chillies')).toBeInTheDocument()
    expect(screen.getByText('Kirinyaga')).toBeInTheDocument()
    expect(screen.getByText('Greenhouse ready in March')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Call/ })).toHaveAttribute('href', 'tel:+254712345678')
    expect(screen.getByRole('link', { name: /WhatsApp/ }).getAttribute('href')).toContain('wa.me/254712345678')
  })

  it('shows a friendly message when there are none', async () => {
    holder.db = createFakeDb({ farmer_registrations: [] })
    renderWithProviders(<Registrations />)
    expect(await screen.findByText('No registrations yet.')).toBeInTheDocument()
  })

  it('deletes after confirmation only', async () => {
    const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true)
    const user = userEvent.setup()
    renderWithProviders(<Registrations />)
    await user.click(await screen.findByRole('button', { name: /Delete/ }))
    await waitFor(() => {
      const del = holder.db.calls.find((c) => c.op === 'delete')
      expect(del?.table).toBe('farmer_registrations')
      expect(del?.filters).toEqual({ id: 'r1' })
    })
    confirm.mockReturnValue(false)
    holder.db.calls.length = 0
    await user.click(await screen.findByRole('button', { name: /Delete/ }))
    expect(holder.db.calls.some((c) => c.op === 'delete')).toBe(false)
    confirm.mockRestore()
  })

  it('tells staff when the database refuses the delete', async () => {
    holder.db = createFakeDb({ farmer_registrations: [row()] }, { denyWrites: true })
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const user = userEvent.setup()
    renderWithProviders(<Registrations />)
    await user.click(await screen.findByRole('button', { name: /Delete/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/Only Auxesis staff/)
  })
})
