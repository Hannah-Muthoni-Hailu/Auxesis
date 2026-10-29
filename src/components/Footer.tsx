import { Link } from 'react-router-dom'
import { site } from '@/config/site'
import Logo from './Logo'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-cream-dark">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-bark-soft">
            Traceable Kenyan vegetables, grown on our Karatina farm and by commercial growers
            across the country.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-display text-base font-semibold">Explore</h3>
          <ul className="space-y-1.5 text-bark-soft">
            <li><Link to="/traceability" className="hover:text-olive-dark">Farm production tracker</Link></li>
            <li><Link to="/about" className="hover:text-olive-dark">About {site.name}</Link></li>
            <li><Link to="/quote" className="hover:text-olive-dark">Wholesale enquiries</Link></li>
            <li><Link to="/auth" className="hover:text-olive-dark">Farmer &amp; staff sign in</Link></li>
          </ul>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-display text-base font-semibold">Find us</h3>
          <p className="text-bark-soft">{site.markets}</p>
          <p className="text-bark-soft">{site.phone}</p>
          <p className="text-bark-soft">{site.email}</p>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-bark-soft">
        © {year} {site.name} {site.tagline}. All rights reserved.
      </div>
    </footer>
  )
}
