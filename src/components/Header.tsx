import { NavLink } from 'react-router-dom'
import { nav, site, whatsappLink } from '@/config/site'
import { useLang } from '@/i18n'
import Logo from './Logo'

export default function Header() {
  const { lang, setLang, t } = useLang()

  return (
    <header className="border-b bg-background">
      <div className="container-x flex flex-wrap items-center justify-between gap-4 py-4">
        <Logo />
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" aria-label={t('Main')}>
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) => (isActive ? 'text-primary font-medium' : 'hover:text-primary')}
            >
              {t(n.label)}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-full border text-xs">
            {(['en', 'sw'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                aria-label={l === 'en' ? 'English' : 'Kiswahili'}
                className={`px-3 py-1.5 ${lang === l ? 'bg-primary text-primary-foreground' : ''}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('WhatsApp us on {phone}', { phone: site.phone })}
            className="rounded-full border border-foreground px-4 py-1.5 text-sm font-medium hover:bg-foreground hover:text-background"
          >
            {t('WhatsApp us')}
          </a>
        </div>
      </div>
    </header>
  )
}
