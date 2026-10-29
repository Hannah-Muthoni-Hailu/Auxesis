import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { hasSavedSession } from '@/auth/savedSession'
import { nav } from '@/config/site'
import Logo from './Logo'

export default function Header() {
  // The menu is "open" only for the page it was opened on, so it closes by itself
  // when the visitor navigates somewhere else.
  const { pathname } = useLocation()
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  // Re-checked on every page change, which is when signing in or out happens.
  const signedIn = hasSavedSession()

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive ? 'text-olive-dark' : 'text-bark hover:text-olive-dark'
    }`

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          {signedIn ? (
            <NavLink to="/portal" className="btn btn-primary ml-2 !px-4 !py-1.5 text-sm">
              My batches
            </NavLink>
          ) : (
            <NavLink to="/auth" className="btn btn-secondary ml-2 !px-4 !py-1.5 text-sm">
              Sign in
            </NavLink>
          )}
        </nav>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpenOn(open ? null : pathname)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-line bg-cream md:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col py-2">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `py-3 text-base font-medium ${isActive ? 'text-olive-dark' : 'text-bark'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to={signedIn ? '/portal' : '/auth'}
              className="py-3 text-base font-semibold text-olive-dark"
            >
              {signedIn ? 'My batches' : 'Sign in'}
            </NavLink>
          </div>
        </nav>
      )}
    </header>
  )
}
