import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeDb, type FakeDb } from '@/test/fakeDb'
import { renderWithProviders } from '@/test/render'
import WorkWithUs from './WorkWithUs'

const holder = vi.hoisted(() => ({ db: null as unknown as FakeDb }))
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: { from: (table: string) => holder.db.from(table) },
}))

const inserts = () => holder.db.calls.filter((c) => c.op === 'insert')
const buttons = () => screen.getAllByRole('button', { name: 'Send' })

describe('Work with us', () => {
  beforeEach(() => {
    holder.db = createFakeDb({})
  })

  it('has the two cards from the client design', () => {
    renderWithProviders(<WorkWithUs />)
    expect(screen.getByRole('heading', { name: 'Buyers and farmers, one market link' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Request a supply quote' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Register your farm' })).toBeInTheDocument()
    for (const label of ['Business name', 'Crops & weekly volume', 'Your name', 'County & crop']) {
      expect(screen.getByPlaceholderText(label)).toBeInTheDocument()
    }
    expect(screen.getAllByPlaceholderText('Phone or WhatsApp')).toHaveLength(2)
  })

  it('saves a buyer request as a quote enquiry', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WorkWithUs />)
    await user.type(screen.getByPlaceholderText('Business name'), 'Mama Mboga Ltd')
    await user.type(screen.getByPlaceholderText('Crops & weekly volume'), 'Capsicum 500kg')
    await user.type(screen.getAllByPlaceholderText('Phone or WhatsApp')[0], '0712345678')
    await user.click(buttons()[0])

    expect(await screen.findByText("Thanks — we'll be in touch on WhatsApp.")).toBeInTheDocument()
    expect(inserts()).toHaveLength(1)
    expect(inserts()[0].table).toBe('enquiries')
    expect(inserts()[0].payload).toMatchObject({
      name: 'Mama Mboga Ltd',
      phone: '0712345678',
      message: 'Crops & weekly volume: Capsicum 500kg',
    })
  })

  it('saves a farmer registration, reading the county from before the comma', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WorkWithUs />)
    await user.type(screen.getByPlaceholderText('Your name'), 'Wanjiku Kamau')
    await user.type(screen.getByPlaceholderText('County & crop'), 'Kirinyaga, cucumbers')
    await user.type(screen.getAllByPlaceholderText('Phone or WhatsApp')[1], '0712345678')
    await user.click(buttons()[1])

    expect(await screen.findByText("Thanks — we'll be in touch on WhatsApp.")).toBeInTheDocument()
    expect(inserts()[0].table).toBe('farmer_registrations')
    expect(inserts()[0].payload).toMatchObject({
      name: 'Wanjiku Kamau',
      phone: '0712345678',
      county: 'Kirinyaga',
      crops: 'Kirinyaga, cucumbers',
    })
  })

  it('rejects a bad phone number and saves nothing', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WorkWithUs />)
    await user.type(screen.getByPlaceholderText('Your name'), 'Wanjiku')
    await user.type(screen.getByPlaceholderText('County & crop'), 'Nyeri, chillies')
    await user.type(screen.getAllByPlaceholderText('Phone or WhatsApp')[1], '123')
    await user.click(buttons()[1])
    expect(await screen.findByText(/Enter a valid phone number/)).toBeInTheDocument()
    expect(inserts()).toHaveLength(0)
  })

  it('says so when the request cannot be saved', async () => {
    holder.db = createFakeDb({}, { insertError: 'Failed to fetch' })
    const user = userEvent.setup()
    renderWithProviders(<WorkWithUs />)
    await user.type(screen.getByPlaceholderText('Business name'), 'Mama Mboga')
    await user.type(screen.getByPlaceholderText('Crops & weekly volume'), 'Capsicum')
    await user.type(screen.getAllByPlaceholderText('Phone or WhatsApp')[0], '0712345678')
    await user.click(buttons()[0])
    expect(await screen.findByText(/could not send that/i)).toBeInTheDocument()
    expect(screen.queryByText(/Thanks/)).not.toBeInTheDocument()
  })

  it('saves nothing when the hidden bot-trap field is filled', async () => {
    const user = userEvent.setup()
    renderWithProviders(<WorkWithUs />)
    await user.type(screen.getByPlaceholderText('Business name'), 'Bot')
    await user.type(screen.getByPlaceholderText('Crops & weekly volume'), 'x')
    await user.type(screen.getAllByPlaceholderText('Phone or WhatsApp')[0], '0712345678')
    fireEvent.change(document.getElementById('For buyers-website') as HTMLInputElement, {
      target: { value: 'http://spam.example' },
    })
    await user.click(buttons()[0])
    await waitFor(() => expect(screen.getByText(/Thanks/)).toBeInTheDocument())
    expect(inserts()).toHaveLength(0)
  })
})
