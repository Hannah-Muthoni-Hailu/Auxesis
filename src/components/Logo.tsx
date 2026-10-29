import { Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '@/config/site'

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label={`${site.name} ${site.tagline} home`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-sun text-bark">
        <Sprout size={20} strokeWidth={2.4} />
      </span>
      <span className="leading-none">
        <span className="block font-display text-lg font-bold">{site.name}</span>
        <span className="block text-[0.65rem] font-medium uppercase tracking-[0.2em] text-bark-soft">
          {site.tagline}
        </span>
      </span>
    </Link>
  )
}
