import { fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createFakeDb, type FakeDb } from '@/test/fakeDb'
import { renderWithProviders } from '@/test/render'
import FarmerRegistrationForm from './FarmerRegistrationForm'

const holder = vi.hoisted(() => ({ db: null as unknown as FakeDb }))
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: true,
  supabase: { from: (table: string) => holder.db.from(table) },
}))

const inserts = () => holder.db.calls.filter((c) => c.op === 'insert')

async function fill(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Your name'), 'Wanjiku Kamau')
  await user.type(screen.getByLabelText('Phone or WhatsApp'), '0712345678')
  await user.type(screen.getByLabelText('County'), 'Kirinyaga')
  await user.type(screen.getByLabelText(/Crops you grow/), 'Cucumbers, chillies')
}

describe('FarmerRegistrationForm', () => {
  beforeEach(() => {
    holder.db = createFakeDb({})
  })

  it('shows what is missing and saves nothing when submitted empty', async () => {
    const user = userEvent.setup()
    renderWithProviders(<FarmerRegistrationForm />)
    await user.click(screen.getByRole('button', { name: 'Register my farm' }))

    expect(await screen.findByText('Enter your name')).toBeInTheDocument()
    expect(screen.getByText('Enter your county')).toBeInTheDocument()
    expect(screen.getByText('Tell us what you grow')).toBeInTheDocument()
    expect(inserts()).toHaveLength(0)
  })

  it('saves the registration to the database and thanks the farmer', async () => {
    const user = userEvent.setup()
    renderWithProviders(<FarmerRegistrationForm />)
    await fill(user)
    await user.type(screen.getByLabelText(/Expected volume/), '500kg a week')
    await user.click(screen.getByRole('button', { name: 'Register my farm' }))

    expect(await screen.findByText('Thank you, Wanjiku')).toBeInTheDocument()
    expect(inserts()).toHaveLength(1)
    expect(inserts()[0].table).toBe('farmer_registrations')
    expect(inserts()[0].payload).toEqual({
      name: 'Wanjiku Kamau',
      phone: '0712345678',
      county: 'Kirinyaga',
      crops: 'Cucumbers, chillies',
      volume: '500kg a week',
      message: null,
    })
    expect(screen.getByRole('link', { name: /WhatsApp/ }).getAttribute('href')).toContain('wa.me/254714073154')
  })

  it('rejects a phone number that is too short', async () => {
    const user = userEvent.setup()
    renderWithProviders(<FarmerRegistrationForm />)
    await fill(user)
    await user.clear(screen.getByLabelText('Phone or WhatsApp'))
    await user.type(screen.getByLabelText('Phone or WhatsApp'), '123')
    await user.click(screen.getByRole('button', { name: 'Register my farm' }))
    expect(await screen.findByText(/Enter a valid phone number/)).toBeInTheDocument()
    expect(inserts()).toHaveLength(0)
  })

  it('says so, and offers WhatsApp, when it cannot be saved', async () => {
    holder.db = createFakeDb({}, { insertError: 'Failed to fetch' })
    const user = userEvent.setup()
    renderWithProviders(<FarmerRegistrationForm />)
    await fill(user)
    await user.click(screen.getByRole('button', { name: 'Register my farm' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not send/i)
    expect(screen.queryByText(/Thank you/)).not.toBeInTheDocument()
  })

  it('saves nothing when the hidden bot-trap field is filled', async () => {
    const user = userEvent.setup()
    renderWithProviders(<FarmerRegistrationForm />)
    await fill(user)
    fireEvent.change(document.getElementById('reg-website') as HTMLInputElement, {
      target: { value: 'http://spam.example' },
    })
    await user.click(screen.getByRole('button', { name: 'Register my farm' }))
    await waitFor(() => expect(screen.getByText('Thank you, Wanjiku')).toBeInTheDocument())
    expect(inserts()).toHaveLength(0)
  })
})
