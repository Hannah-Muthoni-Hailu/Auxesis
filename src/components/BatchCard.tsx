import { MapPin } from 'lucide-react'
import { useT } from '@/i18n'
import {
  formatDate,
  formatKg,
  STAGES,
  stageIndex,
  stageLabels,
  stageStyles,
  type Batch,
} from '@/lib/batches'

function DateItem({ label, value }: { label: string; value: string | null }) {
  const t = useT()
  return (
    <div>
      <dt className="text-[0.7rem] font-semibold uppercase tracking-wide text-bark-soft">{t(label)}</dt>
      <dd className="text-sm font-medium">{formatDate(value)}</dd>
    </div>
  )
}

export default function BatchCard({ batch }: { batch: Batch }) {
  const t = useT()
  const current = stageIndex(batch.stage)
  const farm = batch.farms

  return (
    <article className="card flex flex-col gap-4 p-5">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{t(batch.crop)}</h3>
          {batch.variety && <p className="text-sm text-bark-soft">{batch.variety}</p>}
        </div>
        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${stageStyles[batch.stage]}`}
        >
          {t(stageLabels[batch.stage])}
        </span>
      </header>

      {/* Progress through the seven stages */}
      <div
        className="flex gap-1"
        role="img"
        aria-label={t('Stage {n} of {total}: {stage}', { n: current + 1, total: STAGES.length, stage: t(stageLabels[batch.stage]) })}
      >
        {STAGES.map((s, i) => (
          <span
            key={s}
            className={`h-1.5 flex-1 rounded-full ${i <= current ? 'bg-olive' : 'bg-line'}`}
          />
        ))}
      </div>

      {farm && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <MapPin size={15} className="shrink-0 text-sun-dark" />
          <span className="font-medium">
            {farm.name}, {farm.county}
          </span>
          {farm.is_own_farm && (
            <span className="rounded-full bg-sun/20 px-2 py-0.5 text-xs font-semibold text-sun-dark">
              {t('Our farm')}
            </span>
          )}
        </p>
      )}

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
        <DateItem label="Planted" value={batch.planted_on} />
        <DateItem label="Expected harvest" value={batch.expected_harvest} />
        <DateItem label="Harvested" value={batch.harvested_on} />
        <DateItem label="Market ready" value={batch.market_ready_on} />
      </dl>

      <footer className="mt-auto space-y-2 border-t border-line pt-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="rounded-md bg-cream-dark px-2 py-0.5 font-mono text-xs">
            {batch.batch_code}
          </span>
          <span className="font-semibold">{formatKg(batch.quantity_kg)}</span>
          {batch.grade && <span className="text-bark-soft">{t('Grade {grade}', { grade: batch.grade })}</span>}
        </div>
        {batch.notes && <p className="text-sm text-bark-soft">{batch.notes}</p>}
      </footer>
    </article>
  )
}
