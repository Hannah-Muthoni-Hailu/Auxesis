import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Auth from './Auth'

const holder = vi.hoisted(() => ({ auth: {} as Record<string, unknown> }))
vi.mock('@/auth/useAuth', () => ({ useAuth: () => holder.auth }))
vi.mock('@/lib/supabase', () => ({ isSupabaseConfigured: true, supabase: {} }))

const signIn = vi.fn<(email: string, password: string) => Promise<string | null>>()

function renderAuth() {
  return render(
    <MemoryRouter initialEntries={['/auth']}>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/portal" element={<p>Portal page</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Sign-in page', () => {
  beforeEach(() => {
    signIn.mockReset()
    holder.auth = { session: null, loading: false, signIn }
  })

  it('has no sign-up option, only sign-in', () => {
    renderAuth()
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument()
    expect(screen.queryByText(/sign up|create an account|register/i)).not.toBeInTheDocument()
    expect(screen.getByText(/accounts are created by auxesis/i)).toBeInTheDocument()
  })

  it('shows a clear message for a wrong password', async () => {
    signIn.mockResolvedValue('Wrong email or password.')
    const user = userEvent.setup()
    renderAuth()

    await user.type(screen.getByLabelText('Email'), 'farmer@example.com')
    await user.type(screen.getByLabelText('Password'), 'nope')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Wrong email or password.')
    expect(signIn).toHaveBeenCalledWith('farmer@example.com', 'nope')
    expect(screen.queryByText('Portal page')).not.toBeInTheDocument()
  })

  it('goes to the portal after a successful sign-in', async () => {
    signIn.mockResolvedValue(null)
    const user = userEvent.setup()
    renderAuth()

    await user.type(screen.getByLabelText('Email'), 'farmer@example.com')
    await user.type(screen.getByLabelText('Password'), 'correct-password')
    await user.click(screen.getByRole('button', { name: 'Sign in' }))

    await waitFor(() => expect(screen.getByText('Portal page')).toBeInTheDocument())
  })

  it('skips the form when already signed in', () => {
    holder.auth = { session: { user: {} }, loading: false, signIn }
    renderAuth()
    expect(screen.getByText('Portal page')).toBeInTheDocument()
  })
})
