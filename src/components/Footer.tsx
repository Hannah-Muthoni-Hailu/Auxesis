import { Link } from 'react-router-dom'
import { nav, site } from '@/config/site'

export default function Footer() {
  return (
    <footer className="mt-24 border-t bg-cream-dark">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-xl font-bold">
            {site.name} {site.tagline}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Grower, offtaker and market link for Kenyan fresh produce.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-3">Pages</p>
          <ul className="space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-primary">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-3">Visit</p>
          <p className="text-sm">Marikiti Market, Nairobi</p>
          <p className="text-sm">Karatina, Nyeri County</p>
        </div>
        <div>
          <p className="eyebrow mb-3">Contact</p>
          <p className="text-sm">WhatsApp: {site.phone}</p>
          <p className="text-sm">{site.email}</p>
        </div>
      </div>
    </footer>
  )
}
