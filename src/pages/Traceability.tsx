import { useMemo, useState } from 'react'
import BatchCard from '@/components/BatchCard'
import { cropNames } from '@/data/products'
import { useBatches } from '@/hooks/useBatches'
import {
  filterBatches,
  formatKg,
  STAGES,
  stageLabels,
  summarise,
  type BatchFilters,
} from '@/lib/batches'
import { isSupabaseConfigured } from '@/lib/supabase'
import { usePageMeta } from '@/lib/usePageMeta'

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="card p-5">
      <dd className="font-display text-3xl font-extrabold text-olive-dark">{value}</dd>
      <dt className="mt-1 text-sm text-bark-soft">{label}</dt>
    </div>
  )
}

export default function Traceability() {
  usePageMeta({ title: 'Farm tracker', description: 'See what is planted, growing and ready for market, farm by farm, updated by the farmers who grow it.' })
  const { data, isPending, isError } = useBatches()
  const [crop, setCrop] = useState<BatchFilters['crop']>('all')
  const [stage, setStage] = useState<BatchFilters['stage']>('any')

  const batches = useMemo(() => data ?? [], [data])
  const summary = useMemo(() => summarise(batches), [batches])
  const visible = useMemo(() => filterBatches(batches, { crop, stage }), [batches, crop, stage])

  const loaded = isSupabaseConfigured && !isPending && !isError

  return (
    <section className="container-page py-14">
      <p className="eyebrow">Live listing</p>
      <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">Farm production tracker</h1>
      <p className="mt-4 max-w-3xl text-bark-soft">
        Follow every batch from the day it was planted to the day it is ready at Marikiti and City
        Park, across our Karatina farm and commercial growers countrywide.
      </p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat value={loaded ? String(summary.farms) : '—'} label="Farms in production" />
        <Stat
          value={loaded ? String(summary.readyForMarket) : '—'}
          label="Batches ready for market"
        />
        <Stat value={loaded ? formatKg(summary.volumeKg) : '—'} label="Tracked volume" />
      </dl>

      {/* Filters */}
      <div className="mt-8 space-y-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Crop">
          {(['all', ...cropNames] as const).map((c) => (
            <button
              key={c}
              type="button"
              className="chip"
              data-active={crop === c}
              onClick={() => setCrop(c)}
            >
              {c === 'all' ? 'All crops' : c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Stage">
          {(['any', ...STAGES] as const).map((s) => (
            <button
              key={s}
              type="button"
              className="chip"
              data-active={stage === s}
              onClick={() => setStage(s)}
            >
              {s === 'any' ? 'Any stage' : stageLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mt-8">
        {!isSupabaseConfigured ? (
          <div className="card p-8">
            <p className="font-semibold">The tracker is not connected to the database yet.</p>
            <p className="mt-1 text-sm text-bark-soft">
              Add <code className="rounded bg-cream-dark px-1">VITE_SUPABASE_URL</code> and{' '}
              <code className="rounded bg-cream-dark px-1">VITE_SUPABASE_PUBLISHABLE_KEY</code> to
              the <code className="rounded bg-cream-dark px-1">.env</code> file, then restart the
              site.
            </p>
          </div>
        ) : isPending ? (
          <p className="text-sm text-bark-soft" aria-live="polite">
            Loading batches…
          </p>
        ) : isError ? (
          <div className="card p-8">
            <p className="font-semibold">We could not load the tracker right now.</p>
            <p className="mt-1 text-sm text-bark-soft">
              Please refresh the page in a moment. If it keeps happening, call us on the number
              on the Contact page.
            </p>
          </div>
        ) : visible.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="font-semibold">
              {batches.length === 0
                ? 'No batches have been registered yet.'
                : 'No batches match those filters.'}
            </p>
            {batches.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary mt-5"
                onClick={() => {
                  setCrop('all')
                  setStage('any')
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((b) => (
              <BatchCard key={b.id} batch={b} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
