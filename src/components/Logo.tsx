import { Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { site } from '@/config/site'
import { useT } from '@/i18n'

export default function Logo() {
  const t = useT()
  return (
    <Link to="/" className="flex items-center gap-3" aria-label={t('{name} home', { name: `${site.name} ${site.tagline}` })}>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-sun text-foreground">
        <Sprout className="h-5 w-5" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-lg font-bold">{site.name}</span>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{t(site.tagline)}</span>
      </span>
    </Link>
  )
}
