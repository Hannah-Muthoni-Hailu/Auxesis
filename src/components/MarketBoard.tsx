import { marketBoard } from '@/data/home'
import { useT } from '@/i18n'

export default function MarketBoard() {
  const t = useT()
  return (
    <div>
      <p className="eyebrow">{t('Market board')}</p>
      <h2 className="mt-2 text-3xl font-bold">{t('This week at Marikiti')}</h2>
      <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-5">
        {marketBoard.map((m) => (
          <div key={m.item} className="bg-card p-5">
            <p className="font-medium">{t(m.item)}</p>
            <p className="mt-3 font-display text-3xl font-bold text-olive-dark">{m.price === null ? '—' : m.price.toLocaleString('en-KE')}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t(m.unit)} · —</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{t('Sample figures. Updated every Monday.')}</p>
    </div>
  )
}
