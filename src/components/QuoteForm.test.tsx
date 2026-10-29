import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeDb, type FakeDb } from '@/test/fakeDb'
import { renderWithProviders } from '@/test/render'
import QuoteForm from './QuoteForm'

const holder = vi.hoisted(() => ({ db: null as unknown as FakeDb }))
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: {
    from: (table: string) => holder.db.from(table),
    rpc: (name: string, args: unknown) => holder.db.rpc(name, args),
  },
}))

const inserts = () => holder.db.calls.filter((c) => c.op === 'insert')

describe('QuoteForm', () => {
  beforeEach(() => {
    holder.db = createFakeDb({})
  })

  it('shows what is missing and sends nothing when submitted empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<QuoteForm />)

    await user.click(screen.getByRole('button', { name: 'Request a quote' }))

    expect(await screen.findByText('Enter your name')).toBeInTheDocument()
    expect(screen.getByText('Enter a phone number we can call or WhatsApp')).toBeInTheDocument()
    expect(inserts()).toHaveLength(0)
  })

  it('saves the enquiry and offers a WhatsApp follow-up', async () => {
    const user = userEvent.setup()
    renderWithProviders(<QuoteForm />)

    await user.type(screen.getByLabelText('Your name'), 'Jane Wanjiru')
    await user.type(screen.getByLabelText('Phone or WhatsApp'), '0712345678')
    await user.selectOptions(screen.getByLabelText('Produce'), 'Broccoli')
    await user.type(screen.getByLabelText(/Quantity/), '500kg a week')
    await user.click(screen.getByRole('button', { name: 'Request a quote' }))

    expect(await screen.findByText('Thank you, Jane')).toBeInTheDocument()
    expect(inserts()).toHaveLength(1)
    expect(inserts()[0].table).toBe('enquiries')
    expect(inserts()[0].payload).toEqual({
      name: 'Jane Wanjiru',
      phone: '0712345678',
      email: null,
      crop: 'Broccoli',
      quantity: '500kg a week',
      delivery_point: null,
      message: null,
    })
    const wa = screen.getByRole('link', { name: /WhatsApp/ })
    expect(wa.getAttribute('href')).toContain('wa.me/254714073154')
    expect(decodeURIComponent(wa.getAttribute('href') ?? '')).toContain('Produce: Broccoli')
  })

  it('pre-selects the crop it was opened with', () => {
    renderWithProviders(<QuoteForm initialCrop="Red Capsicum" />)
    expect(screen.getByLabelText('Produce')).toHaveValue('Red Capsicum')
  })

  it('ignores an unknown crop in the link', () => {
    renderWithProviders(<QuoteForm initialCrop="Mangoes" />)
    expect(screen.getByLabelText('Produce')).toHaveValue('')
  })

  it('says so, and offers WhatsApp, when the request cannot be saved', async () => {
    holder.db = createFakeDb({}, { insertError: 'Failed to fetch' })
    const user = userEvent.setup()
    renderWithProviders(<QuoteForm />)

    await user.type(screen.getByLabelText('Your name'), 'Jane')
    await user.type(screen.getByLabelText('Phone or WhatsApp'), '0712345678')
    await user.selectOptions(screen.getByLabelText('Produce'), 'Zucchini')
    await user.click(screen.getByRole('button', { name: 'Request a quote' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/could not send/i)
    expect(screen.getByRole('link', { name: 'WhatsApp' })).toBeInTheDocument()
    expect(screen.queryByText(/Thank you/)).not.toBeInTheDocument()
  })

  it('saves nothing when the hidden bot-trap field is filled', async () => {
    const user = userEvent.setup()
    renderWithProviders(<QuoteForm />)

    await user.type(screen.getByLabelText('Your name'), 'Bot')
    await user.type(screen.getByLabelText('Phone or WhatsApp'), '0712345678')
    await user.selectOptions(screen.getByLabelText('Produce'), 'Zucchini')
    fireEvent.change(document.getElementById('website') as HTMLInputElement, {
      target: { value: 'http://spam.example' },
    })
    await user.click(screen.getByRole('button', { name: 'Request a quote' }))

    await waitFor(() => expect(screen.getByText('Thank you, Bot')).toBeInTheDocument())
    expect(inserts()).toHaveLength(0)
  })
})
