import { Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '@/config/site'

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3" aria-label={`${site.name} ${site.tagline} home`}>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-sun text-foreground">
        <Sprout className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold">{site.name}</span>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{site.tagline}</span>
      </span>
    </Link>
  )
}
