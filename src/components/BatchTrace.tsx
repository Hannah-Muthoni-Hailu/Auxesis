import { Check } from 'lucide-react'
import BatchCard from '@/components/BatchCard'
import { useT } from '@/i18n'
import { buildTimeline, formatDate, stageLabels, type TracedBatch } from '@/lib/batches'

// The result of a batch-code lookup: the batch, and the dated journey it has made so far.
export default function BatchTrace({ batch }: { batch: TracedBatch }) {
  const t = useT()
  const steps = buildTimeline(batch, batch.batch_events)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-start">
      <BatchCard batch={batch} />
      <div className="card p-5 md:p-6">
        <h2 className="text-lg font-semibold">
          {t('Journey of {crop}', { crop: t(batch.crop) })}
          {batch.block ? ` · ${batch.block}` : ''}
        </h2>
        <ol className="mt-4 space-y-0">
          {steps.map((s, i) => (
            <li key={s.stage} className="flex gap-3" aria-current={s.state === 'current' ? 'step' : undefined}>
              <div className="flex flex-col items-center">
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    s.state === 'upcoming'
                      ? 'border border-line bg-white text-bark-soft'
                      : s.state === 'current'
                        ? 'bg-sun text-bark ring-4 ring-sun/30'
                        : 'bg-olive text-white'
                  }`}
                >
                  {s.state === 'done' ? <Check size={14} strokeWidth={3} /> : i + 1}
                </span>
                {i < steps.length - 1 && (
                  <span className={`w-0.5 flex-1 ${s.state === 'done' ? 'bg-olive' : 'bg-line'}`} />
                )}
              </div>
              <div className={`pb-5 ${s.state === 'upcoming' ? 'text-bark-soft' : ''}`}>
                <p className="font-semibold leading-7">
                  {t(stageLabels[s.stage])}
                  {s.state === 'current' && (
                    <span className="ml-2 rounded-full bg-sun/20 px-2 py-0.5 text-xs font-semibold text-sun-dark">
                      {t('Now')}
                    </span>
                  )}
                </p>
                {s.date && <p className="text-sm text-bark-soft">{formatDate(s.date)}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
