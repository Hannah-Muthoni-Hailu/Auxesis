import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { nav, site, whatsappLink } from '@/config/site'
import Logo from './Logo'

export default function Header() {
  // Not wired to translations yet: it only switches which button looks selected.
  const [lang, setLang] = useState<'EN' | 'SW'>('EN')

  return (
    <header className="border-b bg-background">
      <div className="container-x flex flex-wrap items-center justify-between gap-4 py-4">
        <Logo />
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" aria-label="Main">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) => (isActive ? 'text-primary font-medium' : 'hover:text-primary')}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-full border text-xs">
            {(['EN', 'SW'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`px-3 py-1.5 ${lang === l ? 'bg-primary text-primary-foreground' : ''}`}
              >
                {l}
              </button>
            ))}
          </div>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp us on ${site.phone}`}
            className="rounded-full border border-foreground px-4 py-1.5 text-sm font-medium hover:bg-foreground hover:text-background"
          >
            WhatsApp us
          </a>
        </div>
      </div>
    </header>
  )
}
