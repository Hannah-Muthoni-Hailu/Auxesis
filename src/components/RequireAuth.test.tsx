import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RequireAuth from './RequireAuth'

const holder = vi.hoisted(() => ({ auth: {} as Record<string, unknown> }))
vi.mock('@/auth/useAuth', () => ({ useAuth: () => holder.auth }))

function setAuth(over: Record<string, unknown>) {
  holder.auth = { session: { user: {} }, loading: false, rolesLoading: false, isStaff: false, ...over }
}

function renderAt(staffOnly: boolean) {
  return render(
    <MemoryRouter initialEntries={['/secret']}>
      <Routes>
        <Route path="/auth" element={<p>Sign in page</p>} />
        <Route
          path="/secret"
          element={
            <RequireAuth staffOnly={staffOnly}>
              <p>Secret content</p>
            </RequireAuth>
          }
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('RequireAuth', () => {
  beforeEach(() => setAuth({}))

  it('sends signed-out visitors to the sign-in page', () => {
    setAuth({ session: null })
    renderAt(false)
    expect(screen.getByText('Sign in page')).toBeInTheDocument()
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument()
  })

  it('waits while checking who is signed in', () => {
    setAuth({ loading: true, session: null })
    renderAt(false)
    expect(screen.getByText(/checking your sign-in/i)).toBeInTheDocument()
    expect(screen.queryByText('Sign in page')).not.toBeInTheDocument()
  })

  it('lets any signed-in person see an ordinary protected page', () => {
    renderAt(false)
    expect(screen.getByText('Secret content')).toBeInTheDocument()
  })

  it('keeps farmers out of staff-only pages', () => {
    renderAt(true)
    expect(screen.getByText(/for Auxesis staff/i)).toBeInTheDocument()
    expect(screen.queryByText('Secret content')).not.toBeInTheDocument()
  })

  it('lets staff into staff-only pages', () => {
    setAuth({ isStaff: true })
    renderAt(true)
    expect(screen.getByText('Secret content')).toBeInTheDocument()
  })
})
